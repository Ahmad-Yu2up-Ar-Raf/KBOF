import { createMiddleware } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { auth } from './auth/auth'
import type { UserRoleType } from '@/db/schema'
import { db } from '@/db'
import { user } from '@/db/schema'
import { eq } from 'drizzle-orm'

// =============================================================================
// AUTH MIDDLEWARE - Requires authenticated user
// =============================================================================

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) {
      throw redirect({ to: '/auth' })
    }
    return await next()
  },
)

// =============================================================================
// GUEST MIDDLEWARE - Only for non-authenticated users
// =============================================================================

export const guestMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })

    if (session) {
      throw redirect({ to: '/dashboard', search: { createdAt: [] } })
    }
    return await next()
  },
)

// =============================================================================
// AUTH SERVER MIDDLEWARE - For server functions, passes user context
// =============================================================================

export const authServerMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) {
      throw new Error('Unauthorized')
    }
    return next({ context: { user: session.user } })
  },
)

// =============================================================================
// PRE-DEFINED ROLE MIDDLEWARES
// =============================================================================

export const dashboardMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      throw redirect({ to: '/auth' })
    }

    return next({ context: { user: session.user } })
  },
)

/**
 * Auth server middleware with role check
 * For server functions that need role-based access
 */
export function createAuthServerMiddlewareWithRole(
  allowedRoles: Array<UserRoleType>,
) {
  return createMiddleware().server(async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      throw new Error('Unauthorized')
    }

    // Try to read role from session first
    let userRole = (session.user as { role?: UserRoleType }).role

    // If role not present on session, fetch from DB as a fallback
    if (!userRole) {
      try {
        const dbUser = await db
          .select({ id: user.id, role: user.role })
          .from(user)
          .where(eq(user.id, session.user.id))
          .limit(1)
          .then((rows) => rows[0])

        if (dbUser && dbUser.role) {
          userRole = dbUser.role as UserRoleType
          // attach role to session.user for downstream usage
          ;(session.user as any).role = userRole
        }
      } catch (err) {
        // ignore DB errors here; role check will fail below
        console.warn('Failed to read user role from DB fallback', err)
      }
    }

    // Ensure role is defined before checking allowed roles to satisfy TS
    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new Error('Forbidden: Insufficient permissions')
    }

    return next({ context: { user: session.user } })
  })
}

// Pre-defined server middlewares
export const adminServerMiddleware = createAuthServerMiddlewareWithRole([
  'admin',
  'superAdmin',
])

export const superAdminServerMiddleware = createAuthServerMiddlewareWithRole([
  'superAdmin',
])

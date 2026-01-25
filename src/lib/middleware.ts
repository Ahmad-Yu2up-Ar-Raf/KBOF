import { createMiddleware } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { auth } from './auth/auth'
import type { UserRoleType } from '@/db/schema'

// =============================================================================
// AUTH MIDDLEWARE - Requires authenticated user
// =============================================================================

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) {
      throw redirect({ to: '/login' })
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
      throw redirect({ to: '/login' })
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

    const userRole = (session.user as { role?: UserRoleType }).role

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

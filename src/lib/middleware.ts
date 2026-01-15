import { createMiddleware } from '@tanstack/react-start'
import { auth } from './auth/auth'
import { redirect } from '@tanstack/react-router'
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
      const user = session.user as {
        role?: UserRoleType
        hasCompletedOnboarding?: boolean
      }
      const role = user?.role || 'pribumi'

      // Redirect based on role
      if (role === 'pribumi') {
        // Check if onboarding is completed
        if (!user?.hasCompletedOnboarding) {
          throw redirect({ to: '/onboarding' })
        }
        throw redirect({ to: '/profile' })
      } else {
        throw redirect({ to: '/dashboard', search: { createdAt: [] } })
      }
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
// ROLE-BASED MIDDLEWARE FACTORY
// =============================================================================

/**
 * Creates a middleware that checks if user has one of the allowed roles
 * @param allowedRoles - Array of roles that can access the route
 */
export function createRoleMiddleware(allowedRoles: UserRoleType[]) {
  return createMiddleware().server(async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      throw redirect({ to: '/login' })
    }

    const userRole =
      (session.user as { role?: UserRoleType })?.role || 'pribumi'

    if (!allowedRoles.includes(userRole)) {
      // Redirect to appropriate page based on their actual role
      if (userRole === 'pribumi') {
        throw redirect({ to: '/profile' })
      } else {
        throw redirect({ to: '/dashboard', search: { createdAt: [] } })
      }
    }

    return next({ context: { user: session.user } })
  })
}

// =============================================================================
// PRE-DEFINED ROLE MIDDLEWARES
// =============================================================================

/**
 * Dashboard middleware - Admin & Super Admin only
 * Redirects Pribumi users to /profile
 */
export const dashboardMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      throw redirect({ to: '/login' })
    }

    const role = (session.user as { role?: UserRoleType })?.role || 'pribumi'

    if (role === 'pribumi') {
      throw redirect({ to: '/profile' })
    }

    return next({ context: { user: session.user } })
  },
)

/**
 * Admin panel middleware - Super Admin only
 * Used for /dashboard/admin routes
 */
export const superAdminMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      throw redirect({ to: '/login' })
    }

    const role = (session.user as { role?: UserRoleType })?.role || 'pribumi'

    if (role !== 'superAdmin') {
      if (role === 'pribumi') {
        throw redirect({ to: '/profile' })
      } else {
        throw redirect({ to: '/dashboard', search: { createdAt: [] } })
      }
    }

    return next({ context: { user: session.user } })
  },
)

/**
 * Profile middleware - Pribumi only
 * Used for /profile routes
 * Redirects to onboarding if not completed
 */
export const profileMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      throw redirect({ to: '/login' })
    }

    const user = session.user as {
      role?: UserRoleType
      hasCompletedOnboarding?: boolean
    }
    const role = user?.role || 'pribumi'

    // Only Pribumi can access profile routes
    if (role !== 'pribumi') {
      throw redirect({ to: '/dashboard', search: { createdAt: [] } })
    }

    // Check if onboarding is completed
    if (!user?.hasCompletedOnboarding) {
      throw redirect({ to: '/onboarding' })
    }

    return next({ context: { user: session.user } })
  },
)

/**
 * Onboarding middleware - Pribumi who haven't completed onboarding
 */
export const onboardingMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      throw redirect({ to: '/login' })
    }

    const user = session.user as {
      role?: UserRoleType
      hasCompletedOnboarding?: boolean
    }
    const role = user?.role || 'pribumi'

    // Only Pribumi needs onboarding
    if (role !== 'pribumi') {
      throw redirect({ to: '/dashboard', search: { createdAt: [] } })
    }

    // If already completed onboarding, redirect to profile
    if (user?.hasCompletedOnboarding) {
      throw redirect({ to: '/profile' })
    }

    return next({ context: { user: session.user } })
  },
)

/**
 * Auth server middleware with role check
 * For server functions that need role-based access
 */
export function createAuthServerMiddlewareWithRole(
  allowedRoles: UserRoleType[],
) {
  return createMiddleware().server(async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      throw new Error('Unauthorized')
    }

    const userRole =
      (session.user as { role?: UserRoleType })?.role || 'pribumi'

    if (!allowedRoles.includes(userRole)) {
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

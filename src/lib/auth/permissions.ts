// =============================================================================
// ACCESS CONTROL & PERMISSIONS - SUASANA
// =============================================================================
// Role-based access control (RBAC) configuration using Better Auth
// Roles: PRIBUMI (default), ADMIN, SUPER_ADMIN
// =============================================================================

import { createAccessControl } from 'better-auth/plugins/access'
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access'

// =============================================================================
// CUSTOM RESOURCE STATEMENTS
// =============================================================================

/**
 * Define all resources and their available actions
 * This extends Better Auth's default statements with Suasana-specific resources
 */
export const statement = {
  // Better Auth default statements (user, session management)
  ...defaultStatements,

  // Destination management
  destination: ['create', 'read', 'update', 'delete', 'approve', 'publish'],

  // Article management
  article: ['create', 'read', 'update', 'delete', 'publish'],

  // Analytics & Dashboard
  analytics: ['read'],

  // User management (extended from default)
  userManagement: ['create', 'read', 'update', 'delete', 'changeRole'],
} as const

// =============================================================================
// ACCESS CONTROLLER
// =============================================================================

export const ac = createAccessControl(statement)

// =============================================================================
// ROLE DEFINITIONS
// =============================================================================

/**
 * PRIBUMI Role (Default for new users)
 * - Can create own destinations (pending status)
 * - Can manage own articles
 * - Cannot approve destinations or manage other users
 */
export const pribumi = ac.newRole({
  // Destination: Create (pending), read all, update/delete own only
  destination: ['create', 'read'],
  // Article: Full control of own articles
  article: ['create', 'read', 'update', 'delete', 'publish'],
  // No analytics access
  // No user management
})

/**
 * ADMIN Role
 * - Full destination management (CRUD + approve/publish)
 * - Full article management
 * - Analytics access
 * - Cannot manage users
 */
export const admin = ac.newRole({
  // Inherit admin permissions for user/session
  ...adminAc.statements,
  // Destination: Full control
  destination: ['create', 'read', 'update', 'delete', 'approve', 'publish'],
  // Article: Full control
  article: ['create', 'read', 'update', 'delete', 'publish'],
  // Analytics: Read access
  analytics: ['read'],
  // No user management (only SUPER_ADMIN)
})

/**
 * SUPER_ADMIN Role (Highest Authority)
 * - All admin permissions
 * - Full user management
 * - Access to /dashboard/admin
 */
export const superAdmin = ac.newRole({
  // Inherit admin permissions plus full control
  ...adminAc.statements,
  // Destination: Full control
  destination: ['create', 'read', 'update', 'delete', 'approve', 'publish'],
  // Article: Full control
  article: ['create', 'read', 'update', 'delete', 'publish'],
  // Analytics: Read access
  analytics: ['read'],
  // User management: Full control
  userManagement: ['create', 'read', 'update', 'delete', 'changeRole'],
})

// =============================================================================
// ROLE EXPORTS FOR BETTER AUTH
// =============================================================================

export const roles = {
  pribumi,
  admin,
  superAdmin,
} as const

// =============================================================================
// ROLE TYPE DEFINITIONS
// =============================================================================

export type UserRole = keyof typeof roles
export const USER_ROLES = ['pribumi', 'admin', 'superAdmin'] as const

// =============================================================================
// ROLE HELPER FUNCTIONS
// =============================================================================

/**
 * Get default redirect path based on role
 */
export function getRedirectPathForRole(role: UserRole): string {
  switch (role) {
    case 'superAdmin':
    case 'admin':
      return '/dashboard'
    case 'pribumi':
    default:
      return '/profile'
  }
}

/**
 * Check if role can access dashboard
 */
export function canAccessDashboard(role: UserRole): boolean {
  return role === 'admin' || role === 'superAdmin'
}

/**
 * Check if role can access admin panel
 */
export function canAccessAdminPanel(role: UserRole): boolean {
  return role === 'superAdmin'
}

/**
 * Check if role can manage destinations (approve/publish)
 */
export function canManageDestinations(role: UserRole): boolean {
  return role === 'admin' || role === 'superAdmin'
}

/**
 * Check if role can manage users
 */
export function canManageUsers(role: UserRole): boolean {
  return role === 'superAdmin'
}

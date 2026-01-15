// =============================================================================
// USER MUTATION HOOKS - SUASANA
// =============================================================================
// Provides reusable mutation hooks for user management operations (SuperAdmin only)
// with automatic cache invalidation support.

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'

import {
  updateUserRole,
  banUser,
  unbanUser,
  deleteUser,
  bulkDeleteUsers,
  bulkUpdateUserRole,
  bulkBanUsers,
  bulkUnbanUsers,
} from '@/lib/server/user/user-server-actions'
import { invalidateAllUserQueries } from '@/lib/query-options'
import type {
  UpdateUserRoleInput,
  BanUserInput,
  UnbanUserInput,
  DeleteUserInput,
  BulkDeleteUsersInput,
  BulkUpdateUserRoleInput,
  BulkBanUsersInput,
  BulkUnbanUsersInput,
} from '@/lib/validations/user-validations'

// ============================================
// UPDATE USER ROLE MUTATION
// ============================================

interface UseUpdateUserRoleMutationOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useUpdateUserRoleMutation(
  options?: UseUpdateUserRoleMutationOptions,
) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const updateRoleFn = useServerFn(updateUserRole)

  return useMutation({
    mutationFn: async (data: UpdateUserRoleInput) => {
      const result = await updateRoleFn({ data })
      return result
    },

    onSuccess: async () => {
      await invalidateAllUserQueries(queryClient)
      await router.invalidate()
      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Update user role error:', error.message)
      options?.onError?.(error)
    },
  })
}

// ============================================
// BAN USER MUTATION
// ============================================

interface UseBanUserMutationOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useBanUserMutation(options?: UseBanUserMutationOptions) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const banUserFn = useServerFn(banUser)

  return useMutation({
    mutationFn: async (data: BanUserInput) => {
      const result = await banUserFn({ data })
      return result
    },

    onSuccess: async () => {
      await invalidateAllUserQueries(queryClient)
      await router.invalidate()
      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Ban user error:', error.message)
      options?.onError?.(error)
    },
  })
}

// ============================================
// UNBAN USER MUTATION
// ============================================

interface UseUnbanUserMutationOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useUnbanUserMutation(options?: UseUnbanUserMutationOptions) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const unbanUserFn = useServerFn(unbanUser)

  return useMutation({
    mutationFn: async (data: UnbanUserInput) => {
      const result = await unbanUserFn({ data })
      return result
    },

    onSuccess: async () => {
      await invalidateAllUserQueries(queryClient)
      await router.invalidate()
      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Unban user error:', error.message)
      options?.onError?.(error)
    },
  })
}

// ============================================
// DELETE USER MUTATION
// ============================================

interface UseDeleteUserMutationOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useDeleteUserMutation(options?: UseDeleteUserMutationOptions) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const deleteUserFn = useServerFn(deleteUser)

  return useMutation({
    mutationFn: async (data: DeleteUserInput) => {
      const result = await deleteUserFn({ data })
      return result
    },

    onSuccess: async () => {
      await invalidateAllUserQueries(queryClient)
      await router.invalidate()
      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Delete user error:', error.message)
      options?.onError?.(error)
    },
  })
}

// ============================================
// BULK DELETE USERS MUTATION
// ============================================

interface UseBulkDeleteUsersMutationOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useBulkDeleteUsersMutation(
  options?: UseBulkDeleteUsersMutationOptions,
) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const bulkDeleteUsersFn = useServerFn(bulkDeleteUsers)

  return useMutation({
    mutationFn: async (data: BulkDeleteUsersInput) => {
      const result = await bulkDeleteUsersFn({ data })
      return result
    },

    onSuccess: async () => {
      await invalidateAllUserQueries(queryClient)
      await router.invalidate()
      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Bulk delete users error:', error.message)
      options?.onError?.(error)
    },
  })
}

// ============================================
// BULK UPDATE USER ROLE MUTATION
// ============================================

interface UseBulkUpdateUserRoleMutationOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useBulkUpdateUserRoleMutation(
  options?: UseBulkUpdateUserRoleMutationOptions,
) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const bulkUpdateUserRoleFn = useServerFn(bulkUpdateUserRole)

  return useMutation({
    mutationFn: async (data: BulkUpdateUserRoleInput) => {
      const result = await bulkUpdateUserRoleFn({ data })
      return result
    },

    onSuccess: async () => {
      await invalidateAllUserQueries(queryClient)
      await router.invalidate()
      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Bulk update user role error:', error.message)
      options?.onError?.(error)
    },
  })
}

// ============================================
// BULK BAN USERS MUTATION
// ============================================

interface UseBulkBanUsersMutationOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useBulkBanUsersMutation(
  options?: UseBulkBanUsersMutationOptions,
) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const bulkBanUsersFn = useServerFn(bulkBanUsers)

  return useMutation({
    mutationFn: async (data: BulkBanUsersInput) => {
      const result = await bulkBanUsersFn({ data })
      return result
    },

    onSuccess: async () => {
      await invalidateAllUserQueries(queryClient)
      await router.invalidate()
      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Bulk ban users error:', error.message)
      options?.onError?.(error)
    },
  })
}

// ============================================
// BULK UNBAN USERS MUTATION
// ============================================

interface UseBulkUnbanUsersMutationOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useBulkUnbanUsersMutation(
  options?: UseBulkUnbanUsersMutationOptions,
) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const bulkUnbanUsersFn = useServerFn(bulkUnbanUsers)

  return useMutation({
    mutationFn: async (data: BulkUnbanUsersInput) => {
      const result = await bulkUnbanUsersFn({ data })
      return result
    },

    onSuccess: async () => {
      await invalidateAllUserQueries(queryClient)
      await router.invalidate()
      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Bulk unban users error:', error.message)
      options?.onError?.(error)
    },
  })
}

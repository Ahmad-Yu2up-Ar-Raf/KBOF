// =============================================================================
// DESTINATION MUTATION HOOKS - SUASANA
// =============================================================================
// Provides reusable mutation hooks for destination CRUD operations
// with automatic cache invalidation and optimistic updates support.

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'

import {
  addDestination,
  updateDestination,
  deleteDestination,
  updateBulkDestinationStatus,
} from '@/lib/server/destination/destination-server-actions'
import { invalidateDestinationQueries } from '@/lib/utils/destination-utils'
import type {
  CreateDestinationSchema,
  UpdateDestinationSchema,
} from '@/lib/validations/destination-validations'
import type { DestinationStatus } from '@/types'

// ============================================
// CREATE DESTINATION MUTATION
// ============================================

interface UseCreateDestinationMutationOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useCreateDestinationMutation(
  options?: UseCreateDestinationMutationOptions,
) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const addDestinationFn = useServerFn(addDestination)

  return useMutation({
    mutationFn: async (data: CreateDestinationSchema) => {
      const result = await addDestinationFn({ data })
      return result
    },

    onSuccess: async () => {
      // Invalidate ALL destination queries
      await invalidateDestinationQueries(queryClient)

      // Invalidate router to ensure loaders refetch
      await router.invalidate()

      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Create destination error:', error.message)
      options?.onError?.(error)
    },
  })
}

// ============================================
// UPDATE DESTINATION MUTATION
// ============================================

interface UseUpdateDestinationMutationOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useUpdateDestinationMutation(
  options?: UseUpdateDestinationMutationOptions,
) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const updateDestinationFn = useServerFn(updateDestination)

  return useMutation({
    mutationFn: async (data: UpdateDestinationSchema) => {
      const result = await updateDestinationFn({ data })
      return result
    },

    onSuccess: async () => {
      await invalidateDestinationQueries(queryClient)
      await router.invalidate()
      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Update destination error:', error.message)
      options?.onError?.(error)
    },
  })
}

// ============================================
// BULK UPDATE STATUS MUTATION
// ============================================

interface BulkUpdateStatusData {
  id: number | number[]
  status: DestinationStatus
}

interface UseBulkUpdateDestinationStatusMutationOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useBulkUpdateDestinationStatusMutation(
  options?: UseBulkUpdateDestinationStatusMutationOptions,
) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const updateBulkStatusFn = useServerFn(updateBulkDestinationStatus)

  return useMutation({
    mutationFn: async (data: BulkUpdateStatusData) => {
      const result = await updateBulkStatusFn({ data })
      return result
    },

    onSuccess: async () => {
      await invalidateDestinationQueries(queryClient)
      await router.invalidate()
      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Bulk update destination status error:', error.message)
      options?.onError?.(error)
    },
  })
}

// ============================================
// DELETE DESTINATION MUTATION
// ============================================

interface UseDeleteDestinationMutationOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useDeleteDestinationMutation(
  options?: UseDeleteDestinationMutationOptions,
) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const deleteDestinationFn = useServerFn(deleteDestination)

  return useMutation({
    mutationFn: async (ids: number | number[]) => {
      const result = await deleteDestinationFn({
        data: { id: Array.isArray(ids) ? ids : [ids] },
      })
      return result
    },

    onSuccess: async () => {
      await invalidateDestinationQueries(queryClient)
      await router.invalidate()
      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Delete destination error:', error.message)
      options?.onError?.(error)
    },
  })
}

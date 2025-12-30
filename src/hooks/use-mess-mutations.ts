// src/hooks/use-mess-mutations.ts
// =============================================================================
// MESS MUTATION HOOKS - Using useMutation for best practices
// =============================================================================
// Provides reusable mutation hooks for mess CRUD operations
// with automatic cache invalidation and optimistic updates support.

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'

import {
  addMess,
  updateMess,
  updateMessPartial,
  updateBulkMess,
  deleteMess,
} from '@/lib/server/mess/mess-server-actions'
import { invalidateAllMessQueries } from '@/lib/query-options'
import type { CreateMessSchema } from '@/lib/validations/mess-validations'
import type { Mess } from '@/db/schema'

// ============================================
// CREATE MESS MUTATION
// ============================================

interface UseCreateMessMutationOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useCreateMessMutation(options?: UseCreateMessMutationOptions) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const addMessFn = useServerFn(addMess)

  return useMutation({
    mutationFn: async (data: CreateMessSchema) => {
      const result = await addMessFn({ data })
      if (result.error) {
        throw new Error(result.error)
      }
      return result.data
    },

    onSuccess: async () => {
      // ⭐ Invalidate ALL mess queries using unified key
      await invalidateAllMessQueries(queryClient)

      // ⭐ Invalidate router to ensure loaders refetch
      await router.invalidate()

      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Create mess error:', error.message)
      options?.onError?.(error)
    },
  })
}

// ============================================
// UPDATE MESS MUTATION
// ============================================

interface UseUpdateMessMutationOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useUpdateMessMutation(options?: UseUpdateMessMutationOptions) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const updateMessFn = useServerFn(updateMess)

  return useMutation({
    mutationFn: async (data: CreateMessSchema & { id: number }) => {
      const result = await updateMessFn({ data })
      if (result.error) {
        throw new Error(result.error)
      }
      return result.data
    },

    onSuccess: async () => {
      await invalidateAllMessQueries(queryClient)
      await router.invalidate()
      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Update mess error:', error.message)
      options?.onError?.(error)
    },
  })
}

// ============================================
// PARTIAL UPDATE MUTATION (for inline edits)
// ============================================

interface PartialUpdateData {
  id: number
  status?: Mess['status']
  type?: Mess['type']
  statusCapacity?: Mess['statusCapacity']
}

interface UsePartialUpdateMessMutationOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function usePartialUpdateMessMutation(
  options?: UsePartialUpdateMessMutationOptions,
) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const updateMessPartialFn = useServerFn(updateMessPartial)

  return useMutation({
    mutationFn: async (data: PartialUpdateData) => {
      const result = await updateMessPartialFn({ data })
      if (result.error) {
        throw new Error(result.error)
      }
      return result.data
    },

    onSuccess: async () => {
      await invalidateAllMessQueries(queryClient)
      await router.invalidate()
      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Partial update mess error:', error.message)
      options?.onError?.(error)
    },
  })
}

// ============================================
// BULK UPDATE MUTATION
// ============================================

interface BulkUpdateData {
  ids: number[]
  status?: Mess['status']
  type?: Mess['type']
  statusCapacity?: Mess['statusCapacity']
}

interface UseBulkUpdateMessMutationOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useBulkUpdateMessMutation(
  options?: UseBulkUpdateMessMutationOptions,
) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const updateBulkMessFn = useServerFn(updateBulkMess)

  return useMutation({
    mutationFn: async (data: BulkUpdateData) => {
      const result = await updateBulkMessFn({ data })
      if (result.error) {
        throw new Error(result.error)
      }
      return result.data
    },

    onSuccess: async () => {
      await invalidateAllMessQueries(queryClient)
      await router.invalidate()
      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Bulk update mess error:', error.message)
      options?.onError?.(error)
    },
  })
}

// ============================================
// DELETE MESS MUTATION
// ============================================

interface UseDeleteMessMutationOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useDeleteMessMutation(options?: UseDeleteMessMutationOptions) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const deleteMessFn = useServerFn(deleteMess)

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const result = await deleteMessFn({ data: { ids } })
      if (result.error) {
        throw new Error(result.error)
      }
      return result.data
    },

    onSuccess: async () => {
      await invalidateAllMessQueries(queryClient)
      await router.invalidate()
      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Delete mess error:', error.message)
      options?.onError?.(error)
    },
  })
}

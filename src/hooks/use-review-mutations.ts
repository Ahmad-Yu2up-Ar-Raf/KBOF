// =============================================================================
// REVIEW MUTATION HOOKS - SUASANA
// =============================================================================
// Provides reusable mutation and query hooks for review operations
// with automatic cache invalidation and optimistic updates support.
// =============================================================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'

import {
  addReview,
  updateReview,
  deleteReview,
  checkUserReview,
  getDestinationReviews,
  type CreateReviewInput,
  type UpdateReviewInput,
} from '@/lib/server/review/review-server-actions'
import { DestinasiKeys } from '@/lib/query-options'

// ============================================
// QUERY KEYS
// ============================================

export const reviewKeys = {
  all: ['review'] as const,
  userReview: (destinationId: number) =>
    [...reviewKeys.all, 'user', destinationId] as const,
  list: (destinationId: number) =>
    [...reviewKeys.all, 'list', destinationId] as const,
} as const

// ============================================
// CHECK USER REVIEW HOOK
// ============================================

export function useCheckUserReview(destinationId: number, enabled = true) {
  const checkUserReviewFn = useServerFn(checkUserReview)

  return useQuery({
    queryKey: reviewKeys.userReview(destinationId),
    queryFn: async () => {
      const result = await checkUserReviewFn({ data: { destinationId } })
      return result
    },
    enabled,
    staleTime: 30 * 1000,
  })
}

// ============================================
// GET DESTINATION REVIEWS HOOK
// ============================================

export function useDestinationReviews(
  destinationId: number,
  limit = 10,
  enabled = true,
) {
  const getReviewsFn = useServerFn(getDestinationReviews)

  return useQuery({
    queryKey: reviewKeys.list(destinationId),
    queryFn: async () => {
      const result = await getReviewsFn({
        data: { destinationId, limit },
      })
      return result
    },
    enabled,
    staleTime: 30 * 1000,
  })
}

// ============================================
// ADD REVIEW MUTATION
// ============================================

interface UseAddReviewMutationOptions {
  destinationSlug?: string
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useAddReviewMutation(options?: UseAddReviewMutationOptions) {
  const queryClient = useQueryClient()
  const addReviewFn = useServerFn(addReview)

  return useMutation({
    mutationFn: async (data: CreateReviewInput) => {
      const result = await addReviewFn({ data })
      return result
    },

    onSuccess: async (_, variables) => {
      // Invalidate user review status
      await queryClient.invalidateQueries({
        queryKey: reviewKeys.userReview(variables.destinationId),
      })

      // Invalidate reviews list
      await queryClient.invalidateQueries({
        queryKey: reviewKeys.list(variables.destinationId),
      })

      // Invalidate destination detail to refresh review stats
      if (options?.destinationSlug) {
        await queryClient.invalidateQueries({
          queryKey: DestinasiKeys.detail(options.destinationSlug),
        })
      }

      // Invalidate all destinasi list queries
      await queryClient.invalidateQueries({
        queryKey: DestinasiKeys.all,
      })

      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Add review error:', error.message)
      options?.onError?.(error)
    },
  })
}

// ============================================
// UPDATE REVIEW MUTATION
// ============================================

interface UseUpdateReviewMutationOptions {
  destinationId: number
  destinationSlug?: string
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useUpdateReviewMutation(
  options: UseUpdateReviewMutationOptions,
) {
  const queryClient = useQueryClient()
  const updateReviewFn = useServerFn(updateReview)

  return useMutation({
    mutationFn: async (data: UpdateReviewInput) => {
      const result = await updateReviewFn({ data })
      return result
    },

    onSuccess: async () => {
      // Invalidate user review status
      await queryClient.invalidateQueries({
        queryKey: reviewKeys.userReview(options.destinationId),
      })

      // Invalidate reviews list
      await queryClient.invalidateQueries({
        queryKey: reviewKeys.list(options.destinationId),
      })

      // Invalidate destination detail
      if (options?.destinationSlug) {
        await queryClient.invalidateQueries({
          queryKey: DestinasiKeys.detail(options.destinationSlug),
        })
      }

      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Update review error:', error.message)
      options?.onError?.(error)
    },
  })
}

// ============================================
// DELETE REVIEW MUTATION
// ============================================

interface UseDeleteReviewMutationOptions {
  destinationId: number
  destinationSlug?: string
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useDeleteReviewMutation(
  options: UseDeleteReviewMutationOptions,
) {
  const queryClient = useQueryClient()
  const deleteReviewFn = useServerFn(deleteReview)

  return useMutation({
    mutationFn: async (reviewId: number) => {
      const result = await deleteReviewFn({ data: { id: reviewId } })
      return result
    },

    onSuccess: async () => {
      // Invalidate user review status
      await queryClient.invalidateQueries({
        queryKey: reviewKeys.userReview(options.destinationId),
      })

      // Invalidate reviews list
      await queryClient.invalidateQueries({
        queryKey: reviewKeys.list(options.destinationId),
      })

      // Invalidate destination detail
      if (options?.destinationSlug) {
        await queryClient.invalidateQueries({
          queryKey: DestinasiKeys.detail(options.destinationSlug),
        })
      }

      // Invalidate all destinasi list queries
      await queryClient.invalidateQueries({
        queryKey: DestinasiKeys.all,
      })

      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Delete review error:', error.message)
      options?.onError?.(error)
    },
  })
}

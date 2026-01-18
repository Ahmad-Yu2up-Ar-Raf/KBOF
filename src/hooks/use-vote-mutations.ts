// =============================================================================
// VOTE MUTATION HOOKS - SUASANA
// =============================================================================
// Provides reusable mutation hooks for vote operations
// with automatic cache invalidation and optimistic updates support.
// =============================================================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'

import {
  addVote,
  checkUserVote,
  getVoteCount,
  removeVote,
} from '@/lib/server/vote/vote-server-actions'
import { DestinasiKeys, leaderboardKeys } from '@/lib/query-options'

// ============================================
// QUERY KEYS
// ============================================

export const voteKeys = {
  all: ['vote'] as const,
  userVote: (destinationId: number) =>
    [...voteKeys.all, 'user', destinationId] as const,
  count: (destinationId: number) =>
    [...voteKeys.all, 'count', destinationId] as const,
} as const

// ============================================
// CHECK USER VOTE HOOK
// ============================================

export function useCheckUserVote(destinationId: number, enabled = true) {
  const checkUserVoteFn = useServerFn(checkUserVote)

  return useQuery({
    queryKey: voteKeys.userVote(destinationId),
    queryFn: async () => {
      const result = await checkUserVoteFn({ data: { destinationId } })
      return result
    },
    enabled,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// ============================================
// GET VOTE COUNT HOOK
// ============================================

export function useVoteCount(destinationId: number) {
  const getVoteCountFn = useServerFn(getVoteCount)

  return useQuery({
    queryKey: voteKeys.count(destinationId),
    queryFn: async () => {
      const result = await getVoteCountFn({ data: { destinationId } })
      return result
    },
    staleTime: 30 * 1000,
  })
}

// ============================================
// ADD VOTE MUTATION
// ============================================

interface UseAddVoteMutationOptions {
  destinationSlug?: string
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useAddVoteMutation(options?: UseAddVoteMutationOptions) {
  const queryClient = useQueryClient()
  const addVoteFn = useServerFn(addVote)

  return useMutation({
    mutationFn: async (destinationId: number) => {
      const result = await addVoteFn({ data: { destinationId } })
      return result
    },

    onSuccess: async (_, destinationId) => {
      // Invalidate user vote status
      await queryClient.invalidateQueries({
        queryKey: voteKeys.userVote(destinationId),
      })

      // Invalidate vote count
      await queryClient.invalidateQueries({
        queryKey: voteKeys.count(destinationId),
      })

      // Invalidate destination detail to refresh vote count
      if (options?.destinationSlug) {
        await queryClient.invalidateQueries({
          queryKey: DestinasiKeys.detail(options.destinationSlug),
        })
      }

      // Invalidate all destinasi list queries
      await queryClient.invalidateQueries({
        queryKey: DestinasiKeys.all,
      })

      // Invalidate leaderboard queries (vote count changed)
      await queryClient.invalidateQueries({
        queryKey: leaderboardKeys.all,
      })

      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Add vote error:', error.message)
      options?.onError?.(error)
    },
  })
}

// ============================================
// REMOVE VOTE MUTATION
// ============================================

interface UseRemoveVoteMutationOptions {
  destinationSlug?: string
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useRemoveVoteMutation(options?: UseRemoveVoteMutationOptions) {
  const queryClient = useQueryClient()
  const removeVoteFn = useServerFn(removeVote)

  return useMutation({
    mutationFn: async (destinationId: number) => {
      const result = await removeVoteFn({ data: { destinationId } })
      return result
    },

    onSuccess: async (_, destinationId) => {
      // Invalidate user vote status
      await queryClient.invalidateQueries({
        queryKey: voteKeys.userVote(destinationId),
      })

      // Invalidate vote count
      await queryClient.invalidateQueries({
        queryKey: voteKeys.count(destinationId),
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

      // Invalidate leaderboard queries
      await queryClient.invalidateQueries({
        queryKey: leaderboardKeys.all,
      })

      await options?.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Remove vote error:', error.message)
      options?.onError?.(error)
    },
  })
}

// ============================================
// TOGGLE VOTE HOOK - Convenience hook for vote/unvote
// ============================================

interface UseToggleVoteOptions {
  destinationId: number
  destinationSlug: string
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useToggleVote({
  destinationId,
  destinationSlug,
  onSuccess,
  onError,
}: UseToggleVoteOptions) {
  const addMutation = useAddVoteMutation({
    destinationSlug,
    onSuccess,
    onError,
  })
  const removeMutation = useRemoveVoteMutation({
    destinationSlug,
    onSuccess,
    onError,
  })

  const toggleVote = async (hasVoted: boolean) => {
    if (hasVoted) {
      await removeMutation.mutateAsync(destinationId)
    } else {
      await addMutation.mutateAsync(destinationId)
    }
  }

  return {
    toggleVote,
    isLoading: addMutation.isPending || removeMutation.isPending,
    isAddingVote: addMutation.isPending,
    isRemovingVote: removeMutation.isPending,
  }
}

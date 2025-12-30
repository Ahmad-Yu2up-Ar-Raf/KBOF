// src/lib/query-options.ts
// =============================================================================
// QUERY OPTIONS FACTORY - UNIFIED QUERY KEYS
// =============================================================================
// This file provides query options for TanStack Query integration.
// Uses consistent query keys for proper cache invalidation.

import { queryOptions } from '@tanstack/react-query'
import {
  getMessAggregateServerFn,
  type MessAggregateInput,
} from './server/mess/mess-server-queries'

// ============================================
// MESS QUERY KEYS - Single Source of Truth
// ============================================

/**
 * Unified query keys for mess queries
 * All mess-related queries MUST use these keys for proper invalidation
 */
export const messKeys = {
  // Base key - invalidate this to clear ALL mess queries
  all: ['mess'] as const,

  // Aggregate query key - includes filters for granular caching
  aggregate: (filters: MessAggregateInput) =>
    [...messKeys.all, 'aggregate', filters] as const,

  // For future use
  list: (filters?: Record<string, unknown>) =>
    [...messKeys.all, 'list', filters] as const,
  detail: (id: number) => [...messKeys.all, 'detail', id] as const,
} as const

// ============================================
// MESS QUERY OPTIONS
// ============================================

/**
 * Query options factory for mess aggregate data
 *
 * @param filters - Filter parameters from nuqs/search params
 * @returns Query options object for use with useQuery/useSuspenseQuery
 *
 * @example
 * // In loader (SSR) - populate cache:
 * await queryClient.ensureQueryData(getMessQueryOptions(filters))
 *
 * // In component (CSR with hydration):
 * const { data } = useSuspenseQuery(getMessQueryOptions(filters))
 */
export const getMessQueryOptions = (filters: MessAggregateInput) =>
  queryOptions({
    // ⭐ Use unified query key
    queryKey: messKeys.aggregate(filters),

    // ⭐ queryFn MUST be a function that returns a Promise
    queryFn: async () => {
      const result = await getMessAggregateServerFn({
        data: { filters },
      })
      return result
    },

    // ⭐ Keep data fresh - staleTime: 0 means always refetch on mount
    staleTime: 0,

    // ⭐ Don't garbage collect immediately
    gcTime: 5 * 60 * 1000, // 5 minutes
  })

// ============================================
// INVALIDATION HELPERS
// ============================================

/**
 * Invalidate ALL mess queries
 * Use after create/update/delete operations
 *
 * @param queryClient - TanStack Query client
 *
 * @example
 * await invalidateAllMessQueries(queryClient)
 */
export const invalidateAllMessQueries = async (
  queryClient: import('@tanstack/react-query').QueryClient,
) => {
  await queryClient.invalidateQueries({
    queryKey: messKeys.all,
  })
}

/**
 * Refetch ALL mess queries
 * More aggressive than invalidate - immediately refetches
 *
 * @param queryClient - TanStack Query client
 */
export const refetchAllMessQueries = async (
  queryClient: import('@tanstack/react-query').QueryClient,
) => {
  await queryClient.refetchQueries({
    queryKey: messKeys.all,
    type: 'active', // Only refetch active queries
  })
}

// ============================================
// TYPE EXPORTS
// ============================================

export type { MessAggregateInput }

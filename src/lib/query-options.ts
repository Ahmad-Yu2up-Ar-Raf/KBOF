// src/lib/query-options.ts
// =============================================================================
// QUERY OPTIONS FACTORY - UNIFIED QUERY KEYS
// =============================================================================
// This file provides query options for TanStack Query integration.
// Uses consistent query keys for proper cache invalidation.

import { queryOptions, infiniteQueryOptions } from '@tanstack/react-query'

import {
  getDestinationAggregateServerFn,
  type DestinationAggregateInput,
} from './server/destination/destination-server-queries'

import {
  getExploreDestinationsServerFn,
  getDestinationBySlugServerFn,
  type ExploreFilters,
} from './server/explore/explore-server-queries'

import {
  getArticleAggregateServerFn,
  type ArticleAggregateInput,
} from './server/article/article-server-queries'

import {
  getDonationAggregateServerFn,
  type DonationAggregateInput,
} from './server/donation/donation-server-queries'

// ============================================
// TYPE EXPORTS
// ============================================

export type {
  DestinationAggregateInput,
  ExploreFilters,
  ArticleAggregateInput,
  DonationAggregateInput,
}

// ============================================
// DESTINATION QUERY KEYS
// ============================================

/**
 * Unified query keys for destination queries
 * All destination-related queries MUST use these keys for proper invalidation
 */
export const destinationKeys = {
  // Base key - invalidate this to clear ALL destination queries
  all: ['destination'] as const,

  // Aggregate query key - includes filters for granular caching
  aggregate: (filters: DestinationAggregateInput) =>
    [...destinationKeys.all, 'aggregate', filters] as const,

  // For future use
  list: (filters?: Record<string, unknown>) =>
    [...destinationKeys.all, 'list', filters] as const,
  detail: (id: string) => [...destinationKeys.all, 'detail', id] as const,
} as const

// ============================================
// DESTINATION QUERY OPTIONS
// ============================================

/**
 * Query options factory for destination aggregate data
 */
export const getDestinationQueryOptions = (
  filters: DestinationAggregateInput,
) =>
  queryOptions({
    queryKey: destinationKeys.aggregate(filters),

    queryFn: async () => {
      const result = await getDestinationAggregateServerFn({
        data: { filters },
      })
      return result
    },

    // ⭐ IMPORTANT: Set reasonable staleTime to prevent excessive refetches
    // Data is considered "fresh" for 30 seconds - nuqs filter changes will
    // still trigger refetch because queryKey changes (which always fetches)
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000,
  })

// ============================================
// DESTINATION INVALIDATION HELPERS
// ============================================

/**
 * Invalidate ALL destination queries
 * Use after create/update/delete operations
 */
export const invalidateAllDestinationQueries = async (
  queryClient: import('@tanstack/react-query').QueryClient,
) => {
  await queryClient.invalidateQueries({
    queryKey: destinationKeys.all,
  })
}

/**
 * Refetch ALL destination queries
 */
export const refetchAllDestinationQueries = async (
  queryClient: import('@tanstack/react-query').QueryClient,
) => {
  await queryClient.refetchQueries({
    queryKey: destinationKeys.all,
    type: 'active',
  })
}

// ============================================
// EXPLORE QUERY KEYS (Public)
// ============================================

export const exploreKeys = {
  all: ['explore'] as const,
  list: (filters: Omit<ExploreFilters, 'cursor'>) =>
    [...exploreKeys.all, 'list', filters] as const,
  detail: (slug: string) => [...exploreKeys.all, 'detail', slug] as const,
} as const

// ============================================
// EXPLORE QUERY OPTIONS (Infinite Scroll)
// ============================================

/**
 * Infinite query options for explore destinations (public)
 * Uses cursor-based pagination for infinite scroll
 */
export const getExploreInfiniteQueryOptions = (
  filters: Omit<ExploreFilters, 'cursor'>,
) =>
  infiniteQueryOptions({
    queryKey: exploreKeys.list(filters),
    queryFn: async ({ pageParam }) => {
      const result = await getExploreDestinationsServerFn({
        data: {
          filters: {
            ...filters,
            cursor: pageParam,
          },
        },
      })
      return result
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? (lastPage.nextCursor ?? undefined) : undefined,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

/**
 * Query options for single destination by slug (public)
 */
export const getExploreDetailQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: exploreKeys.detail(slug),
    queryFn: async () => {
      const result = await getDestinationBySlugServerFn({
        data: { slug },
      })
      return result
    },
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

// ============================================
// ARTICLE QUERY KEYS
// ============================================

export const articleKeys = {
  all: ['articles'] as const,
  aggregate: (filters: ArticleAggregateInput) =>
    [...articleKeys.all, 'aggregate', filters] as const,
  detail: (id: number) => [...articleKeys.all, 'detail', id] as const,
} as const

// ============================================
// ARTICLE QUERY OPTIONS
// ============================================

export const getArticleQueryOptions = (filters: ArticleAggregateInput) =>
  queryOptions({
    queryKey: articleKeys.aggregate(filters),
    queryFn: async () => {
      const result = await getArticleAggregateServerFn({
        data: { filters },
      })
      return result
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  })

// ============================================
// DONATION QUERY KEYS
// ============================================

export const donationKeys = {
  all: ['donations'] as const,
  aggregate: (filters: DonationAggregateInput) =>
    [...donationKeys.all, 'aggregate', filters] as const,
} as const

// ============================================
// DONATION QUERY OPTIONS
// ============================================

export const getDonationQueryOptions = (filters: DonationAggregateInput) =>
  queryOptions({
    queryKey: donationKeys.aggregate(filters),
    queryFn: async () => {
      const result = await getDonationAggregateServerFn({
        data: { filters },
      })
      return result
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  })

// src/lib/query-options.ts
// =============================================================================
// QUERY OPTIONS FACTORY - UNIFIED QUERY KEYS
// =============================================================================
// This file provides query options for TanStack Query integration.
// Uses consistent query keys for proper cache invalidation.

import { queryOptions, infiniteQueryOptions } from '@tanstack/react-query'

import {
  getDestinationAggregateServerFn,
  getDestinationAggregateAdminServerFn,
  type DestinationAggregateInput,
} from './server/destination/destination-server-queries'
// ... existing imports ...
import {
  getDestinationReviewsServerFn,
  getDestinationReviewsPreviewServerFn,
  type ReviewFilters,
  type ReviewsResult,
  type ReviewWithUser,
} from './server/review/review-server-queries'
import {
  getDestinasiDestinationsServerFn,
  getDestinationBySlugServerFn,
  getRelatedDestinationsServerFn,
  getFeaturedDestinationsServerFn,
  type DestinasiFilters,
  type DestinasiDetailDestination,
  type DestinasiDestination,
  type RelatedDestination,
} from './server/explore/destinasi-server-queries'

import {
  getArticleAggregateServerFn,
  getArticleAggregateAdminServerFn,
  type ArticleAggregateInput,
} from './server/article/article-server-queries'

import {
  getPublicArticlesServerFn,
  getArticleBySlugServerFn,
  getRecommendedArticlesServerFn,
  getFeaturedArticlesServerFn,
  type ArticlePublicFilters,
} from './server/article/article-public-queries'

import {
  getLeaderboardServerFn,
  getLeaderboardTopServerFn,
  getLeaderboardPodiumServerFn,
  type LeaderboardFilters,
  type LeaderboardResult,
  type LeaderboardTopEntry,
  type LeaderboardEntry,
} from './server/leaderboard/leaderboard-server-queries'

import {
  getAnalyticsAggregateServerFn,
  type AnalyticsInput,
  type AnalyticsAggregateResult,
} from './server/analytics/analytics-server-queries'

import {
  getUserAggregateServerFn,
  type UserAggregateInput,
  type UserAggregateResult,
} from './server/user/user-server-queries'

// ============================================
// TYPE EXPORTS
// ============================================

export type {
  DestinationAggregateInput,
  DestinasiFilters,
  DestinasiDetailDestination,
  DestinasiDestination,
  RelatedDestination,
  ArticleAggregateInput,
  LeaderboardFilters,
  LeaderboardResult,
  LeaderboardTopEntry,
  LeaderboardEntry,
  AnalyticsInput,
  AnalyticsAggregateResult,
  UserAggregateInput,
  UserAggregateResult,
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

/**
 * Query options factory for destination aggregate data (ADMIN - ALL DATA)
 */
export const getDestinationAdminQueryOptions = (
  filters: DestinationAggregateInput,
) =>
  queryOptions({
    queryKey: [...destinationKeys.all, 'admin', 'aggregate', filters] as const,

    queryFn: async () => {
      const result = await getDestinationAggregateAdminServerFn({
        data: { filters },
      })
      return result
    },

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
// Destinasi QUERY KEYS (Public)
// ============================================

export const DestinasiKeys = {
  all: ['Destinasi'] as const,
  list: (filters: Omit<DestinasiFilters, 'cursor'>) =>
    [...DestinasiKeys.all, 'list', filters] as const,
  detail: (slug: string) => [...DestinasiKeys.all, 'detail', slug] as const,
  related: (destinationId: number) =>
    [...DestinasiKeys.all, 'related', destinationId] as const,
  featured: (limit: number) =>
    [...DestinasiKeys.all, 'featured', limit] as const,
} as const

// ============================================
// Destinasi QUERY OPTIONS (Infinite Scroll)
// ============================================

/**
 * Infinite query options for Destinasi destinations (public)
 * Uses cursor-based pagination for infinite scroll
 */
export const getDestinasiInfiniteQueryOptions = (
  filters: Omit<DestinasiFilters, 'cursor'>,
) =>
  infiniteQueryOptions({
    queryKey: DestinasiKeys.list(filters),
    queryFn: async ({ pageParam }) => {
      const result = await getDestinasiDestinationsServerFn({
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
 * Returns DestinasiDetailDestination with full relations and computed fields
 */
export const getDestinasiDetailQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: DestinasiKeys.detail(slug),
    queryFn: async (): Promise<DestinasiDetailDestination | null> => {
      const result = await getDestinationBySlugServerFn({
        data: { slug },
      })
      return result
    },
    staleTime: 60 * 1000, // 1 minute - reasonable for detail page
    gcTime: 10 * 60 * 1000, // 10 minutes
    // Enable retry for network errors
    retry: 2,
  })

/**
 * Query options for related destinations
 * Fetches destinations similar to the current one (same category/provinsi)
 */
export type RelatedDestinationsInput = {
  destinationId: number
  category: string
  provinsi: string
  limit?: number
}

export const getRelatedDestinationsQueryOptions = ({
  destinationId,
  category,
  provinsi,
  limit = 6,
}: RelatedDestinationsInput) =>
  queryOptions({
    queryKey: DestinasiKeys.related(destinationId),
    queryFn: async (): Promise<RelatedDestination[]> => {
      const result = await getRelatedDestinationsServerFn({
        data: {
          destinationId,
          category: category as Parameters<
            typeof getRelatedDestinationsServerFn
          >[0]['data']['category'],
          provinsi: provinsi as Parameters<
            typeof getRelatedDestinationsServerFn
          >[0]['data']['provinsi'],
          limit,
        },
      })
      return result
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - related destinations don't change often
    gcTime: 15 * 60 * 1000, // 15 minutes
    // Only fetch if we have a valid destination
    enabled: destinationId > 0,
  })

/**
 * Query options for featured destinations (homepage)
 * Returns latest published destinations sorted by creation date
 */
export const getFeaturedDestinationsQueryOptions = (limit: number = 8) =>
  queryOptions({
    queryKey: DestinasiKeys.featured(limit),
    queryFn: async (): Promise<DestinasiDestination[]> => {
      const result = await getFeaturedDestinationsServerFn({
        data: { limit },
      })
      return result
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })

// ============================================
// ARTICLE QUERY KEYS
// ============================================

export const articleKeys = {
  all: ['articles'] as const,
  aggregate: (filters: ArticleAggregateInput) =>
    [...articleKeys.all, 'aggregate', filters] as const,
  list: (filters: Omit<ArticlePublicFilters, 'cursor'>) =>
    [...articleKeys.all, 'list', filters] as const,
  detail: (id: number) => [...articleKeys.all, 'detail', id] as const,
  detailBySlug: (slug: string) => [...articleKeys.all, 'detail', slug] as const,
  recommendations: (excludeSlug: string) =>
    [...articleKeys.all, 'recommendations', excludeSlug] as const,
  featured: (limit: number) => [...articleKeys.all, 'featured', limit] as const,
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

/**
 * Query options factory for article aggregate data (ADMIN - ALL DATA)
 */
export const getArticleAdminQueryOptions = (filters: ArticleAggregateInput) =>
  queryOptions({
    queryKey: [...articleKeys.all, 'admin', 'aggregate', filters] as const,
    queryFn: async () => {
      const result = await getArticleAggregateAdminServerFn({
        data: { filters },
      })
      return result
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  })

// ============================================
// ARTICLE INFINITE QUERY OPTIONS (Public)
// ============================================

/**
 * Infinite query options for browse articles (public)
 * Uses cursor-based pagination for infinite scroll
 */
export const getArticleInfiniteQueryOptions = (
  filters: Omit<ArticlePublicFilters, 'cursor'>,
) =>
  infiniteQueryOptions({
    queryKey: articleKeys.list(filters),
    queryFn: async ({ pageParam }) => {
      const result = await getPublicArticlesServerFn({
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
 * Query options for single article by slug (public)
 */
export const getArticleDetailQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: articleKeys.detailBySlug(slug),
    queryFn: async () => {
      const result = await getArticleBySlugServerFn({
        data: { slug },
      })
      return result
    },
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

/**
 * Query options for recommended articles (public)
 * Excludes the current article being viewed
 */
export const getRecommendedArticlesQueryOptions = (
  excludeSlug: string,
  limit: number = 3,
) =>
  queryOptions({
    queryKey: articleKeys.recommendations(excludeSlug),
    queryFn: async () => {
      const result = await getRecommendedArticlesServerFn({
        data: { excludeSlug, limit },
      })
      return result
    },
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

/**
 * Query options for featured articles (homepage)
 * Returns latest published articles for homepage display
 */
export const getFeaturedArticlesQueryOptions = (limit: number = 4) =>
  queryOptions({
    queryKey: articleKeys.featured(limit),
    queryFn: async () => {
      const result = await getFeaturedArticlesServerFn({
        data: { limit },
      })
      return result
    },
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

// ============================================
// DONATION QUERY KEYS
// ============================================

export const reviewKeys = {
  all: ['review'] as const,
  userReview: (destinationId: number) =>
    [...reviewKeys.all, 'user', destinationId] as const,
  list: (destinationId: number) =>
    [...reviewKeys.all, 'list', destinationId] as const,
  listByFilters: (filters: ReviewFilters) =>
    [...reviewKeys.all, 'listByFilters', filters] as const,
  preview: (destinationId: number) =>
    [...reviewKeys.all, 'preview', destinationId] as const,
  byDestination: (destinationId: number) =>
    [...reviewKeys.all, 'byDestination', destinationId] as const,
} as const

// ============================================
// VOTE QUERY KEYS
// ============================================

export const voteKeys = {
  all: ['vote'] as const,
  userVote: (destinationId: number) =>
    [...voteKeys.all, 'user', destinationId] as const,
  count: (destinationId: number) =>
    [...voteKeys.all, 'count', destinationId] as const,
} as const

// ============================================
// LEADERBOARD QUERY KEYS
// ============================================

export const leaderboardKeys = {
  all: ['leaderboard'] as const,
  list: (filters: Omit<LeaderboardFilters, 'offset'>) =>
    [...leaderboardKeys.all, 'list', filters] as const,
  top: (limit: number) => [...leaderboardKeys.all, 'top', limit] as const,
  podium: (filters: Omit<LeaderboardFilters, 'limit' | 'offset'>) =>
    [...leaderboardKeys.all, 'podium', filters] as const,
} as const

// ============================================
// LEADERBOARD QUERY OPTIONS
// ============================================

/**
 * Query options for paginated leaderboard with filters
 * Includes filter counts for UI
 */
export const getLeaderboardQueryOptions = (filters: LeaderboardFilters) =>
  queryOptions({
    queryKey: leaderboardKeys.list(filters),
    queryFn: async (): Promise<LeaderboardResult> => {
      const result = await getLeaderboardServerFn({
        data: { filters },
      })
      return result
    },
    staleTime: 30 * 1000, // 30 seconds - leaderboard changes frequently
    gcTime: 5 * 60 * 1000,
  })

/**
 * Query options for TOP N destinations (homepage widget)
 */
export const getLeaderboardTopQueryOptions = (limit: number = 4) =>
  queryOptions({
    queryKey: leaderboardKeys.top(limit),
    queryFn: async (): Promise<LeaderboardTopEntry[]> => {
      const result = await getLeaderboardTopServerFn({
        data: { limit },
      })
      return result
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000,
  })

/**
 * Query options for podium (TOP 3) with full details
 */
export const getLeaderboardPodiumQueryOptions = (
  filters: Omit<LeaderboardFilters, 'limit' | 'offset'>,
) =>
  queryOptions({
    queryKey: leaderboardKeys.podium(filters),
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      const result = await getLeaderboardPodiumServerFn({
        data: { filters },
      })
      return result
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  })

// ============================================
// LEADERBOARD INVALIDATION HELPERS
// ============================================

/**
 * Invalidate ALL leaderboard queries
 * Call this after a vote is added/removed
 */
export const invalidateAllLeaderboardQueries = async (
  queryClient: import('@tanstack/react-query').QueryClient,
) => {
  await queryClient.invalidateQueries({
    queryKey: leaderboardKeys.all,
  })
}

// ============================================
// ANALYTICS QUERY KEYS
// ============================================

export const analyticsKeys = {
  all: ['analytics'] as const,
  aggregate: (filters: AnalyticsInput) =>
    [...analyticsKeys.all, 'aggregate', filters] as const,
} as const

// ============================================
// ANALYTICS QUERY OPTIONS
// ============================================

/**
 * Query options factory for dashboard analytics (aggregated)
 * Uses createdAt filter for date range filtering
 */
export const getAnalyticsQueryOptions = (filters: AnalyticsInput) =>
  queryOptions({
    queryKey: analyticsKeys.aggregate(filters),
    queryFn: async (): Promise<AnalyticsAggregateResult> => {
      const result = await getAnalyticsAggregateServerFn({
        data: { filters },
      })
      return result
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000,
  })

// ============================================
// ANALYTICS INVALIDATION HELPERS
// ============================================

/**
 * Invalidate ALL analytics queries
 */
export const invalidateAllAnalyticsQueries = async (
  queryClient: import('@tanstack/react-query').QueryClient,
) => {
  await queryClient.invalidateQueries({
    queryKey: analyticsKeys.all,
  })
}

// ============================================
// USER MANAGEMENT QUERY KEYS
// ============================================

/**
 * Unified query keys for user management queries (SuperAdmin only)
 * All user-related queries MUST use these keys for proper invalidation
 */
export const userKeys = {
  // Base key - invalidate this to clear ALL user queries
  all: ['user'] as const,

  // Aggregate query key - includes filters for granular caching
  aggregate: (filters: UserAggregateInput) =>
    [...userKeys.all, 'aggregate', filters] as const,

  // Detail query key
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
} as const

// ============================================
// USER MANAGEMENT QUERY OPTIONS
// ============================================

/**
 * Query options factory for user aggregate data (SuperAdmin only)
 * Returns paginated users with role counts
 */
export const getUserQueryOptions = (filters: UserAggregateInput) =>
  queryOptions({
    queryKey: userKeys.aggregate(filters),
    queryFn: async (): Promise<UserAggregateResult> => {
      const result = await getUserAggregateServerFn({
        data: { filters },
      })
      return result
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000,
  })

// ============================================
// USER MANAGEMENT INVALIDATION HELPERS
// ============================================

/**
 * Invalidate ALL user queries
 * Use after create/update/delete/ban/unban operations
 */
export const invalidateAllUserQueries = async (
  queryClient: import('@tanstack/react-query').QueryClient,
) => {
  await queryClient.invalidateQueries({
    queryKey: userKeys.all,
  })
}

/**
 * Refetch ALL user queries
 */
export const refetchAllUserQueries = async (
  queryClient: import('@tanstack/react-query').QueryClient,
) => {
  await queryClient.refetchQueries({
    queryKey: userKeys.all,
    type: 'active',
  })
}

// ... existing code ...

// =============================================================================
// REVIEW QUERY KEYS
// =============================================================================

// =============================================================================
// REVIEW QUERY OPTIONS
// =============================================================================

/**
 * Query options for paginated reviews list
 * Used in AllReviewsSheet for fetching all reviews
 */
export const getReviewsQueryOptions = (filters: ReviewFilters) =>
  queryOptions({
    queryKey: reviewKeys.listByFilters(filters),
    queryFn: async (): Promise<ReviewsResult> => {
      const result = await getDestinationReviewsServerFn({
        data: { filters },
      })
      return result
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  })

/**
 * Query options for review preview (first 4 reviews)
 * Used in destination detail page
 */
export const getReviewsPreviewQueryOptions = (destinationId: number) =>
  queryOptions({
    queryKey: reviewKeys.preview(destinationId),
    queryFn: async (): Promise<ReviewWithUser[]> => {
      const result = await getDestinationReviewsPreviewServerFn({
        data: { destinationId },
      })
      return result
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

// =============================================================================
// REVIEW INVALIDATION HELPERS
// =============================================================================

/**
 * Invalidate all reviews for a destination
 * Call after posting/editing/deleting a review
 */
export const invalidateDestinationReviews = async (
  queryClient: import('@tanstack/react-query').QueryClient,
  destinationId: number,
) => {
  await queryClient.invalidateQueries({
    queryKey: reviewKeys.byDestination(destinationId),
  })
}

// Export types
export type { ReviewFilters, ReviewsResult, ReviewWithUser }

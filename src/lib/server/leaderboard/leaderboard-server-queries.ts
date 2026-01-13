// =============================================================================
// LEADERBOARD SERVER QUERIES - SUASANA
// =============================================================================
// Server-side leaderboard aggregation functions
// Calculates vote counts and rankings for destinations
// =============================================================================

import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { and, count, desc, eq, inArray, sql } from 'drizzle-orm'
import * as schema from '@/db/schema'

// Dynamic import to prevent db from being bundled in client
const getDb = async () => {
  const { db } = await import('@/db')
  return db
}

const { destination, user, vote } = schema

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Leaderboard filter schema - supports multi-value filters
 * Uses arrays for OR semantics within same field, AND between different fields
 */
export const LeaderboardFiltersSchema = z.object({
  // Filter by categories (OR semantics if multiple)
  categories: z
    .array(z.enum(schema.destinationCategory.enumValues))
    .default([]),
  // Filter by types (OR semantics if multiple)
  types: z.array(z.enum(schema.destinationType.enumValues)).default([]),
  // Filter by provinces (OR semantics if multiple)
  provinces: z.array(z.enum(schema.provinsiIndonesia.enumValues)).default([]),
  // Pagination
  limit: z.number().int().positive().max(100).default(10),
  offset: z.number().int().nonnegative().default(0),
  // Scope - for future use (e.g., weekly, monthly leaderboard)
  scope: z.enum(['global', 'weekly', 'monthly']).default('global'),
})

export type LeaderboardFilters = z.infer<typeof LeaderboardFiltersSchema>

/**
 * Single leaderboard entry with rank
 */
export type LeaderboardEntry = {
  rank: number
  destinationId: number
  slug: string
  name: string
  description: string
  coverImage: string | null
  voteCount: number
  category: schema.DestinationCategory
  type: schema.DestinationType
  provinsi: schema.ProvinsiIndonesia
  kabupatenKota: string | null
  user: {
    id: string
    name: string
    image: string | null
  }
}

/**
 * Leaderboard result with metadata
 */
export type LeaderboardResult = {
  data: LeaderboardEntry[]
  totalCount: number
  hasMore: boolean
  // Category/type/province counts for filter UI
  categoryCounts: Record<string, number>
  typeCounts: Record<string, number>
  provinceCounts: Record<string, number>
}

/**
 * Simplified entry for homepage (Top 4)
 */
export type LeaderboardTopEntry = {
  id: number
  slug: string
  name: string
  coverImage: string | null
  voteCount: number
}

// ============================================
// INTERNAL AGGREGATION FUNCTIONS
// ============================================

/**
 * Core aggregation query - counts votes per destination
 * Uses LEFT JOIN to include destinations with 0 votes
 */
async function fetchLeaderboardData(
  filters: LeaderboardFilters,
): Promise<{ data: LeaderboardEntry[]; totalCount: number }> {
  const db = await getDb()
  const { categories, types, provinces, limit, offset } = filters

  // Build WHERE conditions - only published destinations
  const whereConditions = [eq(destination.status, 'published')]

  // Add category filter (OR semantics for multiple values)
  if (categories.length > 0) {
    whereConditions.push(
      inArray(destination.category, categories as schema.DestinationCategory[]),
    )
  }

  // Add type filter (OR semantics for multiple values)
  if (types.length > 0) {
    whereConditions.push(
      inArray(destination.type, types as schema.DestinationType[]),
    )
  }

  // Add province filter (OR semantics for multiple values)
  if (provinces.length > 0) {
    whereConditions.push(
      inArray(destination.provinsi, provinces as schema.ProvinsiIndonesia[]),
    )
  }

  // Get total count for pagination
  const [countResult] = await db
    .select({ count: count() })
    .from(destination)
    .where(and(...whereConditions))

  const totalCount = countResult?.count ?? 0

  // Main query with vote aggregation
  // Using subquery approach for better performance
  const voteCountsSubquery = db
    .select({
      destinationId: vote.destinationId,
      voteCount: count().as('vote_count'),
    })
    .from(vote)
    .groupBy(vote.destinationId)
    .as('vote_counts')

  const results = await db
    .select({
      destinationId: destination.id,
      slug: destination.slug,
      name: destination.name,
      description: destination.description,
      coverImage: destination.coverImage,
      category: destination.category,
      type: destination.type,
      provinsi: destination.provinsi,
      kabupatenKota: destination.kabupatenKota,
      voteCount: sql<number>`COALESCE(${voteCountsSubquery.voteCount}, 0)`,
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
      },
    })
    .from(destination)
    .leftJoin(user, eq(destination.userId, user.id))
    .leftJoin(
      voteCountsSubquery,
      eq(destination.id, voteCountsSubquery.destinationId),
    )
    .where(and(...whereConditions))
    .orderBy(
      desc(sql`COALESCE(${voteCountsSubquery.voteCount}, 0)`),
      desc(destination.createdAt),
    )
    .limit(limit)
    .offset(offset)

  // Map results with rank
  const data: LeaderboardEntry[] = results.map((row, index) => ({
    rank: offset + index + 1,
    destinationId: row.destinationId,
    slug: row.slug,
    name: row.name,
    description: row.description,
    coverImage: row.coverImage,
    voteCount: Number(row.voteCount) || 0,
    category: row.category,
    type: row.type,
    provinsi: row.provinsi,
    kabupatenKota: row.kabupatenKota,
    user: row.user ?? { id: '', name: 'Unknown', image: null },
  }))

  return { data, totalCount }
}

/**
 * Fetch filter counts for UI (how many destinations per category/type/province)
 */
async function fetchFilterCounts(): Promise<{
  categoryCounts: Record<string, number>
  typeCounts: Record<string, number>
  provinceCounts: Record<string, number>
}> {
  const db = await getDb()
  const baseCondition = eq(destination.status, 'published')

  // Fetch counts in parallel
  const [categoryResults, typeResults, provinceResults] = await Promise.all([
    db
      .select({
        value: destination.category,
        count: count(),
      })
      .from(destination)
      .where(baseCondition)
      .groupBy(destination.category),

    db
      .select({
        value: destination.type,
        count: count(),
      })
      .from(destination)
      .where(baseCondition)
      .groupBy(destination.type),

    db
      .select({
        value: destination.provinsi,
        count: count(),
      })
      .from(destination)
      .where(baseCondition)
      .groupBy(destination.provinsi),
  ])

  // Build count objects
  const categoryCounts: Record<string, number> = {}
  for (const { value, count: cnt } of categoryResults) {
    categoryCounts[value] = cnt
  }

  const typeCounts: Record<string, number> = {}
  for (const { value, count: cnt } of typeResults) {
    typeCounts[value] = cnt
  }

  const provinceCounts: Record<string, number> = {}
  for (const { value, count: cnt } of provinceResults) {
    provinceCounts[value] = cnt
  }

  return { categoryCounts, typeCounts, provinceCounts }
}

// ============================================
// PUBLIC SERVER FUNCTIONS
// ============================================

/**
 * Get leaderboard data with filters and pagination
 * Main function for /leaderboard route
 */
export const getLeaderboardServerFn = createServerFn({
  method: 'GET',
})
  .inputValidator(z.object({ filters: LeaderboardFiltersSchema }))
  .handler(async ({ data: { filters } }): Promise<LeaderboardResult> => {
    const [leaderboardData, filterCounts] = await Promise.all([
      fetchLeaderboardData(filters),
      fetchFilterCounts(),
    ])

    return {
      data: leaderboardData.data,
      totalCount: leaderboardData.totalCount,
      hasMore: filters.offset + filters.limit < leaderboardData.totalCount,
      ...filterCounts,
    }
  })

/**
 * Get TOP N destinations for homepage or widgets
 * Simplified response with minimal fields
 */
export const getLeaderboardTopServerFn = createServerFn({
  method: 'GET',
})
  .inputValidator(
    z.object({
      limit: z.number().int().positive().max(10).default(4),
    }),
  )
  .handler(async ({ data: { limit } }): Promise<LeaderboardTopEntry[]> => {
    const db = await getDb()

    // Vote counts subquery
    const voteCountsSubquery = db
      .select({
        destinationId: vote.destinationId,
        voteCount: count().as('vote_count'),
      })
      .from(vote)
      .groupBy(vote.destinationId)
      .as('vote_counts')

    const results = await db
      .select({
        id: destination.id,
        slug: destination.slug,
        name: destination.name,
        coverImage: destination.coverImage,
        voteCount: sql<number>`COALESCE(${voteCountsSubquery.voteCount}, 0)`,
      })
      .from(destination)
      .leftJoin(
        voteCountsSubquery,
        eq(destination.id, voteCountsSubquery.destinationId),
      )
      .where(eq(destination.status, 'published'))
      .orderBy(
        desc(sql`COALESCE(${voteCountsSubquery.voteCount}, 0)`),
        desc(destination.createdAt),
      )
      .limit(limit)

    return results.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      coverImage: row.coverImage,
      voteCount: Number(row.voteCount) || 0,
    }))
  })

/**
 * Get podium (TOP 3) with detailed info for leaderboard page hero section
 */
export const getLeaderboardPodiumServerFn = createServerFn({
  method: 'GET',
})
  .inputValidator(
    z.object({
      filters: LeaderboardFiltersSchema.omit({ limit: true, offset: true }),
    }),
  )
  .handler(async ({ data: { filters } }): Promise<LeaderboardEntry[]> => {
    const result = await fetchLeaderboardData({
      ...filters,
      limit: 3,
      offset: 0,
    })
    return result.data
  })

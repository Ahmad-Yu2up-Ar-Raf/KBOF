// =============================================================================
// ANALYTICS SERVER QUERIES - SUASANA
// =============================================================================
// Server-side aggregated queries for dashboard analytics with date filtering
// Following the same pattern as destination-server-queries.ts

import { createServerFn } from '@tanstack/react-start'
import { eq, sql, desc, count, gte, lte, and } from 'drizzle-orm'
import { z } from 'zod'
import * as schema from '@/db/schema'
import { adminServerMiddleware } from '@/lib/middleware'

// Dynamic import to prevent db from being bundled in client
const getDb = async () => {
  const { db } = await import('@/db')
  return db
}

// ============================================
// ANALYTICS INPUT SCHEMA
// ============================================

export const analyticsInputSchema = z.object({
  createdAt: z.array(z.number()).default([]),
})

export type AnalyticsInput = z.infer<typeof analyticsInputSchema>

// ============================================
// ANALYTICS RESULT TYPES
// ============================================

export interface DashboardStats {
  totalUsers: number
  totalDestinations: number
  totalArticles: number
  totalVotes: number
}

export interface TopDestinationVotes {
  id: number
  name: string
  slug: string
  coverImage: string | null
  provinsi: string
  voteCount: number
  createdAt: Date
}

export interface CategoryDistribution {
  category: string
  count: number
}

export interface TypeDistribution {
  type: string
  count: number
}

export interface ProvinsiDistribution {
  provinsi: string
  count: number
}

/**
 * Activity trend data for interactive area chart
 * Shows votes, destinations, and articles created per date
 */
export interface ActivityTrend {
  date: string
  votes: number
  destinations: number
  articles: number
}

export interface AnalyticsAggregateResult {
  stats: DashboardStats
  topDestinations: TopDestinationVotes[]
  categoryDistribution: CategoryDistribution[]
  typeDistribution: TypeDistribution[]
  provinsiDistribution: ProvinsiDistribution[]
  activityTrends: ActivityTrend[]
}

// ============================================
// HELPER: Build date filter conditions
// ============================================

function buildDateFilter(createdAt: number[]) {
  if (!createdAt || createdAt.length === 0) {
    return undefined
  }

  const [fromTimestamp, toTimestamp] = createdAt

  return {
    from: fromTimestamp ? new Date(fromTimestamp) : undefined,
    to: toTimestamp ? new Date(toTimestamp) : undefined,
  }
}

// ============================================
// FETCH FUNCTIONS (Internal - used by server fn)
// ============================================

/**
 * Fetch dashboard statistics with optional date filter
 */
export async function fetchDashboardStats(
  input: AnalyticsInput,
): Promise<DashboardStats> {
  const db = await getDb()

  const dateRange = buildDateFilter(input.createdAt)

  // Build where conditions for each table
  const userWhere = dateRange
    ? dateRange.from && dateRange.to
      ? and(
          gte(schema.user.createdAt, dateRange.from),
          lte(schema.user.createdAt, dateRange.to),
        )
      : dateRange.from
        ? gte(schema.user.createdAt, dateRange.from)
        : dateRange.to
          ? lte(schema.user.createdAt, dateRange.to)
          : undefined
    : undefined

  const destinationWhere = dateRange
    ? dateRange.from && dateRange.to
      ? and(
          gte(schema.destination.createdAt, dateRange.from),
          lte(schema.destination.createdAt, dateRange.to),
        )
      : dateRange.from
        ? gte(schema.destination.createdAt, dateRange.from)
        : dateRange.to
          ? lte(schema.destination.createdAt, dateRange.to)
          : undefined
    : undefined

  const articleWhere = dateRange
    ? dateRange.from && dateRange.to
      ? and(
          gte(schema.article.createdAt, dateRange.from),
          lte(schema.article.createdAt, dateRange.to),
        )
      : dateRange.from
        ? gte(schema.article.createdAt, dateRange.from)
        : dateRange.to
          ? lte(schema.article.createdAt, dateRange.to)
          : undefined
    : undefined

  const voteWhere = dateRange
    ? dateRange.from && dateRange.to
      ? and(
          gte(schema.vote.createdAt, dateRange.from),
          lte(schema.vote.createdAt, dateRange.to),
        )
      : dateRange.from
        ? gte(schema.vote.createdAt, dateRange.from)
        : dateRange.to
          ? lte(schema.vote.createdAt, dateRange.to)
          : undefined
    : undefined

  const [usersResult, destinationsResult, articlesResult, votesResult] =
    await Promise.all([
      db.select({ count: count() }).from(schema.user).where(userWhere),
      db
        .select({ count: count() })
        .from(schema.destination)
        .where(destinationWhere),
      db.select({ count: count() }).from(schema.article).where(articleWhere),
      db.select({ count: count() }).from(schema.vote).where(voteWhere),
    ])

  return {
    totalUsers: usersResult[0]?.count ?? 0,
    totalDestinations: destinationsResult[0]?.count ?? 0,
    totalArticles: articlesResult[0]?.count ?? 0,
    totalVotes: votesResult[0]?.count ?? 0,
  }
}

/**
 * Fetch top destinations by votes with optional date filter
 */
export async function fetchTopDestinations(
  input: AnalyticsInput,
): Promise<TopDestinationVotes[]> {
  const db = await getDb()

  const dateRange = buildDateFilter(input.createdAt)

  let whereConditions = eq(schema.destination.status, 'published')

  if (dateRange) {
    if (dateRange.from && dateRange.to) {
      whereConditions = and(
        eq(schema.destination.status, 'published'),
        gte(schema.destination.createdAt, dateRange.from),
        lte(schema.destination.createdAt, dateRange.to),
      )!
    } else if (dateRange.from) {
      whereConditions = and(
        eq(schema.destination.status, 'published'),
        gte(schema.destination.createdAt, dateRange.from),
      )!
    } else if (dateRange.to) {
      whereConditions = and(
        eq(schema.destination.status, 'published'),
        lte(schema.destination.createdAt, dateRange.to),
      )!
    }
  }

  const destinations = await db
    .select({
      id: schema.destination.id,
      name: schema.destination.name,
      slug: schema.destination.slug,
      coverImage: schema.destination.coverImage,
      provinsi: schema.destination.provinsi,
      createdAt: schema.destination.createdAt,
      voteCount: sql<number>`COALESCE((
        SELECT COUNT(*) FROM vote WHERE vote.destination_id = destination.id
      ), 0)::int`,
    })
    .from(schema.destination)
    .where(whereConditions)
    .orderBy(
      desc(
        sql`(SELECT COUNT(*) FROM vote WHERE vote.destination_id = destination.id)`,
      ),
    )
    .limit(10)

  return destinations as TopDestinationVotes[]
}

/**
 * Fetch category distribution (top 4 + others)
 */
export async function fetchCategoryDistribution(
  input: AnalyticsInput,
): Promise<CategoryDistribution[]> {
  const db = await getDb()

  const dateRange = buildDateFilter(input.createdAt)

  let whereConditions = eq(schema.destination.status, 'published')

  if (dateRange) {
    if (dateRange.from && dateRange.to) {
      whereConditions = and(
        eq(schema.destination.status, 'published'),
        gte(schema.destination.createdAt, dateRange.from),
        lte(schema.destination.createdAt, dateRange.to),
      )!
    } else if (dateRange.from) {
      whereConditions = and(
        eq(schema.destination.status, 'published'),
        gte(schema.destination.createdAt, dateRange.from),
      )!
    } else if (dateRange.to) {
      whereConditions = and(
        eq(schema.destination.status, 'published'),
        lte(schema.destination.createdAt, dateRange.to),
      )!
    }
  }

  const allDistribution = await db
    .select({
      category: schema.destination.category,
      count: count(),
    })
    .from(schema.destination)
    .where(whereConditions)
    .groupBy(schema.destination.category)
    .orderBy(desc(count()))

  // Get top 4 and aggregate the rest as "Lainnya"
  const top4 = allDistribution.slice(0, 4)
  const othersCount = allDistribution
    .slice(4)
    .reduce((sum, item) => sum + item.count, 0)

  const result: CategoryDistribution[] = top4.map((item) => ({
    category: item.category ?? 'unknown',
    count: item.count,
  }))

  if (othersCount > 0) {
    result.push({
      category: 'lainnya',
      count: othersCount,
    })
  }

  return result
}

/**
 * Fetch type distribution (top 4 + others)
 */
export async function fetchTypeDistribution(
  input: AnalyticsInput,
): Promise<TypeDistribution[]> {
  const db = await getDb()

  const dateRange = buildDateFilter(input.createdAt)

  let whereConditions = eq(schema.destination.status, 'published')

  if (dateRange) {
    if (dateRange.from && dateRange.to) {
      whereConditions = and(
        eq(schema.destination.status, 'published'),
        gte(schema.destination.createdAt, dateRange.from),
        lte(schema.destination.createdAt, dateRange.to),
      )!
    } else if (dateRange.from) {
      whereConditions = and(
        eq(schema.destination.status, 'published'),
        gte(schema.destination.createdAt, dateRange.from),
      )!
    } else if (dateRange.to) {
      whereConditions = and(
        eq(schema.destination.status, 'published'),
        lte(schema.destination.createdAt, dateRange.to),
      )!
    }
  }

  const allDistribution = await db
    .select({
      type: schema.destination.type,
      count: count(),
    })
    .from(schema.destination)
    .where(whereConditions)
    .groupBy(schema.destination.type)
    .orderBy(desc(count()))

  // Get top 4 and aggregate the rest as "Lainnya"
  const top4 = allDistribution.slice(0, 4)
  const othersCount = allDistribution
    .slice(4)
    .reduce((sum, item) => sum + item.count, 0)

  const result: TypeDistribution[] = top4.map((item) => ({
    type: item.type ?? 'unknown',
    count: item.count,
  }))

  if (othersCount > 0) {
    result.push({
      type: 'lainnya',
      count: othersCount,
    })
  }

  return result
}

/**
 * Fetch provinsi distribution (top 4 + others)
 */
export async function fetchProvinsiDistribution(
  input: AnalyticsInput,
): Promise<ProvinsiDistribution[]> {
  const db = await getDb()

  const dateRange = buildDateFilter(input.createdAt)

  let whereConditions = eq(schema.destination.status, 'published')

  if (dateRange) {
    if (dateRange.from && dateRange.to) {
      whereConditions = and(
        eq(schema.destination.status, 'published'),
        gte(schema.destination.createdAt, dateRange.from),
        lte(schema.destination.createdAt, dateRange.to),
      )!
    } else if (dateRange.from) {
      whereConditions = and(
        eq(schema.destination.status, 'published'),
        gte(schema.destination.createdAt, dateRange.from),
      )!
    } else if (dateRange.to) {
      whereConditions = and(
        eq(schema.destination.status, 'published'),
        lte(schema.destination.createdAt, dateRange.to),
      )!
    }
  }

  const allDistribution = await db
    .select({
      provinsi: schema.destination.provinsi,
      count: count(),
    })
    .from(schema.destination)
    .where(whereConditions)
    .groupBy(schema.destination.provinsi)
    .orderBy(desc(count()))

  // Get top 4 and aggregate the rest as "Lainnya"
  const top4 = allDistribution.slice(0, 4)
  const othersCount = allDistribution
    .slice(4)
    .reduce((sum, item) => sum + item.count, 0)

  const result: ProvinsiDistribution[] = top4.map((item) => ({
    provinsi: item.provinsi ?? 'unknown',
    count: item.count,
  }))

  if (othersCount > 0) {
    result.push({
      provinsi: 'lainnya',
      count: othersCount,
    })
  }

  return result
}

/**
 * Fetch activity trends for interactive area chart
 * Shows votes, destinations, and articles created per date
 */
export async function fetchActivityTrends(
  input: AnalyticsInput,
): Promise<ActivityTrend[]> {
  const db = await getDb()

  // Default to last 90 days if no filter provided
  let startDate: Date
  let endDate: Date

  if (input.createdAt && input.createdAt.length >= 2) {
    startDate = new Date(input.createdAt[0])
    endDate = new Date(input.createdAt[1])
  } else if (input.createdAt && input.createdAt.length === 1) {
    startDate = new Date(input.createdAt[0])
    endDate = new Date()
  } else {
    endDate = new Date()
    startDate = new Date()
    startDate.setDate(startDate.getDate() - 90)
  }

  // Query votes grouped by date
  const voteTrends = await db
    .select({
      date: sql<string>`DATE(${schema.vote.createdAt})::text`,
      count: count(),
    })
    .from(schema.vote)
    .where(
      and(
        gte(schema.vote.createdAt, startDate),
        lte(schema.vote.createdAt, endDate),
      ),
    )
    .groupBy(sql`DATE(${schema.vote.createdAt})`)
    .orderBy(sql`DATE(${schema.vote.createdAt})`)

  // Query destinations grouped by date
  const destinationTrends = await db
    .select({
      date: sql<string>`DATE(${schema.destination.createdAt})::text`,
      count: count(),
    })
    .from(schema.destination)
    .where(
      and(
        eq(schema.destination.status, 'published'),
        gte(schema.destination.createdAt, startDate),
        lte(schema.destination.createdAt, endDate),
      ),
    )
    .groupBy(sql`DATE(${schema.destination.createdAt})`)
    .orderBy(sql`DATE(${schema.destination.createdAt})`)

  // Query articles grouped by date
  const articleTrends = await db
    .select({
      date: sql<string>`DATE(${schema.article.createdAt})::text`,
      count: count(),
    })
    .from(schema.article)
    .where(
      and(
        eq(schema.article.status, 'published'),
        gte(schema.article.createdAt, startDate),
        lte(schema.article.createdAt, endDate),
      ),
    )
    .groupBy(sql`DATE(${schema.article.createdAt})`)
    .orderBy(sql`DATE(${schema.article.createdAt})`)

  // Merge all data by date
  const trendsMap = new Map<string, ActivityTrend>()

  // Initialize with votes
  voteTrends.forEach((item) => {
    trendsMap.set(item.date, {
      date: item.date,
      votes: item.count,
      destinations: 0,
      articles: 0,
    })
  })

  // Add destinations
  destinationTrends.forEach((item) => {
    const existing = trendsMap.get(item.date)
    if (existing) {
      existing.destinations = item.count
    } else {
      trendsMap.set(item.date, {
        date: item.date,
        votes: 0,
        destinations: item.count,
        articles: 0,
      })
    }
  })

  // Add articles
  articleTrends.forEach((item) => {
    const existing = trendsMap.get(item.date)
    if (existing) {
      existing.articles = item.count
    } else {
      trendsMap.set(item.date, {
        date: item.date,
        votes: 0,
        destinations: 0,
        articles: item.count,
      })
    }
  })

  // Sort by date
  return Array.from(trendsMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
}

// ============================================
// AGGREGATED SERVER FUNCTION
// ============================================

/**
 * Input schema for analytics aggregate function
 */
const analyticsAggregateInputSchema = z.object({
  filters: z.object({
    createdAt: z.array(z.number()).optional().default([]),
  }),
})

/**
 * Get all analytics data in a single request (aggregated)
 * Protected with adminServerMiddleware
 */
export const getAnalyticsAggregateServerFn = createServerFn({ method: 'GET' })
  .middleware([adminServerMiddleware])
  .inputValidator(analyticsAggregateInputSchema)
  .handler(async ({ data: { filters } }): Promise<AnalyticsAggregateResult> => {
    try {
      const input: AnalyticsInput = filters ?? { createdAt: [] }

      // Run all queries in parallel for better performance
      const [
        stats,
        topDestinations,
        categoryDistribution,
        typeDistribution,
        provinsiDistribution,
        activityTrends,
      ] = await Promise.all([
        fetchDashboardStats(input),
        fetchTopDestinations(input),
        fetchCategoryDistribution(input),
        fetchTypeDistribution(input),
        fetchProvinsiDistribution(input),
        fetchActivityTrends(input),
      ])

      return {
        stats,
        topDestinations,
        categoryDistribution,
        typeDistribution,
        provinsiDistribution,
        activityTrends,
      }
    } catch (err) {
      console.error('[Analytics Aggregate Query Error]:', err)
      return {
        stats: {
          totalUsers: 0,
          totalDestinations: 0,
          totalArticles: 0,
          totalVotes: 0,
        },
        topDestinations: [],
        categoryDistribution: [],
        typeDistribution: [],
        provinsiDistribution: [],
        activityTrends: [],
      }
    }
  })

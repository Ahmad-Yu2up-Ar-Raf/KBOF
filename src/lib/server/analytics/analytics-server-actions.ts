// =============================================================================
// ANALYTICS SERVER ACTIONS - SUASANA
// =============================================================================
// Server-side queries for dashboard analytics

import { createServerFn } from '@tanstack/react-start'
import { count, desc, eq, gte, sql } from 'drizzle-orm'
import * as schema from '@/db/schema'
import { adminServerMiddleware } from '@/lib/middleware'

// Dynamic import to prevent db from being bundled in client
const getDb = async () => {
  const { db } = await import('@/db')
  return db
}

// ============================================
// DASHBOARD ANALYTICS (Admin/SuperAdmin)
// ============================================

export interface DashboardStats {
  totalUsers: number
  totalDestinations: number
  totalArticles: number
  totalVotes: number
  totalReviews: number
  totalComments: number
  newUsersThisMonth: number
  newDestinationsThisMonth: number
}

export interface TopDestination {
  id: number
  name: string
  slug: string
  coverImage: string
  provinsi: string
  voteCount: number
  reviewCount: number
}

export interface CategoryDistribution {
  category: string
  count: number
}

export interface ProvinsiDistribution {
  provinsi: string
  count: number
}

export interface RecentActivity {
  type: 'destination' | 'article' | 'vote' | 'review' | 'user'
  title: string
  description: string
  createdAt: Date
  userId: string
  userName: string
}

/**
 * Get dashboard statistics for admin/superAdmin
 */
export const getDashboardStats = createServerFn({ method: 'GET' })
  .middleware([adminServerMiddleware])
  .handler(async () => {
    const db = await getDb()

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    // Run all count queries in parallel
    const [
      usersResult,
      destinationsResult,
      articlesResult,
      votesResult,
      reviewsResult,
      commentsResult,
      newUsersResult,
      newDestinationsResult,
    ] = await Promise.all([
      db.select({ count: count() }).from(schema.user),
      db.select({ count: count() }).from(schema.destination),
      db.select({ count: count() }).from(schema.article),
      db.select({ count: count() }).from(schema.vote),
      db.select({ count: count() }).from(schema.review),
      db.select({ count: count() }).from(schema.comment),
      db
        .select({ count: count() })
        .from(schema.user)
        .where(gte(schema.user.createdAt, startOfMonth)),
      db
        .select({ count: count() })
        .from(schema.destination)
        .where(gte(schema.destination.createdAt, startOfMonth)),
    ])

    const stats: DashboardStats = {
      totalUsers: usersResult[0]?.count ?? 0,
      totalDestinations: destinationsResult[0]?.count ?? 0,
      totalArticles: articlesResult[0]?.count ?? 0,
      totalVotes: votesResult[0]?.count ?? 0,
      totalReviews: reviewsResult[0]?.count ?? 0,
      totalComments: commentsResult[0]?.count ?? 0,
      newUsersThisMonth: newUsersResult[0]?.count ?? 0,
      newDestinationsThisMonth: newDestinationsResult[0]?.count ?? 0,
    }

    return stats
  })

/**
 * Get top destinations by votes and reviews
 */
export const getTopDestinations = createServerFn({ method: 'GET' })
  .middleware([adminServerMiddleware])
  .handler(async () => {
    const db = await getDb()

    const destinations = await db
      .select({
        id: schema.destination.id,
        name: schema.destination.name,
        slug: schema.destination.slug,
        coverImage: schema.destination.coverImage,
        provinsi: schema.destination.provinsi,
        voteCount: sql<number>`COALESCE((
          SELECT COUNT(*) FROM vote WHERE vote.destination_id = destination.id
        ), 0)::int`,
        reviewCount: sql<number>`COALESCE((
          SELECT COUNT(*) FROM review WHERE review.destination_id = destination.id
        ), 0)::int`,
      })
      .from(schema.destination)
      .where(eq(schema.destination.status, 'published'))
      .orderBy(
        desc(
          sql`(
          SELECT COUNT(*) FROM vote WHERE vote.destination_id = destination.id
        )`,
        ),
      )
      .limit(10)

    return destinations as Array<TopDestination>
  })

/**
 * Get destination distribution by category
 */
export const getCategoryDistribution = createServerFn({ method: 'GET' })
  .middleware([adminServerMiddleware])
  .handler(async () => {
    const db = await getDb()

    const distribution = await db
      .select({
        category: schema.destination.category,
        count: count(),
      })
      .from(schema.destination)
      .where(eq(schema.destination.status, 'published'))
      .groupBy(schema.destination.category)
      .orderBy(desc(count()))

    return distribution as Array<CategoryDistribution>
  })

/**
 * Get destination distribution by provinsi
 */
export const getProvinsiDistribution = createServerFn({ method: 'GET' })
  .middleware([adminServerMiddleware])
  .handler(async () => {
    const db = await getDb()

    const distribution = await db
      .select({
        provinsi: schema.destination.provinsi,
        count: count(),
      })
      .from(schema.destination)
      .where(eq(schema.destination.status, 'published'))
      .groupBy(schema.destination.provinsi)
      .orderBy(desc(count()))
      .limit(10)

    return distribution as Array<ProvinsiDistribution>
  })

 
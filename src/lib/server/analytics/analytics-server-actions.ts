// =============================================================================
// ANALYTICS SERVER ACTIONS - SUASANA
// =============================================================================
// Server-side queries for dashboard analytics

import { createServerFn } from '@tanstack/react-start'
import { eq, sql, desc, count, gte } from 'drizzle-orm'
import * as schema from '@/db/schema'
import { adminServerMiddleware, authServerMiddleware } from '@/lib/middleware'

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
        )`
        )
      )
      .limit(10)

    return destinations as TopDestination[]
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

    return distribution as CategoryDistribution[]
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

    return distribution as ProvinsiDistribution[]
  })

// ============================================
// USER PROFILE ANALYTICS (Pribumi)
// ============================================

export interface UserStats {
  totalDestinations: number
  totalArticles: number
  totalVotesReceived: number
  totalReviewsReceived: number
  totalCommentsReceived: number
  publishedDestinations: number
  draftDestinations: number
  publishedArticles: number
  draftArticles: number
}

export interface UserTopDestination {
  id: number
  name: string
  slug: string
  coverImage: string
  voteCount: number
  reviewCount: number
  status: string
}

/**
 * Get user profile statistics (for Pribumi dashboard)
 */
export const getUserStats = createServerFn({ method: 'GET' })
  .middleware([authServerMiddleware])
  .handler(async ({ context }) => {
    const db = await getDb()
    const userId = context.user!.id

    // Get user's destinations
    const userDestinations = await db
      .select({ id: schema.destination.id, status: schema.destination.status })
      .from(schema.destination)
      .where(eq(schema.destination.userId, userId))

    const destinationIds = userDestinations.map((d) => d.id)
    const publishedDestinations = userDestinations.filter(
      (d) => d.status === 'published'
    ).length
    const draftDestinations = userDestinations.filter(
      (d) => d.status === 'draft'
    ).length

    // Get user's articles
    const userArticles = await db
      .select({ id: schema.article.id, status: schema.article.status })
      .from(schema.article)
      .where(eq(schema.article.authorId, userId))

    const publishedArticles = userArticles.filter(
      (a) => a.status === 'published'
    ).length
    const draftArticles = userArticles.filter(
      (a) => a.status === 'draft'
    ).length

    // Get votes, reviews, comments on user's destinations
    let totalVotesReceived = 0
    let totalReviewsReceived = 0
    let totalCommentsReceived = 0

    if (destinationIds.length > 0) {
      const [votesResult, reviewsResult, commentsResult] = await Promise.all([
        db
          .select({ count: count() })
          .from(schema.vote)
          .where(sql`${schema.vote.destinationId} = ANY(${destinationIds})`),
        db
          .select({ count: count() })
          .from(schema.review)
          .where(sql`${schema.review.destinationId} = ANY(${destinationIds})`),
        db
          .select({ count: count() })
          .from(schema.comment)
          .where(sql`${schema.comment.destinationId} = ANY(${destinationIds})`),
      ])

      totalVotesReceived = votesResult[0]?.count ?? 0
      totalReviewsReceived = reviewsResult[0]?.count ?? 0
      totalCommentsReceived = commentsResult[0]?.count ?? 0
    }

    const stats: UserStats = {
      totalDestinations: userDestinations.length,
      totalArticles: userArticles.length,
      totalVotesReceived,
      totalReviewsReceived,
      totalCommentsReceived,
      publishedDestinations,
      draftDestinations,
      publishedArticles,
      draftArticles,
    }

    return stats
  })

/**
 * Get user's top destinations by engagement
 */
export const getUserTopDestinations = createServerFn({ method: 'GET' })
  .middleware([authServerMiddleware])
  .handler(async ({ context }) => {
    const db = await getDb()
    const userId = context.user!.id

    const destinations = await db
      .select({
        id: schema.destination.id,
        name: schema.destination.name,
        slug: schema.destination.slug,
        coverImage: schema.destination.coverImage,
        status: schema.destination.status,
        voteCount: sql<number>`COALESCE((
          SELECT COUNT(*) FROM vote WHERE vote.destination_id = destination.id
        ), 0)::int`,
        reviewCount: sql<number>`COALESCE((
          SELECT COUNT(*) FROM review WHERE review.destination_id = destination.id
        ), 0)::int`,
      })
      .from(schema.destination)
      .where(eq(schema.destination.userId, userId))
      .orderBy(
        desc(
          sql`(
          SELECT COUNT(*) FROM vote WHERE vote.destination_id = destination.id
        )`
        )
      )
      .limit(5)

    return destinations as UserTopDestination[]
  })

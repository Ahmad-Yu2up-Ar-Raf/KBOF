// =============================================================================
// REVIEW SERVER QUERIES - SUASANA
// =============================================================================
// Server-side query functions untuk review management
// =============================================================================

import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { and, count, desc, eq, sql } from 'drizzle-orm'
import * as schema from '@/db/schema'

const getDb = async () => {
  const { db } = await import('@/db')
  return db
}

const { review, user } = schema

// =============================================================================
// ZOD SCHEMAS
// =============================================================================

const ReviewFiltersSchema = z.object({
  destinationId: z.number().int().positive(),
  page: z.number().int().positive().default(1),
  perPage: z.number().int().positive().max(50).default(20),
  sort: z.enum(['newest', 'oldest', 'highest', 'lowest']).default('newest'),
})

export type ReviewFilters = z.infer<typeof ReviewFiltersSchema>

// =============================================================================
// TYPES
// =============================================================================

export type ReviewWithUser = {
  id: number
  userId: string
  destinationId: number
  rating: number
  title: string | null
  content: string | null
  visitDate: Date | null
  createdAt: Date
  user: {
    id: string
    name: string
    image: string | null
  }
}

export type ReviewsResult = {
  data: Array<ReviewWithUser>
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
    hasNextPage: boolean
  }
}

// =============================================================================
// SERVER FUNCTIONS
// =============================================================================

/**
 * Fetch paginated reviews for a destination with filters
 * Used for "Show All Reviews" sheet
 */
export const getDestinationReviewsServerFn = createServerFn({
  method: 'GET',
})
  .inputValidator(z.object({ filters: ReviewFiltersSchema }))
  .handler(async ({ data: { filters } }): Promise<ReviewsResult> => {
    const db = await getDb()
    const { destinationId, page, perPage, sort } = filters

    // Build order clause
    const orderByClause = (() => {
      switch (sort) {
        case 'newest':
          return [desc(review.createdAt)]
        case 'oldest':
          return [desc(review.createdAt)]
        case 'highest':
          return [desc(review.rating), desc(review.createdAt)]
        case 'lowest':
          return [desc(review.rating), desc(review.createdAt)]
        default:
          return [desc(review.createdAt)]
      }
    })()

    // Get total count
    const [countResult] = await db
      .select({ count: count() })
      .from(review)
      .where(eq(review.destinationId, destinationId))

    const total = countResult?.count ?? 0
    const totalPages = Math.ceil(total / perPage)
    const offset = (page - 1) * perPage

    // Fetch reviews with user relation
    const results = await db
      .select({
        id: review.id,
        userId: review.userId,
        destinationId: review.destinationId,
        rating: review.rating,
        title: review.title,
        content: review.content,
        visitDate: review.visitDate,
        createdAt: review.createdAt,
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(review)
      .leftJoin(user, eq(review.userId, user.id))
      .where(eq(review.destinationId, destinationId))
      .orderBy(...orderByClause)
      .limit(perPage)
      .offset(offset)

    return {
      data: results.map((r) => ({
        ...r,
        user: r.user ?? { id: '', name: 'Unknown', image: null },
      })),
      pagination: {
        page,
        perPage,
        total,
        totalPages,
        hasNextPage: page < totalPages,
      },
    }
  })

/**
 * Fetch preview reviews (first 4) for destination detail page
 */
export const getDestinationReviewsPreviewServerFn = createServerFn({
  method: 'GET',
})
  .inputValidator(z.object({ destinationId: z.number().int().positive() }))
  .handler(
    async ({ data: { destinationId } }): Promise<Array<ReviewWithUser>> => {
      const db = await getDb()

      const results = await db
        .select({
          id: review.id,
          userId: review.userId,
          destinationId: review.destinationId,
          rating: review.rating,
          title: review.title,
          content: review.content,
          visitDate: review.visitDate,
          createdAt: review.createdAt,
          user: {
            id: user.id,
            name: user.name,
            image: user.image,
          },
        })
        .from(review)
        .leftJoin(user, eq(review.userId, user.id))
        .where(eq(review.destinationId, destinationId))
        .orderBy(desc(review.createdAt))
        .limit(4)

      return results.map((r) => ({
        ...r,
        user: r.user ?? { id: '', name: 'Unknown', image: null },
      }))
    },
  )

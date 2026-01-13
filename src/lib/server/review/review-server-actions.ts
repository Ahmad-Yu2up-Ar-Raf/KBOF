// =============================================================================
// REVIEW SERVER ACTIONS - SUASANA
// =============================================================================
// Server-side review actions with authentication middleware
// Each user can only review once per destination
// =============================================================================

import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { and, eq, desc } from 'drizzle-orm'
import { authServerMiddleware } from '@/lib/middleware'

// Dynamic import to prevent db from being bundled in client
const getDb = async () => {
  const { db } = await import('@/db')
  return db
}

const getSchema = async () => {
  const schema = await import('@/db/schema')
  return schema
}

// ============================================
// VALIDATION SCHEMAS
// ============================================

export const createReviewSchema = z.object({
  destinationId: z.number().int().positive('ID destinasi tidak valid'),
  rating: z
    .number()
    .int()
    .min(1, 'Rating minimal 1')
    .max(5, 'Rating maksimal 5'),
  title: z.string().max(200, 'Judul maksimal 200 karakter').optional(),
  content: z.string().max(2000, 'Konten maksimal 2000 karakter').optional(),
  visitDate: z.date().optional().nullable(),
})

export const updateReviewSchema = z.object({
  id: z.number().int().positive('ID review tidak valid'),
  rating: z
    .number()
    .int()
    .min(1, 'Rating minimal 1')
    .max(5, 'Rating maksimal 5')
    .optional(),
  title: z.string().max(200, 'Judul maksimal 200 karakter').optional(),
  content: z.string().max(2000, 'Konten maksimal 2000 karakter').optional(),
  visitDate: z.date().optional().nullable(),
})

export const deleteReviewSchema = z.object({
  id: z.number().int().positive('ID review tidak valid'),
})

export const checkReviewSchema = z.object({
  destinationId: z.number().int().positive('ID destinasi tidak valid'),
})

export const getReviewsSchema = z.object({
  destinationId: z.number().int().positive('ID destinasi tidak valid'),
  limit: z.number().int().positive().default(10),
  cursor: z.number().int().nonnegative().optional(),
})

export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>

// ============================================
// ADD REVIEW - Protected with auth middleware
// ============================================

export const addReview = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(createReviewSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const { review, destination } = await getSchema()
    const userId = context.user.id

    // Check if destination exists and is published
    const existingDestination = await db.query.destination.findFirst({
      where: and(
        eq(destination.id, data.destinationId),
        eq(destination.status, 'published'),
      ),
    })

    if (!existingDestination) {
      throw new Error('Destinasi tidak ditemukan atau belum dipublikasikan')
    }

    // Check if user already reviewed this destination
    const existingReview = await db.query.review.findFirst({
      where: and(
        eq(review.userId, userId),
        eq(review.destinationId, data.destinationId),
      ),
    })

    if (existingReview) {
      throw new Error('Anda sudah memberikan review untuk destinasi ini')
    }

    // Create the review
    const [newReview] = await db
      .insert(review)
      .values({
        userId,
        destinationId: data.destinationId,
        rating: data.rating,
        title: data.title || null,
        content: data.content || null,
        visitDate: data.visitDate || null,
      })
      .returning()

    return {
      success: true,
      message: 'Review berhasil ditambahkan!',
      review: newReview,
    }
  })

// ============================================
// UPDATE REVIEW - Protected with auth middleware
// ============================================

export const updateReview = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(updateReviewSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const { review } = await getSchema()
    const userId = context.user.id

    // Check if review exists and belongs to user
    const existingReview = await db.query.review.findFirst({
      where: and(eq(review.id, data.id), eq(review.userId, userId)),
    })

    if (!existingReview) {
      throw new Error('Review tidak ditemukan atau bukan milik Anda')
    }

    // Update the review
    const [updatedReview] = await db
      .update(review)
      .set({
        rating: data.rating ?? existingReview.rating,
        title: data.title !== undefined ? data.title : existingReview.title,
        content:
          data.content !== undefined ? data.content : existingReview.content,
        visitDate:
          data.visitDate !== undefined
            ? data.visitDate
            : existingReview.visitDate,
      })
      .where(eq(review.id, data.id))
      .returning()

    return {
      success: true,
      message: 'Review berhasil diperbarui!',
      review: updatedReview,
    }
  })

// ============================================
// DELETE REVIEW - Protected with auth middleware
// ============================================

export const deleteReview = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(deleteReviewSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const { review } = await getSchema()
    const userId = context.user.id

    // Check if review exists and belongs to user
    const existingReview = await db.query.review.findFirst({
      where: and(eq(review.id, data.id), eq(review.userId, userId)),
    })

    if (!existingReview) {
      throw new Error('Review tidak ditemukan atau bukan milik Anda')
    }

    // Delete the review
    await db.delete(review).where(eq(review.id, data.id))

    return {
      success: true,
      message: 'Review berhasil dihapus',
    }
  })

// ============================================
// CHECK USER REVIEW STATUS - Protected with auth middleware
// ============================================

export const checkUserReview = createServerFn({ method: 'GET' })
  .middleware([authServerMiddleware])
  .inputValidator(checkReviewSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const { review } = await getSchema()
    const userId = context.user.id

    const existingReview = await db.query.review.findFirst({
      where: and(
        eq(review.userId, userId),
        eq(review.destinationId, data.destinationId),
      ),
    })

    return {
      hasReviewed: !!existingReview,
      review: existingReview ?? null,
    }
  })

// ============================================
// GET REVIEWS FOR DESTINATION - Public
// ============================================

export const getDestinationReviews = createServerFn({ method: 'GET' })
  .inputValidator(getReviewsSchema)
  .handler(async ({ data }) => {
    const db = await getDb()
    const { review } = await getSchema()

    const reviews = await db.query.review.findMany({
      where: eq(review.destinationId, data.destinationId),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: [desc(review.createdAt)],
      limit: data.limit + 1,
      offset: data.cursor ?? 0,
    })

    const hasNextPage = reviews.length > data.limit
    const items = hasNextPage ? reviews.slice(0, data.limit) : reviews

    return {
      reviews: items,
      nextCursor: hasNextPage ? (data.cursor ?? 0) + data.limit : null,
      hasNextPage,
    }
  })

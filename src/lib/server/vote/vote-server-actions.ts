// =============================================================================
// VOTE SERVER ACTIONS - SUASANA
// =============================================================================
// Server-side vote actions with authentication middleware
// Each user can only vote once per destination
// =============================================================================

import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { and, eq } from 'drizzle-orm'
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

export const voteDestinationSchema = z.object({
  destinationId: z.number().int().positive('ID destinasi tidak valid'),
})

export const checkVoteSchema = z.object({
  destinationId: z.number().int().positive('ID destinasi tidak valid'),
})

export type VoteDestinationInput = z.infer<typeof voteDestinationSchema>

// ============================================
// ADD VOTE - Protected with auth middleware
// ============================================

export const addVote = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(voteDestinationSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const { vote, destination } = await getSchema()
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

    // Check if user already voted for this destination
    const existingVote = await db.query.vote.findFirst({
      where: and(
        eq(vote.userId, userId),
        eq(vote.destinationId, data.destinationId),
      ),
    })

    if (existingVote) {
      throw new Error('Anda sudah memberikan vote untuk destinasi ini')
    }

    // Create the vote
    const [newVote] = await db
      .insert(vote)
      .values({
        userId,
        destinationId: data.destinationId,
      })
      .returning()

    return {
      success: true,
      message: 'Vote berhasil ditambahkan!',
      vote: newVote,
    }
  })

// ============================================
// REMOVE VOTE - Protected with auth middleware
// ============================================

export const removeVote = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(voteDestinationSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const { vote } = await getSchema()
    const userId = context.user.id

    // Check if vote exists
    const existingVote = await db.query.vote.findFirst({
      where: and(
        eq(vote.userId, userId),
        eq(vote.destinationId, data.destinationId),
      ),
    })

    if (!existingVote) {
      throw new Error('Vote tidak ditemukan')
    }

    // Delete the vote
    await db
      .delete(vote)
      .where(
        and(
          eq(vote.userId, userId),
          eq(vote.destinationId, data.destinationId),
        ),
      )

    return {
      success: true,
      message: 'Vote berhasil dihapus',
    }
  })

// ============================================
// CHECK USER VOTE STATUS - Protected with auth middleware
// ============================================

export const checkUserVote = createServerFn({ method: 'GET' })
  .middleware([authServerMiddleware])
  .inputValidator(checkVoteSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const { vote } = await getSchema()
    const userId = context.user.id

    const existingVote = await db.query.vote.findFirst({
      where: and(
        eq(vote.userId, userId),
        eq(vote.destinationId, data.destinationId),
      ),
    })

    return {
      hasVoted: !!existingVote,
      voteId: existingVote?.id ?? null,
    }
  })

// ============================================
// GET VOTE COUNT FOR DESTINATION - Public
// ============================================

export const getVoteCount = createServerFn({ method: 'GET' })
  .inputValidator(checkVoteSchema)
  .handler(async ({ data }) => {
    const db = await getDb()
    const { vote } = await getSchema()

    const votes = await db.query.vote.findMany({
      where: eq(vote.destinationId, data.destinationId),
    })

    return {
      count: votes.length,
    }
  })

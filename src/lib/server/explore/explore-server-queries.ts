// =============================================================================
// EXPLORE SERVER QUERIES - SUASANA
// =============================================================================
// Public server-side query functions untuk explore destinations
// Tidak memerlukan authentication - data publik
// =============================================================================

import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { and, asc, count, desc, eq, ilike, inArray, sql } from 'drizzle-orm'
import * as schema from '@/db/schema'

// Dynamic import to prevent db from being bundled in client
const getDb = async () => {
  const { db } = await import('@/db')
  return db
}

const { destination, user, review } = schema

// ============================================
// TYPE DEFINITIONS
// ============================================

export const exploreFiltersSchema = z.object({
  cursor: z.number().int().nonnegative().optional(), // For infinite scroll
  limit: z.number().int().positive().default(12),
  search: z.string().default(''),
  categories: z
    .array(z.enum(schema.destinationCategory.enumValues))
    .default([]), // Multiple categories
  type: z.enum(['all', ...schema.destinationType.enumValues]).default('all'),
  provinsi: z
    .enum(['all', ...schema.provinsiIndonesia.enumValues])
    .default('all'),
  sortBy: z.enum(['newest', 'popular', 'rating', 'name']).default('popular'),
})

export type ExploreFilters = z.infer<typeof exploreFiltersSchema>

export type ExploreDestination = {
  id: number
  slug: string
  name: string
  description: string
  type: schema.DestinationType
  category: schema.DestinationCategory
  provinsi: schema.ProvinsiIndonesia
  kabupatenKota: string | null
  coverImage: string | null
  totalVote: number
  totalReview: number
  averageRating: number
  createdAt: Date
  user: {
    id: string
    name: string
    image: string | null
  }
}

export type ExploreResult = {
  data: ExploreDestination[]
  nextCursor: number | null
  hasNextPage: boolean
  totalCount: number
  categoryCounts: Record<string, number>
}

// ============================================
// INTERNAL DB FUNCTIONS
// ============================================

async function fetchExploreDestinations(filters: ExploreFilters): Promise<{
  data: ExploreDestination[]
  nextCursor: number | null
  hasNextPage: boolean
  totalCount: number
}> {
  const db = await getDb()
  const { cursor, limit, search, categories, type, provinsi, sortBy } = filters

  // Build where conditions - only published destinations
  const whereConditions = [eq(destination.status, 'published')]

  if (search.trim()) {
    whereConditions.push(ilike(destination.name, `%${search}%`))
  }

  // Multiple categories filter
  if (categories.length > 0) {
    whereConditions.push(
      inArray(destination.category, categories as schema.DestinationCategory[]),
    )
  }

  if (type !== 'all') {
    whereConditions.push(eq(destination.type, type as schema.DestinationType))
  }

  if (provinsi !== 'all') {
    whereConditions.push(
      eq(destination.provinsi, provinsi as schema.ProvinsiIndonesia),
    )
  }

  // Build order by with cursor-based pagination support
  const orderByClause = (() => {
    switch (sortBy) {
      case 'newest':
        return [desc(destination.createdAt), desc(destination.id)]
      case 'popular':
        return [desc(destination.totalVote), desc(destination.id)]
      case 'rating':
        return [desc(destination.averageRating), desc(destination.id)]
      case 'name':
        return [asc(destination.name), asc(destination.id)]
      default:
        return [desc(destination.totalVote), desc(destination.id)]
    }
  })()

  // Add cursor condition for infinite scroll
  if (cursor !== undefined && cursor > 0) {
    whereConditions.push(sql`${destination.id} < ${cursor}`)
  }

  // Get total count (without cursor)
  const baseConditions = [eq(destination.status, 'published')]
  if (search.trim()) {
    baseConditions.push(ilike(destination.name, `%${search}%`))
  }
  if (categories.length > 0) {
    baseConditions.push(
      inArray(destination.category, categories as schema.DestinationCategory[]),
    )
  }
  if (type !== 'all') {
    baseConditions.push(eq(destination.type, type as schema.DestinationType))
  }
  if (provinsi !== 'all') {
    baseConditions.push(
      eq(destination.provinsi, provinsi as schema.ProvinsiIndonesia),
    )
  }

  const [countResult] = await db
    .select({ count: count() })
    .from(destination)
    .where(and(...baseConditions))

  const totalCount = countResult?.count ?? 0

  // Get paginated data with user relation (fetch one extra to check hasNextPage)
  const data = await db
    .select({
      id: destination.id,
      slug: destination.slug,
      name: destination.name,
      description: destination.description,
      type: destination.type,
      category: destination.category,
      provinsi: destination.provinsi,
      kabupatenKota: destination.kabupatenKota,
      coverImage: destination.coverImage,
      totalVote: destination.totalVote,
      totalReview: destination.totalReview,
      averageRating: destination.averageRating,
      createdAt: destination.createdAt,
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
      },
    })
    .from(destination)
    .leftJoin(user, eq(destination.userId, user.id))
    .where(and(...whereConditions))
    .orderBy(...orderByClause)
    .limit(limit + 1) // Fetch one extra to check if there's more

  const hasNextPage = data.length > limit
  const items = hasNextPage ? data.slice(0, limit) : data
  const lastItem = items[items.length - 1]
  const nextCursor = hasNextPage && lastItem ? lastItem.id : null

  return {
    data: items.map((item) => ({
      ...item,
      user: item.user ?? { id: '', name: 'Unknown', image: null },
    })),
    nextCursor,
    hasNextPage,
    totalCount,
  }
}

async function fetchCategoryCounts(): Promise<Record<string, number>> {
  const db = await getDb()

  const counts = await db
    .select({
      category: destination.category,
      count: count(),
    })
    .from(destination)
    .where(eq(destination.status, 'published'))
    .groupBy(destination.category)

  const result: Record<string, number> = { all: 0 }

  // Initialize all categories with 0
  for (const cat of schema.destinationCategory.enumValues) {
    result[cat] = 0
  }

  // Fill in actual counts
  for (const { category, count: cnt } of counts) {
    result[category] = cnt
    result.all += cnt
  }

  return result
}

// ============================================
// PUBLIC SERVER FUNCTION
// ============================================

export const getExploreDestinationsServerFn = createServerFn({
  method: 'GET',
})
  .inputValidator(z.object({ filters: exploreFiltersSchema }))
  .handler(async ({ data: { filters } }): Promise<ExploreResult> => {
    const [destinationsResult, categoryCounts] = await Promise.all([
      fetchExploreDestinations(filters),
      fetchCategoryCounts(),
    ])

    return {
      data: destinationsResult.data,
      nextCursor: destinationsResult.nextCursor,
      hasNextPage: destinationsResult.hasNextPage,
      totalCount: destinationsResult.totalCount,
      categoryCounts,
    }
  })

// ============================================
// GET SINGLE DESTINATION BY SLUG (for detail page)
// ============================================

export const getDestinationBySlugServerFn = createServerFn({
  method: 'GET',
})
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data: { slug } }) => {
    const db = await getDb()

    const result = await db.query.destination.findFirst({
      where: and(
        eq(destination.slug, slug),
        eq(destination.status, 'published'),
      ),
      with: {
        user: true,
        votes: {
          limit: 10,
          with: {
            user: {
              columns: { id: true, name: true, image: true },
            },
          },
        },
        reviews: {
          orderBy: [desc(review.createdAt)],
          limit: 10,
          with: {
            user: {
              columns: { id: true, name: true, image: true },
            },
          },
        },
      },
    })

    return result ?? null
  })

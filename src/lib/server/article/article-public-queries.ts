// =============================================================================
// ARTICLE PUBLIC QUERIES - SUASANA
// =============================================================================
// Public server-side query functions untuk browse articles
// Tidak memerlukan authentication - data publik
// =============================================================================

import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { and, asc, count, desc, eq, ilike, sql } from 'drizzle-orm'
import * as schema from '@/db/schema'

// Dynamic import to prevent db from being bundled in client
const getDb = async () => {
  const { db } = await import('@/db')
  return db
}

const { article, user } = schema

// ============================================
// TYPE DEFINITIONS
// ============================================

export const articlePublicFiltersSchema = z.object({
  cursor: z.number().int().nonnegative().optional(), // For infinite scroll
  limit: z.number().int().positive().default(12),
  search: z.string().default(''),
  sortBy: z.enum(['newest', 'oldest', 'title']).default('newest'),
})

export type ArticlePublicFilters = z.infer<typeof articlePublicFiltersSchema>

export type PublicArticle = {
  id: number
  slug: string
  title: string
  excerpt: string | null
  coverImage: string | null
  publishedAt: Date | null
  createdAt: Date
  author: {
    id: string
    name: string
    image: string | null
  }
}

export type ArticlePublicResult = {
  data: Array<PublicArticle>
  nextCursor: number | null
  hasNextPage: boolean
  totalCount: number
}

// ============================================
// INTERNAL DB FUNCTIONS
// ============================================

async function fetchPublicArticles(filters: ArticlePublicFilters): Promise<{
  data: Array<PublicArticle>
  nextCursor: number | null
  hasNextPage: boolean
  totalCount: number
}> {
  const db = await getDb()
  const { cursor, limit, search, sortBy } = filters

  // Build where conditions - only published articles
  const whereConditions = [eq(article.status, 'published')]

  if (search.trim()) {
    whereConditions.push(ilike(article.title, `%${search}%`))
  }

  // Build order by with cursor-based pagination support
  const orderByClause = (() => {
    switch (sortBy) {
      case 'newest':
        return [desc(article.publishedAt), desc(article.id)]
      case 'oldest':
        return [asc(article.publishedAt), asc(article.id)]
      case 'title':
        return [asc(article.title), asc(article.id)]
      default:
        return [desc(article.publishedAt), desc(article.id)]
    }
  })()

  // Add cursor condition for infinite scroll
  if (cursor !== undefined && cursor > 0) {
    whereConditions.push(sql`${article.id} < ${cursor}`)
  }

  // Get total count (without cursor)
  const baseConditions = [eq(article.status, 'published')]
  if (search.trim()) {
    baseConditions.push(ilike(article.title, `%${search}%`))
  }

  const [countResult] = await db
    .select({ count: count() })
    .from(article)
    .where(and(...baseConditions))

  const totalCount = countResult.count

  // Get paginated data with user relation
  const data = await db
    .select({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      coverImage: article.coverImage,
      publishedAt: article.publishedAt,
      createdAt: article.createdAt,
      author: {
        id: user.id,
        name: user.name,
        image: user.image,
      },
    })
    .from(article)
    .leftJoin(user, eq(article.authorId, user.id))
    .where(and(...whereConditions))
    .orderBy(...orderByClause)
    .limit(limit + 1) // Fetch one extra to check if there's more

  const hasNextPage = data.length > limit
  const items = hasNextPage ? data.slice(0, limit) : data
  const lastItem = items.at(-1)
  const nextCursor = lastItem?.id ?? null

  return {
    data: items.map((item) => ({
      ...item,
      author: item.author ?? { id: '', name: 'Unknown', image: null },
    })),
    nextCursor,
    hasNextPage,
    totalCount,
  }
}

// ============================================
// PUBLIC SERVER FUNCTION
// ============================================

export const getPublicArticlesServerFn = createServerFn({
  method: 'GET',
})
  .inputValidator(z.object({ filters: articlePublicFiltersSchema }))
  .handler(async ({ data: { filters } }): Promise<ArticlePublicResult> => {
    const result = await fetchPublicArticles(filters)

    return {
      data: result.data,
      nextCursor: result.nextCursor,
      hasNextPage: result.hasNextPage,
      totalCount: result.totalCount,
    }
  })

// ============================================
// GET SINGLE ARTICLE BY SLUG (for detail page)
// ============================================

export const getArticleBySlugServerFn = createServerFn({
  method: 'GET',
})
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data: { slug } }) => {
    const db = await getDb()

    const result = await db.query.article.findFirst({
      where: and(eq(article.slug, slug), eq(article.status, 'published')),
      with: {
        author: {
          columns: { id: true, name: true, image: true, email: true },
        },
      },
    })

    return result ?? null
  })

// ============================================
// GET RECOMMENDED ARTICLES (exclude current article)
// ============================================

export const getRecommendedArticlesServerFn = createServerFn({
  method: 'GET',
})
  .inputValidator(
    z.object({
      excludeSlug: z.string(),
      limit: z.number().int().positive().default(3),
    }),
  )
  .handler(async ({ data: { excludeSlug, limit } }) => {
    const db = await getDb()

    // Get recommended articles (newest first, excluding current article)
    const data = await db
      .select({
        id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        coverImage: article.coverImage,
        publishedAt: article.publishedAt,
        createdAt: article.createdAt,
        author: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(article)
      .leftJoin(user, eq(article.authorId, user.id))
      .where(
        and(
          eq(article.status, 'published'),
          sql`${article.slug} != ${excludeSlug}`,
        ),
      )
      .orderBy(desc(article.publishedAt), desc(article.id))
      .limit(limit)

    return data.map((item) => ({
      ...item,
      author: item.author ?? { id: '', name: 'Unknown', image: null },
    })) as Array<PublicArticle>
  })

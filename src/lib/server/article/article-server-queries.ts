// =============================================================================
// ARTICLE SERVER QUERIES - SUASANA
// =============================================================================
// Server-side query functions untuk article entity

import { createServerFn } from '@tanstack/react-start'
import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  lte,
} from 'drizzle-orm'
import * as z from 'zod'
import type { ArticleAggregateResult } from '@/types'
import * as schema from '@/db/schema'
import { adminServerMiddleware, authServerMiddleware } from '@/lib/middleware'
import { filterColumns } from '@/lib/filter-columns'

// ============================================
// AGGREGATE SERVER FUNCTION (ADMIN - ALL DATA)
// ============================================

// Dynamic import to prevent db from being bundled in client
const getDb = async () => {
  const { db } = await import('@/db')
  return db
}

const { article, user } = schema

// ============================================
// TYPE DEFINITIONS
// ============================================

export const articleAggregateInputSchema = z.object({
  filterFlag: z
    .enum(['advancedFilters', 'commandFilters'])
    .nullable()
    .default(null),
  page: z.number().int().positive().default(1),
  perPage: z.number().int().positive().default(10),
  sort: z
    .array(z.object({ id: z.string(), desc: z.boolean() }))
    .default([{ id: 'createdAt', desc: true }]),
  title: z.string().default(''),
  status: z.array(z.enum(['published', 'draft', 'archived'])).default([]),
  createdAt: z.array(z.number()).default([]),
  filters: z.array(z.any()).default([]),
  joinOperator: z.enum(['and', 'or']).default('and'),
})

export type ArticleAggregateInput = z.infer<typeof articleAggregateInputSchema>

// ============================================
// INTERNAL DB FUNCTIONS
// ============================================

export async function fetchArticleList(
  userId: string,
  input: ArticleAggregateInput,
): Promise<{
  data: ArticleAggregateResult['data']
  pageCount: number
}> {
  const db = await getDb()
  const {
    page,
    perPage,
    sort,
    title,
    status,
    createdAt,
    filters,
    filterFlag,
    joinOperator,
  } = input
  const offset = (page - 1) * perPage

  const advancedTable =
    filterFlag === 'advancedFilters' || filterFlag === 'commandFilters'

  const advancedWhere = filterColumns({
    table: article,
    filters: filters,
    joinOperator: joinOperator,
  })

  const userFilter = eq(article.authorId, userId)

  const where = advancedTable
    ? and(userFilter, advancedWhere)
    : and(
        userFilter,
        title ? ilike(article.title, `%${title}%`) : undefined,
        status.length > 0 ? inArray(article.status, status) : undefined,
        createdAt.length > 0
          ? and(
              createdAt[0]
                ? gte(article.createdAt, new Date(createdAt[0]))
                : undefined,
              createdAt[1]
                ? lte(article.createdAt, new Date(createdAt[1]))
                : undefined,
            )
          : undefined,
      )

  // Valid column names untuk sorting
  type ArticleColumnKey =
    | 'id'
    | 'title'
    | 'createdAt'
    | 'status'
    | 'publishedAt'

  const validColumns: Array<ArticleColumnKey> = [
    'id',
    'title',
    'createdAt',
    'status',
    'publishedAt',
  ]

  const orderBy =
    sort.length > 0
      ? sort
          .filter((item) => validColumns.includes(item.id as ArticleColumnKey))
          .map((item) => {
            const column = article[item.id as ArticleColumnKey]
            return item.desc ? desc(column) : asc(column)
          })
      : [asc(article.createdAt)]

  const [dataResult, countResult] = await Promise.all([
    db
      .select({
        id: article.id,
        authorId: article.authorId,
        authorName: user.name,
        authorAvatar: user.avatar,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        coverImage: article.coverImage,
        status: article.status,
        publishedAt: article.publishedAt,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      })
      .from(article)
      .leftJoin(user, eq(article.authorId, user.id))
      .where(where)
      .orderBy(...orderBy)
      .limit(perPage)
      .offset(offset),
    db.select({ count: count() }).from(article).where(where),
  ])

  const total = countResult[0]?.count ?? 0

  const data = dataResult.map((a) => ({
    id: a.id,
    authorId: a.authorId,
    authorName: a.authorName ?? null,
    authorAvatar: a.authorAvatar ?? null,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    content: a.content,
    coverImage: a.coverImage,
    status: a.status,
    publishedAt: a.publishedAt,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  }))

  return { data, pageCount: Math.ceil(total / perPage) }
}

export async function fetchArticleStatusCounts(
  userId: string,
): Promise<ArticleAggregateResult['statusCounts']> {
  const db = await getDb()
  const result = await db
    .select({ status: article.status, count: count() })
    .from(article)
    .where(eq(article.authorId, userId))
    .groupBy(article.status)
    .having(gt(count(article.status), 0))

  return result.reduce(
    (acc, { status, count }) => {
      acc[status] = count
      return acc
    },
    {
      published: 0,
      draft: 0,
      archived: 0,
    } as ArticleAggregateResult['statusCounts'],
  )
}

// ============================================
// ADMIN DB FUNCTIONS (NO USER FILTER)
// ============================================

export async function fetchArticleListAdmin(
  input: ArticleAggregateInput,
): Promise<{
  data: ArticleAggregateResult['data']
  pageCount: number
}> {
  const db = await getDb()
  const {
    page,
    perPage,
    sort,
    title,
    status,
    createdAt,
    filters,
    filterFlag,
    joinOperator,
  } = input
  const offset = (page - 1) * perPage

  const advancedTable =
    filterFlag === 'advancedFilters' || filterFlag === 'commandFilters'

  const advancedWhere = filterColumns({
    table: article,
    filters: filters,
    joinOperator: joinOperator,
  })

  // No user filter for admin - gets all articles
  const where = advancedTable
    ? advancedWhere
    : and(
        title ? ilike(article.title, `%${title}%`) : undefined,
        status.length > 0 ? inArray(article.status, status) : undefined,
        createdAt.length > 0
          ? and(
              createdAt[0]
                ? gte(article.createdAt, new Date(createdAt[0]))
                : undefined,
              createdAt[1]
                ? lte(article.createdAt, new Date(createdAt[1]))
                : undefined,
            )
          : undefined,
      )

  // Valid column names untuk sorting
  type ArticleColumnKey =
    | 'id'
    | 'title'
    | 'createdAt'
    | 'status'
    | 'publishedAt'

  const validColumns: Array<ArticleColumnKey> = [
    'id',
    'title',
    'createdAt',
    'status',
    'publishedAt',
  ]

  const orderBy =
    sort.length > 0
      ? sort
          .filter((item) => validColumns.includes(item.id as ArticleColumnKey))
          .map((item) => {
            const column = article[item.id as ArticleColumnKey]
            return item.desc ? desc(column) : asc(column)
          })
      : [asc(article.createdAt)]

  const [dataResult, countResult] = await Promise.all([
    db
      .select({
        id: article.id,
        authorId: article.authorId,
        authorName: user.name,
        authorAvatar: user.avatar,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        coverImage: article.coverImage,
        status: article.status,
        publishedAt: article.publishedAt,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      })
      .from(article)
      .leftJoin(user, eq(article.authorId, user.id))
      .where(where)
      .orderBy(...orderBy)
      .limit(perPage)
      .offset(offset),
    db.select({ count: count() }).from(article).where(where),
  ])

  const total = countResult[0]?.count ?? 0

  const data = dataResult.map((a) => ({
    id: a.id,
    authorId: a.authorId,
    authorName: a.authorName ?? null,
    authorAvatar: a.authorAvatar ?? null,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    content: a.content,
    coverImage: a.coverImage,
    status: a.status,
    publishedAt: a.publishedAt,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  }))

  return { data, pageCount: Math.ceil(total / perPage) }
}

export async function fetchArticleStatusCountsAdmin(): Promise<
  ArticleAggregateResult['statusCounts']
> {
  const db = await getDb()
  const result = await db
    .select({ status: article.status, count: count() })
    .from(article)
    .groupBy(article.status)
    .having(gt(count(article.status), 0))

  return result.reduce(
    (acc, { status, count }) => {
      acc[status] = count
      return acc
    },
    {
      published: 0,
      draft: 0,
      archived: 0,
    } as ArticleAggregateResult['statusCounts'],
  )
}

// ============================================
// AGGREGATE SERVER FUNCTION (USER)
// ============================================

export const getArticleAggregateServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authServerMiddleware])
  .inputValidator(z.object({ filters: articleAggregateInputSchema }))
  .handler(
    async ({ data: { filters }, context }): Promise<ArticleAggregateResult> => {
      const userId = context.user.id

      try {
        const [listResult, statusCounts] = await Promise.all([
          fetchArticleList(userId, filters),
          fetchArticleStatusCounts(userId),
        ])

        return {
          data: listResult.data,
          pageCount: listResult.pageCount,
          statusCounts,
        }
      } catch (err) {
        console.error('[Article Aggregate Query Error]:', err)
        return {
          data: [],
          pageCount: 0,
          statusCounts: { published: 0, draft: 0, archived: 0 },
        }
      }
    },
  )

export const getArticleAggregateAdminServerFn = createServerFn({
  method: 'POST',
})
  .middleware([adminServerMiddleware])
  .inputValidator(z.object({ filters: articleAggregateInputSchema }))
  .handler(
    async ({ data: { filters }, context }): Promise<ArticleAggregateResult> => {
      try {
        const role = context.user?.role
        const userId = context.user?.id

        if (role === 'superAdmin') {
          const [listResult, statusCounts] = await Promise.all([
            fetchArticleListAdmin(filters),
            fetchArticleStatusCountsAdmin(),
          ])

          return {
            data: listResult.data,
            pageCount: listResult.pageCount,
            statusCounts,
          }
        }

        // Non-super admins should only see their own data
        const [listResult, statusCounts] = await Promise.all([
          fetchArticleList(userId, filters),
          fetchArticleStatusCounts(userId),
        ])

        return {
          data: listResult.data,
          pageCount: listResult.pageCount,
          statusCounts,
        }
      } catch (err) {
        console.error('[Article Admin Aggregate Query Error]:', err)
        return {
          data: [],
          pageCount: 0,
          statusCounts: { published: 0, draft: 0, archived: 0 },
        }
      }
    },
  )

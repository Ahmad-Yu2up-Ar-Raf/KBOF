// =============================================================================
// ARTICLE SERVER QUERIES - SUASANA
// =============================================================================
// Server-side query functions untuk article entity

import { createServerFn } from '@tanstack/react-start'
import {
  and,
  count,
  eq,
  gt,
  ilike,
  inArray,
  asc,
  desc,
  gte,
  lte,
} from 'drizzle-orm'
import * as schema from '@/db/schema'
import { authServerMiddleware } from '@/lib/middleware'
import * as z from 'zod'
import { filterColumns } from '@/lib/filter-columns'
import type { ArticleAggregateResult } from '@/types'

// Dynamic import to prevent db from being bundled in client
const getDb = async () => {
  const { db } = await import('@/db')
  return db
}

const article = schema.article

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

  const validColumns: ArticleColumnKey[] = [
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
    db.query.article.findMany({
      where,
      orderBy,
      limit: perPage,
      offset,
    }),
    db.select({ count: count() }).from(article).where(where),
  ])

  const total = countResult[0]?.count ?? 0

  const data = dataResult.map((a) => ({
    id: a.id,
    authorId: a.authorId,
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
// AGGREGATE SERVER FUNCTION
// ============================================

export const getArticleAggregateServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authServerMiddleware])
  .inputValidator(z.object({ filters: articleAggregateInputSchema }))
  .handler(
    async ({ data: { filters }, context }): Promise<ArticleAggregateResult> => {
      const userId = context.user!.id

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

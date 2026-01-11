// =============================================================================
// DESTINATION SERVER QUERIES - SUASANA
// =============================================================================
// Server-side query functions untuk destination entity

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
import type { DestinationAggregateResult } from '@/types'

// Dynamic import to prevent db from being bundled in client
const getDb = async () => {
  const { db } = await import('@/db')
  return db
}

const destination = schema.destination

// ============================================
// TYPE DEFINITIONS
// ============================================

export const destinationAggregateInputSchema = z.object({
  filterFlag: z
    .enum(['advancedFilters', 'commandFilters'])
    .nullable()
    .default(null),
  page: z.number().int().positive().default(1),
  perPage: z.number().int().positive().default(10),
  sort: z
    .array(z.object({ id: z.string(), desc: z.boolean() }))
    .default([{ id: 'createdAt', desc: true }]),
  name: z.string().default(''),
  status: z.array(z.enum(['published', 'draft', 'archived'])).default([]),
  type: z
    .array(
      z.enum([
        'wisata-alam',
        'wisata-budaya',
        'wisata-sejarah',
        'wisata-religi',
        'wisata-kuliner',
        'wisata-bahari',
        'adat-istiadat',
        'kesenian',
        'kerajinan',
        'festival',
      ]),
    )
    .default([]),
  provinsi: z.string().default(''),
  createdAt: z.array(z.number()).default([]),
  filters: z.array(z.any()).default([]),
  joinOperator: z.enum(['and', 'or']).default('and'),
})

export type DestinationAggregateInput = z.infer<
  typeof destinationAggregateInputSchema
>

// ============================================
// INTERNAL DB FUNCTIONS
// ============================================

export async function fetchDestinationList(
  userId: string,
  input: DestinationAggregateInput,
): Promise<{
  data: DestinationAggregateResult['data']
  pageCount: number
}> {
  const db = await getDb()
  const {
    page,
    perPage,
    sort,
    name,
    status,
    type,
    provinsi,
    createdAt,
    filters,
    filterFlag,
    joinOperator,
  } = input
  const offset = (page - 1) * perPage

  const advancedTable =
    filterFlag === 'advancedFilters' || filterFlag === 'commandFilters'

  const advancedWhere = filterColumns({
    table: destination,
    filters: filters,
    joinOperator: joinOperator,
  })

  const userFilter = eq(destination.userId, userId)

  const where = advancedTable
    ? and(userFilter, advancedWhere)
    : and(
        userFilter,
        name ? ilike(destination.name, `%${name}%`) : undefined,
        status.length > 0 ? inArray(destination.status, status) : undefined,
        type.length > 0 ? inArray(destination.type, type) : undefined,
        provinsi ? ilike(destination.provinsi, `%${provinsi}%`) : undefined,
        createdAt.length > 0
          ? and(
              createdAt[0]
                ? gte(destination.createdAt, new Date(createdAt[0]))
                : undefined,
              createdAt[1]
                ? lte(destination.createdAt, new Date(createdAt[1]))
                : undefined,
            )
          : undefined,
      )

  // Valid column names untuk sorting
  type DestinationColumnKey =
    | 'id'
    | 'name'
    | 'createdAt'
    | 'status'
    | 'type'
    | 'provinsi'
    | 'totalVote'

  const validColumns: DestinationColumnKey[] = [
    'id',
    'name',
    'createdAt',
    'status',
    'type',
    'provinsi',
    'totalVote',
  ]

  const orderBy =
    sort.length > 0
      ? sort
          .filter((item) =>
            validColumns.includes(item.id as DestinationColumnKey),
          )
          .map((item) => {
            const column = destination[item.id as DestinationColumnKey]
            return item.desc ? desc(column) : asc(column)
          })
      : [asc(destination.createdAt)]

  const [dataResult, countResult] = await Promise.all([
    db.query.destination.findMany({
      where,
      orderBy,
      limit: perPage,
      offset,
    }),
    db.select({ count: count() }).from(destination).where(where),
  ])

  const total = countResult[0]?.count ?? 0

  const data = dataResult.map((d) => ({
    id: d.id,
    userId: d.userId,
    slug: d.slug,
    name: d.name,
    description: d.description,
    type: d.type,
    category: d.category,
    provinsi: d.provinsi,
    kabupatenKota: d.kabupatenKota,
    alamat: d.alamat,
    coverImage: d.coverImage,
    images: d.images,
    totalVote: d.totalVote,
    totalReview: d.totalReview,
    averageRating: d.averageRating,
    totalDonation: d.totalDonation,
    status: d.status,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  }))

  return { data, pageCount: Math.ceil(total / perPage) }
}

export async function fetchStatusCounts(
  userId: string,
): Promise<DestinationAggregateResult['statusCounts']> {
  const db = await getDb()
  const result = await db
    .select({ status: destination.status, count: count() })
    .from(destination)
    .where(eq(destination.userId, userId))
    .groupBy(destination.status)
    .having(gt(count(destination.status), 0))

  return result.reduce(
    (acc, { status, count }) => {
      acc[status] = count
      return acc
    },
    {
      published: 0,
      draft: 0,
      archived: 0,
    } as DestinationAggregateResult['statusCounts'],
  )
}

export async function fetchCategoryCounts(
  userId: string,
): Promise<DestinationAggregateResult['categoryCounts']> {
  const db = await getDb()
  const result = await db
    .select({ category: destination.category, count: count() })
    .from(destination)
    .where(eq(destination.userId, userId))
    .groupBy(destination.category)
    .having(gt(count(destination.category), 0))

  return result.reduce(
    (acc, { category, count }) => {
      acc[category] = count
      return acc
    },
    {
      'lokasi-budaya': 0,
      pariwisata: 0,
      'adat-istiadat': 0,
      'kuliner-tradisional': 0,
      'kesenian-daerah': 0,
      'situs-sejarah': 0,
    } as DestinationAggregateResult['categoryCounts'],
  )
}

export async function fetchTypeCounts(
  userId: string,
): Promise<DestinationAggregateResult['typeCounts']> {
  const db = await getDb()
  const result = await db
    .select({ type: destination.type, count: count() })
    .from(destination)
    .where(eq(destination.userId, userId))
    .groupBy(destination.type)
    .having(gt(count(destination.type), 0))

  return result.reduce(
    (acc, { type, count }) => {
      acc[type] = count
      return acc
    },
    {
      'wisata-alam': 0,
      'wisata-budaya': 0,
      'wisata-sejarah': 0,
      'wisata-religi': 0,
      'wisata-kuliner': 0,
      'wisata-bahari': 0,
      'adat-istiadat': 0,
      kesenian: 0,
      kerajinan: 0,
      festival: 0,
    } as DestinationAggregateResult['typeCounts'],
  )
}

// ============================================
// AGGREGATE SERVER FUNCTION
// ============================================

export const getDestinationAggregateServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authServerMiddleware])
  .inputValidator(z.object({ filters: destinationAggregateInputSchema }))
  .handler(
    async ({
      data: { filters },
      context,
    }): Promise<DestinationAggregateResult> => {
      const userId = context.user!.id

      try {
        const [listResult, statusCounts, categoryCounts, typeCounts] =
          await Promise.all([
            fetchDestinationList(userId, filters),
            fetchStatusCounts(userId),
            fetchCategoryCounts(userId),
            fetchTypeCounts(userId),
          ])

        return {
          data: listResult.data,
          pageCount: listResult.pageCount,
          statusCounts,
          categoryCounts,
          typeCounts,
        }
      } catch (err) {
        console.error('[Destination Aggregate Query Error]:', err)
        return {
          data: [],
          pageCount: 0,
          categoryCounts: {
            'lokasi-budaya': 0,
            pariwisata: 0,
            'adat-istiadat': 0,
            'kuliner-tradisional': 0,
            'kesenian-daerah': 0,
            'situs-sejarah': 0,
          },
          statusCounts: { published: 0, draft: 0, archived: 0 },
          typeCounts: {
            'wisata-alam': 0,
            'wisata-budaya': 0,
            'wisata-sejarah': 0,
            'wisata-religi': 0,
            'wisata-kuliner': 0,
            'wisata-bahari': 0,
            'adat-istiadat': 0,
            kesenian: 0,
            kerajinan: 0,
            festival: 0,
          },
        }
      }
    },
  )

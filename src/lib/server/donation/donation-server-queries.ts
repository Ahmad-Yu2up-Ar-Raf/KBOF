// =============================================================================
// DONATION SERVER QUERIES - SUASANA
// =============================================================================
// Server-side query functions untuk donation entity (READ-ONLY)
// Menampilkan donasi yang masuk ke destinasi milik user

import { createServerFn } from '@tanstack/react-start'
import {
  and,
  count,
  eq,
  gt,
  inArray,
  asc,
  desc,
  gte,
  lte,
  sum,
} from 'drizzle-orm'
import * as schema from '@/db/schema'
import { authServerMiddleware } from '@/lib/middleware'
import * as z from 'zod'
import { filterColumns } from '@/lib/filter-columns'
import type { DonationAggregateResult, DonationWithDetails } from '@/types'

// Dynamic import to prevent db from being bundled in client
const getDb = async () => {
  const { db } = await import('@/db')
  return db
}

const { donation, destination, user } = schema

// ============================================
// TYPE DEFINITIONS
// ============================================

export const donationAggregateInputSchema = z.object({
  filterFlag: z
    .enum(['advancedFilters', 'commandFilters'])
    .nullable()
    .default(null),
  page: z.number().int().positive().default(1),
  perPage: z.number().int().positive().default(10),
  sort: z
    .array(z.object({ id: z.string(), desc: z.boolean() }))
    .default([{ id: 'createdAt', desc: true }]),
  status: z
    .array(z.enum(['pending', 'completed', 'failed', 'refunded']))
    .default([]),
  destinationId: z.number().optional(),
  createdAt: z.array(z.number()).default([]),
  filters: z.array(z.any()).default([]),
  joinOperator: z.enum(['and', 'or']).default('and'),
})

export type DonationAggregateInput = z.infer<
  typeof donationAggregateInputSchema
>

// ============================================
// INTERNAL DB FUNCTIONS
// ============================================

export async function fetchDonationList(
  userId: string,
  input: DonationAggregateInput,
): Promise<{
  data: DonationWithDetails[]
  pageCount: number
}> {
  const db = await getDb()
  const {
    page,
    perPage,
    sort,
    status,
    destinationId,
    createdAt,
    filters,
    filterFlag,
    joinOperator,
  } = input
  const offset = (page - 1) * perPage

  const advancedTable =
    filterFlag === 'advancedFilters' || filterFlag === 'commandFilters'

  const advancedWhere = filterColumns({
    table: donation,
    filters: filters,
    joinOperator: joinOperator,
  })

  // Base filter: donations to destinations owned by current user
  const ownerFilter = eq(destination.userId, userId)

  const where = advancedTable
    ? and(ownerFilter, advancedWhere)
    : and(
        ownerFilter,
        status.length > 0 ? inArray(donation.status, status) : undefined,
        destinationId && destinationId > 0
          ? eq(donation.destinationId, destinationId)
          : undefined,
        createdAt.length > 0
          ? and(
              createdAt[0]
                ? gte(donation.createdAt, new Date(createdAt[0]))
                : undefined,
              createdAt[1]
                ? lte(donation.createdAt, new Date(createdAt[1]))
                : undefined,
            )
          : undefined,
      )

  // Valid column names untuk sorting
  type DonationColumnKey = 'id' | 'createdAt' | 'status' | 'amount' | 'paidAt'

  const validColumns: DonationColumnKey[] = [
    'id',
    'createdAt',
    'status',
    'amount',
    'paidAt',
  ]

  const orderBy =
    sort.length > 0
      ? sort
          .filter((item) => validColumns.includes(item.id as DonationColumnKey))
          .map((item) => {
            const column = donation[item.id as DonationColumnKey]
            return item.desc ? desc(column) : asc(column)
          })
      : [desc(donation.createdAt)]

  // Query donations with joins
  const dataResult = await db
    .select({
      donation: donation,
      donor: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      destination: {
        id: destination.id,
        name: destination.name,
        slug: destination.slug,
        coverImage: destination.coverImage,
      },
    })
    .from(donation)
    .innerJoin(destination, eq(donation.destinationId, destination.id))
    .innerJoin(user, eq(donation.userId, user.id))
    .where(where)
    .orderBy(...orderBy)
    .limit(perPage)
    .offset(offset)

  // Count query
  const countResult = await db
    .select({ count: count() })
    .from(donation)
    .innerJoin(destination, eq(donation.destinationId, destination.id))
    .where(where)

  const total = countResult[0]?.count ?? 0

  // Transform data
  const data: DonationWithDetails[] = dataResult.map((row) => ({
    ...row.donation,
    donor: row.donor,
    destination: row.destination,
  }))

  return { data, pageCount: Math.ceil(total / perPage) }
}

export async function fetchDonationStatusCounts(
  userId: string,
): Promise<DonationAggregateResult['statusCounts']> {
  const db = await getDb()

  const result = await db
    .select({ status: donation.status, count: count() })
    .from(donation)
    .innerJoin(destination, eq(donation.destinationId, destination.id))
    .where(eq(destination.userId, userId))
    .groupBy(donation.status)
    .having(gt(count(donation.status), 0))

  return result.reduce(
    (acc, { status, count }) => {
      acc[status] = count
      return acc
    },
    {
      pending: 0,
      completed: 0,
      failed: 0,
      refunded: 0,
    } as DonationAggregateResult['statusCounts'],
  )
}

export async function fetchTotalDonationAmount(
  userId: string,
): Promise<number> {
  const db = await getDb()

  const result = await db
    .select({ total: sum(donation.amount) })
    .from(donation)
    .innerJoin(destination, eq(donation.destinationId, destination.id))
    .where(
      and(eq(destination.userId, userId), eq(donation.status, 'completed')),
    )

  return Number(result[0]?.total ?? 0)
}

// ============================================
// AGGREGATE SERVER FUNCTION
// ============================================

export const getDonationAggregateServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authServerMiddleware])
  .inputValidator(z.object({ filters: donationAggregateInputSchema }))
  .handler(
    async ({
      data: { filters },
      context,
    }): Promise<DonationAggregateResult> => {
      const userId = context.user!.id

      try {
        const [listResult, statusCounts, totalAmount] = await Promise.all([
          fetchDonationList(userId, filters),
          fetchDonationStatusCounts(userId),
          fetchTotalDonationAmount(userId),
        ])

        return {
          data: listResult.data,
          pageCount: listResult.pageCount,
          totalAmount,
          statusCounts,
        }
      } catch (err) {
        console.error('[Donation Aggregate Query Error]:', err)
        return {
          data: [],
          pageCount: 0,
          totalAmount: 0,
          statusCounts: { pending: 0, completed: 0, failed: 0, refunded: 0 },
        }
      }
    },
  )

// ============================================
// USER'S DESTINATIONS LIST (for filter dropdown)
// ============================================

export const getUserDestinationsForFilter = createServerFn({
  method: 'GET',
})
  .middleware([authServerMiddleware])
  .handler(async ({ context }) => {
    const db = await getDb()
    const userId = context.user!.id

    const destinations = await db
      .select({
        id: destination.id,
        name: destination.name,
      })
      .from(destination)
      .where(eq(destination.userId, userId))
      .orderBy(asc(destination.name))

    return destinations
  })

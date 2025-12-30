// src/lib/server/mess-aggregate.server.ts
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
import { MessAggregateResult } from '@/types'

// Dynamic import to prevent db from being bundled in client
const getDb = async () => {
  const { db } = await import('@/db')
  return db
}

const mess = schema.mess

// ============================================
// TYPE DEFINITIONS
// ============================================

/** Input schema - compatible dengan nuqs parser output */
export const messAggregateInputSchema = z.object({
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
  status: z.array(z.enum(['active', 'not-active'])).default([]),
  type: z.array(z.enum(['male', 'female', 'mixture'])).default([]),
  statusCapacity: z.array(z.enum(['full', 'available'])).default([]),
  createdAt: z.array(z.number()).default([]),
  filters: z.array(z.any()).default([]),
  joinOperator: z.enum(['and', 'or']).default('and'),
})

/** Export input type for client usage */
export type MessAggregateInput = z.infer<typeof messAggregateInputSchema>

/** Output type - semua data dalam satu payload */

// ============================================
// INTERNAL DB FUNCTIONS (tidak di-export)
// ============================================

export async function fetchMessList(
  userId: string,
  input: MessAggregateInput,
): Promise<{ data: MessAggregateResult['data']; pageCount: number }> {
  const db = await getDb()
  const {
    page,
    perPage,
    sort,
    name,
    status,
    type,
    statusCapacity,
    createdAt,
    filters,
    filterFlag,
    joinOperator,
  } = input
  const offset = (page - 1) * perPage

  const advancedTable =
    filterFlag === 'advancedFilters' || filterFlag === 'commandFilters'

  const advancedWhere = filterColumns({
    table: mess,
    filters: filters,
    joinOperator: joinOperator,
  })

  const userFilter = eq(mess.userId, userId)

  const where = advancedTable
    ? and(userFilter, advancedWhere)
    : and(
        userFilter,
        name ? ilike(mess.name, `%${name}%`) : undefined,
        status.length > 0 ? inArray(mess.status, status) : undefined,
        statusCapacity.length > 0
          ? inArray(mess.statusCapacity, statusCapacity)
          : undefined,
        type.length > 0 ? inArray(mess.type, type) : undefined,
        createdAt.length > 0
          ? and(
              createdAt[0]
                ? gte(mess.createdAt, new Date(createdAt[0]).toISOString())
                : undefined,
              createdAt[1]
                ? lte(mess.createdAt, new Date(createdAt[1]).toISOString())
                : undefined,
            )
          : undefined,
      )

  // Valid column names untuk sorting
  type MessColumnKey =
    | 'id'
    | 'name'
    | 'createdAt'
    | 'status'
    | 'type'
    | 'statusCapacity'
    | 'location'
    | 'capacityRoom'
    | 'capacityEmploye'
  const validColumns: MessColumnKey[] = [
    'id',
    'name',
    'createdAt',
    'status',
    'type',
    'statusCapacity',
    'location',
    'capacityRoom',
    'capacityEmploye',
  ]

  const orderBy =
    sort.length > 0
      ? sort
          .filter((item) => validColumns.includes(item.id as MessColumnKey))
          .map((item) => {
            const column = mess[item.id as MessColumnKey]
            return item.desc ? desc(column) : asc(column)
          })
      : [asc(mess.createdAt)]

  // ⚠️ neon-http driver does NOT support transactions!
  // Run queries separately using Promise.all for parallel execution
  const [dataResult, countResult] = await Promise.all([
    // Query 1: Fetch paginated data with relations
    db.query.mess.findMany({
      where,
      orderBy,
      limit: perPage,
      offset,
      with: {
        // Load rooms dengan nested employes untuk count
        rooms: {
          columns: { id: true },
          with: {
            employes: { columns: { id: true } },
          },
        },
      },
    }),
    // Query 2: Count total records for pagination
    db.select({ count: count() }).from(mess).where(where),
  ])

  const total = countResult[0]?.count ?? 0

  const data = dataResult.map((m) => ({
    id: m.id,
    name: m.name,
    location: m.location,
    deskripcion: m.deskripcion,
    capacityRoom: m.capacityRoom,
    createdAt: m.createdAt,
    status: m.status,
    type: m.type,
    statusCapacity: m.statusCapacity,
    capacityEmploye: m.capacityEmploye,
    roomCount: m.rooms?.length ?? null,
    // Count employees dari semua rooms
    employeeCount:
      m.rooms?.reduce((acc, room) => acc + (room.employes?.length ?? 0), 0) ??
      null,
  }))

  return { data, pageCount: Math.ceil(total / perPage) }
}

export async function fetchStatusCounts(
  userId: string,
): Promise<MessAggregateResult['statusCounts']> {
  const db = await getDb()
  const result = await db
    .select({ status: mess.status, count: count() })
    .from(mess)
    .where(eq(mess.userId, userId))
    .groupBy(mess.status)
    .having(gt(count(mess.status), 0))

  return result.reduce(
    (acc, { status, count }) => {
      acc[status] = count
      return acc
    },
    { active: 0, 'not-active': 0 } as MessAggregateResult['statusCounts'],
  )
}

export async function fetchTypeCounts(
  userId: string,
): Promise<MessAggregateResult['typeCounts']> {
  const db = await getDb()
  const result = await db
    .select({ type: mess.type, count: count() })
    .from(mess)
    .where(eq(mess.userId, userId))
    .groupBy(mess.type)
    .having(gt(count(mess.type), 0))

  return result.reduce(
    (acc, { type, count }) => {
      acc[type] = count
      return acc
    },
    { male: 0, female: 0, mixture: 0 } as MessAggregateResult['typeCounts'],
  )
}

export async function fetchCapacityCounts(
  userId: string,
): Promise<MessAggregateResult['capacityCounts']> {
  const db = await getDb()
  const result = await db
    .select({ statusCapacity: mess.statusCapacity, count: count() })
    .from(mess)
    .where(eq(mess.userId, userId))
    .groupBy(mess.statusCapacity)
    .having(gt(count(mess.statusCapacity), 0))

  return result.reduce(
    (acc, { statusCapacity, count }) => {
      acc[statusCapacity] = count
      return acc
    },
    { full: 0, available: 0 } as MessAggregateResult['capacityCounts'],
  )
}
// ============================================
// AGGREGATE SERVER FUNCTION
// ============================================

export const getMessAggregateServerFn = createServerFn({ method: 'GET' })
  .middleware([authServerMiddleware])
  .inputValidator(z.object({ filters: messAggregateInputSchema }))
  .handler(
    async ({ data: { filters }, context }): Promise<MessAggregateResult> => {
      const userId = context.user!.id

      try {
        // ⭐ Promise.all - semua fetch parallel
        const [listResult, statusCounts, typeCounts, capacityCounts] =
          await Promise.all([
            fetchMessList(userId, filters),
            fetchStatusCounts(userId),
            fetchTypeCounts(userId),
            fetchCapacityCounts(userId),
          ])

        return {
          data: listResult.data,
          pageCount: listResult.pageCount,
          statusCounts,
          typeCounts,
          capacityCounts,
        }
      } catch (err) {
        console.error('[Aggregate Query Error]:', err)
        return {
          data: [],
          pageCount: 0,
          statusCounts: { active: 0, 'not-active': 0 },
          typeCounts: { male: 0, female: 0, mixture: 0 },
          capacityCounts: { full: 0, available: 0 },
        }
      }
    },
  )

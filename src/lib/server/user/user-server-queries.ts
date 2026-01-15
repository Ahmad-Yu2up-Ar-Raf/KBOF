// =============================================================================
// USER SERVER QUERIES - SUASANA
// =============================================================================
// Server-side query functions for user management (SuperAdmin only)
// Uses aggregated pattern similar to destination-server-queries

import { createServerFn } from '@tanstack/react-start'
import {
  and,
  count,
  eq,
  or,
  ilike,
  asc,
  desc,
  sql,
  type SQL,
} from 'drizzle-orm'
import * as schema from '@/db/schema'
import { superAdminServerMiddleware } from '@/lib/middleware'
import * as z from 'zod'
import type { UserRoleType } from '@/db/schema'
import { filterColumns } from '@/lib/filter-columns'
import type { ExtendedColumnFilter, JoinOperator } from '@/types/data-table'

// Dynamic import to prevent db from being bundled in client
const getDb = async () => {
  const { db } = await import('@/db')
  return db
}

const { user } = schema

// ============================================
// TYPE DEFINITIONS
// ============================================

export const userAggregateInputSchema = z.object({
  filterFlag: z.string().nullish(),
  page: z.number().int().positive().default(1),
  perPage: z.number().int().positive().default(10),
  sort: z
    .array(z.object({ id: z.string(), desc: z.boolean() }))
    .default([{ id: 'createdAt', desc: true }]),
  search: z.string().default(''),
  role: z.enum(['pribumi', 'admin', 'superAdmin', 'all']).default('all'),
  banned: z.enum(['all', 'banned', 'active']).default('all'),
  filters: z
    .array(
      z.object({
        id: z.string(),
        value: z.union([z.string(), z.array(z.string())]),
        variant: z
          .enum(['text', 'multiSelect', 'dateRange', 'select'])
          .optional(),
        operator: z
          .enum([
            'eq',
            'ne',
            'contains',
            'iContains',
            'notContains',
            'startsWith',
            'endsWith',
            'lt',
            'lte',
            'gt',
            'gte',
            'isBetween',
            'isEmpty',
            'isNotEmpty',
          ])
          .optional(),
      }),
    )
    .default([]),
  joinOperator: z.enum(['and', 'or']).default('and'),
})

export type UserAggregateInput = z.infer<typeof userAggregateInputSchema>

// User table row type
export interface UserTableRow {
  id: string
  name: string
  email: string
  image: string | null
  role: UserRoleType
  banned: boolean | null
  banReason: string | null
  banExpires: Date | null
  hasCompletedOnboarding: boolean
  username: string | null
  fullName: string | null
  createdAt: Date
  emailVerified: boolean
}

// Aggregate result type
export interface UserAggregateResult {
  data: UserTableRow[]
  pageCount: number
  totalCount: number
  roleCounts: Record<UserRoleType, number>
}

// ============================================
// INTERNAL DB FUNCTIONS
// ============================================

export async function fetchUserList(
  input: UserAggregateInput,
): Promise<{
  data: UserTableRow[]
  pageCount: number
  totalCount: number
}> {
  const db = await getDb()
  const { page, perPage, sort, search, role, banned, filters, joinOperator } = input
  const offset = (page - 1) * perPage

  // Build where conditions
  const conditions: SQL<unknown>[] = []

  // Search filter
  if (search) {
    conditions.push(
      or(
        ilike(user.name, `%${search}%`),
        ilike(user.email, `%${search}%`),
        ilike(user.username, `%${search}%`),
      )!,
    )
  }

  // Role filter (from simple filter)
  if (role && role !== 'all') {
    conditions.push(eq(user.role, role))
  }

  // Banned filter (from simple filter)
  if (banned === 'banned') {
    conditions.push(eq(user.banned, true))
  } else if (banned === 'active') {
    conditions.push(
      or(eq(user.banned, false), sql`${user.banned} IS NULL`)!,
    )
  }

  // Advanced filters using filterColumns helper
  const advancedConditions = filterColumns({
    table: user,
    filters: filters as ExtendedColumnFilter<typeof user>[],
    joinOperator: joinOperator as JoinOperator,
  })

  if (advancedConditions) {
    conditions.push(advancedConditions)
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // Get total count
  const totalResult = await db
    .select({ count: count() })
    .from(user)
    .where(whereClause)

  const totalCount = totalResult[0]?.count ?? 0
  const pageCount = Math.ceil(totalCount / perPage)

  // Build order by
  const sortField = sort[0]?.id ?? 'createdAt'
  const sortDesc = sort[0]?.desc ?? true

  const orderByColumn =
    sortField === 'name'
      ? user.name
      : sortField === 'email'
        ? user.email
        : sortField === 'role'
          ? user.role
          : user.createdAt

  const orderByDirection = sortDesc ? desc : asc

  // Get users
  const users = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      banned: user.banned,
      banReason: user.banReason,
      banExpires: user.banExpires,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
      username: user.username,
      fullName: user.fullName,
      createdAt: user.createdAt,
      emailVerified: user.emailVerified,
    })
    .from(user)
    .where(whereClause)
    .orderBy(orderByDirection(orderByColumn))
    .limit(perPage)
    .offset(offset)

  return {
    data: users as UserTableRow[],
    pageCount,
    totalCount,
  }
}

export async function fetchRoleCounts(): Promise<Record<UserRoleType, number>> {
  const db = await getDb()

  const counts = await db
    .select({
      role: user.role,
      count: count(),
    })
    .from(user)
    .groupBy(user.role)

  const roleCounts: Record<UserRoleType, number> = {
    pribumi: 0,
    admin: 0,
    superAdmin: 0,
  }

  counts.forEach((c) => {
    if (c.role in roleCounts) {
      roleCounts[c.role as UserRoleType] = c.count
    }
  })

  return roleCounts
}

// ============================================
// AGGREGATED SERVER FUNCTION
// ============================================

/**
 * Get aggregated user data (SuperAdmin only)
 * Returns paginated users with role counts in single request
 */
export const getUserAggregateServerFn = createServerFn({ method: 'GET' })
  .middleware([superAdminServerMiddleware])
  .inputValidator(
    z.object({
      filters: userAggregateInputSchema,
    }),
  )
  .handler(async ({ data: { filters } }): Promise<UserAggregateResult> => {
    // Execute queries in parallel for better performance
    const [listResult, roleCounts] = await Promise.all([
      fetchUserList(filters),
      fetchRoleCounts(),
    ])

    return {
      data: listResult.data,
      pageCount: listResult.pageCount,
      totalCount: listResult.totalCount,
      roleCounts,
    }
  })

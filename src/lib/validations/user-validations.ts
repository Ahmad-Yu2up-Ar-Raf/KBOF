// =============================================================================
// USER MANAGEMENT VALIDATIONS - SUASANA
// =============================================================================
// Zod schemas untuk user management dengan nuqs integration

import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server'
import * as z from 'zod'

import { getSortingStateParser } from '@/lib/parsers'
import type { User } from '@/db/schema'

// ============================================
// USER ROLE ENUM
// ============================================

export const userRoleEnum = z.enum(['pribumi', 'admin', 'superAdmin'])

export const updateUserRoleSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: userRoleEnum,
})

export const banUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  reason: z.string().optional(),
  expiresAt: z.date().optional(),
})

export const unbanUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
})

export const deleteUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
})

export const bulkDeleteUsersSchema = z.object({
  userIds: z.array(z.string()).min(1, 'At least one user ID is required'),
})

export const bulkUpdateUserRoleSchema = z.object({
  userIds: z.array(z.string()).min(1, 'At least one user ID is required'),
  role: userRoleEnum,
})

export const bulkBanUsersSchema = z.object({
  userIds: z.array(z.string()).min(1, 'At least one user ID is required'),
  reason: z.string().optional(),
})

export const bulkUnbanUsersSchema = z.object({
  userIds: z.array(z.string()).min(1, 'At least one user ID is required'),
})

export const searchUsersSchema = z.object({
  page: z.number().optional().default(1),
  perPage: z.number().optional().default(10),
  search: z.string().optional(),
  role: userRoleEnum.optional(),
  banned: z.boolean().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

// Onboarding schema
export const onboardingStep1Schema = z.object({
  fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  username: z
    .string()
    .min(3, 'Username minimal 3 karakter')
    .max(30, 'Username maksimal 30 karakter')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username hanya boleh huruf, angka, dan underscore'
    ),
  bio: z.string().max(500, 'Bio maksimal 500 karakter').optional(),
})

export const onboardingStep2Schema = z.object({
  province: z.string().optional(),
  city: z.string().optional(),
  hobbies: z.array(z.string()).optional(),
  expertise: z.array(z.string()).optional(),
  motivation: z.string().max(1000, 'Motivasi maksimal 1000 karakter').optional(),
})

export const onboardingStep3Schema = z.object({
  favoriteCategories: z.array(z.string()).optional(),
  interestedTypes: z.array(z.string()).optional(),
  notificationPreferences: z
    .object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      newsletter: z.boolean().optional(),
    })
    .optional(),
})

export const completeOnboardingSchema = z.object({
  step1: onboardingStep1Schema,
  step2: onboardingStep2Schema.optional(),
  step3: onboardingStep3Schema.optional(),
})

// ============================================
// NUQS SEARCH PARAMS CACHE
// ============================================

const roleValues = ['pribumi', 'admin', 'superAdmin', 'all'] as const
const bannedValues = ['all', 'banned', 'active'] as const

export const searchParamsCacheUser = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<User>().withDefault([
    { id: 'createdAt', desc: true },
  ]),
  search: parseAsString.withDefault(''),
  role: parseAsStringEnum([...roleValues]).withDefault('all'),
  banned: parseAsStringEnum([...bannedValues]).withDefault('all'),
})

// ============================================
// PREPROCESS HELPERS
// ============================================

const toNumber = (val: unknown): number | undefined => {
  if (typeof val === 'number') return val
  if (typeof val === 'string' && val.length > 0) {
    const num = Number(val)
    return isNaN(num) ? undefined : num
  }
  return undefined
}

const jsonParse = <T>(fallback: T) => {
  return (val: unknown): T => {
    if (Array.isArray(val) || (typeof val === 'object' && val !== null))
      return val as T
    if (typeof val === 'string' && val.length > 0) {
      try {
        return JSON.parse(val) as T
      } catch {
        return fallback
      }
    }
    return fallback
  }
}

// ============================================
// SEARCH SCHEMA (untuk route validation)
// ============================================

export const userSearchSchema = z.object({
  filterFlag: z.string().nullish(),
  page: z.preprocess(toNumber, z.number().int().positive().catch(1)).optional(),
  perPage: z
    .preprocess(toNumber, z.number().int().positive().catch(10))
    .optional(),

  sort: z
    .preprocess(
      jsonParse([{ id: 'createdAt', desc: true }]),
      z
        .array(z.object({ id: z.string(), desc: z.boolean() }))
        .catch([{ id: 'createdAt', desc: true }]),
    )
    .optional(),

  search: z.string().catch('').optional(),

  role: z
    .enum(['pribumi', 'admin', 'superAdmin', 'all'])
    .catch('all')
    .optional(),

  banned: z.enum(['all', 'banned', 'active']).catch('all').optional(),

  // Advanced filters
  filters: z
    .preprocess(
      jsonParse([]),
      z
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
        .catch([]),
    )
    .optional(),

  joinOperator: z.enum(['and', 'or']).catch('and').optional(),
})

// ============================================
// TYPE EXPORTS
// ============================================

export type UserSearchParams = z.infer<typeof userSearchSchema>
export type GetUserSchema = Awaited<
  ReturnType<typeof searchParamsCacheUser.parse>
>
export type UserRole = z.infer<typeof userRoleEnum>
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>
export type BanUserInput = z.infer<typeof banUserSchema>
export type UnbanUserInput = z.infer<typeof unbanUserSchema>
export type DeleteUserInput = z.infer<typeof deleteUserSchema>
export type BulkDeleteUsersInput = z.infer<typeof bulkDeleteUsersSchema>
export type BulkUpdateUserRoleInput = z.infer<typeof bulkUpdateUserRoleSchema>
export type BulkBanUsersInput = z.infer<typeof bulkBanUsersSchema>
export type BulkUnbanUsersInput = z.infer<typeof bulkUnbanUsersSchema>
export type SearchUsersInput = z.infer<typeof searchUsersSchema>
export type OnboardingStep1Input = z.infer<typeof onboardingStep1Schema>
export type OnboardingStep2Input = z.infer<typeof onboardingStep2Schema>
export type OnboardingStep3Input = z.infer<typeof onboardingStep3Schema>
export type CompleteOnboardingInput = z.infer<typeof completeOnboardingSchema>

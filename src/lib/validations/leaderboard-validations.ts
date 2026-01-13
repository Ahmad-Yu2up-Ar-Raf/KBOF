// =============================================================================
// LEADERBOARD VALIDATIONS - SUASANA
// =============================================================================
// Zod schemas and nuqs parsers for leaderboard filtering
// =============================================================================

import { z } from 'zod'
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsStringEnum,
} from 'nuqs/server'
import {
  destinationCategory,
  destinationType,
  provinsiIndonesia,
} from '@/db/schema'

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Preprocess CSV string to array
 * Handles: "a,b,c" -> ["a", "b", "c"]
 */
const csvToArray = (v: unknown): unknown => {
  if (typeof v === 'string') {
    return v
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }
  if (Array.isArray(v)) return v
  return []
}

// ============================================
// LEADERBOARD SEARCH PARAMS CACHE
// ============================================

/**
 * Server-side search params cache for leaderboard route
 * Uses nuqs for type-safe URL parsing
 */
export const searchParamsCacheLeaderboard = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  categories: parseAsArrayOf(
    parseAsStringEnum(destinationCategory.enumValues),
  ).withDefault([]),
  types: parseAsArrayOf(
    parseAsStringEnum(destinationType.enumValues),
  ).withDefault([]),
  provinces: parseAsArrayOf(
    parseAsStringEnum(provinsiIndonesia.enumValues),
  ).withDefault([]),
})

// ============================================
// ZOD SCHEMAS
// ============================================

/**
 * Leaderboard filter schema with preprocessing
 * Handles both CSV strings and arrays from URL params
 */
export const leaderboardSearchSchema = z.object({
  page: z.preprocess(
    (v) => (typeof v === 'string' ? parseInt(v, 10) : v),
    z.number().int().positive().catch(1),
  ),
  perPage: z.preprocess(
    (v) => (typeof v === 'string' ? parseInt(v, 10) : v),
    z.number().int().positive().max(100).catch(10),
  ),
  categories: z
    .preprocess(
      csvToArray,
      z.array(z.enum(destinationCategory.enumValues)).catch([]),
    )
    .optional()
    .default([]),
  types: z
    .preprocess(
      csvToArray,
      z.array(z.enum(destinationType.enumValues)).catch([]),
    )
    .optional()
    .default([]),
  provinces: z
    .preprocess(
      csvToArray,
      z.array(z.enum(provinsiIndonesia.enumValues)).catch([]),
    )
    .optional()
    .default([]),
  scope: z.enum(['global', 'weekly', 'monthly']).catch('global').optional(),
})

// ============================================
// TYPE EXPORTS
// ============================================

export type LeaderboardSearchParams = z.infer<typeof leaderboardSearchSchema>
export type GetLeaderboardSchema = Awaited<
  ReturnType<typeof searchParamsCacheLeaderboard.parse>
>

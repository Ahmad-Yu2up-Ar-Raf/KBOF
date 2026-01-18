// =============================================================================
// ANALYTICS VALIDATIONS - SUASANA
// =============================================================================
// Validation schemas and nuqs parsers for dashboard analytics

import { z } from 'zod'
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
} from 'nuqs/server'

// ============================================
// NUQS SEARCH PARAMS PARSER
// ============================================

/**
 * Search params cache for analytics dashboard
 * Uses nuqs for URL state management
 */
export const analyticsSearchParamsCache = createSearchParamsCache({
  createdAt: parseAsArrayOf(parseAsInteger),
})

// ============================================
// ZOD VALIDATION SCHEMA
// ============================================

/**
 * Zod schema for analytics search params
 * Used for route validation
 * Handles both array and string inputs (nuqs URL parsing)
 */
export const analyticsSearchSchema = z.object({
  createdAt: z
    .union([
      z.array(z.number()),
      z.string().transform((val) => {
        if (!val || val === '') return []
        try {
          const parsed = JSON.parse(val)
          if (Array.isArray(parsed))
            return parsed.map(Number).filter((n) => !isNaN(n))
          return []
        } catch {
          return val
            .split(',')
            .map(Number)
            .filter((n) => !isNaN(n))
        }
      }),
    ])
    .optional(),
})

export type AnalyticsSearchParams = z.infer<typeof analyticsSearchSchema>

// =============================================================================
// DONATION VALIDATIONS - SUASANA
// =============================================================================
// Zod schemas untuk donation entity dengan nuqs integration

import { donationStatus } from '@/db/schema'
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsStringEnum,
} from 'nuqs/server'
import * as z from 'zod'

import { flagConfig } from '@/config/flag'
import { getFiltersStateParser, getSortingStateParser } from '@/lib/parsers'
import type { Donation } from '@/db/schema'

// ============================================
// NUQS SEARCH PARAMS CACHE
// ============================================

export const searchParamsCacheDonation = createSearchParamsCache({
  filterFlag: parseAsStringEnum(
    flagConfig.featureFlags.map((flag) => flag.value),
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Donation>().withDefault([
    { id: 'createdAt', desc: true },
  ]),
  status: parseAsArrayOf(
    parseAsStringEnum(donationStatus.enumValues),
  ).withDefault([]),
  destinationId: parseAsInteger.withDefault(0),
  createdAt: parseAsArrayOf(parseAsInteger).withDefault([]),
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and'),
})

// ============================================
// PREPROCESS HELPERS
// ============================================

const csvToArray = (val: unknown): string[] => {
  if (Array.isArray(val)) return val.filter(Boolean)
  if (typeof val === 'string' && val.length > 0) {
    return val
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return []
}

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

export const donationSearchSchema = z.object({
  filterFlag: z
    .preprocess(
      (v) => (v === 'null' || v === '' ? null : v),
      z.enum(['advancedFilters', 'commandFilters']).nullable().catch(null),
    )
    .optional(),

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

  status: z
    .preprocess(
      csvToArray,
      z.array(z.enum(donationStatus.enumValues)).catch([]),
    )
    .optional(),

  destinationId: z.preprocess(toNumber, z.number().int().catch(0)).optional(),

  createdAt: z
    .preprocess((v) => {
      if (Array.isArray(v)) return v
      if (typeof v === 'string' && v.length > 0) {
        try {
          return JSON.parse(v)
        } catch {
          return v
            .split(',')
            .map(Number)
            .filter((n) => !isNaN(n))
        }
      }
      return []
    }, z.array(z.number()).catch([]))
    .optional(),

  filters: z.preprocess(jsonParse([]), z.array(z.any()).catch([])).optional(),

  joinOperator: z.enum(['and', 'or']).catch('and').optional(),
})

// ============================================
// TYPE EXPORTS
// ============================================

export type DonationSearchParams = z.infer<typeof donationSearchSchema>
export type GetDonationSchema = Awaited<
  ReturnType<typeof searchParamsCacheDonation.parse>
>

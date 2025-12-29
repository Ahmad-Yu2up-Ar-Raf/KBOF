import { type Mess, mess, status } from '@/db/schema'
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server'
import * as z from 'zod'

import { flagConfig } from '@/config/flag'
import { getFiltersStateParser, getSortingStateParser } from '@/lib/parsers'

export const searchParamsCacheMess = createSearchParamsCache({
  filterFlag: parseAsStringEnum(
    flagConfig.featureFlags.map((flag) => flag.value),
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Mess>().withDefault([
    { id: 'createdAt', desc: true },
  ]),
  name: parseAsString.withDefault(''),
  status: parseAsArrayOf(parseAsStringEnum(status.enumValues)).withDefault([]),
  type: parseAsArrayOf(parseAsStringEnum(mess.type.enumValues)).withDefault([]),
  statusCapacity: parseAsArrayOf(
    parseAsStringEnum(mess.statusCapacity.enumValues),
  ).withDefault([]),
  createdAt: parseAsArrayOf(parseAsInteger).withDefault([]),
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and'),
})

export const createMesschema = z.object({
  name: z.string().min(1),
  capacityRoom: z.number().min(1),
  capacityEmploye: z.number().optional(),
  status: z.enum(mess.status.enumValues).optional(),
  location: z.string().optional(),
  deskripcion: z.string().optional(),
  type: z.enum(mess.type.enumValues).optional(),
})

// Form schema for update - same as create (id is passed separately)
export const updateMesschema = createMesschema.extend({
  id: z.number(),
})

// Full update schema with id (for server action only)

export const IdSchema = z.object({
  ids: z.number().array(),
})

export const UpdateMessTypesIdSchema = z.object({
  ids: z.number().array(),
  status: z.enum(mess.status.enumValues).optional(),
  statusCapacity: z.enum(mess.statusCapacity.enumValues).optional(),
  type: z.enum(mess.type.enumValues).optional(),
})

// Partial update schema for single row status/type updates (without requiring name/capacityRoom)
export const updateMessPartialSchema = z.object({
  id: z.number(),
  status: z.enum(mess.status.enumValues).optional(),
  type: z.enum(mess.type.enumValues).optional(),
  statusCapacity: z.enum(mess.statusCapacity.enumValues).optional(),
})

// ============================================
// PREPROCESS HELPERS
// ============================================

/**
 * Preprocess untuk mengubah CSV string menjadi array
 * Contoh: "active,not-active" → ["active", "not-active"]
 */
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

/**
 * Preprocess untuk number (handle string dari URL)
 */
const toNumber = (val: unknown): number | undefined => {
  if (typeof val === 'number') return val
  if (typeof val === 'string' && val.length > 0) {
    const num = Number(val)
    return isNaN(num) ? undefined : num
  }
  return undefined
}

/**
 * Preprocess untuk JSON string menjadi object/array
 * Contoh: '[{"id":"createdAt","desc":true}]' → [{id: "createdAt", desc: true}]
 */
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

/**
 * Zod schema untuk validasi search params di route
 *
 * FEATURES:
 * - Preprocess untuk handle CSV string → array (dari URL manual)
 * - Preprocess untuk handle JSON string → object (dari URL encoded)
 * - Optional fields dengan catch untuk graceful fallback
 */
export const messSearchSchema = z.object({
  // Filter flag - nullable enum
  filterFlag: z
    .preprocess(
      (v) => (v === 'null' || v === '' ? null : v),
      z.enum(['advancedFilters', 'commandFilters']).nullable().catch(null),
    )
    .optional(),

  // Pagination - preprocess string to number
  page: z.preprocess(toNumber, z.number().int().positive().catch(1)).optional(),
  perPage: z
    .preprocess(toNumber, z.number().int().positive().catch(10))
    .optional(),

  // Sort - handle JSON string
  sort: z
    .preprocess(
      jsonParse([{ id: 'createdAt', desc: true }]),
      z
        .array(z.object({ id: z.string(), desc: z.boolean() }))
        .catch([{ id: 'createdAt', desc: true }]),
    )
    .optional(),

  // Text search
  name: z.string().catch('').optional(),

  // Array filters - preprocess CSV string → array
  status: z
    .preprocess(csvToArray, z.array(z.enum(status.enumValues)).catch([]))
    .optional(),
  type: z
    .preprocess(csvToArray, z.array(z.enum(mess.type.enumValues)).catch([]))
    .optional(),
  statusCapacity: z
    .preprocess(
      csvToArray,
      z.array(z.enum(mess.statusCapacity.enumValues)).catch([]),
    )
    .optional(),

  // Date range - preprocess JSON atau CSV
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

  // Advanced filters - JSON array
  filters: z.preprocess(jsonParse([]), z.array(z.any()).catch([])).optional(),

  // Join operator
  joinOperator: z.enum(['and', 'or']).catch('and').optional(),
})

export type MessSearchParams = z.infer<typeof messSearchSchema>

export type GetMessSchema = Awaited<
  ReturnType<typeof searchParamsCacheMess.parse>
>

export type CreateMessSchema = z.infer<typeof createMesschema>
export type UpdateMessSchema = z.infer<typeof updateMesschema>

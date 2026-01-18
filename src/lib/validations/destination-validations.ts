// =============================================================================
// DESTINATION VALIDATIONS - SUASANA
// =============================================================================
// Zod schemas untuk destination entity dengan nuqs integration

import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server'
import * as z from 'zod'
import type { Destination } from '@/db/schema'
import {
  contentStatus,
  destinationCategory,
  destinationType,
  provinsiIndonesia,
} from '@/db/schema'

import { flagConfig } from '@/config/flag'
import { getFiltersStateParser, getSortingStateParser } from '@/lib/parsers'

// ============================================
// NUQS SEARCH PARAMS CACHE
// ============================================

export const searchParamsCacheDestination = createSearchParamsCache({
  filterFlag: parseAsStringEnum(
    flagConfig.featureFlags.map((flag) => flag.value),
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Destination>().withDefault([
    { id: 'createdAt', desc: true },
  ]),
  name: parseAsString.withDefault(''),
  status: parseAsArrayOf(
    parseAsStringEnum(contentStatus.enumValues),
  ).withDefault([]),
  type: parseAsArrayOf(
    parseAsStringEnum(destinationType.enumValues),
  ).withDefault([]),
  category: parseAsArrayOf(
    parseAsStringEnum(destinationCategory.enumValues),
  ).withDefault([]),
  provinsi: parseAsString.withDefault(''),
  createdAt: parseAsArrayOf(parseAsInteger).withDefault([]),
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and'),
})

// ============================================
// CREATE/UPDATE SCHEMAS
// ============================================

// Schema for form validation (accepts both File objects and URLs)
const fileOrUrlSchema = z.union([z.string().url(), z.instanceof(File)])

const filesOrUrlsSchema = z
  .array(z.union([z.string().url(), z.instanceof(File)]))
  .optional()

export const createDestinationSchema = z.object({
  name: z.string().min(1, 'Nama destinasi wajib diisi'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  type: z.enum(destinationType.enumValues).optional(),
  category: z.enum(destinationCategory.enumValues).optional(),
  provinsi: z.enum(provinsiIndonesia.enumValues, 'Provinsi tidak valid'),
  kabupatenKota: z.string().optional(),
  alamat: z.string().optional(),
  coverImage: fileOrUrlSchema,
  images: filesOrUrlsSchema,
  status: z.enum(contentStatus.enumValues).optional(),
})

export const updateDestinationSchema = createDestinationSchema
  .partial()
  .extend({
    id: z.number(),
  })

export const IdSchema = z.object({
  id: z.union([z.number(), z.array(z.number())]),
})

export const UpdateDestinationBulkSchema = z.object({
  id: z.union([z.number(), z.array(z.number())]),
  status: z.enum(contentStatus.enumValues),
})

export const updateDestinationPartialSchema = z.object({
  id: z.number(),
  status: z.enum(contentStatus.enumValues).optional(),
  type: z.enum(destinationType.enumValues).optional(),
})

// ============================================
// PREPROCESS HELPERS
// ============================================

const csvToArray = (val: unknown): Array<string> => {
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

export const destinationSearchSchema = z.object({
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

  name: z.string().catch('').optional(),

  status: z
    .preprocess(csvToArray, z.array(z.enum(contentStatus.enumValues)).catch([]))
    .optional(),

  type: z
    .preprocess(
      csvToArray,
      z.array(z.enum(destinationType.enumValues)).catch([]),
    )
    .optional(),

  category: z
    .preprocess(
      csvToArray,
      z.array(z.enum(destinationCategory.enumValues)).catch([]),
    )
    .optional(),

  provinsi: z.string().catch('').optional(),

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

export type DestinationSearchParams = z.infer<typeof destinationSearchSchema>
export type GetDestinationSchema = Awaited<
  ReturnType<typeof searchParamsCacheDestination.parse>
>
export type CreateDestinationSchema = z.infer<typeof createDestinationSchema>
export type UpdateDestinationSchema = z.infer<typeof updateDestinationSchema>

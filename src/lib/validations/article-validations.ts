// =============================================================================
// ARTICLE VALIDATIONS - SUASANA
// =============================================================================
// Zod schemas untuk article entity dengan nuqs integration

import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server'
import * as z from 'zod'
import type { Article } from '@/db/schema'
import { contentStatus } from '@/db/schema'

import { flagConfig } from '@/config/flag'
import { getFiltersStateParser, getSortingStateParser } from '@/lib/parsers'

// ============================================
// NUQS SEARCH PARAMS CACHE
// ============================================

export const searchParamsCacheArticle = createSearchParamsCache({
  filterFlag: parseAsStringEnum(
    flagConfig.featureFlags.map((flag) => flag.value),
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Article>().withDefault([
    { id: 'createdAt', desc: true },
  ]),
  title: parseAsString.withDefault(''),
  status: parseAsArrayOf(
    parseAsStringEnum(contentStatus.enumValues),
  ).withDefault([]),
  createdAt: parseAsArrayOf(parseAsInteger).withDefault([]),
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and'),
})

// ============================================
// CREATE/UPDATE SCHEMAS
// ============================================

// Schema for form validation (accepts both File objects and URLs)
const fileOrUrlSchema = z
  .union([z.string().url(), z.string().length(0), z.instanceof(File)])
  .nullable()
  .optional()

export const createArticleSchema = z.object({
  title: z.string().min(1, 'Judul artikel wajib diisi'),
  excerpt: z.string().optional(),
  content: z.string().min(50, 'Konten minimal 50 karakter'),
  coverImage: fileOrUrlSchema,
  status: z.enum(contentStatus.enumValues).optional(),
})

// Schema for server-side validation (only accepts string URLs, not File)
export const createArticleServerSchema = z.object({
  title: z.string().min(1, 'Judul artikel wajib diisi'),
  excerpt: z.string().optional(),
  content: z.string().min(50, 'Konten minimal 50 karakter'),
  coverImage: z.string().url().nullable().optional(),
  status: z.enum(contentStatus.enumValues).optional(),
})

export const updateArticleSchema = createArticleSchema.partial().extend({
  id: z.number(),
})

export const updateArticleServerSchema = createArticleServerSchema
  .partial()
  .extend({
    id: z.number(),
  })

export const ArticleIdSchema = z.object({
  id: z.number(),
})

export const UpdateArticleBulkSchema = z.object({
  ids: z.array(z.number()),
  status: z.enum(contentStatus.enumValues),
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

export const articleSearchSchema = z.object({
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

  title: z.string().catch('').optional(),

  status: z
    .preprocess(csvToArray, z.array(z.enum(contentStatus.enumValues)).catch([]))
    .optional(),

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

export type ArticleSearchParams = z.infer<typeof articleSearchSchema>
export type GetArticleSchema = Awaited<
  ReturnType<typeof searchParamsCacheArticle.parse>
>
export type CreateArticleSchema = z.infer<typeof createArticleSchema>
export type UpdateArticleSchema = z.infer<typeof updateArticleSchema>

// =============================================================================
// SUASANA VALIDATIONS - ZOD SCHEMAS
// =============================================================================
// Validation schemas untuk wisata & budaya lokal Indonesia
// =============================================================================

import { z } from 'zod'
import { contentStatus, destinationType } from '@/db/schema'

// =============================================================================
// DESTINATION VALIDATIONS (Wisata & Budaya)
// =============================================================================

export const createDestinationSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug wajib diisi')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan dash'),
  name: z.string().min(1, 'Nama destinasi wajib diisi').max(200),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  type: z.enum(destinationType.enumValues),
  provinsi: z.string().min(1, 'Provinsi wajib diisi').max(100),
  kabupatenKota: z.string().max(100).optional(),
  alamat: z.string().max(500).optional(),
  coverImage: z.string().url('URL cover image tidak valid').optional(),
  images: z.array(z.string().url()).max(10).optional(),
  status: z.enum(contentStatus.enumValues).optional(),
})

export const updateDestinationSchema = createDestinationSchema
  .partial()
  .extend({
    id: z.number(),
  })

export const destinationFilterSchema = z.object({
  search: z.string().optional(),
  type: z.enum(destinationType.enumValues).optional(),
  provinsi: z.string().optional(),
  status: z.enum(contentStatus.enumValues).optional(),
  sortBy: z.enum(['totalVote', 'createdAt', 'name']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
})

export type CreateDestinationInput = z.infer<typeof createDestinationSchema>
export type UpdateDestinationInput = z.infer<typeof updateDestinationSchema>
export type DestinationFilterInput = z.infer<typeof destinationFilterSchema>

// =============================================================================
// VOTE VALIDATIONS
// =============================================================================

export const createVoteSchema = z.object({
  destinationId: z.number().int().positive('ID destinasi wajib'),
})

export const deleteVoteSchema = z.object({
  destinationId: z.number().int().positive('ID destinasi wajib'),
})

export type CreateVoteInput = z.infer<typeof createVoteSchema>
export type DeleteVoteInput = z.infer<typeof deleteVoteSchema>

// =============================================================================
// COMMENT VALIDATIONS
// =============================================================================

export const createCommentSchema = z.object({
  destinationId: z.number().int().positive('ID destinasi wajib'),
  content: z
    .string()
    .min(1, 'Komentar tidak boleh kosong')
    .max(1000, 'Komentar maksimal 1000 karakter'),
  parentId: z.number().int().positive().optional(),
})

export const updateCommentSchema = z.object({
  id: z.number(),
  content: z
    .string()
    .min(1, 'Komentar tidak boleh kosong')
    .max(1000, 'Komentar maksimal 1000 karakter'),
})

export const deleteCommentSchema = z.object({
  id: z.number(),
})

export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>
export type DeleteCommentInput = z.infer<typeof deleteCommentSchema>

// =============================================================================
// ARTICLE VALIDATIONS
// =============================================================================

export const createArticleSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug wajib diisi')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan dash'),
  title: z.string().min(1, 'Judul wajib diisi').max(200),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(50, 'Konten minimal 50 karakter'),
  coverImage: z.string().url('URL cover image tidak valid').optional(),
  status: z.enum(contentStatus.enumValues).optional(),
})

export const updateArticleSchema = createArticleSchema.partial().extend({
  id: z.number(),
})

export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>

// =============================================================================
// UTILITY SCHEMAS
// =============================================================================

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

export const idsSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1, 'Minimal 1 ID'),
})

export type PaginationInput = z.infer<typeof paginationSchema>
export type IdsInput = z.infer<typeof idsSchema>

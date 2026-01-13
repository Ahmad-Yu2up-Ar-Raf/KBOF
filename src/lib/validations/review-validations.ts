// =============================================================================
// REVIEW VALIDATIONS - SUASANA
// =============================================================================
// Zod schemas for review form validation
// =============================================================================

import * as z from 'zod'

// ============================================
// CREATE REVIEW SCHEMA (for form)
// ============================================

export const createReviewFormSchema = z.object({
  destinationId: z.number().int().positive('ID destinasi tidak valid'),
  rating: z
    .number()
    .int()
    .min(1, 'Rating minimal 1 bintang')
    .max(5, 'Rating maksimal 5 bintang'),
  title: z
    .string()
    .max(200, 'Judul maksimal 200 karakter')
    .optional()
    .or(z.literal('')),
  content: z
    .string()
    .max(2000, 'Ulasan maksimal 2000 karakter')
    .optional()
    .or(z.literal('')),
  visitDate: z.date().optional().nullable(),
})

// ============================================
// UPDATE REVIEW SCHEMA (for form)
// ============================================

export const updateReviewFormSchema = z.object({
  id: z.number().int().positive('ID review tidak valid'),
  rating: z
    .number()
    .int()
    .min(1, 'Rating minimal 1 bintang')
    .max(5, 'Rating maksimal 5 bintang')
    .optional(),
  title: z
    .string()
    .max(200, 'Judul maksimal 200 karakter')
    .optional()
    .or(z.literal('')),
  content: z
    .string()
    .max(2000, 'Ulasan maksimal 2000 karakter')
    .optional()
    .or(z.literal('')),
  visitDate: z.date().optional().nullable(),
})

// ============================================
// TYPE EXPORTS
// ============================================

export type CreateReviewFormSchema = z.infer<typeof createReviewFormSchema>
export type UpdateReviewFormSchema = z.infer<typeof updateReviewFormSchema>

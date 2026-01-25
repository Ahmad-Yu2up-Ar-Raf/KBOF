// src/lib/validations/auth-validations.ts
import { z } from 'zod'

// ✅ Magic Link Schema - email only
export const magicLinkSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

export type MagicLinkSchema = z.infer<typeof magicLinkSchema>

// Keep other schemas if needed (changePassword, updateSchema, etc.)
export const changePassword = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const updateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
})

export type ChangePassword = z.infer<typeof changePassword>
export type UpdateSchema = z.infer<typeof updateSchema>

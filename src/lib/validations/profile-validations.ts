// src/lib/validations/profile-validations.ts
import { z } from 'zod'

// Cropped image data structure (base64 + metadata)
export const croppedImageSchema = z.object({
  filename: z.string(),
  dataUrl: z
    .string()
    .regex(
      /^data:image\/(png|jpeg|jpg|webp|gif);base64,/,
      'Invalid base64 image',
    ),
  // width/height/mime are optional when using an initial image URL placeholder
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  mime: z
    .string()
    .regex(/^image\/(png|jpeg|jpg|webp|gif)$/)
    .optional(),
})

export type CroppedImageData = z.infer<typeof croppedImageSchema>

// Profile update schema
export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  image: croppedImageSchema.nullable().optional(),
})

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>

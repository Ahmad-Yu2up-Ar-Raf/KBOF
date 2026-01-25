// src/lib/server/profile-actions.ts
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '@/db'
import { user } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { authServerMiddleware } from '@/lib/middleware'
import { uploadToCloudinary } from '../cloudinary/cloudinary-upload-helper'
import { deleteCloudinaryFileByUrl } from '../cloudinary'

// ============================================
// VALIDATION SCHEMAS
// ============================================

const uploadCroppedImageSchema = z.object({
  dataUrl: z.string().regex(/^data:image/),
  folder: z.string().default('suasana/profiles'),
  filename: z.string().optional(),
})

const updateProfileSchema = z.object({
  userId: z.string(),
  name: z.string().min(1).max(100),
  // single avatar URL
  avatarUrl: z.string().url().nullable().optional(),
})

// ============================================
// UPLOAD CROPPED IMAGE ACTION
// ============================================

/**
 * Upload base64 cropped image to Cloudinary
 * Returns URL + metadata
 */
export const uploadCroppedImageServer = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(uploadCroppedImageSchema.parse)
  .handler(async ({ data, context }) => {
    try {
      console.log('📤 Uploading cropped image to Cloudinary...')

      const result = await uploadToCloudinary({
        dataUrl: data.dataUrl,
        folder: `${data.folder}/${context.user.id}`,
        filename: data.filename,
      })

      console.log('✅ Image uploaded:', result.secure_url)

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      }
    } catch (error) {
      console.error('❌ Cloudinary upload failed:', error)
      throw new Error('Failed to upload image')
    }
  })

// ============================================
// UPDATE USER PROFILE ACTION
// ============================================

/**
 * Update user profile in database
 * Only updates name, avatar, and images
 * Email cannot be changed (passwordless auth)
 */
export const updateUserProfileServer = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(updateProfileSchema.parse)
  .handler(async ({ data, context }) => {
    try {
      // Verify user can only update their own profile
      if (data.userId !== context.user.id) {
        throw new Error('Unauthorized: Cannot update another user profile')
      }

      console.log('💾 Updating user profile in DB...')

      // Use single avatar URL field
      const avatar = data.avatarUrl ?? null

      const [updated] = await db
        .update(user)
        .set({
          name: data.name,
          image: avatar,
          updatedAt: new Date(),
        })
        .where(eq(user.id, data.userId))
        .returning()

      if (!updated) {
        throw new Error('Failed to update user profile')
      }

      console.log('✅ Profile updated successfully')

      return {
        success: true,
        user: {
          id: updated.id,
          name: updated.name,
          image: updated.image,
        },
      }
    } catch (error) {
      console.error('❌ Profile update failed:', error)
      throw new Error(
        error instanceof Error ? error.message : 'Failed to update profile',
      )
    }
  })

// ============================================
// TYPE EXPORTS
// ============================================

export type UploadCroppedImageInput = z.infer<typeof uploadCroppedImageSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

// ============================================
// DELETE CLOUDINARY FILE (server action)
// ============================================

export const deleteCloudinaryFileServer = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(z.object({ url: z.string().url() }).parse)
  .handler(async ({ data }) => {
    try {
      await deleteCloudinaryFileByUrl({ data: { url: data.url } })
      return { success: true }
    } catch (err) {
      console.error('Failed to delete cloudinary file', err)
      throw new Error('Failed to delete file')
    }
  })

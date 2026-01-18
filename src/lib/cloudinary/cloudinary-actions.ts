// =============================================================================
// CLOUDINARY SERVER ACTIONS - SUASANA
// =============================================================================
// Server-side actions for Cloudinary file upload management.

import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import {
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
  extractPublicIdFromUrl,
  generateUploadSignature,
} from './cloudinary-config'
import { authServerMiddleware } from '@/lib/middleware'

// ============================================
// VALIDATION SCHEMAS
// ============================================

const generateSignatureSchema = z.object({
  folder: z.string().optional(),
  publicId: z.string().optional(),
})

const deleteFileSchema = z.object({
  publicId: z.string().min(1, 'Public ID is required'),
  resourceType: z.enum(['image', 'video', 'raw']).optional().default('image'),
})

const deleteFilesSchema = z.object({
  publicIds: z.array(z.string()).min(1, 'At least one public ID is required'),
  resourceType: z.enum(['image', 'video', 'raw']).optional().default('image'),
})

const deleteByUrlSchema = z.object({
  url: z.string().url('Invalid URL'),
  resourceType: z.enum(['image', 'video', 'raw']).optional().default('image'),
})

const deleteByUrlsSchema = z.object({
  urls: z.array(z.string().url()).min(1, 'At least one URL is required'),
  resourceType: z.enum(['image', 'video', 'raw']).optional().default('image'),
})

// ============================================
// GENERATE SIGNATURE ACTION
// ============================================

/**
 * Generate a signed signature for client-side direct upload to Cloudinary.
 * This allows secure uploads without exposing API secret on client.
 */
export const generateCloudinarySignature = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(generateSignatureSchema)
  .handler(async ({ data, context }) => {
    try {
      const userId = context.user.id

      // Create a folder structure: suasana/users/{userId}/{folder}
      const folder = data.folder
        ? `suasana/users/${userId}/${data.folder}`
        : `suasana/users/${userId}/uploads`

      const signatureData = generateUploadSignature(folder, {
        publicId: data.publicId,
      })

      return {
        success: true,
        data: signatureData,
      }
    } catch (error) {
      console.error('Failed to generate Cloudinary signature:', error)
      throw new Error('Failed to generate upload signature')
    }
  })

// ============================================
// DELETE SINGLE FILE ACTION
// ============================================

/**
 * Delete a single file from Cloudinary by public_id
 */
export const deleteCloudinaryFile = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(deleteFileSchema)
  .handler(async ({ data }) => {
    try {
      const result = await deleteFromCloudinary(
        data.publicId,
        data.resourceType,
      )

      return {
        success: true,
        result: result.result,
      }
    } catch (error) {
      console.error('Failed to delete Cloudinary file:', error)
      throw new Error('Failed to delete file from storage')
    }
  })

// ============================================
// DELETE MULTIPLE FILES ACTION
// ============================================

/**
 * Delete multiple files from Cloudinary by public_ids
 */
export const deleteCloudinaryFiles = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(deleteFilesSchema)
  .handler(async ({ data }) => {
    try {
      const result = await deleteMultipleFromCloudinary(
        data.publicIds,
        data.resourceType,
      )

      return {
        success: true,
        deleted: result.deleted,
      }
    } catch (error) {
      console.error('Failed to delete Cloudinary files:', error)
      throw new Error('Failed to delete files from storage')
    }
  })

// ============================================
// DELETE BY URL ACTION
// ============================================

/**
 * Delete a file from Cloudinary by its URL
 * Automatically extracts the public_id from the URL
 */
export const deleteCloudinaryFileByUrl = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(deleteByUrlSchema)
  .handler(async ({ data }) => {
    try {
      const publicId = extractPublicIdFromUrl(data.url)

      if (!publicId) {
        throw new Error('Could not extract public_id from URL')
      }

      const result = await deleteFromCloudinary(publicId, data.resourceType)

      return {
        success: true,
        result: result.result,
        publicId,
      }
    } catch (error) {
      console.error('Failed to delete Cloudinary file by URL:', error)
      throw new Error('Failed to delete file from storage')
    }
  })

// ============================================
// DELETE MULTIPLE BY URLS ACTION
// ============================================

/**
 * Delete multiple files from Cloudinary by their URLs
 */
export const deleteCloudinaryFilesByUrls = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(deleteByUrlsSchema)
  .handler(async ({ data }) => {
    try {
      const publicIds = data.urls
        .map(extractPublicIdFromUrl)
        .filter((id): id is string => id !== null)

      if (publicIds.length === 0) {
        return {
          success: true,
          deleted: {},
          message: 'No valid public_ids found in URLs',
        }
      }

      const result = await deleteMultipleFromCloudinary(
        publicIds,
        data.resourceType,
      )

      return {
        success: true,
        deleted: result.deleted,
        processedCount: publicIds.length,
      }
    } catch (error) {
      console.error('Failed to delete Cloudinary files by URLs:', error)
      throw new Error('Failed to delete files from storage')
    }
  })

// ============================================
// EXPORT UTILITY TYPES
// ============================================

export type GenerateSignatureInput = z.infer<typeof generateSignatureSchema>
export type DeleteFileInput = z.infer<typeof deleteFileSchema>
export type DeleteFilesInput = z.infer<typeof deleteFilesSchema>
export type DeleteByUrlInput = z.infer<typeof deleteByUrlSchema>
export type DeleteByUrlsInput = z.infer<typeof deleteByUrlsSchema>

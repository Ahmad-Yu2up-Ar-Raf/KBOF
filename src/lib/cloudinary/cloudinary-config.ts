// =============================================================================
// CLOUDINARY SERVER CONFIGURATION - SUASANA
// =============================================================================
// Server-side Cloudinary configuration for signed uploads and file management.
// This file should ONLY be imported in server-side code!

import { v2 as cloudinary } from 'cloudinary'

// Ensure this only runs on server
if (typeof window !== 'undefined') {
  throw new Error(
    '❌ Cloudinary server config attempted in browser! ' +
      'This module should only be imported in server-side code.',
  )
}

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

// ============================================
// CLOUDINARY HELPER FUNCTIONS
// ============================================

/**
 * Generate a signed upload signature for client-side direct upload
 */
export function generateUploadSignature(
  folder?: string,
  options: {
    publicId?: string
    transformation?: string
    eager?: string
    uploadPreset?: string
  } = {},
) {
  const timestamp = Math.round(new Date().getTime() / 1000)

  const paramsToSign: Record<string, string | number> = {
    timestamp,
  }

  // Add optional parameters
  if (folder) paramsToSign.folder = folder
  if (options.publicId) paramsToSign.public_id = options.publicId
  if (options.transformation)
    paramsToSign.transformation = options.transformation
  if (options.eager) paramsToSign.eager = options.eager
  if (options.uploadPreset) paramsToSign.upload_preset = options.uploadPreset

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!,
  )

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    folder,
  }
}

/**
 * Delete a single file from Cloudinary by public_id
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image',
): Promise<{ result: string }> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    })
    return result
  } catch (error) {
    console.error(`Failed to delete ${publicId} from Cloudinary:`, error)
    throw error
  }
}

/**
 * Delete multiple files from Cloudinary by public_ids
 */
export async function deleteMultipleFromCloudinary(
  publicIds: Array<string>,
  resourceType: 'image' | 'video' | 'raw' = 'image',
): Promise<{ deleted: Record<string, string> }> {
  try {
    if (publicIds.length === 0) return { deleted: {} }

    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: resourceType,
    })
    return result
  } catch (error) {
    console.error('Failed to delete multiple files from Cloudinary:', error)
    throw error
  }
}

/**
 * Extract public_id from Cloudinary URL
 * Example: https://res.cloudinary.com/df94cviif/image/upload/v1234567890/folder/file.jpg
 * Returns: folder/file
 */
export function extractPublicIdFromUrl(url: string): string | null {
  if (!url) return null

  try {
    // Match the pattern: /upload/v{timestamp}/{public_id}.{extension}
    const regex = /\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/
    const match = url.match(regex)

    if (match && match[1]) {
      // Remove file extension if present
      return match[1].replace(/\.[^.]+$/, '')
    }

    return null
  } catch {
    return null
  }
}

/**
 * Get optimized delivery URL with transformations
 */
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'auto'
    quality?: 'auto' | number
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png'
  } = {},
): string {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options

  const transformations: Array<string> = []

  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  if (crop) transformations.push(`c_${crop}`)
  if (quality) transformations.push(`q_${quality}`)
  if (format) transformations.push(`f_${format}`)

  const transformation = transformations.join(',')
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/${publicId}`
}

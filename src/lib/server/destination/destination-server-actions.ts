// =============================================================================
// DESTINATION SERVER ACTIONS - SUASANA
// =============================================================================
// Server-side mutations (CRUD) untuk destination entity

import { createServerFn } from '@tanstack/react-start'
import { eq, inArray, and } from 'drizzle-orm'
import * as schema from '@/db/schema'
import { authServerMiddleware } from '@/lib/middleware'
import * as z from 'zod'
import {
  createDestinationSchema,
  updateDestinationSchema,
  IdSchema,
  UpdateDestinationBulkSchema,
} from '@/lib/validations/destination-validations'
import { generateSlug } from '@/lib/utils/destination-utils'
import {
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
  extractPublicIdFromUrl,
} from '@/lib/cloudinary/cloudinary-config'

// Dynamic import to prevent db from being bundled in client
const getDb = async () => {
  const { db } = await import('@/db')
  return db
}

const destination = schema.destination

// ============================================
// HELPER: Delete images from Cloudinary
// ============================================

async function cleanupCloudinaryImages(
  coverImage: string | null | undefined,
  images: string | null | undefined,
) {
  const publicIdsToDelete: string[] = []

  // Extract public_id from cover image
  if (coverImage) {
    const publicId = extractPublicIdFromUrl(coverImage)
    if (publicId) publicIdsToDelete.push(publicId)
  }

  // Extract public_ids from gallery images
  if (images) {
    try {
      const imageArray = JSON.parse(images) as string[]
      for (const url of imageArray) {
        const publicId = extractPublicIdFromUrl(url)
        if (publicId) publicIdsToDelete.push(publicId)
      }
    } catch {
      // Ignore JSON parse errors
    }
  }

  // Delete all images from Cloudinary
  if (publicIdsToDelete.length > 0) {
    try {
      await deleteMultipleFromCloudinary(publicIdsToDelete, 'image')
      console.log(`Deleted ${publicIdsToDelete.length} images from Cloudinary`)
    } catch (error) {
      // Log but don't fail the operation if Cloudinary cleanup fails
      console.error('Failed to cleanup Cloudinary images:', error)
    }
  }
}

// ============================================
// ADD DESTINATION
// ============================================

export const addDestination = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(createDestinationSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const userId = context.user!.id

    const slug = generateSlug(data.name)

    // Don't set id - let database auto-generate it
    // Ensure coverImage is a string (not File or null)
    const coverImageValue =
      typeof data.coverImage === 'string' ? data.coverImage : ''

    const newDestination = {
      userId,
      slug,
      name: data.name,
      description: data.description ?? '',
      type: data.type ?? 'wisata-alam',
      category: data.category ?? 'pariwisata',
      provinsi: data.provinsi,
      kabupatenKota: data.kabupatenKota ?? '',
      alamat: data.alamat ?? '',
      coverImage: coverImageValue,
      images: JSON.stringify(data.images ?? []),
      status: data.status ?? 'draft',
    }

    const result = await db
      .insert(destination)
      .values(newDestination)
      .returning({ id: destination.id })

    return { success: true, id: result[0]?.id }
  })

// ============================================
// UPDATE DESTINATION
// ============================================

export const updateDestination = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(updateDestinationSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const userId = context.user!.id

    // Check ownership
    const existing = await db.query.destination.findFirst({
      where: and(eq(destination.id, data.id), eq(destination.userId, userId)),
    })

    if (!existing) {
      throw new Error('Destination not found or access denied')
    }

    // ============================================
    // CLOUDINARY CLEANUP: Handle image changes
    // ============================================

    // Check if cover image changed - delete old one
    if (
      data.coverImage !== undefined &&
      data.coverImage !== existing.coverImage
    ) {
      if (existing.coverImage) {
        const publicId = extractPublicIdFromUrl(existing.coverImage)
        if (publicId) {
          try {
            await deleteFromCloudinary(publicId, 'image')
            console.log(`Deleted old cover image: ${publicId}`)
          } catch (error) {
            console.error('Failed to delete old cover image:', error)
          }
        }
      }
    }

    // Check if gallery images changed - delete removed ones
    if (data.images !== undefined) {
      const oldImages: string[] = existing.images
        ? JSON.parse(existing.images as string)
        : []
      const newImages: string[] = (data.images || []).filter(
        (img): img is string => typeof img === 'string',
      )

      // Find images that were removed
      const removedImages = oldImages.filter((url) => !newImages.includes(url))

      // Delete removed images from Cloudinary
      if (removedImages.length > 0) {
        const publicIds = removedImages
          .map(extractPublicIdFromUrl)
          .filter((id): id is string => id !== null)

        if (publicIds.length > 0) {
          try {
            await deleteMultipleFromCloudinary(publicIds, 'image')
            console.log(`Deleted ${publicIds.length} removed gallery images`)
          } catch (error) {
            console.error('Failed to delete removed gallery images:', error)
          }
        }
      }
    }

    // Build update object, regenerate slug if name changed
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date(),
    }

    // Convert images array to JSON string if provided
    if (data.images) {
      updateData.images = JSON.stringify(data.images)
    }

    if (data.name && data.name !== existing.name) {
      updateData.slug = generateSlug(data.name)
    }

    // Remove id from update data
    delete updateData.id

    await db
      .update(destination)
      .set(updateData)
      .where(and(eq(destination.id, data.id), eq(destination.userId, userId)))

    return { success: true }
  })

// ============================================
// DELETE DESTINATION
// ============================================

export const deleteDestination = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(IdSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const userId = context.user!.id

    // Single or array of IDs
    const ids = Array.isArray(data.id) ? data.id : [data.id]

    // ============================================
    // CLOUDINARY CLEANUP: Fetch destinations to delete their images
    // ============================================

    const destinationsToDelete = await db.query.destination.findMany({
      where: and(inArray(destination.id, ids), eq(destination.userId, userId)),
      columns: {
        id: true,
        coverImage: true,
        images: true,
      },
    })

    // If some requested IDs are not owned by the user, reject
    if (destinationsToDelete.length !== ids.length) {
      throw new Error('Anda tidak memiliki izin untuk mengedit data ini.')
    }

    // Delete images from Cloudinary for each destination
    for (const dest of destinationsToDelete) {
      await cleanupCloudinaryImages(dest.coverImage, dest.images)
    }

    // Delete destinations from database
    await db
      .delete(destination)
      .where(and(inArray(destination.id, ids), eq(destination.userId, userId)))

    return { success: true }
  })

// ============================================
// BULK UPDATE STATUS
// ============================================

export const updateBulkDestinationStatus = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(UpdateDestinationBulkSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const userId = context.user!.id

    const ids = Array.isArray(data.id) ? data.id : [data.id]

    // Verify ownership of all destinations
    const owned = await db.query.destination.findMany({
      where: and(inArray(destination.id, ids), eq(destination.userId, userId)),
      columns: { id: true },
    })

    if (owned.length !== ids.length) {
      throw new Error('Anda tidak memiliki izin untuk mengedit data ini.')
    }

    await db
      .update(destination)
      .set({
        status: data.status,
        updatedAt: new Date(),
      })
      .where(and(inArray(destination.id, ids), eq(destination.userId, userId)))

    return { success: true }
  })

// ============================================
// GET SINGLE DESTINATION
// ============================================

const getSingleDestinationSchema = z.object({
  id: z.number(),
})

export const getDestinationById = createServerFn({ method: 'GET' })
  .middleware([authServerMiddleware])
  .inputValidator(getSingleDestinationSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const userId = context.user!.id

    const result = await db.query.destination.findFirst({
      where: and(eq(destination.id, data.id), eq(destination.userId, userId)),
    })

    if (!result) {
      throw new Error('Destination not found or access denied')
    }

    return result
  })

// ============================================
// GET USER DESTINATIONS
// ============================================

const getUserDestinationsSchema = z.object({
  status: z.enum(['published', 'draft', 'all']).optional().default('all'),
})

export const getUserDestinationsByStatus = createServerFn({ method: 'GET' })
  .middleware([authServerMiddleware])
  .inputValidator(getUserDestinationsSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const userId = context.user!.id

    const conditions = [eq(destination.userId, userId)]

    if (data.status && data.status !== 'all') {
      conditions.push(eq(destination.status, data.status))
    }

    const results = await db.query.destination.findMany({
      where: and(...conditions),
      orderBy: (destination, { desc }) => [desc(destination.createdAt)],
      columns: {
        id: true,
        name: true,
        slug: true,
        category: true,
        provinsi: true,
        status: true,
        coverImage: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return results
  })

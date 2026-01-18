// =============================================================================
// DESTINATION SERVER ACTIONS - SUASANA
// =============================================================================
// Server-side mutations (CRUD) untuk destination entity

import { createServerFn } from '@tanstack/react-start'
import { and, eq, inArray } from 'drizzle-orm'
import * as z from 'zod'
import * as schema from '@/db/schema'
import {
  authServerMiddleware,
  superAdminServerMiddleware,
} from '@/lib/middleware'
import {
  IdSchema,
  UpdateDestinationBulkSchema,
  createDestinationSchema,
  updateDestinationSchema,
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
  const publicIdsToDelete: Array<string> = []

  // Extract public_id from cover image
  if (coverImage) {
    const publicId = extractPublicIdFromUrl(coverImage)
    if (publicId) publicIdsToDelete.push(publicId)
  }

  // Extract public_ids from gallery images
  if (images) {
    try {
      const imageArray = JSON.parse(images) as Array<string>
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
    const userId = context.user.id
    const role = context.user?.role

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
      status: data.status ?? 'pending',
    }

    // Non-superAdmin users cannot publish directly; force pending (request)
    if (role !== 'superAdmin') {
      newDestination.status = 'pending'
    }

    // If superAdmin created as published, set publishedAt; otherwise ensure null
    if (role === 'superAdmin' && newDestination.status === 'published') {
      ;(newDestination as any).publishedAt = new Date()
    } else {
      ;(newDestination as any).publishedAt = null
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
    const userId = context.user.id
    const role = context.user?.role

    // Check ownership (superAdmin can edit any)
    const existing =
      role === 'superAdmin'
        ? await db.query.destination.findFirst({
            where: eq(destination.id, data.id),
          })
        : await db.query.destination.findFirst({
            where: and(
              eq(destination.id, data.id),
              eq(destination.userId, userId),
            ),
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
      const oldImages: Array<string> = existing.images
        ? JSON.parse(existing.images)
        : []
      const newImages: Array<string> = (data.images || []).filter(
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

    // Prevent non-superAdmin from changing status
    if (role !== 'superAdmin' && 'status' in updateData) {
      delete updateData.status
    }

    // If superAdmin sets status to published, record publishedAt
    if (role === 'superAdmin' && (updateData as any).status === 'published') {
      ;(updateData as any).publishedAt = new Date()
    } else if (
      role === 'superAdmin' &&
      (updateData as any).status &&
      (updateData as any).status !== 'published'
    ) {
      // If superAdmin changes status away from published, clear publishedAt
      ;(updateData as any).publishedAt = null
    }

    // Remove id from update data
    delete updateData.id

    const whereClause =
      role === 'superAdmin'
        ? eq(destination.id, data.id)
        : and(eq(destination.id, data.id), eq(destination.userId, userId))

    await db.update(destination).set(updateData).where(whereClause)

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
    const userId = context.user.id
    const role = context.user?.role

    // Single or array of IDs
    const ids = Array.isArray(data.id) ? data.id : [data.id]

    // Super admin: hard delete (cleanup images)
    if (role === 'superAdmin') {
      const destinationsToDelete = await db.query.destination.findMany({
        where: inArray(destination.id, ids),
        columns: { id: true, coverImage: true, images: true },
      })

      // Delete images from Cloudinary for each destination
      for (const dest of destinationsToDelete) {
        await cleanupCloudinaryImages(dest.coverImage, dest.images)
      }

      await db.delete(destination).where(inArray(destination.id, ids))

      return { success: true }
    }

    // Non-superAdmin: only allow owner to mark as 'cancel' (soft-cancel)
    const owned = await db.query.destination.findMany({
      where: and(inArray(destination.id, ids), eq(destination.userId, userId)),
      columns: { id: true },
    })

    if (owned.length !== ids.length) {
      throw new Error('Anda tidak memiliki izin untuk menghapus data ini.')
    }

    await db
      .update(destination)
      .set({ status: 'cancel', updatedAt: new Date() })
      .where(and(inArray(destination.id, ids), eq(destination.userId, userId)))

    return { success: true }
  })

// ============================================
// BULK UPDATE STATUS
// ============================================

export const updateBulkDestinationStatus = createServerFn({ method: 'POST' })
  .middleware([superAdminServerMiddleware])
  .inputValidator(UpdateDestinationBulkSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const ids = Array.isArray(data.id) ? data.id : [data.id]

    const updateData: Record<string, unknown> = {
      status: data.status,
      updatedAt: new Date(),
    }
    if (data.status === 'published') {
      updateData.publishedAt = new Date()
    } else {
      // clearing publishedAt when not published
      updateData.publishedAt = null
    }

    await db
      .update(destination)
      .set(updateData)
      .where(inArray(destination.id, ids))

    return { success: true }
  })

// ============================================
// BULK UPDATE TYPE
// ============================================

export const updateBulkDestinationType = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(
    z.object({
      ids: z.array(z.number()),
      type: z.enum(schema.destinationType.enumValues),
    }),
  )
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const userId = context.user.id
    const role = context.user?.role

    const ids = data.ids

    if (role === 'superAdmin') {
      await db
        .update(destination)
        .set({ type: data.type, updatedAt: new Date() })
        .where(inArray(destination.id, ids))
      return { success: true }
    }

    // For non-superAdmin, verify ownership first
    const owned = await db.query.destination.findMany({
      where: and(inArray(destination.id, ids), eq(destination.userId, userId)),
      columns: { id: true },
    })

    if (owned.length !== ids.length) {
      throw new Error('Anda tidak memiliki izin untuk mengedit data ini.')
    }

    await db
      .update(destination)
      .set({ type: data.type, updatedAt: new Date() })
      .where(and(inArray(destination.id, ids), eq(destination.userId, userId)))

    return { success: true }
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
    const userId = context.user.id

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
        publishedAt: true,
        coverImage: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return results
  })

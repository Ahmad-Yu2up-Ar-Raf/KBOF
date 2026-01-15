// =============================================================================
// ARTICLE SERVER ACTIONS - SUASANA
// =============================================================================
// Server-side mutations (CRUD) untuk article entity

import { createServerFn } from '@tanstack/react-start'
import { eq, inArray, and } from 'drizzle-orm'
import * as schema from '@/db/schema'
import { authServerMiddleware } from '@/lib/middleware'
import * as z from 'zod'
import {
  createArticleServerSchema,
  updateArticleServerSchema,
  ArticleIdSchema,
  UpdateArticleBulkSchema,
} from '@/lib/validations/article-validations'
import { generateSlug } from '@/lib/utils/destination-utils'
import {
  deleteFromCloudinary,
  extractPublicIdFromUrl,
} from '@/lib/cloudinary/cloudinary-config'

// Dynamic import to prevent db from being bundled in client
const getDb = async () => {
  const { db } = await import('@/db')
  return db
}

const article = schema.article

// ============================================
// HELPER: Delete cover image from Cloudinary
// ============================================

async function cleanupArticleCoverImage(coverImage: string | null | undefined) {
  if (coverImage) {
    const publicId = extractPublicIdFromUrl(coverImage)
    if (publicId) {
      try {
        await deleteFromCloudinary(publicId, 'image')
        console.log(`Deleted article cover image: ${publicId}`)
      } catch (error) {
        console.error('Failed to delete article cover image:', error)
      }
    }
  }
}

// ============================================
// ADD ARTICLE
// ============================================

export const addArticle = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(createArticleServerSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const authorId = context.user!.id

    const slug = generateSlug(data.title)

    // Extract excerpt from content if not provided (first 160 chars)
    const excerpt =
      data.excerpt ||
      data.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'

    const newArticle = {
      authorId,
      slug,
      title: data.title,
      excerpt,
      content: data.content,
      coverImage: data.coverImage || null,
      status: data.status ?? 'draft',
      publishedAt: data.status === 'published' ? new Date() : null,
    }

    const result = await db
      .insert(article)
      .values(newArticle)
      .returning({ id: article.id })

    return { success: true, id: result[0]?.id }
  })

// ============================================
// UPDATE ARTICLE
// ============================================

export const updateArticle = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(updateArticleServerSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const authorId = context.user!.id

    // Check ownership
    const existing = await db.query.article.findFirst({
      where: and(eq(article.id, data.id), eq(article.authorId, authorId)),
    })

    if (!existing) {
      throw new Error('Article not found or access denied')
    }

    // ============================================
    // CLOUDINARY CLEANUP: Handle cover image change
    // ============================================

    if (
      data.coverImage !== undefined &&
      data.coverImage !== existing.coverImage
    ) {
      await cleanupArticleCoverImage(existing.coverImage)
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date(),
    }

    // Regenerate slug if title changed
    if (data.title && data.title !== existing.title) {
      updateData.slug = generateSlug(data.title)
    }

    // Set publishedAt when status changes to published
    if (data.status === 'published' && existing.status !== 'published') {
      updateData.publishedAt = new Date()
    }

    // Remove id from update data
    delete updateData.id

    await db.update(article).set(updateData).where(eq(article.id, data.id))

    return { success: true }
  })

// ============================================
// DELETE ARTICLE
// ============================================

export const deleteArticle = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(ArticleIdSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const authorId = context.user!.id

    // Check ownership and get article data for cleanup
    const existing = await db.query.article.findFirst({
      where: and(eq(article.id, data.id), eq(article.authorId, authorId)),
    })

    if (!existing) {
      throw new Error('Article not found or access denied')
    }

    // Delete cover image from Cloudinary
    await cleanupArticleCoverImage(existing.coverImage)

    // Delete from database
    await db.delete(article).where(eq(article.id, data.id))

    return { success: true }
  })

// ============================================
// BULK UPDATE STATUS
// ============================================

export const updateBulkArticleStatus = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(UpdateArticleBulkSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const authorId = context.user!.id

    // Verify ownership of all articles
    const articles = await db.query.article.findMany({
      where: and(inArray(article.id, data.ids), eq(article.authorId, authorId)),
    })

    if (articles.length !== data.ids.length) {
      throw new Error('Some articles not found or access denied')
    }

    const updateData: Record<string, unknown> = {
      status: data.status,
      updatedAt: new Date(),
    }

    // Set publishedAt for newly published articles
    if (data.status === 'published') {
      updateData.publishedAt = new Date()
    }

    await db
      .update(article)
      .set(updateData)
      .where(and(inArray(article.id, data.ids), eq(article.authorId, authorId)))

    return { success: true, count: data.ids.length }
  })

// ============================================
// BULK DELETE
// ============================================

export const deleteBulkArticles = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(z.object({ ids: z.array(z.number()) }))
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const authorId = context.user!.id

    // Get articles for Cloudinary cleanup
    const articlesToDelete = await db.query.article.findMany({
      where: and(inArray(article.id, data.ids), eq(article.authorId, authorId)),
    })

    if (articlesToDelete.length !== data.ids.length) {
      throw new Error('Some articles not found or access denied')
    }

    // Cleanup cover images from Cloudinary
    for (const a of articlesToDelete) {
      await cleanupArticleCoverImage(a.coverImage)
    }

    // Delete from database
    await db
      .delete(article)
      .where(and(inArray(article.id, data.ids), eq(article.authorId, authorId)))

    return { success: true, count: data.ids.length }
  })

// ============================================
// GET USER ARTICLES
// ============================================

const getUserArticlesSchema = z.object({
  status: z.enum(['published', 'draft', 'all']).optional().default('all'),
})

export const getUserArticlesByStatus = createServerFn({ method: 'GET' })
  .middleware([authServerMiddleware])
  .inputValidator(getUserArticlesSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const authorId = context.user!.id

    const conditions = [eq(article.authorId, authorId)]

    if (data.status && data.status !== 'all') {
      conditions.push(eq(article.status, data.status))
    }

    const results = await db.query.article.findMany({
      where: and(...conditions),
      orderBy: (article, { desc }) => [desc(article.createdAt)],
      columns: {
        id: true,
        title: true,
        slug: true,
        status: true,
        coverImage: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return results
  })

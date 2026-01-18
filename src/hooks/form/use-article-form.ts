import { useCallback } from 'react'
import { useAppForm } from './use-form'
import type { Article } from '@/db/schema'
import type { CreateArticleSchema } from '@/lib/validations/article-validations'
import { createArticleSchema } from '@/lib/validations/article-validations'
import {
  useAddArticleMutation,
  useUpdateArticleMutation,
} from '@/hooks/use-article-mutations'
import { useCloudinaryUpload } from '@/hooks/use-cloudinary-upload'

// =============================================================================
// ARTICLE FORM HOOKS - SUASANA
// =============================================================================

export type CreateArticleFormReturn = ReturnType<typeof useCreateArticleForm>
export type UpdateArticleFormReturn = ReturnType<typeof useUpdateArticleForm>
export type ArticleFormReturn = CreateArticleFormReturn

// Helper to check if value is a File
function isFile(value: unknown): value is File {
  return typeof File !== 'undefined' && value instanceof File
}

export function useCreateArticleForm({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: CreateArticleSchema) => void | Promise<void>
  onError?: (error: Error) => void
} = {}) {
  const createMutation = useAddArticleMutation()

  // Cloudinary upload hook for cover image
  const coverUpload = useCloudinaryUpload({
    folder: 'suasana/articles/cover',
  })

  // Process files before submit
  const processFilesAndSubmit = useCallback(
    async (data: CreateArticleSchema) => {
      let finalCoverImage: string | null = null

      // Handle cover image
      if (isFile(data.coverImage)) {
        const result = await coverUpload.upload(data.coverImage)
        finalCoverImage = result?.secure_url || null
      } else if (typeof data.coverImage === 'string' && data.coverImage) {
        finalCoverImage = data.coverImage
      }

      // Submit with URL only
      const finalData = {
        ...data,
        coverImage: finalCoverImage,
      }

      await createMutation.mutateAsync({ data: finalData })
      await onSuccess?.(finalData)
    },
    [coverUpload, createMutation, onSuccess],
  )

  return useAppForm({
    validators: {
      onSubmit: createArticleSchema,
    },
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      coverImage: undefined,
      status: 'draft',
    } as unknown as CreateArticleSchema,
    onSubmit: async ({ value: data }) => {
      try {
        await processFilesAndSubmit(data)
      } catch (error) {
        onError?.(error as Error)
      }
    },
  })
}

export function useUpdateArticleForm({
  onSuccess,
  onError,
  article: articleData,
}: {
  article: Article
  onSuccess?: (data: CreateArticleSchema) => void | Promise<void>
  onError?: (error: Error) => void
}) {
  const updateMutation = useUpdateArticleMutation()

  // Cloudinary upload hook for cover image
  const coverUpload = useCloudinaryUpload({
    folder: 'suasana/articles/cover',
  })

  // Process files before submit
  const processFilesAndSubmit = useCallback(
    async (data: CreateArticleSchema) => {
      let finalCoverImage: string | null = null

      // Handle cover image
      if (isFile(data.coverImage)) {
        const result = await coverUpload.upload(data.coverImage)
        finalCoverImage = result?.secure_url || null
      } else if (typeof data.coverImage === 'string' && data.coverImage) {
        finalCoverImage = data.coverImage
      }

      // Submit with URL only
      const finalData = {
        id: articleData.id,
        ...data,
        coverImage: finalCoverImage,
      }

      await updateMutation.mutateAsync({ data: finalData })
      await onSuccess?.(finalData)
    },
    [coverUpload, updateMutation, onSuccess, articleData.id],
  )

  return useAppForm({
    validators: {
      onSubmit: createArticleSchema,
    },
    defaultValues: {
      title: articleData.title || '',
      excerpt: articleData.excerpt || '',
      content: articleData.content || '',
      coverImage: articleData.coverImage || undefined,
      status: articleData.status || 'draft',
    } as unknown as CreateArticleSchema,
    onSubmit: async ({ value: data }) => {
      try {
        await processFilesAndSubmit(data)
      } catch (error) {
        onError?.(error as Error)
      }
    },
  })
}

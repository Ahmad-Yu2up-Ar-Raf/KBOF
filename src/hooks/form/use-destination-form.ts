import { useCallback } from 'react'
import { toast } from 'sonner'
import { useAppForm } from './use-form'
import type { Destination } from '@/db/schema'
import type { CreateDestinationSchema } from '@/lib/validations/destination-validations'
import { createDestinationSchema } from '@/lib/validations/destination-validations'
import {
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
} from '@/hooks/use-destination-mutations'
import { useCloudinaryUpload } from '@/hooks/use-cloudinary-upload'
import { useSession } from '@/lib/auth/auth-client'

// =============================================================================
// DESTINATION FORM HOOKS - SUASANA
// =============================================================================

export type CreateDestinationFormReturn = ReturnType<
  typeof useCreateDestinationForm
>
export type UpdateDestinationFormReturn = ReturnType<
  typeof useUpdateDestinationForm
>
export type DestinationFormReturn = CreateDestinationFormReturn

// Helper to check if value is a File
function isFile(value: unknown): value is File {
  return typeof File !== 'undefined' && value instanceof File
}

export function useCreateDestinationForm({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: CreateDestinationSchema) => void | Promise<void>
  onError?: (error: Error) => void
} = {}) {
  const createMutation = useCreateDestinationMutation({
    onError,
  })

  // Cloudinary upload hooks for cover image and gallery
  const coverUpload = useCloudinaryUpload({
    folder: 'suasana/destinations/cover',
  })
  const galleryUpload = useCloudinaryUpload({
    folder: 'suasana/destinations/gallery',
  })
  // Session for role-aware behavior (call hook at top-level)
  const session = useSession()

  // Process files before submit
  const processFilesAndSubmit = useCallback(
    async (data: CreateDestinationSchema) => {
      let finalCoverImage: string | undefined = isFile(data.coverImage)
        ? undefined
        : data.coverImage
      let finalImages = data.images || []

      // Upload cover image if it's a File
      if (isFile(data.coverImage)) {
        const result = await coverUpload.upload(data.coverImage)
        finalCoverImage = result?.secure_url
      }

      // Upload gallery images if any are Files
      if (data.images && data.images.length > 0) {
        const uploadedImages: Array<string> = []
        for (const item of data.images) {
          if (isFile(item)) {
            const result = await galleryUpload.upload(item)
            if (result) {
              uploadedImages.push(result.secure_url)
            }
          } else if (typeof item === 'string') {
            uploadedImages.push(item)
          }
        }
        finalImages = uploadedImages
      }

      // Submit with URLs only
      const finalData = {
        ...data,
        coverImage: finalCoverImage ?? '',
        images: finalImages as Array<string>,
      }

      const result = await createMutation.mutateAsync(finalData)

      // Show role-aware toast
      const role = session?.data?.user?.role

      if (role === 'admin') {
        toast.success('Destinasi telah berhasil diajukan')
      } else {
        toast.success('Destinasi berhasil dibuat')
      }

      await onSuccess?.(finalData)
    },
    [coverUpload, galleryUpload, createMutation, onSuccess],
  )

  return useAppForm({
    validators: {
      onSubmit: createDestinationSchema,
    },
    defaultValues: {
      name: '',
      description: '',
      type: undefined,
      category: undefined,
      provinsi: undefined,
      kabupatenKota: '',
      alamat: '',
      coverImage: undefined,
      images: [],
      status: 'pending',
    } as unknown as CreateDestinationSchema,
    onSubmit: async ({ value: data }) => {
      await processFilesAndSubmit(data)
    },
  })
}

export function useUpdateDestinationForm({
  onSuccess,
  onError,
  destination: destinationData,
}: {
  destination: Destination
  onSuccess?: (data: CreateDestinationSchema) => void | Promise<void>
  onError?: (error: Error) => void
}) {
  const updateMutation = useUpdateDestinationMutation({
    onError,
  })

  // Cloudinary upload hooks for cover image and gallery
  const coverUpload = useCloudinaryUpload({
    folder: 'suasana/destinations/cover',
  })
  const galleryUpload = useCloudinaryUpload({
    folder: 'suasana/destinations/gallery',
  })

  // Parse images from JSON string to array
  const parseImages = (
    images: string | Array<string> | null | undefined,
  ): Array<string> => {
    if (!images) return []
    if (Array.isArray(images)) return images
    try {
      const parsed = JSON.parse(images)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  // Process files before submit
  const processFilesAndSubmit = useCallback(
    async (data: CreateDestinationSchema) => {
      let finalCoverImage: string | undefined = isFile(data.coverImage)
        ? undefined
        : data.coverImage
      let finalImages = data.images || []

      // Upload cover image if it's a File
      if (isFile(data.coverImage)) {
        const result = await coverUpload.upload(data.coverImage)
        finalCoverImage = result?.secure_url
      }

      // Upload gallery images if any are Files
      if (data.images && data.images.length > 0) {
        const uploadedImages: Array<string> = []
        for (const item of data.images) {
          if (isFile(item)) {
            const result = await galleryUpload.upload(item)
            if (result) {
              uploadedImages.push(result.secure_url)
            }
          } else if (typeof item === 'string') {
            uploadedImages.push(item)
          }
        }
        finalImages = uploadedImages
      }

      // Submit with URLs only
      const finalData = {
        ...data,
        coverImage: finalCoverImage ?? '',
        images: finalImages as Array<string>,
      }

      await updateMutation.mutateAsync({ ...finalData, id: destinationData.id })
      await onSuccess?.(finalData)
    },
    [coverUpload, galleryUpload, updateMutation, destinationData.id, onSuccess],
  )

  return useAppForm({
    validators: {
      onSubmit: createDestinationSchema,
    },
    defaultValues: {
      name: destinationData.name,
      description: destinationData.description ?? '',
      type: destinationData.type ?? undefined,
      category: destinationData.category ?? undefined,
      provinsi: destinationData.provinsi ?? undefined,
      kabupatenKota: destinationData.kabupatenKota ?? '',
      alamat: destinationData.alamat ?? '',
      coverImage: destinationData.coverImage ?? undefined,
      images: parseImages(destinationData.images),
      status: destinationData.status ?? 'pending',
    } as unknown as CreateDestinationSchema,
    onSubmit: async ({ value: data }) => {
      await processFilesAndSubmit(data)
    },
  })
}

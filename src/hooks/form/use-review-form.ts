// =============================================================================
// REVIEW FORM HOOKS - SUASANA
// =============================================================================
// Custom form hooks for review create/update operations
// using TanStack Form with Zod validation
// =============================================================================

import { useAppForm } from './use-form'
import type { CreateReviewFormSchema } from '@/lib/validations/review-validations'
import { createReviewFormSchema } from '@/lib/validations/review-validations'
import { useAddReviewMutation } from '@/hooks/use-review-mutations'

// ============================================
// TYPE EXPORTS
// ============================================

export type CreateReviewFormReturn = ReturnType<typeof useCreateReviewForm>

// ============================================
// CREATE REVIEW FORM HOOK
// ============================================

interface UseCreateReviewFormOptions {
  destinationId: number
  destinationSlug: string
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

export function useCreateReviewForm({
  destinationId,
  destinationSlug,
  onSuccess,
  onError,
}: UseCreateReviewFormOptions) {
  const addReviewMutation = useAddReviewMutation({
    destinationSlug,
    onError,
  })

  return useAppForm({
    validators: {
      onSubmit: createReviewFormSchema,
    },
    defaultValues: {
      destinationId,
      rating: 0,
      title: '',
      content: '',
      visitDate: null,
    } as CreateReviewFormSchema,
    onSubmit: async ({ value: data }) => {
      // Ensure rating is valid before submitting
      if (data.rating < 1 || data.rating > 5) {
        throw new Error('Silakan berikan rating 1-5 bintang')
      }

      await addReviewMutation.mutateAsync({
        destinationId: data.destinationId,
        rating: data.rating,
        title: data.title || undefined,
        content: data.content || undefined,
        visitDate: data.visitDate || undefined,
      })

      await onSuccess?.()
    },
  })
}

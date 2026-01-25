// src/hooks/form/use-auth-form.ts
import { useAppForm } from './use-form'
import type {
  ChangePassword,
  MagicLinkSchema,
} from '@/lib/validations/auth-validations'
import { authClient } from '@/lib/auth/auth-client'
import {
  changePassword,
  magicLinkSchema,
} from '@/lib/validations/auth-validations'
import { updateProfileSchema } from '@/lib/validations/profile-validations'
import type { UpdateProfileSchema } from '@/lib/validations/profile-validations'

export type UpdateProfileFormReturn = ReturnType<typeof useUpdateProfileForm>
export type MagicLinkFormReturn = ReturnType<typeof useMagicLinkForm>

// ✅ NEW: Magic Link Form Hook
// src/hooks/form/use-auth-form.ts - UPDATE useMagicLinkForm
export function useMagicLinkForm({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: MagicLinkSchema) => void | Promise<void>
  onError?: (error: Error) => void
} = {}) {
  return useAppForm({
    validators: {
      onSubmit: magicLinkSchema,
    },
    defaultValues: {
      email: '',
    },
    onSubmit: async ({ value: data }) => {
      try {
        console.log('📤 [FORM] Submitting magic link request for:', data.email)

        const result = await authClient.signIn.magicLink({
          email: data.email,
          callbackURL: '/dashboard',
          newUserCallbackURL: '/dashboard',
        })

        console.log('📤 [FORM] Magic link result:', result)

        if (result.error) {
          console.error('📤 [FORM] Magic link error:', result.error)
          throw new Error(result.error.message || 'Failed to send magic link')
        }

        console.log('✅ [FORM] Magic link sent successfully')
        onSuccess?.(data)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to send magic link'
        console.error('❌ [FORM] Magic link error:', message)
        console.error('❌ [FORM] Full error:', error)
        onError?.(error as Error)
        throw error
      }
    },
  })
}

// Keep existing hooks if needed
export function useChangePassword({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: ChangePassword) => void | Promise<void>
  onError?: (error: Error) => void
} = {}) {
  return useAppForm({
    validators: {
      onSubmit: changePassword,
    },
    defaultValues: {
      current_password: '',
      password: '',
    },
    onSubmit: async ({ value: data }) => {
      try {
        await authClient.changePassword(
          {
            newPassword: data.password,
            currentPassword: data.current_password,
            revokeOtherSessions: true,
          },
          {
            onSuccess: () => {
              onSuccess?.(data)
            },
            onError: (ctx) => {
              throw ctx.error
            },
          },
        )
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Password change failed'
        console.log(message)
        onError?.(error as Error)
        throw error
      }
    },
  })
}

export function useUpdateProfileForm({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: UpdateProfileSchema) => void | Promise<void>
  onError?: (error: Error) => void
} = {}) {
  const { data: session } = authClient.useSession()

  return useAppForm({
    validators: {
      onSubmit: updateProfileSchema,
    },
    defaultValues: {
      name: session?.user?.name || '',

      image: session?.user?.image
        ? { dataUrl: session.user.image as string, filename: 'image' }
        : null,
    },
    onSubmit: async ({ value: data }) => {
      try {
        // Form validation passed, call onSuccess
        // Actual upload + DB update will be handled in component
        onSuccess?.(data)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Update failed'
        console.error('Profile update error:', message)
        onError?.(error as Error)
        throw error
      }
    },
  })
}

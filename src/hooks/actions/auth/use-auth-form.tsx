import { authClient } from '@/lib/auth/auth-client'
import { useAppForm } from '../../use-form'
import {
  changePassword,
  ChangePassword,
  loginSchema,
  registerCreateSchema,
  UpdateSchema,
  updateSchema,
} from '@/lib/validations/auth-validations'
import { LoginSchema, RegisterSchema } from '@/lib/validations/auth-validations'

export type LoginFormReturn = ReturnType<typeof useLoginForm>
export type RegisterFormReturn = ReturnType<typeof useRegisterForm>

export function useLoginForm({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: LoginSchema) => void | Promise<void>
  onError?: (error: Error) => void
} = {}) {
  return useAppForm({
    validators: {
      onSubmit: loginSchema,
    },
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value: data }) => {
      try {
        await authClient.signIn.email(
          {
            email: data.email,
            password: data.password,
            callbackURL: '/dashboard',
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
        const message = error instanceof Error ? error.message : 'Login gagal'
        console.log(message)
        onError?.(error as Error)
        throw error
      }
    },
  })
}

export function useRegisterForm({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: RegisterSchema) => void | Promise<void>
  onError?: (error: Error) => void
} = {}) {
  return useAppForm({
    validators: {
      onSubmit: registerCreateSchema,
    },
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value: data }) => {
      try {
        await authClient.signUp.email(
          {
            email: data.email,
            password: data.password,
            name: data.name,
            callbackURL: '/dashboard',
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
        const message = error instanceof Error ? error.message : 'Login gagal'
        console.log(message)
        onError?.(error as Error)
        throw error
      }
    },
  })
}

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
            newPassword: data.password, // required
            currentPassword: data.current_password, // required
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
        const message = error instanceof Error ? error.message : 'Login gagal'
        console.log(message)
        onError?.(error as Error)
        throw error
      }
    },
  })
}

export function useUpdateForm({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: UpdateSchema) => void | Promise<void>
  onError?: (error: Error) => void
} = {}) {
  const { data: session } = authClient.useSession()
  return useAppForm({
    validators: {
      onSubmit: updateSchema,
    },
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
    },
    onSubmit: async ({ value: data }) => {
      try {
        if (
          data.name === session?.user?.name &&
          data.email === session?.user?.email
        ) {
          throw new Error('No changes detected.')
        }

        if (data.name !== session?.user?.name) {
          await authClient.updateUser(
            {
              name: data.name,
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
        }

        if (data.email !== session?.user?.email) {
          await authClient.changeEmail({
            newEmail: data.email,
            callbackURL: '/dashboard/settings', // to redirect after verification
          })
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login gagal'
        console.log(message)
        onError?.(error as Error)
        throw error
      }
    },
  })
}

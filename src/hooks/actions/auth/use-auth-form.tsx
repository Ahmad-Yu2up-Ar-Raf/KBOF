import { authClient } from "@/lib/auth/auth-client"
import { useForm } from "../../use-form"
import { loginSchema, registerCreateSchema } from "@/lib/validations/auth/authValidate"
import type { LoginSchema, RegisterSchema } from "@/lib/validations/auth/authValidate"

/**
 * ✅ Export type untuk form instance
 */
export type LoginFormReturn = ReturnType<typeof useLoginForm>
export type RegisterFormReturn = ReturnType<typeof useRegisterForm>

/**
 * Login Form Hook
 * 
 * Usage:
 * ```tsx
 * const { form, isPending, error } = useLoginForm({
 *   onSuccess: async (data) => {
 *     // data is typed as LoginSchema
 *     await api.login(data)
 *   }
 * })
 * ```
 */
export function useLoginForm({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: LoginSchema) => void | Promise<void>
  onError?: (error: Error) => void
} = {}) {
  return useForm({
    schema: loginSchema,
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async (data: LoginSchema) => {
        try {
         await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          callbackURL: '/dashboard',
        },
        {
          onSuccess:  () => {
           onSuccess?.(data)
          },
          onError: (ctx) => {
        onError?.(ctx.error)
          },
        },
      )
        
        
      }  catch (error) {
        const message = error instanceof Error ? error.message : "Login gagal"
        console.log(message)
        throw error
      }
    },
    onError: (error: Error) => {
      console.error("Login error:", error)
      onError?.(error)
    },
  })
}

/**
 * Register Form Hook
 * 
 * Usage:
 * ```tsx
 * const { form, isPending, error } = useRegisterForm({
 *   onSuccess: async (data) => {
 *     // data is typed as UserSchema
 *     await api.register(data)
 *   }
 * })
 * ```
 */
export function useRegisterForm({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: RegisterSchema) => void | Promise<void>
  onError?: (error: Error) => void
} = {}) {
  return useForm({
    schema: registerCreateSchema,
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async (data) => {
      try {

             authClient.signUp.email(
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
              onError?.(ctx.error)
          },
        },
      )
      } catch (error) {
            const message = error instanceof Error ? error.message : "Login gagal"
        console.log(message)
        throw error
      }
    },
    onError: (error: Error) => {
      console.error("Register error:", error)
      onError?.(error)
    },
  })
}

export async function Logout({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
} = {}) {
await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
           onSuccess?.()
        },
        onError: (error ) => {
        console.error("Logout Error:", error)
      onError?.(error.error)
        }
      },
    })
}


export const signInGoogle = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
    callbackURL: '/dashboard',
  });
};
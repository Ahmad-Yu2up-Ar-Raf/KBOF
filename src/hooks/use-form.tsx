import { useForm as useTanstackForm } from "@tanstack/react-form"
import { useState } from "react"
import type { z } from "zod"

/**
 * Infer type dari Zod schema
 */
type InferZodSchema<T> = T extends z.ZodType<infer U> ? U : never

/**
 * Generic Form Hook Options
 */
interface UseFormOptions<TSchema extends z.ZodType> {
  schema: TSchema
  defaultValues: InferZodSchema<TSchema>
  onSubmit: (data: InferZodSchema<TSchema>) => void | Promise<void>
  onError?: (error: Error) => void
}

/**
 * Generic Reusable Form Hook
 * 
 * Usage:
 * ```tsx
 * const { form, isPending, error } = useForm({
 *   schema: mySchema,
 *   defaultValues: { ... },
 *   onSubmit: async (data) => { ... }
 * })
 * ```
 * 
 * Features:
 * - Automatic type inference from Zod schema
 * - Built-in loading state
 * - Built-in error handling
 * - Zod validation
 */
export function useForm<TSchema extends z.ZodType>({
  schema,
  defaultValues,
  onSubmit,
  onError,
}: UseFormOptions<TSchema>) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  type FormData = InferZodSchema<TSchema>

  const form = useTanstackForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setIsPending(true)
      setError(null)

      try {
        const result = await schema.safeParseAsync(value)
        if (!result.success) {
          const message = result.error.issues[0]?.message ?? "Invalid form data"
          const validationError = new Error(message)
          setError(validationError)
          onError?.(validationError)
          return
        }

        const formData = result.data as FormData
        await onSubmit(formData)
      } catch (err) {
        const errorInstance = err instanceof Error ? err : new Error(String(err))
        setError(errorInstance)
        onError?.(errorInstance)
      } finally {
        setIsPending(false)
      }
    },
  })

  const reset = () => {
    form.reset()
    setError(null)
    setIsPending(false)
  }

  return {
    form,
    isPending,
    error,
    reset,
  }
}
import { useAppForm } from '../../use-form'
import {
  type CreateMessSchema,
  createMesschema,
} from '@/lib/validations/mess-validations'
import { useServerFn } from '@tanstack/react-start'
import { authClient } from '@/lib/auth/auth-client'
import { addMess } from '@/lib/actions/mess-actions'

// =============================================================================
// FORM HOOK
// =============================================================================
export type MessFormReturn = ReturnType<typeof useCreateMessForm>
export type CreateMessFormReturn = ReturnType<typeof useCreateMessForm>

export function useCreateMessForm({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: CreateMessSchema) => void | Promise<void>
  onError?: (error: Error) => void
} = {}) {
  // ✅ Hook dipanggil di TOP LEVEL - bukan di dalam callback
  const addMessFn = useServerFn(addMess)
  const { data: session } = authClient.useSession()

  // Pastikan user sudah login
  const userId = session?.user?.id ?? ''

  return useAppForm({
    validators: {
      onSubmit: createMesschema,
    },
    defaultValues: {
      name: '',
      userId: userId, // dari session
      capacityRoom: 30,
      capacityEmploye: undefined,
      status: undefined,
      location: undefined,
      deskripcion: undefined,
      type: undefined,
    } as CreateMessSchema,
    onSubmit: async ({ value: data }) => {
      try {
        // ✅ Panggil server function dengan data
        await addMessFn({ data })
        await onSuccess?.(data)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Gagal menambahkan mess'
        console.error(message)
        onError?.(error as Error)
        throw error
      }
    },
  })
}

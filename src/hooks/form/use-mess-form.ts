import { useAppForm } from './use-form'
import {
  type CreateMessSchema,
  type UpdateMessSchema,
  createMesschema,
} from '@/lib/validations/mess-validations'
import { useServerFn } from '@tanstack/react-start'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { MESS_QUERY_KEYS } from '@/lib/utils/mess-utils'
import { addMess, updateMess } from '@/lib/server/mess/mess-server-actions'
import { Mess } from '@/db/schema'
import { useSession } from '@/lib/auth/auth-client'

// =============================================================================
// FORM HOOK
// =============================================================================
export type CreateMessFormReturn = ReturnType<typeof useCreateMessForm>
export type UpdateMessFormReturn = ReturnType<typeof useUpdateMessForm>

// Use CreateMessFormReturn as the shared type since both forms have identical fields
// TypeScript's structural typing allows UpdateMessFormReturn to be assigned to this type
export type MessFormReturn = CreateMessFormReturn

export function useCreateMessForm({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: CreateMessSchema) => void | Promise<void>
  onError?: (error: Error) => void
} = {}) {
  // Hook dipanggil di TOP LEVEL - bukan di dalam callback
  const addMessFn = useServerFn(addMess)
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: session } = useSession()

  return useAppForm({
    validators: {
      onSubmit: createMesschema,
    },
    defaultValues: {
      name: '',
      capacityRoom: 30,
      capacityEmploye: undefined,
      status: undefined,
      location: undefined,
      deskripcion: undefined,
      type: undefined,
    } as CreateMessSchema,
    onSubmit: async ({ value: data }) => {
      try {
        // Panggil server function dengan data
        await addMessFn({ data })

        // Invalidate query dengan userId untuk proper cache isolation
        if (session?.user?.id) {
          await queryClient.invalidateQueries({
            queryKey: MESS_QUERY_KEYS.all(session.user.id),
          })
        }

        // ⭐ IMPORTANT: Invalidate + navigate to force fresh loader data (including counts)
        await router.invalidate()

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

export function useUpdateMessForm({
  onSuccess,
  onError,
  mess: messData,
}: {
  mess: Mess
  onSuccess?: (data: CreateMessSchema) => void | Promise<void>
  onError?: (error: Error) => void
}) {
  // Hook dipanggil di TOP LEVEL - bukan di dalam callback
  const updateMessFn = useServerFn(updateMess)
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: session } = useSession()

  return useAppForm({
    validators: {
      onSubmit: createMesschema,
    },
    defaultValues: {
      name: messData.name,
      capacityRoom: messData.capacityRoom,
      status: messData.status ?? undefined,
      type: messData.type ?? undefined,
      capacityEmploye: messData.capacityEmploye ?? undefined,
      deskripcion: messData.deskripcion ?? undefined,
      location: messData.location ?? undefined,
    } as CreateMessSchema,
    onSubmit: async ({ value: data }) => {
      try {
        // Panggil server function dengan data + id dari mess
        await updateMessFn({ data: { ...data, id: messData.id } })

        // Invalidate query dengan userId untuk proper cache isolation
        if (session?.user?.id) {
          await queryClient.invalidateQueries({
            queryKey: MESS_QUERY_KEYS.all(session.user.id),
          })
        }

        // ⭐ IMPORTANT: Invalidate router to refetch loader data
        await router.invalidate()

        await onSuccess?.(data)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Gagal memperbarui mess'
        console.error(message)
        onError?.(error as Error)
        throw error
      }
    },
  })
}

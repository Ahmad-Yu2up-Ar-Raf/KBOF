import { useAppForm } from './use-form'
import {
  type CreateMessSchema,
  createMesschema,
} from '@/lib/validations/mess-validations'
import {
  useCreateMessMutation,
  useUpdateMessMutation,
} from '@/hooks/use-mess-mutations'
import type { Mess } from '@/db/schema'

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
  // ⭐ Use mutation hook for proper cache invalidation
  const createMutation = useCreateMessMutation({
    onError,
  })

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
      // ⭐ Use mutateAsync for proper error handling
      await createMutation.mutateAsync(data)
      await onSuccess?.(data)
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
  // ⭐ Use mutation hook for proper cache invalidation
  const updateMutation = useUpdateMessMutation({
    onError,
  })

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
      // ⭐ Use mutateAsync with id for proper error handling
      await updateMutation.mutateAsync({ ...data, id: messData.id })
      await onSuccess?.(data)
    },
  })
}

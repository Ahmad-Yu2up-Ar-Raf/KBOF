'use client'

import type { Row } from '@tanstack/react-table'
import * as React from 'react'
import { Activity } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/fragments/shadcn-ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/fragments/shadcn-ui/drawer'

import { useIsMobile } from '@/hooks/use-mobile'
import { useDeleteDestinationMutation } from '@/hooks/use-destination-mutations'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'
import type { DestinationAggregateResult } from '@/types'

type DestinationRow = DestinationAggregateResult['data'][number]

interface DeleteDestinationDialogProps extends React.ComponentPropsWithoutRef<
  typeof Dialog
> {
  destinations: Row<DestinationRow>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteDestinationDialog({
  destinations,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteDestinationDialogProps) {
  const isMobile = useIsMobile()

  // Use mutation hook for proper cache invalidation
  const deleteMutation = useDeleteDestinationMutation({
    onSuccess: () => {
      toast.success('Destination deleted successfully')
      props.onOpenChange?.(false)
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete destination')
    },
  })

  const onDelete = React.useCallback(() => {
    deleteMutation.mutate(destinations.map((d) => d.id))
  }, [destinations, deleteMutation])

  const isDeletePending = deleteMutation.isPending

  if (isMobile) {
    return (
      <Drawer {...props}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Apakah Anda yakin?</DrawerTitle>
            <DrawerDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus{' '}
              <span className="font-medium">{destinations.length}</span>
              {destinations.length === 1 ? ' destinasi' : ' destinasi'} secara
              permanen dari server kami.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="gap-2 sm:space-x-0">
            <DrawerClose asChild disabled={isDeletePending}>
              <Button variant="outline">
                <Activity mode={isDeletePending ? 'visible' : 'hidden'}>
                  <Spinner />
                </Activity>
                Batal
              </Button>
            </DrawerClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeletePending}
            >
              <Activity mode={isDeletePending ? 'visible' : 'hidden'}>
                <Spinner />
              </Activity>
              Hapus
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apakah Anda yakin?</DialogTitle>
          <DialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus{' '}
            <span className="font-medium">{destinations.length}</span>
            {destinations.length === 1 ? ' destinasi' : ' destinasi'} secara
            permanen dari server kami.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeletePending}>
              <Activity mode={isDeletePending ? 'visible' : 'hidden'}>
                <Spinner />
              </Activity>
              Batal
            </Button>
          </DialogClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletePending}
          >
            <Activity mode={isDeletePending ? 'visible' : 'hidden'}>
              <Spinner />
            </Activity>
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

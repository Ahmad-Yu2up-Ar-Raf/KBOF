'use client'

import type { Mess } from '@/db/schema'
import type { Row } from '@tanstack/react-table'
import { Loader } from 'lucide-react'
import * as React from 'react'
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
import { useDeleteMessMutation } from '@/hooks/use-mess-mutations'

interface DeleteMessDialogProps extends React.ComponentPropsWithoutRef<
  typeof Dialog
> {
  mess: Row<Mess>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteMessDialog({
  mess,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteMessDialogProps) {
  const isDesktop = !useIsMobile()

  // ⭐ Use mutation hook for proper cache invalidation
  const deleteMutation = useDeleteMessMutation({
    onSuccess: () => {
      toast.success('Mess deleted successfully')
      props.onOpenChange?.(false)
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete mess')
    },
  })

  const onDelete = React.useCallback(() => {
    deleteMutation.mutate(mess.map((task) => task.id))
  }, [mess, deleteMutation])

  const isDeletePending = deleteMutation.isPending

  if (isDesktop) {
    return (
      <Dialog {...props}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your{' '}
              <span className="font-medium">{mess.length}</span>
              {mess.length === 1 ? ' task' : ' mess'} from our servers. along
              with room data in the mess
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline" disabled={isDeletePending}>
                {' '}
                {isDeletePending && (
                  <Loader
                    className="mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}{' '}
                Cancel
              </Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeletePending}
            >
              {isDeletePending && (
                <Loader
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your{' '}
            <span className="font-medium">{mess.length}</span>
            {mess.length === 1 ? ' task' : ' mess'} from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild disabled={isDeletePending}>
            <Button variant="outline">
              {isDeletePending && (
                <Loader
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Cancel
            </Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

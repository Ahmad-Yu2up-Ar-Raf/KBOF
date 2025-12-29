'use client'

import type { Mess } from '@/db/schema'
import type { Row } from '@tanstack/react-table'
import { Loader } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
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

import { deleteMess } from '@/lib/server/mess/mess-server-actions'
import { useIsMobile } from '@/hooks/use-mobile'
import { useServerFn } from '@tanstack/react-start'
import { MESS_QUERY_KEYS } from '@/lib/utils/mess-utils'
import { useSession } from '@/lib/auth/auth-client'

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
  const [isDeletePending, startDeleteTransition] = React.useTransition()

  const isDesktop = !useIsMobile()

  // ✅ Hooks at top level - not inside callbacks
  const queryClient = useQueryClient()
  const router = useRouter()
  const deleteMessFn = useServerFn(deleteMess)
  const { data: session } = useSession()

  const onDelete = React.useCallback(() => {
    startDeleteTransition(async () => {
      try {
        const { error } = await deleteMessFn({
          data: { ids: mess.map((task) => task.id) },
        })

        if (error) {
          toast.error(error, { id: 'mess-deleted-dialog' })
          return
        }

        // Invalidate with userId for proper cache isolation
        if (session?.user?.id) {
          await queryClient.invalidateQueries({
            queryKey: MESS_QUERY_KEYS.all(session.user.id),
          })
        }

        // ⭐ IMPORTANT: Invalidate + navigate to force fresh loader data (including counts)
        await router.invalidate()

        toast.success('mess deleted successfully', {
          id: 'mess-deleted-dialog',
        })

        props.onOpenChange?.(false)
        onSuccess?.()
      } catch (error) {
        toast.error('Failed to delete mess', { id: 'mess-deleted-dialog' })
        console.error('Delete mess error:', error)
      }
    })
  }, [
    mess,
    deleteMessFn,
    queryClient,
    router,
    session?.user?.id,
    props,
    onSuccess,
  ])

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

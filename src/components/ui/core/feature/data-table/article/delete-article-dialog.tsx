'use client'

import type { Row } from '@tanstack/react-table'
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
import { useDeleteArticleMutation } from '@/hooks/use-article-mutations'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'
import type { ArticleAggregateResult } from '@/types'

type ArticleRow = ArticleAggregateResult['data'][number]

interface DeleteArticleDialogProps extends React.ComponentPropsWithoutRef<
  typeof Dialog
> {
  articles: Row<ArticleRow>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteArticleDialog({
  articles,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteArticleDialogProps) {
  const isMobile = useIsMobile()

  // Use mutation hook for proper cache invalidation
  const deleteMutation = useDeleteArticleMutation()

  const onDelete = React.useCallback(async () => {
    try {
      for (const article of articles) {
        await deleteMutation.mutateAsync({ data: { id: article.id } })
      }
      toast.success('Artikel berhasil dihapus')
      props.onOpenChange?.(false)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus artikel')
    }
  }, [articles, deleteMutation, props, onSuccess])

  const isDeletePending = deleteMutation.isPending

  if (isMobile) {
    return (
      <Drawer {...props}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Apakah Anda yakin?</DrawerTitle>
            <DrawerDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus{' '}
              <span className="font-medium">{articles.length}</span>
              {articles.length === 1 ? ' artikel' : ' artikel'} secara permanen
              dari server kami.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="gap-2 sm:space-x-0">
            <DrawerClose asChild disabled={isDeletePending}>
              <Button variant="outline">
                {isDeletePending && <Spinner className="mr-2" />}
                Batal
              </Button>
            </DrawerClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeletePending}
            >
              {isDeletePending && <Spinner className="mr-2" />}
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
            <span className="font-medium">{articles.length}</span>
            {articles.length === 1 ? ' artikel' : ' artikel'} secara permanen
            dari server kami.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeletePending}>
              {isDeletePending && <Spinner className="mr-2" />}
              Batal
            </Button>
          </DialogClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletePending}
          >
            {isDeletePending && <Spinner className="mr-2" />}
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

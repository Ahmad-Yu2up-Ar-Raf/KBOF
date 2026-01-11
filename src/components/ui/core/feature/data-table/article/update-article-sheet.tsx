import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/fragments/shadcn-ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/fragments/shadcn-ui/drawer'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { toast } from 'sonner'
import { useUpdateArticleForm } from '@/hooks/form/use-article-form'
import ArticleForm from '../../form/article-form'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'
import { useState, useRef } from 'react'

import type { ArticleAggregateResult } from '@/types'
import type { Article } from '@/db/schema'

type ArticleRow = ArticleAggregateResult['data'][number]

interface UpdateArticleSheetProps {
  trigger?: boolean
  open?: boolean
  article: ArticleRow
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>> | (() => void)
}

function UpdateArticleSheet({ ...props }: UpdateArticleSheetProps) {
  // Internal state untuk uncontrolled mode
  const [internalOpen, setInternalOpen] = useState(false)
  const toastIdRef = useRef<string | number | undefined>(undefined)
  const article = props.article

  // Gunakan props jika ada, fallback ke internal state
  const isControlled = props.open !== undefined
  const open = isControlled ? props.open : internalOpen
  const setOpen = isControlled ? props.onOpenChange : setInternalOpen

  const isMobile = useIsMobile()

  const form = useUpdateArticleForm({
    article: article as unknown as Article,
    onSuccess: async () => {
      // Dismiss loading toast and show success
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current)
      }
      toast.success('Artikel berhasil diperbarui!')
      form.reset()
      setOpen?.(false)
    },
    onError: (error: Error) => {
      // Dismiss loading toast and show error
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current)
      }
      toast.error(error.message)
    },
  })

  if (!isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen} modal={true}>
        <SheetContent className="flex flex-col gap-6 overflow-y-scroll">
          <SheetHeader className="text-left sm:px-6 space-y-1 bg-background z-30 sticky top-0 p-4 border-b">
            <SheetTitle className="text-lg">
              Update{' '}
              <Button
                type="button"
                variant={'outline'}
                className="ml-2 px-2.5 text-base capitalize"
              >
                {article?.title || 'Artikel'}
              </Button>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Isi rincian di bawah ini untuk memperbarui data artikel
            </SheetDescription>
          </SheetHeader>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <ArticleForm form={form}>
                <SheetFooter className="gap-3 px-3 py-4 w-full flex-row justify-end flex border-t sm:space-x-0">
                  <SheetClose
                    disabled={isSubmitting}
                    asChild
                    onClick={() => form.reset()}
                  >
                    <Button
                      disabled={isSubmitting}
                      type="button"
                      className="w-fit"
                      size={'sm'}
                      variant="outline"
                    >
                      {isSubmitting && <Spinner className="mr-2" />}
                      Batalkan
                    </Button>
                  </SheetClose>
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-fit"
                    size={'sm'}
                  >
                    {isSubmitting && <Spinner className="mr-2" />}
                    Perbarui
                  </Button>
                </SheetFooter>
              </ArticleForm>
            )}
          </form.Subscribe>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} modal={true}>
      <DrawerContent className="flex flex-col">
        <DrawerHeader className="text-left sm:px-6 space-y-1 bg-background p-4 border-b">
          <DrawerTitle className="text-xl">
            Update{' '}
            <Button
              type="button"
              variant={'outline'}
              className="ml-2 px-2.5 text-base"
            >
              {article?.title || 'Artikel'}
            </Button>
          </DrawerTitle>
          <DrawerDescription className="text-sm">
            Isi rincian di bawah ini untuk memperbarui data artikel
          </DrawerDescription>
        </DrawerHeader>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <ArticleForm form={form}>
              <DrawerFooter className="gap-3 px-3 py-4 w-full flex-row justify-end flex border-t sm:space-x-0">
                <DrawerClose
                  disabled={isSubmitting}
                  asChild
                  onClick={() => form.reset()}
                >
                  <Button
                    disabled={isSubmitting}
                    type="button"
                    className="w-fit"
                    size={'sm'}
                    variant="outline"
                  >
                    {isSubmitting && <Spinner className="mr-2" />}
                    Batalkan
                  </Button>
                </DrawerClose>
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-fit"
                  size={'sm'}
                >
                  {isSubmitting && <Spinner className="mr-2" />}
                  Perbarui
                </Button>
              </DrawerFooter>
            </ArticleForm>
          )}
        </form.Subscribe>
      </DrawerContent>
    </Drawer>
  )
}

export default UpdateArticleSheet

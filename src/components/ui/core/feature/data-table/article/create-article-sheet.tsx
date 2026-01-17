import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
  DrawerTrigger,
} from '@/components/ui/fragments/shadcn-ui/drawer'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { toast } from 'sonner'
import { useCreateArticleForm } from '@/hooks/form/use-article-form'
import ArticleForm from '../../form/article-form'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'
import React, { useState, useRef } from 'react'
import { Plus } from 'lucide-react'

interface CreateArticleSheetProps {
  className?: string
  children?: React.ReactNode | boolean
  open?: boolean
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>> | (() => void)
}

function CreateArticleSheet({ className, ...props }: CreateArticleSheetProps) {
  // Internal state untuk uncontrolled mode
  const [internalOpen, setInternalOpen] = useState(false)
  const toastIdRef = useRef<string | number | undefined>(undefined)

  // Gunakan props jika ada, fallback ke internal state
  const isControlled = props.open !== undefined
  const open = isControlled ? props.open : internalOpen
  const setOpen = isControlled ? props.onOpenChange : setInternalOpen

  const isMobile = useIsMobile()

  const form = useCreateArticleForm({
    onSuccess: async () => {
      // Dismiss loading toast and show success
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current)
      }
      toast.success('Artikel berhasil dibuat!')
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
        <SheetTrigger asChild className={className}>
          {props.children ? (
            props.children
          ) : (
            <Button className="text-sm w-fit">
              <Plus className="mr-3" />
              Tambah Artikel
            </Button>
          )}
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-6 overflow-y-auto">
          <SheetHeader className="text-left sm:px-6 space-y-1 bg-background z-30 sticky top-0 p-4 border-b">
            <SheetTitle className="text-xl font-bold">
              Tambah Artikel
            </SheetTitle>
            <SheetDescription>
              Isi form berikut untuk menambahkan artikel baru.
            </SheetDescription>
          </SheetHeader>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <>
                <ArticleForm form={form} />
                <SheetFooter className="gap-3 px-3 py-4 w-full flex-row justify-end flex border-t sm:space-x-0">
                  <SheetClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                    >
                      Batal
                    </Button>
                  </SheetClose>
                  <Button
                    type="submit"
                    form="article-form"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner className="size-4" />
                        Menyimpan...
                      </>
                    ) : (
                      'Simpan'
                    )}
                  </Button>
                </SheetFooter>
              </>
            )}
          </form.Subscribe>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} modal={true}>
      <DrawerTrigger asChild className={className}>
        {props.children ? (
          props.children
        ) : (
          <Button className="text-sm w-fit">
            <Plus className="mr-3" />
            Tambah Artikel
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="flex flex-col max-h-[85svh]">
        <DrawerHeader className="text-left sm:px-6 space-y-1 bg-background p-4 border-b">
          <DrawerTitle className="text-xl font-bold">
            Tambah Artikel
          </DrawerTitle>
          <DrawerDescription>
            Isi form berikut untuk menambahkan artikel baru.
          </DrawerDescription>
        </DrawerHeader>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <>
              <div className="flex-1 overflow-y-auto px-4">
                <ArticleForm form={form} />
              </div>
              <DrawerFooter className="sticky bottom-0 bg-background border-t p-4">
                <Button
                  type="submit"
                  form="article-form"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className="size-4" />
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan'
                  )}
                </Button>
                <DrawerClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    Batal
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          )}
        </form.Subscribe>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateArticleSheet

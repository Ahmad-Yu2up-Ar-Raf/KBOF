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
import { useState, useRef } from 'react'
import { Plus } from 'lucide-react'

interface CreateArticleSheetProps {
  trigger?: boolean
  open?: boolean
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>> | (() => void)
}

function CreateArticleSheet({
  trigger = true,
  ...props
}: CreateArticleSheetProps) {
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

  const TriggerButton = trigger ? (
    <Button variant="default" size="sm" className="gap-2">
      <Plus className="size-4" />
      Tambah Artikel
    </Button>
  ) : null

  if (!isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen} modal={true}>
        {trigger && <SheetTrigger asChild>{TriggerButton}</SheetTrigger>}
        <SheetContent className="flex flex-col gap-6 overflow-y-scroll">
          <SheetHeader className="text-left sm:px-6 space-y-1 bg-background z-30 sticky top-0 p-4 border-b">
            <SheetTitle className="text-lg">Buat Artikel Baru</SheetTitle>
            <SheetDescription className="sr-only">
              Isi rincian di bawah ini untuk membuat artikel baru
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
                    Simpan
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
      {trigger && <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>}
      <DrawerContent className="flex flex-col">
        <DrawerHeader className="text-left sm:px-6 space-y-1 bg-background p-4 border-b">
          <DrawerTitle className="text-xl">Buat Artikel Baru</DrawerTitle>
          <DrawerDescription className="text-sm">
            Isi rincian di bawah ini untuk membuat artikel baru
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
                  Simpan
                </Button>
              </DrawerFooter>
            </ArticleForm>
          )}
        </form.Subscribe>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateArticleSheet

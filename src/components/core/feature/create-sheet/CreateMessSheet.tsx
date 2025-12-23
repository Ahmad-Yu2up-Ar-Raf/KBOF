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
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateMessForm } from '@/hooks/actions/app/use-mess-form'
import MessForm from '../form/MessForm'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'
import { useState } from 'react'

interface type {
  trigger?: boolean
  open?: boolean
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>
}
function CreateMessSheet({ ...props }: type) {
  // Internal state untuk uncontrolled mode
  const [internalOpen, setInternalOpen] = useState(false)

  // Gunakan props jika ada, fallback ke internal state
  const isControlled = props.open !== undefined
  const open = isControlled ? props.open : internalOpen
  const setOpen = isControlled ? props.onOpenChange : setInternalOpen

  const isDesktop = useIsMobile()

  const form = useCreateMessForm({
    onSuccess: async () => {
      toast.success('berhasil!')
      form.reset()
      setOpen?.(false)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  if (!isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen} modal={true}>
        {props.trigger == null && (
          <SheetTrigger asChild>
            <Button className="text-sm w-fit">
              <Plus className="mr-3" />
              Tambahkan Baru
            </Button>
          </SheetTrigger>
        )}
        <SheetContent className="flex flex-col gap-6 overflow-y-scroll">
          <SheetHeader className="text-left sm:px-6 space-y-1 bg-background z-30 sticky top-0 p-4 border-b">
            <SheetTitle className="text-lg">
              Tambahkan Baru{' '}
              <Button
                type="button"
                variant={'outline'}
                className="ml-2 px-2.5 text-base capitalize"
              >
                siswa
              </Button>{' '}
            </SheetTitle>
            <SheetDescription className="sr-only">
              Isi rincian di bawah ini untuk membuat data siswa
            </SheetDescription>
          </SheetHeader>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <MessForm form={form}>
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
                      {isSubmitting && <Spinner className="" />}
                      Batalkan
                    </Button>
                  </SheetClose>
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-fit dark:bg-primary  text-primary-foreground !pointer-siswa-auto dark:primary-foreground bg-primary"
                    size={'sm'}
                  >
                    {isSubmitting && <Spinner className="" />}
                    Tambahkan
                  </Button>
                </SheetFooter>
              </MessForm>
            )}
          </form.Subscribe>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} modal={true}>
      {props.trigger == null && (
        <DrawerTrigger asChild>
          <Button className="w-fit text-sm">
            <Plus className="mr-3" />
            Tambahkan Baru
          </Button>
        </DrawerTrigger>
      )}
      <DrawerContent className="flex flex-col">
        <DrawerHeader className="text-left sm:px-6 space-y-1 bg-background p-4 border-b">
          <DrawerTitle className="text-xl">
            Tambahkan Baru{' '}
            <Button
              type="button"
              variant={'outline'}
              className="ml-2 px-2.5 text-base"
            >
              siswa
            </Button>{' '}
          </DrawerTitle>
          <DrawerDescription className="text-sm">
            Isi rincian di bawah ini untuk membuat data siswa
          </DrawerDescription>
        </DrawerHeader>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <MessForm form={form}>
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
                    {isSubmitting && <Spinner className="" />}
                    Batalkan
                  </Button>
                </DrawerClose>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-fit !pointer-siswa-auto dark:bg-primary  text-primary-foreground dark:primary-foreground bg-primary"
                  size={'sm'}
                >
                  {isSubmitting && <Spinner className="" />}
                  Tambahkan
                </Button>
              </DrawerFooter>
            </MessForm>
          )}
        </form.Subscribe>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateMessSheet

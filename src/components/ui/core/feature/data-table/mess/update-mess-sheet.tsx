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
import { useUpdateMessForm } from '@/hooks/form/use-mess-form'
import MessForm from '../../form/mess-form'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'
import { useState, Activity } from 'react'
import { Mess } from '@/db/schema'

interface type {
  trigger?: boolean
  open?: boolean
  mess: Mess
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>
}
function UpdateMessSheet({ ...props }: type) {
  // Internal state untuk uncontrolled mode
  const [internalOpen, setInternalOpen] = useState(false)
  const mess = props.mess
  // Gunakan props jika ada, fallback ke internal state
  const isControlled = props.open !== undefined
  const open = isControlled ? props.open : internalOpen
  const setOpen = isControlled ? props.onOpenChange : setInternalOpen

  const isDesktop = useIsMobile()

  const form = useUpdateMessForm({
    mess: mess,
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
        <SheetContent className="flex flex-col gap-6 overflow-y-scroll">
          <SheetHeader className="text-left sm:px-6 space-y-1 bg-background z-30 sticky top-0 p-4 border-b">
            <SheetTitle className="text-lg">
              Update{' '}
              <Button
                type="button"
                variant={'outline'}
                className="ml-2 px-2.5 text-base capitalize"
              >
                {mess.name}
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
                      <Activity mode={isSubmitting ? 'visible' : 'hidden'}>
                        <Spinner />
                      </Activity>
                      Batalkan
                    </Button>
                  </SheetClose>
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-fit dark:bg-primary  text-primary-foreground !pointer-siswa-auto dark:primary-foreground bg-primary"
                    size={'sm'}
                  >
                    <Activity mode={isSubmitting ? 'visible' : 'hidden'}>
                      <Spinner />
                    </Activity>
                    Perbarui
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
      <DrawerContent className="flex flex-col">
        <DrawerHeader className="text-left sm:px-6 space-y-1 bg-background p-4 border-b">
          <DrawerTitle className="text-xl">
            Update{' '}
            <Button
              type="button"
              variant={'outline'}
              className="ml-2 px-2.5 text-base"
            >
              {mess.name}
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
                    <Activity mode={isSubmitting ? 'visible' : 'hidden'}>
                      <Spinner />
                    </Activity>
                    Batalkan
                  </Button>
                </DrawerClose>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-fit !pointer-siswa-auto dark:bg-primary  text-primary-foreground dark:primary-foreground bg-primary"
                  size={'sm'}
                >
                  <Activity mode={isSubmitting ? 'visible' : 'hidden'}>
                    <Spinner />
                  </Activity>
                  Perbarui
                </Button>
              </DrawerFooter>
            </MessForm>
          )}
        </form.Subscribe>
      </DrawerContent>
    </Drawer>
  )
}

export default UpdateMessSheet

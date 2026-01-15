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
import { useCreateDestinationForm } from '@/hooks/form/use-destination-form'
import DestinationForm from '../../form/destination-form'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'
import React, { Activity, useState, useRef } from 'react'

interface CreateDestinationSheetProps {
  children?: React.ReactNode | boolean
  open?: boolean
  className?: string
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>
}

function CreateDestinationSheet({  className ,...props }: CreateDestinationSheetProps) {
  // Internal state untuk uncontrolled mode
  const [internalOpen, setInternalOpen] = useState(false)
  const toastIdRef = useRef<string | number | undefined>(undefined)

  // Gunakan props jika ada, fallback ke internal state
  const isControlled = props.open !== undefined
  const open = isControlled ? props.open : internalOpen
  const setOpen = isControlled ? props.onOpenChange : setInternalOpen

  const isMobile = useIsMobile()

  const form = useCreateDestinationForm({
    onSuccess: async () => {
      // Dismiss loading toast and show success
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current)
      }
      toast.success('Destinasi berhasil ditambahkan!')
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
              Tambah Destinasi
            </Button>
          )}
        </SheetTrigger>

        <SheetContent className="flex flex-col gap-6 overflow-y-auto">
          <SheetHeader className="text-left sm:px-6 space-y-1 bg-background z-30 sticky top-0 p-4 border-b">
            <SheetTitle className="text-lg">Tambah Destinasi Baru</SheetTitle>
            <SheetDescription className="sr-only">
              Isi rincian di bawah ini untuk menambah destinasi baru
            </SheetDescription>
          </SheetHeader>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <DestinationForm form={form}>
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
                    className="w-fit"
                    size={'sm'}
                  >
                    <Activity mode={isSubmitting ? 'visible' : 'hidden'}>
                      <Spinner />
                    </Activity>
                    Tambahkan
                  </Button>
                </SheetFooter>
              </DestinationForm>
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
            Tambah Destinasi
          </Button>
        )}
      </DrawerTrigger>

      <DrawerContent className="flex flex-col max-h-[85svh]">
        <DrawerHeader className="text-left sm:px-6 space-y-1 bg-background p-4 border-b">
          <DrawerTitle className="text-xl">Tambah Destinasi Baru</DrawerTitle>
          <DrawerDescription className="text-sm">
            Isi rincian di bawah ini untuk menambah destinasi baru
          </DrawerDescription>
        </DrawerHeader>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <>
              <div className="flex-1 overflow-y-auto">
                <DestinationForm form={form} />
              </div>
              <DrawerFooter className="gap-3 px-3 py-4 w-full flex-row justify-end flex border-t sm:space-x-0">
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  form="destination-form"
                  className="w-full"
                  size={'sm'}
                >
                  <Activity mode={isSubmitting ? 'visible' : 'hidden'}>
                    <Spinner />
                  </Activity>
                  Tambahkan
                </Button>
                <DrawerClose
                  disabled={isSubmitting}
                  asChild
                  onClick={() => form.reset()}
                >
                  <Button
                    disabled={isSubmitting}
                    type="button"
                    className="w-full"
                    size={'sm'}
                    variant="outline"
                  >
                    Batalkan
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

export default CreateDestinationSheet

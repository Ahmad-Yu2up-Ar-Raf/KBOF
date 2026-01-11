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
import { useUpdateDestinationForm } from '@/hooks/form/use-destination-form'
import DestinationForm from '../../form/destination-form'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'
import { Activity, useState, useEffect, useRef } from 'react'
import { useStore } from '@tanstack/react-store'

import type { DestinationAggregateResult } from '@/types'
import type { Destination } from '@/db/schema'

type DestinationRow = DestinationAggregateResult['data'][number]

interface UpdateDestinationSheetProps {
  trigger?: boolean
  open?: boolean
  destination: DestinationRow
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>> | (() => void)
}

function UpdateDestinationSheet({ ...props }: UpdateDestinationSheetProps) {
  // Internal state untuk uncontrolled mode
  const [internalOpen, setInternalOpen] = useState(false)
  const toastIdRef = useRef<string | number | undefined>(undefined)
  const destination = props.destination

  // Gunakan props jika ada, fallback ke internal state
  const isControlled = props.open !== undefined
  const open = isControlled ? props.open : internalOpen
  const setOpen = isControlled ? props.onOpenChange : setInternalOpen

  const isMobile = useIsMobile()

  const form = useUpdateDestinationForm({
    destination: destination as unknown as Destination,
    onSuccess: async () => {
      // Dismiss loading toast and show success
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current)
      }
      toast.success('Destinasi berhasil diperbarui!')
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

  // Subscribe to isSubmitting to show loading toast

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
                {destination?.name || 'Destinasi'}
              </Button>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Isi rincian di bawah ini untuk memperbarui data destinasi
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
                    Perbarui
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
      <DrawerContent className="flex flex-col">
        <DrawerHeader className="text-left sm:px-6 space-y-1 bg-background p-4 border-b">
          <DrawerTitle className="text-xl">
            Update{' '}
            <Button
              type="button"
              variant={'outline'}
              className="ml-2 px-2.5 text-base"
            >
              {destination?.name || 'Destinasi'}
            </Button>
          </DrawerTitle>
          <DrawerDescription className="text-sm">
            Isi rincian di bawah ini untuk memperbarui data destinasi
          </DrawerDescription>
        </DrawerHeader>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <DestinationForm form={form}>
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
                  disabled={isSubmitting}
                  type="submit"
                  className="w-fit"
                  size={'sm'}
                >
                  <Activity mode={isSubmitting ? 'visible' : 'hidden'}>
                    <Spinner />
                  </Activity>
                  Perbarui
                </Button>
              </DrawerFooter>
            </DestinationForm>
          )}
        </form.Subscribe>
      </DrawerContent>
    </Drawer>
  )
}

export default UpdateDestinationSheet

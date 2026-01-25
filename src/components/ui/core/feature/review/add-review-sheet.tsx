'use client'

import React, { Activity, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Star } from 'lucide-react'

import { useNavigate } from '@tanstack/react-router'
import ReviewForm from '../form/review-form'
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
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'

import { useIsMobile } from '@/hooks/use-mobile'
import { useCreateReviewForm } from '@/hooks/form/use-review-form'
import { useCheckUserReview } from '@/hooks/use-review-mutations'
import { useSession } from '@/lib/auth/auth-client'

// ============================================
// TYPES
// ============================================

interface AddReviewSheetProps {
  destinationId: number
  destinationSlug: string
  trigger?: boolean
  open?: boolean
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>
}

// ============================================
// ADD REVIEW SHEET COMPONENT
// ============================================

function AddReviewSheet({
  destinationId,
  destinationSlug,
  ...props
}: AddReviewSheetProps) {
  // Internal state for uncontrolled mode
  const [internalOpen, setInternalOpen] = useState(false)
  const toastIdRef = useRef<string | number | undefined>(undefined)

  // Use props if available, fallback to internal state
  const isControlled = props.open !== undefined
  const open = isControlled ? props.open : internalOpen
  const setOpen = isControlled ? props.onOpenChange : setInternalOpen

  const isMobile = useIsMobile()
  const { data: session } = useSession()

  // Check if user already reviewed
  const { data: userReviewStatus, isLoading: isCheckingReview } =
    useCheckUserReview(destinationId, !!session?.user)

  const form = useCreateReviewForm({
    destinationId,
    destinationSlug,
    onSuccess: async () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current)
      }
      toast.success('Review berhasil ditambahkan! Terima kasih 🎉')
      form.reset()
      setOpen?.(false)
    },
    onError: (error: Error) => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current)
      }
      toast.error(error.message)
    },
  })
  const navigate = useNavigate()
  // Handle unauthenticated users
  const handleTriggerClick = () => {
    if (!session?.user) {
      navigate({
        to: '/auth',
      })
      toast.error('Silakan login terlebih dahulu untuk memberikan review')
      return
    }

    if (userReviewStatus?.hasReviewed) {
      toast.info('Anda sudah memberikan review untuk destinasi ini')
      return
    }

    setOpen?.(true)
  }

  // Trigger button component
  const TriggerButton = (
    <Button
      onClick={handleTriggerClick}
      disabled={isCheckingReview}
      className="w-full sm:w-fit"
    >
      {isCheckingReview ? (
        <Spinner className="size-4" />
      ) : userReviewStatus?.hasReviewed ? (
        <>
          <Star className="size-4 fill-current" />
          Sudah Direview
        </>
      ) : (
        <>
          <Plus className="size-4" />
          Bagi Pengalaman
        </>
      )}
    </Button>
  )

  // If already reviewed, show disabled state
  if (userReviewStatus?.hasReviewed) {
    return TriggerButton
  }

  // Desktop: Sheet
  if (!isMobile) {
    return (
      <Sheet open={props.open} onOpenChange={props.onOpenChange} modal={true}>
        <Activity mode={props.trigger ? 'hidden' : 'visible'}>
          <SheetTrigger asChild>{TriggerButton}</SheetTrigger>
        </Activity>
        <SheetContent className="flex flex-col z-999999999999 gap-0 overflow-y-auto">
          <SheetHeader className="text-left sm:px-6   bg-background z-30 sticky top-0 p-4 border-b">
            <SheetTitle className="text-lg flex items-center gap-2">
              Berikan Review
            </SheetTitle>
            <SheetDescription>
              Bagikan pengalaman Anda mengunjungi destinasi ini
            </SheetDescription>
          </SheetHeader>

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <ReviewForm form={form}>
                <SheetFooter className="gap-3 px-4 sm:px-7 py-4 w-full flex-row justify-end flex border-t sm:space-x-0">
                  <SheetClose
                    disabled={isSubmitting}
                    asChild
                    onClick={() => form.reset()}
                  >
                    <Button
                      disabled={isSubmitting}
                      type="button"
                      className="w-fit"
                      size="sm"
                      variant="outline"
                    >
                      Batalkan
                    </Button>
                  </SheetClose>
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-fit"
                    size="sm"
                  >
                    <Activity mode={isSubmitting ? 'visible' : 'hidden'}>
                      <Spinner />
                    </Activity>
                    Kirim Review
                  </Button>
                </SheetFooter>
              </ReviewForm>
            )}
          </form.Subscribe>
        </SheetContent>
      </Sheet>
    )
  }

  // Mobile: Drawer
  return (
    <Drawer open={open} onOpenChange={setOpen} modal={true}>
      <Activity mode={props.trigger ? 'hidden' : 'visible'}>
        <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
      </Activity>

      <DrawerContent className="flex  z-999999999999  flex-col max-h-[90vh]">
        <DrawerHeader className=" text-center sm:px-6 space-y-1 bg-background p-4 border-b">
          <DrawerTitle className="text-xl  gap-2">
            {/* <Star className="size-5 text-primary fill-primary" /> */}
            Berikan Review & pengalamanmu
          </DrawerTitle>
          <DrawerDescription className="text-sm">
            Bagikan pengalaman Anda mengunjungi destinasi ini
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto flex-1">
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <ReviewForm form={form}>
                <DrawerFooter className="gap-3 px-4 py-4 w-full flex-row justify-end flex border-t">
                  <DrawerClose
                    disabled={isSubmitting}
                    asChild
                    onClick={() => form.reset()}
                  >
                    <Button
                      disabled={isSubmitting}
                      type="button"
                      className="w-fit"
                      size="sm"
                      variant="outline"
                    >
                      Batalkan
                    </Button>
                  </DrawerClose>
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-fit"
                    size="sm"
                  >
                    <Activity mode={isSubmitting ? 'visible' : 'hidden'}>
                      <Spinner />
                    </Activity>
                    Kirim Review
                  </Button>
                </DrawerFooter>
              </ReviewForm>
            )}
          </form.Subscribe>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default AddReviewSheet

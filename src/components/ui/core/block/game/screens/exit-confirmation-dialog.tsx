// =============================================================================
// EXIT CONFIRMATION DIALOG - Quiz Game
// =============================================================================
// Modal confirmation when user wants to exit during gameplay
// =============================================================================

import { motion } from 'framer-motion'
import { LogOut, X } from 'lucide-react'

import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/fragments/shadcn-ui/dialog'

// =============================================================================
// TYPES
// =============================================================================

export type ExitConfirmationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  currentQuestion: number
  totalQuestions: number
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ExitConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  currentQuestion,
  totalQuestions,
}: ExitConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md border-destructive/20"
      >
        <DialogHeader className="gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10"
          >
            <LogOut className="size-8 text-destructive" />
          </motion.div>
          <DialogTitle className="text-center text-xl">
            Keluar dari Permainan?
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Kamu sedang di soal{' '}
            <span className="font-semibold text-foreground">
              {currentQuestion}
            </span>{' '}
            dari{' '}
            <span className="font-semibold text-foreground">
              {totalQuestions}
            </span>
            . Progres permainanmu akan hilang jika keluar sekarang.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex-col gap-2 sm:flex-col">
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="w-full gap-2"
          >
            <LogOut className="size-4" />
            Ya, Keluar
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full gap-2"
          >
            <X className="size-4" />
            Lanjutkan Bermain
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

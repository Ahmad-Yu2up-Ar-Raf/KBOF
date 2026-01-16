// =============================================================================
// PAUSE OVERLAY - Quiz Game
// =============================================================================
// Overlay displayed when game is paused
// =============================================================================

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
// =============================================================================
// TYPES
// =============================================================================

export type PauseOverlayProps = {
  onResume: () => void
  open?: boolean
  setOpen?: (open: boolean) => void
}

// =============================================================================
// COMPONENT
// =============================================================================

export function PauseOverlay({ onResume }: PauseOverlayProps) {
  return (
    <Dialog open={true} onOpenChange={onResume}>
      <DialogContent
        onClick={onResume}
        showCloseButton={false}
        className=" border-0 shadow-none bg-transparent"
      >
        <DialogHeader className=" md:gap-5">
          <DialogTitle className=" flex flex-col md:flex-col lg:flex-col gap-5  text-center text-background ">
            <span className=" text-6xl">⏸️</span>
            <span className="text-3xl md:text-4xl">Permainan Dijeda</span>
          </DialogTitle>
          <DialogDescription className=" text-accent md:text-xl text-lg w-full text-center">
            Permainan sedang dijeda. Tekan "Layar" untuk melanjutkan
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sr-only sm:space-x-0">
          <DialogClose asChild>
            <Button variant="secondary" onClick={onResume}>
              Lanjutkan
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    // <motion.div
    //   // initial={{ opacity: 0 }}
    //   // animate={{ opacity: 1 }}
    //   // exit={{ opacity: 0 }}
    //   className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    // >
    //   <motion.div
    //     // initial={{ scale: 0.9, opacity: 0 }}
    //     // animate={{ scale: 1, opacity: 1 }}
    //     // exit={{ scale: 0.9, opacity: 0 }}
    //     // className="text-center"
    //   >
    //     <div className=""></div>
    //     <h2 className="mt-4 text-2xl font-bold"></h2>
    //     <p className="mt-2 text-muted-foreground">

    //     </p>
    //     <Button size="lg" className="mt-6" onClick={onResume}>
    //       ▶️ Lanjutkan
    //     </Button>
    //   </motion.div>
    // </motion.div>
  )
}

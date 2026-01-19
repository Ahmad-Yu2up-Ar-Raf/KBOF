// ModalContext.js
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MediaItem from '@/components/ui/fragments/custom-ui/media/media-item'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { X } from 'lucide-react'

type ModalPayload = { redirectTo?: string } | null
interface ModalContextValue {
  isOpen: boolean
  payload: ModalPayload
  open: (payload?: ModalPayload) => void
  close: () => void

  // Image modal
  imageSrc: string | null
  openImage: (src: string) => void
  closeImage: () => void
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined)

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [payload, setPayload] = useState<ModalPayload>(null)

  // image modal state
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  const open = (p?: ModalPayload) => {
    setPayload(p ?? null)
    setIsOpen(true)
    // lock body scroll if needed
  }

  const close = () => {
    setIsOpen(false)
    setPayload(null)
  }

  const openImage = (src: string) => {
    setImageSrc(src)
    // optionally lock body scroll here
  }

  const closeImage = () => {
    setImageSrc(null)
  }

  // Lock body scroll when image modal is open
  useEffect(() => {
    if (imageSrc) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
    return
  }, [imageSrc])

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        payload,
        open,
        close,
        imageSrc,
        openImage,
        closeImage,
      }}
    >
      {children}

      {/* Global image modal rendered at provider root so it's mounted once */}
      <AnimatePresence>
        {imageSrc && (
          <motion.div
            key="global-image-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0  cursor-zoom-out z-9999 flex items-center justify-center bg-accent-foreground/80 backdrop-blur-md"
            onClick={closeImage}
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative rounded-2xl overflow-hidden w-full max-w-4xl p-4"
            >
              <MediaItem
                webViewLink={imageSrc}
                className="h-auto max-h-[80vh] w-full object-contain"
              />
            </motion.div>

            <Button
              onClick={closeImage}
              variant={'default'}
              className="absolute right-4 top-4    "
              aria-label="Close image view"
            >
              <X size={24} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used within ModalProvider')
  return ctx
}

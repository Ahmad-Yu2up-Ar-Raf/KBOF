'use client'
import { AnimatePresence } from 'framer-motion'
import SiteFooter from '../app/home/SiteFooter'
import { cn } from '@/lib/utils'
import ReactLenis from 'lenis/react'
import { ModalProvider } from './ContextProvider'
import { ProgressProvider } from '@bprogress/react'
import { useLocation } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/fragments/shadcn-ui/sonner'
import { useEffect, useState } from 'react'
import Preload from '@/components/ui/fragments/custom-ui/animate-ui/Preload'

const Providers = ({ children }: { children: React.ReactNode }) => {
  const disable = ['/login', '/register', '/dashboard']
  const currentPath = useLocation().pathname
  const isDisabled = disable.some((prefix) => currentPath.startsWith(prefix))

  if (!isDisabled) {
    const PRELOAD_SESSION_KEY = 'website_preload_shown'
    const [showPreload, setShowPreload] = useState(false)
    const [contentReady, setContentReady] = useState(false)
    const [isInitializing, setIsInitializing] = useState(true)
    const [isWebsiteReady, setIsWebsiteReady] = useState(false)

    useEffect(() => {
      const hasShownPreload = sessionStorage.getItem(PRELOAD_SESSION_KEY)

      const checkWebsiteReady = () => {
        if (document.readyState === 'complete') {
          console.log('🌐 Website fully loaded')
          setIsWebsiteReady(true)
          checkPreloadStatus()
        } else {
          window.addEventListener('load', () => {
            console.log('🌐 Website fully loaded (via load event)')
            setIsWebsiteReady(true)
            checkPreloadStatus()
          })
        }
      }

      // Fungsi untuk menentukan status preload
      const checkPreloadStatus = () => {
        const shouldShowPreload = !hasShownPreload
        if (shouldShowPreload) {
          console.log('🎬 Website siap, mulai preload animation')
          setShowPreload(true) // Aktifkan preload
          setContentReady(false) // Tahan konten
        } else {
          console.log('⚡ Skip preload, langsung tampilkan konten')
          setShowPreload(false) // Skip preload
          setContentReady(true) // Langsung tampilkan konten
        }

        setIsInitializing(false)
      }

      checkWebsiteReady()

      return () => {
        window.removeEventListener('load', checkWebsiteReady)
      }
    }, [])

    const handlePreloadComplete = () => {
      console.log('✅ Preload selesai, tampilkan konten')

      sessionStorage.setItem(PRELOAD_SESSION_KEY, 'true')

      setShowPreload(false)
      setContentReady(true)
    }

    if (isInitializing) {
      return (
        <div className=" flex min-h-dvh w-full  content-center justify-center items-center"/>
  
      )
    }
   return (
        <ReactLenis root>
          <ProgressProvider
            height="2px"
            color="var(--primary)"
            options={{
              showSpinner: false,
              minimum: 0.3,
              easing: 'ease',
              speed: 200,
            }}
            shallowRouting
          >
            <AnimatePresence>
              {showPreload && (
                <Preload
                  key="preload-animation"
                  onComplete={handlePreloadComplete}
                />
              )}
              {(contentReady && isWebsiteReady) && (
                <ModalProvider>
                  <Toaster position="top-center" theme="light" />

                  <div
                    key="main-content"
                    className={cn(
                      'relative  min-h-dvh w-full overflow-hidden  content-center',
                    )}
                  >
                    <div
                      className={cn(
                        'mx-auto flex flex-col gap-13   lg:gap-25   h-full w-full',
                      )}
                    >
                      {children}
                    </div>
                  </div>

                  <SiteFooter />
                </ModalProvider>
              )}
            </AnimatePresence>
          </ProgressProvider>
        </ReactLenis>
      )
  }

  return (
    <ProgressProvider
      height="2px"
      color="var(--primary)"
      options={{
        showSpinner: false,
        minimum: 0.3,
        easing: 'ease',
        speed: 200,
      }}
      shallowRouting
    >
      <AnimatePresence>
        <Toaster position="top-center" theme="light" />

        <div
          key="main-content"
          className={cn(
            'relative  min-h-dvh w-full overflow-hidden  content-center',
          )}
        >
          <div
            className={cn(
              'mx-auto flex flex-col gap-13   lg:gap-25   h-full w-full',
            )}
          >
            {children}
          </div>
        </div>
      </AnimatePresence>
    </ProgressProvider>
  )
}

export default Providers

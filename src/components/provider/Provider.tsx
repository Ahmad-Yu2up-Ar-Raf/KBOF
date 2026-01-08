'use client'
import { AnimatePresence } from 'framer-motion'

import { ModalProvider } from './context-provider'
import { ProgressProvider } from '@bprogress/react'
import { Toaster } from '@/components/ui/fragments/shadcn-ui/sonner'
import { Activity, useEffect, useState } from 'react'
import Preload from '@/components/ui/fragments/custom-ui/animate-ui/Preload'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'
import { LayoutWrapper } from './layout-wrapper'
import { useMatches } from '@tanstack/react-router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

export { queryClient }

const Providers = ({ children }: { children: React.ReactNode }) => {
  const matches = useMatches()
  const currentRouteId = matches[matches.length - 1]?.routeId

  // Routes yang skip preload animation
  const routesWithoutPreload = [
    '/(auth)/login',
    '/(auth)/register',
    '/dashboard',
    '/$', // 404 page
  ]

  const shouldShowPreload = !routesWithoutPreload.some((routeId) =>
    currentRouteId?.startsWith(routeId),
  )

  const PRELOAD_SESSION_KEY = 'website_preload_shown'
  const [showPreload, setShowPreload] = useState(false)
  const [contentReady, setContentReady] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isWebsiteReady, setIsWebsiteReady] = useState(false)

  useEffect(() => {
    const hasShownPreload = sessionStorage.getItem(PRELOAD_SESSION_KEY)

    const checkWebsiteReady = () => {
      if (document.readyState === 'complete') {
        setIsWebsiteReady(true)
        checkPreloadStatus()
      } else {
        window.addEventListener('load', () => {
          setIsWebsiteReady(true)
          checkPreloadStatus()
        })
      }
    }

    const checkPreloadStatus = () => {
      // Kalau route gak butuh preload, langsung show content
      if (!shouldShowPreload) {
        setShowPreload(false)
        setContentReady(true)
        setIsInitializing(false)
        return
      }

      // Kalau udah pernah show preload, skip
      if (hasShownPreload) {
        setShowPreload(false)
        setContentReady(true)
      } else {
        setShowPreload(true)
        setContentReady(false)
      }

      setIsInitializing(false)
    }

    checkWebsiteReady()

    return () => {
      window.removeEventListener('load', checkWebsiteReady)
    }
  }, [shouldShowPreload])

  const handlePreloadComplete = () => {
    sessionStorage.setItem(PRELOAD_SESSION_KEY, 'true')
    setShowPreload(false)
    setContentReady(true)
  }

  if (isInitializing) {
    return (
      <div className="flex min-h-dvh w-full content-center justify-center items-center">
        <Spinner className="size-8 text-primary" />
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
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
        <AnimatePresence mode="wait">
          <Toaster position="top-center" theme="light" />

          <Activity mode={showPreload ? 'visible' : 'hidden'}>
            <Preload
              key="preload-animation"
              onComplete={handlePreloadComplete}
            />
          </Activity>
          <Activity
            mode={contentReady && isWebsiteReady ? 'visible' : 'hidden'}
          >
            <ModalProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </ModalProvider>
          </Activity>
        </AnimatePresence>
      </ProgressProvider>
    </QueryClientProvider>
  )
}

export default Providers

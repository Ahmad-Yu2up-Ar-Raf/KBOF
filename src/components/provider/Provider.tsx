'use client'
import { AnimatePresence } from 'framer-motion'

import { ModalProvider } from './context-provider'
import { InfiniteScrollProvider } from './infinite-scroll-context'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'
import { Toaster } from '@/components/ui/fragments/shadcn-ui/sonner'
import { useEffect, useState } from 'react'
import Preload from '@/components/ui/fragments/custom-ui/animate-ui/preload-animation'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { LayoutWrapper } from './layout-wrapper'
import { useMatches } from '@tanstack/react-router'
import { Spinner } from '../ui/fragments/shadcn-ui/spinner'

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
    '/profile',
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
      <div className="flex min-h-lvh w-full content-center justify-center items-center">
        <Spinner className=" size-6" />
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" theme="light" />
      <NuqsAdapter>
        <AnimatePresence mode="wait">
          {showPreload ? (
            <Preload
              key="preload-animation"
              onComplete={handlePreloadComplete}
            />
          ) : contentReady && isWebsiteReady ? (
            <ModalProvider key="main-content">
              <InfiniteScrollProvider>
                <LayoutWrapper>{children}</LayoutWrapper>
              </InfiniteScrollProvider>
            </ModalProvider>
          ) : null}
        </AnimatePresence>
      </NuqsAdapter>
    </QueryClientProvider>
  )
}

export default Providers

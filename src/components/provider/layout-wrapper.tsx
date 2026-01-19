import { useMatches, useRouter } from '@tanstack/react-router'
import { Activity, useEffect, useRef } from 'react'
import ReactLenis, { useLenis } from 'lenis/react'
import SiteFooter from '../ui/core/layout/nav/site-footer'
import SiteBorder from '../ui/core/layout/nav/site-border'
import { SiteHeader, SiteHeaderMobile } from '../ui/core/layout/nav/site-header'
import SiteNavbar from '../ui/core/layout/nav/site-navbar'
import { useShouldShowFooter } from './infinite-scroll-context'
import type { ReactNode } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

interface LayoutWrapperProps {
  children: ReactNode
}

// ============================================
// SCROLL TO TOP COMPONENT (with Lenis smooth scroll)
// ============================================
function ScrollToTop() {
  const lenis = useLenis()
  const router = useRouter()
  const previousPathRef = useRef<string>(router.state.location.pathname)

  useEffect(() => {
    // Subscribe to router events - 'onResolved' fires AFTER navigation completes
    const unsubscribe = router.subscribe('onResolved', ({ toLocation }) => {
      const currentPath = toLocation.pathname

      // Only scroll to top when pathname actually changes
      if (previousPathRef.current !== currentPath) {
        // Small delay to ensure DOM is updated
        requestAnimationFrame(() => {
          if (lenis) {
            // Smooth scroll to top with Lenis
            lenis.scrollTo(0, {
              duration: 0.8,
              easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
            })
          } else {
            // Fallback: smooth scroll without Lenis
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        })
        previousPathRef.current = currentPath
      }
    })

    return () => unsubscribe()
  }, [router, lenis])

  return null
}

// ============================================
// SCROLL TO TOP (Native - for layouts without Lenis)
// ============================================
function ScrollToTopNative() {
  const router = useRouter()
  const previousPathRef = useRef<string>(router.state.location.pathname)

  useEffect(() => {
    const unsubscribe = router.subscribe('onResolved', ({ toLocation }) => {
      const currentPath = toLocation.pathname

      if (previousPathRef.current !== currentPath) {
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        })
        previousPathRef.current = currentPath
      }
    })

    return () => unsubscribe()
  }, [router])

  return null
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const matches = useMatches()
  const currentRouteId = matches[matches.length - 1]?.routeId
  const shouldShowFooter = useShouldShowFooter()
  const isMobile = useIsMobile()

  // Routes yang gak butuh footer/border
  const routesWithoutChrome = [
    // '/(auth)/login',
    // '/(auth)/register',
    '/dashboard',
    '/profile',
    '/$', // 404 page
  ]

  const shouldShowChrome = !routesWithoutChrome.some((routeId) =>
    currentRouteId?.startsWith(routeId),
  )

  if (shouldShowChrome) {
    return (
      <ReactLenis root>
        <ScrollToTop />

        {!isMobile && <SiteBorder />}
        <SiteNavbar />
        {/* Add padding-bottom on mobile to account for fixed navbar */}
        <div
          className={cn(
            'relative  pb-10 md:overflow-visible overflow-hidden min-h-svh w-full ',
          )}
        >
          <div
            className={cn(
              'mx-auto flex  lg:gap-30 relative overflow-x-hidden   md:overflow-visible  flex-col  gap-10 sm:gap-8  content-center  h-full w-full',
            )}
          >
            {children}
            <div className=" fixed top-0 h-50 inset-0 bg-linear-to-t from-background/0 via-background/0 to-background     " />
            {/* <div className=" fixed bottom-0 h-full inset-0 bg-linear-to-b from-background/30 via-background/0 to-background     " /> */}
          </div>
        </div>
        {/* Footer only shows when shouldShowFooter is true */}
        {shouldShowFooter && <SiteFooter />}
  
      </ReactLenis>
    )
  }

  // Layout minimal untuk auth/dashboard/404
  return (
    <div className={cn('relative min-h-svh w-full   content-center')}>
      <ScrollToTopNative />
      <div
        className={cn('mx-auto flex flex-col gap-13 lg:gap-25 h-full w-full')}
      >
        {children}
      </div>
    </div>
  )
}

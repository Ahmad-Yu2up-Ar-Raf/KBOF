import { useMatches, useRouter } from '@tanstack/react-router'
import { Activity, useEffect, useRef } from 'react'
import SiteFooter from '../ui/core/layout/nav/site-footer'
import SiteBorder from '../ui/core/layout/nav/site-border'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import ReactLenis, { useLenis } from 'lenis/react'
import SiteHeader from '../ui/core/layout/nav/site-header'
import { useShouldShowFooter } from './infinite-scroll-context'
import { useIsMobile } from '@/hooks/use-mobile'
import SiteNavbar from '../ui/core/layout/nav/site-navbar'

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
            'relative  overflow-hidden pb-10 min-h-lvh w-full ',
            // isMobile && 'pb-[12lvh]', // Extra space for mobile bottom navbar
          )}
        >
          <div
            className={cn(
              'mx-auto flex  relative  flex-col  gap-10 sm:gap-8  content-center  h-full w-full',
            )}
          >
            {children}
          </div>
        </div>
        {/* Footer only shows when shouldShowFooter is true */}
        {shouldShowFooter && <SiteFooter />}
        <SiteHeader />
      </ReactLenis>
    )
  }

  // Layout minimal untuk auth/dashboard/404
  return (
    <div className={cn('relative min-h-lvh w-full   content-center')}>
      <ScrollToTopNative />
      <div
        className={cn('mx-auto flex flex-col gap-13 lg:gap-25 h-full w-full')}
      >
        {children}
      </div>
    </div>
  )
}

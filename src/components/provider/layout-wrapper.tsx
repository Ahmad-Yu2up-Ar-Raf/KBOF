import { useMatches, useRouter } from '@tanstack/react-router'
import { Activity, useEffect, useRef, useState } from 'react'
import ReactLenis, { useLenis } from 'lenis/react'
import SiteFooter from '../ui/core/layout/nav/site-footer'
import SiteBorder from '../ui/core/layout/nav/site-border'
import { SiteHeader, SiteHeaderMobile } from '../ui/core/layout/nav/site-header'
import SiteNavbar from '../ui/core/layout/nav/site-navbar'
import { useShouldShowFooter } from './infinite-scroll-context'
import type { ReactNode } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { Progress } from '../ui/fragments/shadcn-ui/progress'
import { useNavigationProgress } from '@/lib/ui/useNavigationProgress'
import { useIsFetching } from '@tanstack/react-query'

interface LayoutWrapperProps {
  children: ReactNode
}

// ============================================
// SCROLL TO TOP COMPONENT (with Lenis smooth scroll)
// ============================================
function ScrollToTop({ navigateKey }: { navigateKey: number }) {
  const lenis = useLenis()

  useEffect(() => {
    // When `navigateKey` increments, the route just changed — scroll immediately.
    requestAnimationFrame(() => {
      if (lenis) {
        lenis.scrollTo(0, {
          duration: 0.8,
          easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
        })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
  }, [navigateKey, lenis])

  return null
}

// ============================================
// SCROLL TO TOP (Native - for layouts without Lenis)
// ============================================
function ScrollToTopNative({ navigateKey }: { navigateKey: number }) {
  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }, [navigateKey])

  return null
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const matches = useMatches()
  const currentRouteId = matches[matches.length - 1]?.routeId
  const shouldShowFooter = useShouldShowFooter()
  const isMobile = useIsMobile()
  const router = useRouter()
  const pathname = router.state.location.pathname

  // Progress/loading state for top progress bar (shared provider)
  const [navigateKey, setNavigateKey] = useState(0)
  const { start, complete, progress, visible } = useNavigationProgress()
  const isFetching = useIsFetching()
  const resolveRef = useRef<boolean>(false)

  // Routes yang gak butuh footer/border
  const routesWithoutChrome = [
    '/dashboard',
    '/profile',
    '/$', // 404 page
  ]

  const shouldShowChrome = !routesWithoutChrome.some((routeId) =>
    currentRouteId?.startsWith(routeId),
  )

  // Start progress and immediate scroll when pathname changes
  useEffect(() => {
    // Trigger scroll inside the Lenis provider via key prop
    setNavigateKey((k) => k + 1)

    // Start shared navigation progress (start quickly)
    start()

    // mark that current navigation hasn't resolved yet
    resolveRef.current = false

    return () => {
      // nothing to clean here; provider handles its own timers
    }
  }, [pathname, start])

  // Listen for route resolution to finish progress; combine with react-query
  useEffect(() => {
    const unsubscribe = router.subscribe('onResolved', ({ toLocation }) => {
      if (toLocation.pathname !== pathname) return

      // mark resolved; if there are no fetches, complete immediately;
      // otherwise wait for react-query fetching to reach 0 (see next effect)
      resolveRef.current = true
      if (isFetching === 0) {
        complete()
      }
    })

    return () => unsubscribe()
  }, [router, pathname, isFetching, complete])

  // when react-query finishes fetching, and the route has resolved, complete
  useEffect(() => {
    if (isFetching === 0 && resolveRef.current) {
      complete()
    }
  }, [isFetching, complete])

  if (shouldShowChrome) {
    return (
      <ReactLenis root>
        <ScrollToTop navigateKey={navigateKey} />

        {/* Top progress bar */}
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
          {visible && (
            <div className="w-full">
              <Progress value={Math.round(progress)} />
            </div>
          )}
        </div>

        {!isMobile && <SiteBorder />}
        <SiteNavbar />
        {/* Add padding-bottom on mobile to account for fixed navbar */}
        <div
          className={cn(
            'relative   md:overflow-visible overflow-hidden  w-full ',
            // currentRouteId != '/game' && '   min-h-svh',
          )}
        >
          <div
            className={cn(
              'mx-auto flex  lg:gap-25 relative overflow-x-hidden   md:overflow-visible  flex-col  gap-10 sm:gap-8  content-center  h-full w-full',
            )}
          >
            {children}
            <div className=" fixed top-0  pointer-events-none h-50 inset-0 bg-linear-to-t from-background/0 via-background/0 to-background     " />
          </div>
        </div>
        {/* Footer only shows when shouldShowFooter is true */}
        {shouldShowFooter && <SiteFooter />}
        <SiteHeaderMobile />
      </ReactLenis>
    )
  }

  // Layout minimal untuk auth/dashboard/404
  return (
    <div className={cn('relative min-h-svh w-full   content-center')}>
      {/* Top progress bar for native layout */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        {visible && (
          <div className="w-full">
            <Progress value={Math.round(progress)} />
          </div>
        )}
      </div>

      <ScrollToTopNative navigateKey={navigateKey} />
      <div
        className={cn('mx-auto flex flex-col gap-13 lg:gap-25 h-full w-full')}
      >
        {children}
      </div>
    </div>
  )
}

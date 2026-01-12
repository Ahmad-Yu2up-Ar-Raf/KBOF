import { useMatches } from '@tanstack/react-router'
import SiteFooter from '../ui/core/layout/nav/site-footer'
import SiteBorder from '../ui/core/layout/nav/site-border'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import ReactLenis from 'lenis/react'
import SiteHeader from '../ui/core/layout/nav/site-header'
import { useShouldShowFooter } from './infinite-scroll-context'
import { useIsMobile } from '@/hooks/use-mobile'

interface LayoutWrapperProps {
  children: ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const matches = useMatches()
  const currentRouteId = matches[matches.length - 1]?.routeId
  const shouldShowFooter = useShouldShowFooter()
  const isMobile = useIsMobile()
  // Routes yang gak butuh footer/border
  const routesWithoutChrome = [
    '/(auth)/login',
    '/(auth)/register',
    '/dashboard',
    '/$', // 404 page
  ]

  const shouldShowChrome = !routesWithoutChrome.some((routeId) =>
    currentRouteId?.startsWith(routeId),
  )

  if (shouldShowChrome) {
    return (
      <ReactLenis root>
        {!isMobile && <SiteBorder />}
        <div className={cn('relative min-h-lvh w-full  pb-10  ')}>
          <div
            className={cn(
              'mx-auto flex  flex-col gap-13 lg:gap-25 h-full w-full',
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
      <div
        className={cn('mx-auto flex flex-col gap-13 lg:gap-25 h-full w-full')}
      >
        {children}
      </div>
    </div>
  )
}

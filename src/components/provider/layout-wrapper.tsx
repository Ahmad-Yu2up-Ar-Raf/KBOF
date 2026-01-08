import { useMatches } from '@tanstack/react-router'
import SiteFooter from '../ui/core/layout/nav/site-footer'
import SiteBorder from '../ui/core/layout/nav/site-border'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import ReactLenis from 'lenis/react'

interface LayoutWrapperProps {
  children: ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const matches = useMatches()
  const currentRouteId = matches[matches.length - 1]?.routeId

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
        <SiteBorder />

        <div className={cn('relative min-h-dvh w-full overflow-hidden  ')}>
          <div
            className={cn(
              'mx-auto flex flex-col gap-13 lg:gap-25 h-full w-full',
            )}
          >
            {children}
          </div>
        </div>
        <SiteFooter />
      </ReactLenis>
    )
  }

  // Layout minimal untuk auth/dashboard/404
  return (
    <div
      className={cn('relative min-h-dvh w-full overflow-hidden content-center')}
    >
      <div
        className={cn('mx-auto flex flex-col gap-13 lg:gap-25 h-full w-full')}
      >
        {children}
      </div>
    </div>
  )
}

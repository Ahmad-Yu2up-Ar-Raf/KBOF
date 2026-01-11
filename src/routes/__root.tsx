import {
  HeadContent,
  Scripts,
  createRootRoute,
  useRouteContext,
  useRouterState,
} from '@tanstack/react-router'
import appCss from '@/styles/styles.css?url'
import Providers from '@/components/provider/Provider'
import { NotFoundPage } from '@/components/ui/core/block/not-found-block-page'
import NProgress from 'nprogress'
import { useEffect } from 'react'
// ============================================
// ROOT ROUTE
// ============================================

export const Route = createRootRoute({
  notFoundComponent: () => {
    return <NotFoundPage />
  },

  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Suasana | Jelajahi budaya & wisata local indonesia',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  //  const routerState = useRouterState()

  //  useEffect(() => {
  //    if (routerState.isLoading) {
  //      NProgress.start()
  //    } else {
  //      NProgress.done()
  //    }
  //  }, [routerState.isLoading])
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <HeadContent />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Scripts />
      </body>
    </html>
  )
}

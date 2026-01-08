import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import appCss from '@/styles/styles.css?url'
import Providers from '@/components/provider/Provider'
import { NotFoundPage } from '@/components/ui/core/block/not-found-block-page'

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
        title: 'TanStack Start Starter',
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

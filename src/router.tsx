import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { NotFoundPage } from '@/components/ui/core/block/not-found-block-page'
import { Spinner } from './components/ui/fragments/shadcn-ui/spinner'

// Import the generated route tree

// ============================================
// ROUTER FACTORY
// ============================================

/**
 * Creates a router instance
 * @returns Router instance
 */
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    // Disable default scroll restoration - we handle it manually
    scrollRestoration: false,
    notFoundMode: 'root',
    defaultPreloadStaleTime: 0,

    // 👇 Global 404 handler
    defaultNotFoundComponent: NotFoundPage,

    defaultErrorComponent: ({ error }) => (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">An error occurred</h1>
        <pre className="primary-foreground space-pre-wrap bg-red-50 p-4 rounded">
          {error.message}
        </pre>
      </div>
    ),

    // 👇 Tambahan: Handle SSR errors
    defaultPendingComponent: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-8 w-8 animate-spin text-primary" />
      </div>
    ),
  })

  return router
}

// ============================================
// TYPE DECLARATIONS
// ============================================

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}

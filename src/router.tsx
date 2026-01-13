import { createRouter } from '@tanstack/react-router'
import { NotFoundPage } from '@/components/ui/core/block/not-found-block-page'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

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
        <p>Loading...</p>
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

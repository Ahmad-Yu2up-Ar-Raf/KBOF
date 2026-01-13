import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

import DestinasiBlock, {
  DestinasiBlockSkeleton,
} from '@/components/ui/core/block/destinasi/destinasi-block'

import HeaderDestinasi from '@/components/ui/core/block/destinasi/destinasi-header'
import { queryClient } from '@/components/provider/Provider'
import { getDestinasiInfiniteQueryOptions } from '@/lib/query-options'

// Route with loader for initial data prefetch
export const Route = createFileRoute('/destinasi/')({
  // Loader prefetches initial page with default filters
  loader: async () => {
    // Default filters matching what DestinasiBlock uses initially
    const defaultFilters = {
      limit: 12,
      search: '',
      categories: [],
      types: [],
      provinces: [],
      sortBy: 'popular' as const,
    }

    // Prefetch first page of infinite query
    await queryClient.prefetchInfiniteQuery(
      getDestinasiInfiniteQueryOptions(defaultFilters),
    )
  },
  component: RouteComponent,
  pendingComponent: DestinasiBlockSkeleton,
})

function RouteComponent() {
  return (
    <div className="mx-auto container max-w-6xl space-y-4 pt-5">
      <Suspense fallback={<DestinasiBlockSkeleton />}>
        <DestinasiContent />
      </Suspense>
    </div>
  )
}

// Separate component to use nuqs hooks
function DestinasiContent() {
  return (
    <>
      <HeaderDestinasi />
      <DestinasiBlock />
    </>
  )
}

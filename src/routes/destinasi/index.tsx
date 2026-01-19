import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

import { PlusCircle } from 'lucide-react'
import DestinasiBlock, {
  DestinasiBlockSkeleton,
} from '@/components/ui/core/block/destinasi/destinasi-block'

import { queryClient } from '@/components/provider/Provider'
import { getDestinasiInfiniteQueryOptions } from '@/lib/query-options'
import KatalogHeader from '@/components/ui/fragments/custom-ui/typography/katalog-header'
import CreateDestinationSheet from '@/components/ui/core/feature/data-table/destination/create-destination-sheet'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'

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
  pendingComponent: PendingComponent,
})

function RouteComponent() {
  return (
    <div className="mx-auto container max-w-6xl space-y-4 ">
      <KatalogHeader
        titleMain="Ruang"
        titleSecond="Destinasi"
        placholder='Cari destinasi...'
        linkText="Ajukan Destinasi Lokal"
        subTitle="Ruang Destinasi Suasana Lokal"
        deskription="Temukan destinasi wisata unik, rasakan kehangatan budaya lokal."
      >
        <CreateDestinationSheet>
          <Button
            className={' m-auto md:mr-0 text-sm  mt-3 w-full md:max-w-3xs '}
          >
            Ajukan Destinasi Lokal
            <PlusCircle />
          </Button>
        </CreateDestinationSheet>
      </KatalogHeader>

      <Suspense fallback={<DestinasiBlockSkeleton />}>
        <DestinasiBlock />
      </Suspense>
    </div>
  )
}

// Pending component - Header tetap visible!
function PendingComponent() {
  return (
    <div className="mx-auto container max-w-6xl space-y-4 ">
      {/* Header tetap di-render saat pending */}
      <KatalogHeader
        titleMain="Ruang"
        titleSecond="Destinasi"
        placholder="Cari destinasi..."
        linkText="Ajukan Destinasi Lokal"
        subTitle="Ruang Destinasi Suasana Lokal"
        deskription="Temukan destinasi wisata unik, rasakan kehangatan budaya lokal."
      >
        <CreateDestinationSheet>
          <Button
            className={' m-auto md:mr-0 text-sm  mt-3 w-full md:max-w-3xs '}
          >
            Ajukan Destinasi Lokal
            <PlusCircle />
          </Button>
        </CreateDestinationSheet>
      </KatalogHeader>

      {/* Hanya skeleton content */}
      <DestinasiBlockSkeleton />
    </div>
  )
}

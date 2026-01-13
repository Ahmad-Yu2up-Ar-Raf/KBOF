import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import DestinasiDetailBlock, { DestinasiDetailSkeleton } from '@/components/ui/core/block/destinasi/detail/destinasi-detail-block'
import { getDestinasiDetailQueryOptions } from '@/lib/query-options'
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'
 
import { cn } from '@/lib/utils'
 
import { queryClient } from '@/components/provider/Provider'

export const Route = createFileRoute('/destinasi/$destinasiId/')({
  // Server loader untuk prefetch data
  loader: async ({ params }) => {
    await queryClient.ensureQueryData(
      getDestinasiDetailQueryOptions(params.destinasiId),
    )
  },
  component: RouteComponent,
  // Loading state saat navigasi
  pendingComponent: DestinasiDetailSkeleton,
})

function RouteComponent() {
  const { destinasiId } = Route.useParams()

  // useSuspenseQuery - data sudah di prefetch di loader
  const { data: destination } = useSuspenseQuery(
    getDestinasiDetailQueryOptions(destinasiId),
  )

  // Not found state
  if (!destination) {
    return (
      <div className="container mx-auto py-20 text-center space-y-6">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold">Destinasi Tidak Ditemukan</h1>
        <p className="text-muted-foreground">
          Maaf, destinasi yang Anda cari tidak tersedia atau sudah dihapus.
        </p>
        <Link
          to="/destinasi"
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          Kembali ke Eksplorasi
        </Link>
      </div>
    )
  }

  return <DestinasiDetailBlock destination={destination} />
}

// ============================================
// SKELETON COMPONENT - Matches new detail block UI
// ============================================

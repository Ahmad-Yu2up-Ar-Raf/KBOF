import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import DestinasiDetailBlock from '@/components/ui/core/block/destinasi/detail/destinasi-detail-block'
import { getDestinasiDetailQueryOptions } from '@/lib/query-options'
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/destinasi/$destinasiId')({
  component: RouteComponent,
  // Loading state saat navigasi
  pendingComponent: DestinasiDetailSkeleton,
})

function RouteComponent() {
  const { destinasiId } = Route.useParams()

  // useQuery dengan query options - TanStack Query akan handle caching
  const {
    data: destination,
    isLoading,
    isError,
    error,
  } = useQuery(getDestinasiDetailQueryOptions(destinasiId))

  // Loading state
  if (isLoading) {
    return <DestinasiDetailSkeleton />
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto py-20 text-center space-y-6">
        <div className="text-6xl mb-4">😵</div>
        <h1 className="text-2xl font-bold">Terjadi Kesalahan</h1>
        <p className="text-muted-foreground">
          {error?.message || 'Gagal memuat data destinasi'}
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
// SKELETON COMPONENT
// ============================================
function DestinasiDetailSkeleton() {
  return (
    <div className="container py-7 px-5 space-y-7">
      {/* Nav skeleton */}
      <nav className="flex items-center gap-2">
        <ArrowLeft className="size-5 text-muted-foreground" />
        <Skeleton className="h-5 w-16" />
      </nav>

      {/* Content skeleton */}
      <section className="min-h-lvh space-y-6">
        <div className="max-w-xl h-full content-center space-y-6">
          {/* Avatar & User info */}
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 md:size-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-4">
            <Skeleton className="h-10 md:h-14 w-3/4" />
            <div className="h-1 w-36 bg-muted rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Button skeleton */}
            <Skeleton className="h-10 w-40 mt-6" />
          </div>
        </div>

        {/* Image skeleton */}
        <div className="outline-2 p-2 rounded-2xl">
          <Skeleton className="rounded-2xl md:min-h-[30em] min-h-[20em] w-full" />
        </div>
      </section>
    </div>
  )
}

export { DestinasiDetailSkeleton }

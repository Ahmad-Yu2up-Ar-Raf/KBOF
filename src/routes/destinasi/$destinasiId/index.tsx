import { Link, createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import { ArrowLeft, MoreVertical } from 'lucide-react'
import DestinasiDetailBlock from '@/components/ui/core/block/destinasi/detail/destinasi-detail-block'
import { getDestinasiDetailQueryOptions } from '@/lib/query-options'
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
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
function DestinasiDetailSkeleton() {
  const isMobile = useIsMobile()

  // Mobile Skeleton
  if (isMobile) {
    return (
      <div>
        {/* Cover Image Skeleton */}
        <Skeleton className="h-[12em] w-full" />

        {/* Navigation Skeleton */}
        <nav className="z-50 absolute top-3 w-full">
          <div className="relative w-full px-5 container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowLeft className="size-5 text-muted-foreground/50" />
            </div>
            <MoreVertical className="size-5 text-muted-foreground/50" />
          </div>
        </nav>

        <div className="space-y-2">
          <section className="min-h-svh space-y-6">
            <section className="max-w-5xl h-full sm:px-10 pt-2.5 w-full container content-center sm:pt-0 px-6 space-y-6">
              {/* Title & Location Skeleton */}
              <div className="space-y-4">
                <header className="space-y-2">
                  <Skeleton className="h-9 w-3/4" />
                  <Skeleton className="h-4 w-48" />
                </header>
                <div className="h-0.5 w-36 bg-muted rounded-full" />

                {/* Stats Badges Skeleton */}
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>

                {/* Description Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Skeleton className="h-10 w-full sm:w-36" />
                  <Skeleton className="h-10 w-full sm:w-28" />
                </div>
              </div>

              {/* Image Gallery Skeleton */}
              <div className="w-full space-y-2">
                <Skeleton className="h-[45svh] w-full rounded-xl" />
                <div className="flex gap-2 overflow-hidden">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton
                      key={i}
                      className="h-18 w-1/4 rounded-xl shrink-0"
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Reviews Section Skeleton */}
            <section className="sm:px-10 pt-2.5 sm:pt-0 px-6 container content-center space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-7 w-32" />
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 border rounded-xl space-y-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </section>
        </div>
      </div>
    )
  }

  // Desktop Skeleton
  return (
    <div className="max-w-5xl m-auto w-full">
      {/* Navigation Skeleton */}
      <nav className="z-50 absolute max-w-6xl m-auto top-3 w-full">
        <div className="relative w-full px-10 container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeft className="size-5 text-muted-foreground/50" />
            <Skeleton className="h-5 w-16" />
          </div>
          <MoreVertical className="size-5 text-muted-foreground/50" />
        </div>
      </nav>

      {/* Cover Image Skeleton */}
      <Skeleton className="h-[17em] w-full" />

      <div className="space-y-2 mt-10">
        <section className="min-h-svh space-y-6">
          <section className="h-full sm:px-10 pt-4 w-full md:flex md:justify-between md:gap-10 lg:gap-25 container content-center sm:pt-0 px-6 relative space-y-6">
            {/* Left Content */}
            <div className="space-y-10 flex-1">
              <div className="space-y-4">
                {/* Title & Location */}
                <header className="space-y-2">
                  <Skeleton className="h-12 w-3/4" />
                  <Skeleton className="h-4 w-48" />
                </header>
                <div className="h-0.5 w-36 bg-muted rounded-full" />

                {/* Stats Badges */}
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>

                {/* Description */}
                <div className="space-y-2 max-w-xl">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Skeleton className="h-10 w-36" />
                  <Skeleton className="h-10 w-28" />
                </div>
              </div>

              {/* Reviews Section Skeleton */}
              <section className="space-y-4">
                <Skeleton className="h-7 w-32" />
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 border rounded-xl space-y-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right: Image Gallery Skeleton */}
            <div className="w-full md:w-[28em] h-full sticky top-2 space-y-2">
              <Skeleton className="md:h-[27em] h-[45svh] w-full rounded-xl" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-18 flex-1 rounded-xl" />
                ))}
              </div>
            </div>
          </section>
        </section>
      </div>
    </div>
  )
}

export { DestinasiDetailSkeleton }

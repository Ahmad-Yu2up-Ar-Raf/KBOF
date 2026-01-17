import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'

import ArtikelDetailBlock from '@/components/ui/core/block/article/detail/artikel-detail-block'
import { getArticleDetailQueryOptions } from '@/lib/query-options'
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton'
import { cn } from '@/lib/utils'
import { queryClient } from '@/components/provider/Provider'

export const Route = createFileRoute('/artikel/$artikelId')({
  component: RouteComponent,
  // Loading state saat navigasi
  loader: async ({ params }) => {
    await queryClient.ensureQueryData(
      getArticleDetailQueryOptions(params.artikelId),
    )
  },
  pendingComponent: ArtikelDetailSkeleton,
})

function RouteComponent() {
  const { artikelId } = Route.useParams()

  // useQuery dengan query options - TanStack Query akan handle caching
  const {
    data: article,
    isLoading,
    isError,
    error,
  } = useQuery(getArticleDetailQueryOptions(artikelId))

  // Loading state
  if (isLoading) {
    return <ArtikelDetailSkeleton />
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto py-20 text-center space-y-6">
        <div className="text-6xl mb-4">😵</div>
        <h1 className="text-2xl font-bold">Terjadi Kesalahan</h1>
        <p className="text-muted-foreground">
          {error.message || 'Gagal memuat data artikel'}
        </p>
        <Link
          to="/artikel"
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          Kembali ke Artikel
        </Link>
      </div>
    )
  }

  // Not found state
  if (!article) {
    return (
      <div className="container mx-auto py-20 text-center space-y-6">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold">Artikel Tidak Ditemukan</h1>
        <p className="text-muted-foreground">
          Maaf, artikel yang Anda cari tidak tersedia atau sudah dihapus.
        </p>
        <Link
          to="/artikel"
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          Kembali ke Artikel
        </Link>
      </div>
    )
  }

  return <ArtikelDetailBlock article={article} />
}

// ============================================
// SKELETON COMPONENT
// ============================================
function ArtikelDetailSkeleton() {
  return (
    <div className="space-y-7   py-6 sm:pt-5   container  px-6 ">
      {/* Nav skeleton */}
      <nav className="flex items-center gap-2">
        <ArrowLeft className="size-5 text-muted-foreground" />
        <Skeleton className="h-5 w-16" />
      </nav>

      {/* Content skeleton */}
      <section className="min-h-svh space-y-6">
        <div className="max-w-3xl h-full content-center space-y-6">
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
          </div>
        </div>

        {/* Image skeleton */}
        <div className="outline-2 p-2 rounded-2xl">
          <Skeleton className="rounded-2xl md:min-h-[30em] min-h-[20em] w-full" />
        </div>

        {/* Content skeleton */}
        <div className="max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </section>
    </div>
  )
}

export { ArtikelDetailSkeleton }

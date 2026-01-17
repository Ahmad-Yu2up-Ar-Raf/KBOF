import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import ArticleBlock, {
  ArticleBlockSkeleton,
} from '@/components/ui/core/block/article/article-block'
import ArticleHeader from '@/components/ui/fragments/custom-ui/typography/katalog-header'
import { queryClient } from '@/components/provider/Provider'
import { getArticleInfiniteQueryOptions } from '@/lib/query-options'
import KatalogHeader from '@/components/ui/fragments/custom-ui/typography/katalog-header'
import CreateArticleSheet from '@/components/ui/core/feature/data-table/article/create-article-sheet'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { PlusCircle } from 'lucide-react'

// Route with loader for initial data prefetch
export const Route = createFileRoute('/artikel/')({
  // Loader prefetches initial page with default filters
  loader: async () => {
    // Default filters matching what ArticleBlock uses initially
    const defaultFilters = {
      limit: 12,
      search: '',
      sortBy: 'newest' as const,
    }

    // Prefetch first page of infinite query
    await queryClient.prefetchInfiniteQuery(
      getArticleInfiniteQueryOptions(defaultFilters),
    )
  },
  component: RouteComponent,
  pendingComponent: PendingComponent,
})

function RouteComponent() {
  return (
    <div className="mx-auto container max-w-6xl space-y-4  ">
      <KatalogHeader
        titleMain="Kisah"
        titleSecond="Lokal*"
        linkText="Suarakan Ceritamu"
        subTitle="Setiap tempat punya cerita"
        deskription="   Dengarkan suara hati lokal melalui artikel-artikel inspiratif yang
              menghubungkan budaya, cerita."
      >
        <CreateArticleSheet>
          <Button
            className={' m-auto md:mr-0 text-sm  mt-3 w-full md:max-w-3xs '}
          >
            Suarakan Ceritamu
            <PlusCircle />
          </Button>
        </CreateArticleSheet>
      </KatalogHeader>

      <Suspense fallback={<ArticleBlockSkeleton />}>
        <ArticleBlock />
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
        titleMain="Suara"
        titleSecond="Lokal*"
        linkText="Suarakan Ceritamu"
        subTitle="Setiap tempat punya cerita"
        deskription="   Dengarkan suara hati lokal melalui artikel-artikel inspiratif yang
              menghubungkan budaya, cerita."
      >
        <CreateArticleSheet>
          <Button
            className={' m-auto md:mr-0 text-sm  mt-3 w-full md:max-w-3xs '}
          >
            Suarakan Ceritamu
            <PlusCircle />
          </Button>
        </CreateArticleSheet>
      </KatalogHeader>

      {/* Hanya skeleton content */}
      <ArticleBlockSkeleton />
    </div>
  )
}

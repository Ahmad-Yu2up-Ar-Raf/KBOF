import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import ArticleBlock, {
  ArticleBlockSkeleton,
} from '@/components/ui/core/block/article/article-block'
import ArticleHeader from '@/components/ui/core/block/article/article-header'
import { queryClient } from '@/components/provider/Provider'
import { getArticleInfiniteQueryOptions } from '@/lib/query-options'

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
  pendingComponent: ArticleBlockSkeleton,
})

function RouteComponent() {
  return (
    <div className="mx-auto container max-w-7xl space-y-4 pt-5">
      <Suspense fallback={<ArticleBlockSkeleton />}>
        <ArticleContent />
      </Suspense>
    </div>
  )
}

// Separate component to use nuqs hooks
function ArticleContent() {
  return (
    <>
      <ArticleHeader />
      <ArticleBlock />
    </>
  )
}

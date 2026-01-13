import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import ArticleBlock, { ArticleBlockSkeleton, } from '@/components/ui/core/block/article/article-block'
import ArticleHeader from '@/components/ui/core/block/article/article-header'

export const Route = createFileRoute('/artikel/')({
  component: RouteComponent,
  pendingComponent: ArticleBlockSkeleton,
})

function RouteComponent() {
  return (
    <div className="mx-auto container max-w-6xl space-y-4 pt-5">
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

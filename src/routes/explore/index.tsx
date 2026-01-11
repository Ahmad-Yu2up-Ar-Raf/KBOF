import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

import ExploreBlock, {
  ExploreBlockSkeleton,
} from '@/components/ui/core/block/explore/explore-block'

import HeaderExplore from '@/components/ui/core/block/explore/explore-header'

// No validateSearch - nuqs handles URL state with clean defaults
// This keeps URL clean: /explore (not /explore?page=1&search=&category=all)
export const Route = createFileRoute('/explore/')({
  component: RouteComponent,
  pendingComponent: ExploreBlockSkeleton,
})

function RouteComponent() {
  return (
    <div className="mx-auto container max-w-7xl space-y-4 pt-5">
      <Suspense fallback={<ExploreBlockSkeleton />}>
        <ExploreContent />
      </Suspense>
    </div>
  )
}

// Separate component to use nuqs hooks
function ExploreContent() {
  return (
    <>
      <HeaderExplore />
      <ExploreBlock />
    </>
  )
}

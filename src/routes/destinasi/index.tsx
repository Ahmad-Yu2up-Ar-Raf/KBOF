import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

import DestinasiBlock, {
  DestinasiBlockSkeleton,
} from '@/components/ui/core/block/destinasi/destinasi-block'

import HeaderDestinasi from '@/components/ui/core/block/destinasi/destinasi-header'

// No validateSearch - nuqs handles URL state with clean defaults
// This keeps URL clean: /destinasi (not /destinasi?page=1&search=&category=all)
export const Route = createFileRoute('/destinasi/')({
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

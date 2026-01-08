import { NotFoundPage } from '@/components/ui/core/block/not-found-block-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/explore')({
  component: RouteComponent,
  notFoundComponent: () => <NotFoundPage />,
})

function RouteComponent() {
  return <div>Hello "/explore"!</div>
}

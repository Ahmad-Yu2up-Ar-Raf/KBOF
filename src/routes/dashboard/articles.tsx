import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/articles')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/articles"!</div>
}

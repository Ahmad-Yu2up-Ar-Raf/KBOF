import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/destinasi')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/profile/destinasi"!</div>
}

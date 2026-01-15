import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/artikel')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/profile/artikel"!</div>
}

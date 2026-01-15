import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/game')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/games"!</div>
}

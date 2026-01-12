import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/artikel/$artikelId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/artikel/$artikelId"!</div>
}

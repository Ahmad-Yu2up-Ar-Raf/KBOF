import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/cloudinary/delete-by-url')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/api/cloudinary/delete-by-url"!</div>
}

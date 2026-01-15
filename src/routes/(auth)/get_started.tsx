import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/get_started')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/get_started"!</div>
}

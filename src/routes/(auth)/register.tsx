import { createFileRoute } from '@tanstack/react-router'
import Register from '@/components/ui/core/feature/auth/Register'
import { guestMiddleware } from '@/lib/middleware'

export const Route = createFileRoute('/(auth)/register')({
  component: RouteComponent,
  server: {
    middleware: [guestMiddleware],
  },
})

function RouteComponent() {
  return <Register />
}

import { createFileRoute } from '@tanstack/react-router'
import Login from '@/components/ui/core/feature/auth/Login'
import { guestMiddleware } from '@/lib/middleware'

export const Route = createFileRoute('/(auth)/login')({
  component: RouteComponent,
  server: {
    middleware: [guestMiddleware],
  },
})

function RouteComponent() {
  return <Login />
}

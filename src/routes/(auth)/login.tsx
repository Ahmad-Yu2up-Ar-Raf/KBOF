import Login from '@/components/core/feature/auth/Login'
import { guestMiddleware } from '@/lib/middleware'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/login')({
  component: RouteComponent,
  server: {
    middleware: [guestMiddleware],
  },
})

function RouteComponent() {
  return <Login />
}

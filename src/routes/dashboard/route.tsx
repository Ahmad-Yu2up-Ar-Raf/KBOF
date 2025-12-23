import { createFileRoute, Outlet } from '@tanstack/react-router'
import { authMiddleware } from '@/lib/middleware'
import AppLayout from '@/components/core/layout/app/dashboard/AppLayout'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  server: {
    middleware: [authMiddleware],
  },
})

function RouteComponent() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

import { createFileRoute, Outlet } from '@tanstack/react-router'
import { authMiddleware } from '@/lib/middleware'
import AppLayout from '@/components/ui/core/layout/dashboard/app-layout'

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

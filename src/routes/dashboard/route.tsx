import { Outlet, createFileRoute } from '@tanstack/react-router'
import { dashboardMiddleware } from '@/lib/middleware'
import AppLayout from '@/components/ui/core/layout/dashboard/app-layout'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  server: {
    middleware: [dashboardMiddleware],
  },
})

function RouteComponent() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

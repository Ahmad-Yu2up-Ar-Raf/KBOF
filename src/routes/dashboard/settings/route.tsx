import SettingsLayout from '@/components/ui/core/layout/dashboard/app-setting-layout'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SettingsLayout>
      <Outlet />
    </SettingsLayout>
  )
}

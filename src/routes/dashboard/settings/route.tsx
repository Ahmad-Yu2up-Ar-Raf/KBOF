import { Outlet, createFileRoute } from '@tanstack/react-router'
import SettingsLayout from '@/components/ui/core/layout/dashboard/app-setting-layout'

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

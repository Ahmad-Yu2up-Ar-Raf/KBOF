import SettingsLayout from '@/components/core/layout/app/dashboard/AppSettingLayout'
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

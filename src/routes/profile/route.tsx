import { Outlet, createFileRoute } from '@tanstack/react-router'
import { profileMiddleware } from '@/lib/middleware'
import ProfileLayout from '@/components/ui/core/layout/profile/profile-layout'

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
  server: {
    middleware: [profileMiddleware],
  },
})

function RouteComponent() {
  return (
    <ProfileLayout>
      <Outlet />
    </ProfileLayout>
  )
}

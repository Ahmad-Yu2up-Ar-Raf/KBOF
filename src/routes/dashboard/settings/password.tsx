import { UpdatePassword } from '@/components/core/feature/form/UpdatePasswordForm'
import HeadingSmall from '@/components/ui/fragments/custom-ui/typography/heading-small'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/settings/password')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-6">
      <HeadingSmall
        title="Update password"
        description="Ensure your account is using a long, random password to stay secure"
      />

      <UpdatePassword />
    </div>
  )
}

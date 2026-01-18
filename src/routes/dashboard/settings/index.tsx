import { createFileRoute } from '@tanstack/react-router'
import DeleteUser from '@/components/ui/core/feature/auth/delete-user-block'
import { UpdateForm } from '@/components/ui/core/feature/form/update-profile-form'

import HeadingSmall from '@/components/ui/fragments/custom-ui/typography/heading-small'

export const Route = createFileRoute('/dashboard/settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="space-y-6">
        <HeadingSmall
          title="Profile information"
          description="Update your name and email address"
        />
        <UpdateForm />
      </div>

      <DeleteUser />
    </>
  )
}

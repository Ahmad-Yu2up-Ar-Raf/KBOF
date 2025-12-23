import DeleteUser from '@/components/core/feature/app/settings/DeleteUser'
import { UpdateForm } from '@/components/core/feature/form/UpdateProfileForm'

import HeadingSmall from '@/components/ui/fragments/custom-ui/typography/heading-small'

import { createFileRoute } from '@tanstack/react-router'

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

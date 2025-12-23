import CreateMessSheet from '@/components/core/feature/create-sheet/CreateMessSheet'
import Heading from '@/components/ui/fragments/custom-ui/typography/heading'

import { createFileRoute } from '@tanstack/react-router'
import { Building2 } from 'lucide-react'

export const Route = createFileRoute('/dashboard/mess/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Heading
        Icon={Building2}
        title="Mess Management"
        description="Here is your mess list. Manage your mess here."
      />
      <CreateMessSheet />
    </>
  )
}

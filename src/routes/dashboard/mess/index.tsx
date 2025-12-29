// src/routes/dashboard/mess/index.tsx
import { createFileRoute } from '@tanstack/react-router'

import { Building2 } from 'lucide-react'

import Heading from '@/components/ui/fragments/custom-ui/typography/heading'
import { DataTableSkeleton } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-skeleton'
import { FeatureFlagsProvider } from '@/components/ui/core/feature/data-table/feature-flag-provider'
import { TasksTable } from '@/components/ui/core/feature/data-table/mess/mess-table'
import CreateMessSheet from '@/components/ui/core/feature/data-table/mess/create-mess-sheet'
import { messSearchSchema } from '@/lib/validations/mess-validations'
import { getValidFilters } from '@/lib/data-table'
// ⚠️ Server function imported HERE in route file (executes on server via loader)
import { getMessAggregateServerFn } from '@/lib/server/mess/mess-server-queries'

// ============================================
// ROUTE DEFINITION
// ============================================

export const Route = createFileRoute('/dashboard/mess/')({
  // Validate and parse search params using Zod
  validateSearch: (search) => messSearchSchema.parse(search),

  // ⭐ LOADER: Runs on the SERVER before component renders
  // This is the proper TanStack Start pattern - data fetching happens here
  loader: async ({ location }) => {
    // Parse search params from location
    const search = messSearchSchema.parse(location.search)

    // Build normalized filter input
    const validFilters = getValidFilters(search.filters ?? [])

    const filters = {
      ...search,
      filters: validFilters,
    }

    // ⭐ Call server function - this runs on the server!
    const data = await getMessAggregateServerFn({ data: { filters } })

    return { messData: data, filters }
  },

  // ⭐ PENDING COMPONENT: Shows while loader is running
  pendingComponent: MessPageSkeleton,

  // Main component
  component: MessPage,
})

// ============================================
// SKELETON COMPONENT (while loading)
// ============================================

function MessPageSkeleton() {
  return (
    <div className="space-y-3">
      <Heading
        Icon={Building2}
        title="Mess Management"
        description="Manage your mess here."
      />

      <DataTableSkeleton
        columnCount={8}
        filterCount={2}
        cellWidths={[
          '3rem', // select
          '8rem', // name
          '6rem', // status
          '6rem', // type
          '6rem', // capacity
          '5rem', // rooms
          '5rem', // employees
          '8rem', // created
        ]}
        shrinkZero
      />
    </div>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

function MessPage() {
  // ⭐ Get data from loader - already fetched on server!
  const { messData } = Route.useLoaderData()

  return (
    <div className="  ">
      <Heading
        className="mb-4"
        Icon={Building2}
        title="Mess Management"
        description="Here is your mess list. Manage your mess here."
      />
      <main>
        <FeatureFlagsProvider createSheet={<CreateMessSheet />}>
          <TasksTable data={messData} />
        </FeatureFlagsProvider>
      </main>
    </div>
  )
}

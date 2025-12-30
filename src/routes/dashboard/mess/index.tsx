// src/routes/dashboard/mess/index.tsx
import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Building2 } from 'lucide-react'

import Heading from '@/components/ui/fragments/custom-ui/typography/heading'
import { DataTableSkeleton } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-skeleton'
import { FeatureFlagsProvider } from '@/components/ui/core/feature/data-table/feature-flag-provider'
import { TasksTable } from '@/components/ui/core/feature/data-table/mess/mess-table'
import CreateMessSheet from '@/components/ui/core/feature/data-table/mess/create-mess-sheet'
import { messSearchSchema } from '@/lib/validations/mess-validations'
import { getValidFilters } from '@/lib/data-table'
import {
  getMessQueryOptions,
  type MessAggregateInput,
} from '@/lib/query-options'
import { queryClient } from '@/components/ui/core/provider/Provider'
import { Suspense } from 'react'

// ============================================
// HELPER: Build filters from search params
// ============================================

function buildFilters(
  search: ReturnType<typeof messSearchSchema.parse>,
): MessAggregateInput {
  const validFilters = getValidFilters(search.filters ?? [])

  return {
    filterFlag: search.filterFlag ?? null,
    page: search.page ?? 1,
    perPage: search.perPage ?? 10,
    sort: search.sort ?? [{ id: 'createdAt', desc: true }],
    name: search.name ?? '',
    status: search.status ?? [],
    type: search.type ?? [],
    statusCapacity: search.statusCapacity ?? [],
    createdAt: search.createdAt ?? [],
    filters: validFilters,
    joinOperator: search.joinOperator ?? 'and',
  }
}

// ============================================
// ROUTE DEFINITION
// ============================================

export const Route = createFileRoute('/dashboard/mess/')({
  // Validate and parse search params using Zod
  validateSearch: (search) => messSearchSchema.parse(search),

  // ⭐ LOADER: Runs on the SERVER before component renders
  // Use queryClient.ensureQueryData to populate cache for SSR hydration
  loader: async ({ location }) => {
    const search = messSearchSchema.parse(location.search)
    const filters = buildFilters(search)

    // ⭐ ensureQueryData populates the cache so useSuspenseQuery
    // can use it on the client without refetching
    await queryClient.ensureQueryData(getMessQueryOptions(filters))

    return { filters }
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
        columnCount={7}
        filterCount={2}
        cellWidths={[
          '10rem',
          '30rem',
          '10rem',
          '10rem',
          '6rem',
          '6rem',
          '6rem',
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
  // Get current search params
  const search = useSearch({ from: '/dashboard/mess/' })
  const filters = buildFilters(search)

  // ⭐ useSuspenseQuery reads from cache (populated by loader)
  // On navigation/filter changes, it fetches fresh data
  const { data: messData } = useSuspenseQuery(getMessQueryOptions(filters))

  return (
    <div>
      <Heading
        className="mb-4"
        Icon={Building2}
        title="Mess Management"
        description="Here is your mess list. Manage your mess here."
      />
      <main>
        <Suspense
          fallback={
            <DataTableSkeleton
              columnCount={7}
              filterCount={2}
              cellWidths={[
                '10rem',
                '30rem',
                '10rem',
                '10rem',
                '6rem',
                '6rem',
                '6rem',
              ]}
              shrinkZero
            />
          }
        >
          <FeatureFlagsProvider createSheet={<CreateMessSheet />}>
            <TasksTable data={messData} />
          </FeatureFlagsProvider>
        </Suspense>
      </main>
    </div>
  )
}

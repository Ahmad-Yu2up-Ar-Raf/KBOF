import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Map, MapPin, Plus, MapPinPen } from 'lucide-react'
import { Suspense, useState } from 'react'

import type { DestinationAggregateInput } from '@/lib/query-options'
import Heading from '@/components/ui/fragments/custom-ui/typography/heading'
import { DataTableSkeleton } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-skeleton'
// import { FeatureFlagsProvider } from '@/components/ui/core/feature/data-table/feature-flag-provider'
import { DestinationTable } from '@/components/ui/core/feature/data-table/destination/destination-table'
import CreateDestinationSheet from '@/components/ui/core/feature/data-table/destination/create-destination-sheet'
import { destinationSearchSchema } from '@/lib/validations/destination-validations'
import { getValidFilters } from '@/lib/data-table'
import { getDestinationAdminQueryOptions } from '@/lib/query-options'
import { queryClient } from '@/components/provider/Provider'
import { EmptyState } from '@/components/ui/fragments/custom-ui/empty-state'

// ============================================
// HELPER: Build filters from search params
// ============================================

function buildFilters(
  search: ReturnType<typeof destinationSearchSchema.parse>,
): DestinationAggregateInput {
  const validFilters = getValidFilters(search.filters ?? [])

  return {
    filterFlag: search.filterFlag ?? null,
    page: search.page ?? 1,
    perPage: search.perPage ?? 10,
    sort: search.sort ?? [{ id: 'createdAt', desc: true }],
    name: search.name ?? '',
    status: search.status ?? [],
    type: search.type ?? [],
    category: search.category ?? [],
    provinsi: search.provinsi ?? '',
    createdAt: search.createdAt ?? [],
    filters: validFilters,
    joinOperator: search.joinOperator ?? 'and',
  }
}

export const Route = createFileRoute('/dashboard/destination')({
  // Validate and parse search params using Zod
  validateSearch: (search) => destinationSearchSchema.parse(search),
  loaderDeps: ({ search }) => {
    return {
      q: search,
    }
  },
  // ⭐ LOADER: Runs on the SERVER before component renders
  loader: async ({ deps: { q } }) => {
    const search = destinationSearchSchema.parse(q)
    const filters = buildFilters(search)

    // Use admin query - fetches ALL destinations for admin panel
    await queryClient.ensureQueryData(getDestinationAdminQueryOptions(filters))

    return { filters }
  },

  // ⭐ PENDING COMPONENT: Shows while loader is running
  pendingComponent: DestinationPageSkeleton,
  component: RouteComponent,
})

function DestinationPageSkeleton() {
  return (
    <div className="space-y-3">
      <Heading
        className="mb-4 lg:mb-6"
        Icon={MapPinPen}
        title="Destinasi Lokal"
        description="Ajukan dan kelola destinasi wisata dan budaya Indonesia local mu."
      />

      <DataTableSkeleton />
    </div>
  )
}

function RouteComponent() {
  const search = useSearch({ from: '/dashboard/destination' })
  const filters = buildFilters(search)
  const [sheetOpen, setSheetOpen] = useState(false)

  // ⭐ useSuspenseQuery reads from cache (populated by loader) - ADMIN version
  const { data: destinationData } = useSuspenseQuery(
    getDestinationAdminQueryOptions(filters),
  )

  // Check if database is truly empty (no data at all, not just filtered)
  const { statusCounts } = destinationData
  const totalDataCount =
    statusCounts.published +
    statusCounts.draft +
    statusCounts.archived +
    statusCounts.pending
  const isDatabaseEmpty = totalDataCount === 0

  return (
    <div>
      <Heading
        className="mb-4 lg:mb-6"
        Icon={MapPinPen}
        title="Destinasi Lokal"
        description="Ajukan dan kelola destinasi wisata dan budaya Indonesia local mu."
      />
      <main>
        {isDatabaseEmpty ? (
          // Database is truly empty - show only EmptyState + Sheet
          <>
            <EmptyState
              title="Belum ada destinasi"
              description="Tambahkan destinasi wisata atau budaya Indonesia untuk memulai."
              icons={[MapPin, MapPinPen, Plus]}
              action={{
                label: 'Tambah Destinasi',
                onClick: () => setSheetOpen(true),
              }}
            />
            <CreateDestinationSheet
              className=" sr-only"
              open={sheetOpen}
              onOpenChange={setSheetOpen}
            />
          </>
        ) : (
          // Has data - show full DataTable with filters
          <Suspense fallback={<DataTableSkeleton />}>
            <DestinationTable
              data={destinationData}
              createSheet={<CreateDestinationSheet />}
            />
            {/* <FeatureFlagsProvider createSheet={<CreateDestinationSheet />}>
            </FeatureFlagsProvider> */}
          </Suspense>
        )}
      </main>
    </div>
  )
}

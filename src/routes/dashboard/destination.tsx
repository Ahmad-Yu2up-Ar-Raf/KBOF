import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { MapPin } from 'lucide-react'

import Heading from '@/components/ui/fragments/custom-ui/typography/heading'
import { DataTableSkeleton } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-skeleton'
import { FeatureFlagsProvider } from '@/components/ui/core/feature/data-table/feature-flag-provider'
import { DestinationTable } from '@/components/ui/core/feature/data-table/destination/destination-table'
import CreateDestinationSheet from '@/components/ui/core/feature/data-table/destination/create-destination-sheet'
import { destinationSearchSchema } from '@/lib/validations/destination-validations'
import { getValidFilters } from '@/lib/data-table'
import {
  getDestinationQueryOptions,
  type DestinationAggregateInput,
} from '@/lib/query-options'
import { queryClient } from '@/components/provider/Provider'
import { Suspense } from 'react'

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

    await queryClient.ensureQueryData(getDestinationQueryOptions(filters))

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
        Icon={MapPin}
        title="Destinasi"
        description="Kelola destinasi wisata dan budaya Indonesia."
      />

      <DataTableSkeleton />
    </div>
  )
}

function RouteComponent() {
  const search = useSearch({ from: '/dashboard/destination' })
  const filters = buildFilters(search)

  // ⭐ useSuspenseQuery reads from cache (populated by loader)
  const { data: destinationData } = useSuspenseQuery(
    getDestinationQueryOptions(filters),
  )

  return (
    <div>
      <Heading
        className="mb-4"
        Icon={MapPin}
        title="Destinasi"
        description="Kelola destinasi wisata dan budaya Indonesia. Tambah, edit, dan publikasikan konten destinasi."
      />
      <main>
        <Suspense fallback={<DataTableSkeleton />}>
          <FeatureFlagsProvider createSheet={<CreateDestinationSheet />}>
            <DestinationTable data={destinationData} />
          </FeatureFlagsProvider>
        </Suspense>
      </main>
    </div>
  )
}

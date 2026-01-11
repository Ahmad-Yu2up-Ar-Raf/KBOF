import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { HandHeart } from 'lucide-react'

import Heading from '@/components/ui/fragments/custom-ui/typography/heading'
import { DataTableSkeleton } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-skeleton'
import { FeatureFlagsProvider } from '@/components/ui/core/feature/data-table/feature-flag-provider'
import { DonationTable } from '@/components/ui/core/feature/data-table/donation/donation-table'
import { donationSearchSchema } from '@/lib/validations/donation-validations'
import { getValidFilters } from '@/lib/data-table'
import {
  getDonationQueryOptions,
  type DonationAggregateInput,
} from '@/lib/query-options'
import { queryClient } from '@/components/provider/Provider'
import { Suspense } from 'react'

// ============================================
// HELPER: Build filters from search params
// ============================================

function buildFilters(
  search: ReturnType<typeof donationSearchSchema.parse>,
): DonationAggregateInput {
  const validFilters = getValidFilters(search.filters ?? [])

  return {
    filterFlag: search.filterFlag ?? null,
    page: search.page ?? 1,
    perPage: search.perPage ?? 10,
    sort: search.sort ?? [{ id: 'createdAt', desc: true }],
    status: search.status ?? [],
    destinationId: search.destinationId ?? undefined,
    createdAt: search.createdAt ?? [],
    filters: validFilters,
    joinOperator: search.joinOperator ?? 'and',
  }
}

export const Route = createFileRoute('/dashboard/donation')({
  // Validate and parse search params using Zod
  validateSearch: (search) => donationSearchSchema.parse(search),
  loaderDeps: ({ search }) => {
    return {
      q: search,
    }
  },
  // ⭐ LOADER: Runs on the SERVER before component renders
  loader: async ({ deps: { q } }) => {
    const search = donationSearchSchema.parse(q)
    const filters = buildFilters(search)

    await queryClient.ensureQueryData(getDonationQueryOptions(filters))

    return { filters }
  },

  // ⭐ PENDING COMPONENT: Shows while loader is running
  pendingComponent: DonationPageSkeleton,
  component: RouteComponent,
})

function DonationPageSkeleton() {
  return (
    <div className="space-y-3">
      <Heading
        Icon={HandHeart}
        title="Donasi"
        description="Lihat donasi yang masuk ke destinasi Anda."
      />

      <DataTableSkeleton />
    </div>
  )
}

function RouteComponent() {
  const search = useSearch({ from: '/dashboard/donation' })
  const filters = buildFilters(search)

  // ⭐ useSuspenseQuery reads from cache (populated by loader)
  const { data: donationData } = useSuspenseQuery(
    getDonationQueryOptions(filters),
  )

  return (
    <div>
      <Heading
        className="mb-4"
        Icon={HandHeart}
        title="Donasi"
        description="Lihat donasi yang masuk ke destinasi wisata dan budaya Anda."
      />
      <main>
        <Suspense fallback={<DataTableSkeleton />}>
          <FeatureFlagsProvider>
            <DonationTable data={donationData} />
          </FeatureFlagsProvider>
        </Suspense>
      </main>
    </div>
  )
}

'use client'

import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import type { AnalyticsInput } from '@/lib/query-options'
import Wrapper from '@/components/ui/core/feature/report/wrapper'
import Overview from '@/components/ui/core/feature/report/overview'
import { analyticsSearchSchema } from '@/lib/validations/analytics-validations'
import { getAnalyticsQueryOptions } from '@/lib/query-options'
import { queryClient } from '@/components/provider/Provider'
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton'

// ============================================
// HELPER: Build filters from search params
// ============================================

function buildFilters(
  search: ReturnType<typeof analyticsSearchSchema.parse>,
): AnalyticsInput {
  return {
    createdAt: search.createdAt ?? [],
  }
}

// ============================================
// ROUTE DEFINITION
// ============================================

export const Route = createFileRoute('/dashboard/')({
  // Validate search params using Zod
  validateSearch: (search) => analyticsSearchSchema.parse(search),

  // Dependencies for loader
  loaderDeps: ({ search }) => ({
    q: search,
  }),

  // ⭐ LOADER: Runs on SERVER before component renders
  loader: async ({ deps: { q } }) => {
    const search = analyticsSearchSchema.parse(q)
    const filters = buildFilters(search)

    // Pre-fetch analytics data on server
    await queryClient.ensureQueryData(getAnalyticsQueryOptions(filters))

    return { filters }
  },

  // ⭐ PENDING COMPONENT: Shows while loader is running
  pendingComponent: DashboardSkeleton,
  component: DashboardPage,
})

// ============================================
// SKELETON COMPONENT
// ============================================

function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-4">
      {/* Header Skeleton */}
      <header className="flex w-full flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-[260px]" />
      </header>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>

      {/* Chart Skeleton */}
      <Skeleton className="h-[300px] w-full rounded-lg" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

function DashboardPage() {
  const search = useSearch({ from: '/dashboard/' })
  const filters = buildFilters(search)

  // ⭐ useSuspenseQuery reads from cache (populated by loader)
  const { data: analyticsData } = useSuspenseQuery(
    getAnalyticsQueryOptions(filters),
  )

  return (
    <Wrapper title="Hi Warga Lokal!" >
      <Overview data={analyticsData} />
    </Wrapper>
  )
}

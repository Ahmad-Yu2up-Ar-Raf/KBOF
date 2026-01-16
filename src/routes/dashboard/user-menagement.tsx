import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Users, Shield, UserCog, UsersRound } from 'lucide-react'
import { Suspense } from 'react'

import Heading from '@/components/ui/fragments/custom-ui/typography/heading'
import { DataTableSkeleton } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-skeleton'
import { FeatureFlagsProvider } from '@/components/ui/core/feature/data-table/feature-flag-provider'
import { UserTable } from '@/components/ui/core/feature/data-table/user/user-table'
import { userSearchSchema } from '@/lib/validations/user-validations'
import {
  getUserQueryOptions,
  type UserAggregateInput,
} from '@/lib/query-options'
import { queryClient } from '@/components/provider/Provider'
import type { UserRoleType } from '@/db/schema'

// ============================================
// HELPER: Build filters from search params
// ============================================

function buildFilters(
  search: ReturnType<typeof userSearchSchema.parse>,
): UserAggregateInput {
  return {
    filterFlag: search.filterFlag ?? null,
    page: search.page ?? 1,
    perPage: search.perPage ?? 10,
    sort: search.sort ?? [{ id: 'createdAt', desc: true }],
    search: search.search ?? '',
    role: (search.role ?? 'all') as UserRoleType | 'all',
    banned: (search.banned ?? 'all') as 'all' | 'banned' | 'active',
    filters: search.filters ?? [],
    joinOperator: search.joinOperator ?? 'and',
  }
}

export const Route = createFileRoute('/dashboard/user-menagement')({
  // Validate and parse search params using Zod
  validateSearch: (search) => userSearchSchema.parse(search),
  loaderDeps: ({ search }) => {
    return {
      q: search,
    }
  },
  // ⭐ LOADER: Runs on the SERVER before component renders
  loader: async ({ deps: { q } }) => {
    const search = userSearchSchema.parse(q)
    const filters = buildFilters(search)

    // Prefetch user data on server
    await queryClient.ensureQueryData(getUserQueryOptions(filters))

    return { filters }
  },

  // ⭐ PENDING COMPONENT: Shows while loader is running
  pendingComponent: UserPageSkeleton,
  component: RouteComponent,
})

function UserPageSkeleton() {
  return (
    <div className="space-y-3">
      <Heading
        Icon={Users}
        title="Manajemen Pengguna"
        description="Kelola pengguna dan hak akses sistem."
      />

      <DataTableSkeleton />
    </div>
  )
}

function RouteComponent() {
  const search = useSearch({ from: '/dashboard/user-menagement' })
  const filters = buildFilters(search)

  // ⭐ useSuspenseQuery reads from cache (populated by loader)
  const { data: userData } = useSuspenseQuery(getUserQueryOptions(filters))

  // Check if database is truly empty (no users at all)
  const { roleCounts } = userData
  const totalUsersCount =
    roleCounts.pribumi + roleCounts.admin + roleCounts.superAdmin
  const isDatabaseEmpty = totalUsersCount === 0

  return (
    <div>
      <Heading
        className="mb-4"
        Icon={UsersRound}
        title="Manajemen Pengguna"
        description="Kelola pengguna, role, dan status akun. Fitur ini khusus untuk Super Admin."
      />
      <main>
        {isDatabaseEmpty ? (
          // Database is truly empty - show empty state
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-muted-foreground/50" />
              <UserCog className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="font-medium text-lg">Belum ada pengguna</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Saat ini belum ada pengguna yang terdaftar di sistem. Pengguna
              akan muncul di sini setelah mereka mendaftar.
            </p>
          </div>
        ) : (
          // Has data - show full DataTable with filters
          <Suspense fallback={<DataTableSkeleton />}>
            <FeatureFlagsProvider>
              <UserTable data={userData} />
            </FeatureFlagsProvider>
          </Suspense>
        )}
      </main>
    </div>
  )
}

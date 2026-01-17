import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Newspaper, FileText, Plus } from 'lucide-react'
import { Suspense, useState } from 'react'

import Heading from '@/components/ui/fragments/custom-ui/typography/heading'
import { DataTableSkeleton } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-skeleton'
import { FeatureFlagsProvider } from '@/components/ui/core/feature/data-table/feature-flag-provider'
import { ArticleTable } from '@/components/ui/core/feature/data-table/article/article-table'
import CreateArticleSheet from '@/components/ui/core/feature/data-table/article/create-article-sheet'
import { articleSearchSchema } from '@/lib/validations/article-validations'
import { getValidFilters } from '@/lib/data-table'
import {
  getArticleAdminQueryOptions,
  type ArticleAggregateInput,
} from '@/lib/query-options'
import { queryClient } from '@/components/provider/Provider'
import { EmptyState } from '@/components/ui/fragments/custom-ui/empty-state'

// ============================================
// HELPER: Build filters from search params
// ============================================

function buildFilters(
  search: ReturnType<typeof articleSearchSchema.parse>,
): ArticleAggregateInput {
  const validFilters = getValidFilters(search.filters ?? [])

  return {
    filterFlag: search.filterFlag ?? null,
    page: search.page ?? 1,
    perPage: search.perPage ?? 10,
    sort: search.sort ?? [{ id: 'createdAt', desc: true }],
    title: search.title ?? '',
    status: search.status ?? [],
    createdAt: search.createdAt ?? [],
    filters: validFilters,
    joinOperator: search.joinOperator ?? 'and',
  }
}

export const Route = createFileRoute('/dashboard/articles')({
  // Validate and parse search params using Zod
  validateSearch: (search) => articleSearchSchema.parse(search),
  loaderDeps: ({ search }) => {
    return {
      q: search,
    }
  },
  // ⭐ LOADER: Runs on the SERVER before component renders
  loader: async ({ deps: { q } }) => {
    const search = articleSearchSchema.parse(q)
    const filters = buildFilters(search)

    // Use admin query - fetches ALL articles for admin panel
    await queryClient.ensureQueryData(getArticleAdminQueryOptions(filters))

    return { filters }
  },

  // ⭐ PENDING COMPONENT: Shows while loader is running
  pendingComponent: ArticlePageSkeleton,
  component: RouteComponent,
})

function ArticlePageSkeleton() {
  return (
    <div className="space-y-3">
      <Heading
        Icon={Newspaper}
        title="Artikel"
        description="Kelola artikel dan konten edukasi."
      />

      <DataTableSkeleton />
    </div>
  )
}

function RouteComponent() {
  const search = useSearch({ from: '/dashboard/articles' })
  const filters = buildFilters(search)
  const [sheetOpen, setSheetOpen] = useState(false)

  // ⭐ useSuspenseQuery reads from cache (populated by loader) - ADMIN version
  const { data: articleData } = useSuspenseQuery(
    getArticleAdminQueryOptions(filters),
  )

  // Check if database is truly empty (no data at all, not just filtered)
  const { statusCounts } = articleData
  const totalDataCount =
    statusCounts.published + statusCounts.draft + statusCounts.archived
  const isDatabaseEmpty = totalDataCount === 0

  return (
    <div>
      <Heading
        className="mb-4"
        Icon={Newspaper}
        title="Artikel"
        description="Kelola artikel dan konten edukasi tentang wisata dan budaya Indonesia."
      />
      <main>
        {isDatabaseEmpty ? (
          // Database is truly empty - show only EmptyState + Sheet
          <>
            <EmptyState
              title="Belum ada artikel"
              description="Tambahkan artikel atau konten edukasi tentang wisata dan budaya Indonesia."
              icons={[Newspaper, FileText, Plus]}
              action={{
                label: 'Tambah Artikel',
                onClick: () => setSheetOpen(true),
              }}
            />
            <CreateArticleSheet
              className=" sr-only"
              open={sheetOpen}
              onOpenChange={setSheetOpen}
            />
          </>
        ) : (
          // Has data - show full DataTable with filters
          <Suspense fallback={<DataTableSkeleton />}>
            <ArticleTable
              createSheet={<CreateArticleSheet />}
              data={articleData}
            />
            {/* <FeatureFlagsProvider>
            </FeatureFlagsProvider> */}
          </Suspense>
        )}
      </main>
    </div>
  )
}

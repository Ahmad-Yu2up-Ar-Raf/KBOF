import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { PenLine } from 'lucide-react'

import Heading from '@/components/ui/fragments/custom-ui/typography/heading'
import { DataTableSkeleton } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-skeleton'
import { FeatureFlagsProvider } from '@/components/ui/core/feature/data-table/feature-flag-provider'
import { ArticleTable } from '@/components/ui/core/feature/data-table/article/article-table'
import CreateArticleSheet from '@/components/ui/core/feature/data-table/article/create-article-sheet'
import { articleSearchSchema } from '@/lib/validations/article-validations'
import { getValidFilters } from '@/lib/data-table'
import {
  getArticleQueryOptions,
  type ArticleAggregateInput,
} from '@/lib/query-options'
import { queryClient } from '@/components/provider/Provider'
import { Suspense } from 'react'

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

    await queryClient.ensureQueryData(getArticleQueryOptions(filters))

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
        Icon={PenLine}
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

  // ⭐ useSuspenseQuery reads from cache (populated by loader)
  const { data: articleData } = useSuspenseQuery(
    getArticleQueryOptions(filters),
  )

  return (
    <div>
      <Heading
        className="mb-4"
        Icon={PenLine}
        title="Artikel"
        description="Kelola artikel dan konten edukasi tentang wisata dan budaya Indonesia."
      />
      <main>
        <Suspense fallback={<DataTableSkeleton />}>
          <FeatureFlagsProvider createSheet={<CreateArticleSheet />}>
            <ArticleTable data={articleData} />
          </FeatureFlagsProvider>
        </Suspense>
      </main>
    </div>
  )
}

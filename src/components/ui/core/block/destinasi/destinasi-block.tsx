// =============================================================================
// DESTINASI BLOCK - Main Destination Listing Page
// =============================================================================
// Clean, refactored version with separated components and hooks
// =============================================================================

'use client'

import { useState, useEffect, useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton'
import { SkeletonCard } from '@/components/ui/fragments/custom-ui/card/destinasi-card'

import { getDestinasiInfiniteQueryOptions } from '@/lib/query-options'
import { useInfiniteScrollContext } from '@/components/provider/infinite-scroll-context'
import {
  buildCategoryOptions,
  buildTypeOptions,
  buildProvinsiOptions,
} from '@/lib/utils/destination-labels'

// Local components
import {
  DestinasiFilterSection,
  DestinasiInfoSection,
  DestinasiGridSection,
  DestinasiLoadMore,
  DestinasiErrorState,
} from './components'

// Local hooks
import { useDestinasiFilters, useInfiniteScroll } from './hooks'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function DestinasiBlock() {
  // Local UI state
  const [hovered, setHovered] = useState<number | null>(null)

  // URL filters hook
  const {
    search,
    categories,
    types,
    provinces,
    sortBy,
    filters,
    hasActiveFilters,
    handleResetFilter,
    handleCategoriesChange,
    handleTypesChange,
    handleProvincesChange,
    handleSortByChange,
  } = useDestinasiFilters()

  // Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery(getDestinasiInfiniteQueryOptions(filters))

  // Infinite scroll hook
  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  })

  // Register infinite scroll state with context (for footer visibility)
  const { registerInfiniteScroll, unregisterInfiniteScroll } =
    useInfiniteScrollContext()

  useEffect(() => {
    registerInfiniteScroll(
      hasNextPage ?? false,
      isLoading || isFetchingNextPage,
    )
    return () => unregisterInfiniteScroll()
  }, [
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    registerInfiniteScroll,
    unregisterInfiniteScroll,
  ])

  // Flatten all pages into single array
  const destinations = data?.pages.flatMap((page) => page.data) ?? []
  const totalCount = data?.pages[0]?.totalCount ?? 0
  const categoryCounts = data?.pages[0]?.categoryCounts ?? {}

  // Build filter options with counts
  const categoryOptions = useMemo(
    () => buildCategoryOptions(categoryCounts),
    [categoryCounts],
  )
  const typeOptions = useMemo(() => buildTypeOptions(), [])
  const provinsiOptions = useMemo(() => buildProvinsiOptions(), [])

  // ==========================================================================
  // RENDER
  // ==========================================================================

  if (isLoading) {
    return <DestinasiBlockSkeleton />
  }

  if (isError) {
    return <DestinasiErrorState />
  }

  return (
    <section className="container py-3  space-y-5">
      {/* Filters */}
      <DestinasiFilterSection
        categories={categories}
        types={types}
        provinces={provinces}
        sortBy={sortBy}
        categoryOptions={categoryOptions}
        typeOptions={typeOptions}
        provinsiOptions={provinsiOptions}
        onCategoriesChange={handleCategoriesChange}
        onTypesChange={handleTypesChange}
        onProvincesChange={handleProvincesChange}
        onSortByChange={handleSortByChange}
        onReset={handleResetFilter}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Info */}
      <DestinasiInfoSection
        currentCount={destinations.length}
        totalCount={totalCount}
        search={search}
        categories={categories}
        types={types}
        provinces={provinces}
      />

      {/* Grid */}
      <DestinasiGridSection
        destinations={destinations}
        hovered={hovered}
        setHovered={setHovered}
        search={search}
        hasFilters={categories.length > 0}
      />

      {/* Load More */}
      <DestinasiLoadMore
        ref={loadMoreRef}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        hasData={destinations.length > 0}
      />
    </section>
  )
}

// =============================================================================
// SKELETON
// =============================================================================

export function DestinasiBlockSkeleton() {
  return (
    <section className="py-1 w-full container md:py-2 sm:px-8 px-1.5 flex-1">
      <div className="space-y-5">
        {/* Filter Toolbar Skeleton */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap mt-1 sm:items-center px-1 md:px-0">
          <Skeleton className="h-8 w-full md:w-28 rounded-xl" />
          <Skeleton className="h-8 w-full md:w-28  rounded-xl" />
          <Skeleton className="h-8 w-full md:w-28  rounded-xl" />
          <Skeleton className="h-8 w-full md:w-28  rounded-xl" />
        </div>

        {/* Current Filter Info */}
        <div className="flex items-center px-5">
          <Skeleton className="h-4 w-34 rounded-xl" />
        </div>

        {/* Grid */}
        <div className="grid px-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full auto-rows-fr">
          {Array.from({ length: 6 }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

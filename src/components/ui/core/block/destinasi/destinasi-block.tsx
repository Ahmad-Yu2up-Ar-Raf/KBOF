'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  useQueryState,
  parseAsString,
  parseAsArrayOf,
  parseAsStringLiteral,
} from 'nuqs'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/fragments/shadcn-ui/select'
import {
  FacetedFilter,
  FilterToolbar,
} from '@/components/ui/fragments/custom-ui/filter'
import DestinasiCard, {
  SkeletonCard,
} from '@/components/ui/fragments/custom-ui/card/destinasi-card'

import { getDestinasiInfiniteQueryOptions } from '@/lib/query-options'
import type { DestinasiDestination } from '@/lib/server/explore/destinasi-server-queries'
import { useInfiniteScrollContext } from '@/components/provider/infinite-scroll-context'

import {
  categoryLabels,
  typeLabels,
  provinsiLabels,
  categoryList,
  typeList,
  provinsiList,
  buildCategoryOptions,
  buildTypeOptions,
  buildProvinsiOptions,
  sortOptions,
  type SortBy,
} from '@/lib/utils/destination-labels'

type Category = (typeof categoryList)[number]
type DestinationType = (typeof typeList)[number]
type Provinsi = (typeof provinsiList)[number]

export default function DestinasiBlock() {
  const navigate = useNavigate()

  // Local UI state
  const [hovered, setHovered] = useState<number | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  // URL State with nuqs - clean URLs (no default values in URL)
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault(''),
  )

  const [categories, setCategories] = useQueryState(
    'categories',
    parseAsArrayOf(parseAsStringLiteral(categoryList)).withDefault([]),
  )

  const [types, setTypes] = useQueryState(
    'types',
    parseAsArrayOf(parseAsStringLiteral(typeList)).withDefault([]),
  )

  const [provinces, setProvinces] = useQueryState(
    'provinces',
    parseAsArrayOf(parseAsStringLiteral(provinsiList)).withDefault([]),
  )

  const [sortBy, setSortBy] = useQueryState(
    'sortBy',
    parseAsStringLiteral(sortOptions.map((o) => o.value)).withDefault(
      'popular',
    ),
  )

  // Build filters for query
  const filters = {
    limit: 12,
    search,
    categories: categories as Category[],
    types: types as DestinationType[],
    provinces: provinces as Provinsi[],
    sortBy: sortBy as SortBy,
  }

  // Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery(getDestinasiInfiniteQueryOptions(filters))

  // Register infinite scroll state with context (for footer visibility)
  const { registerInfiniteScroll, unregisterInfiniteScroll } =
    useInfiniteScrollContext()

  useEffect(() => {
    // Register this page as having infinite scroll
    registerInfiniteScroll(
      hasNextPage ?? false,
      isLoading || isFetchingNextPage,
    )

    // Cleanup on unmount
    return () => {
      unregisterInfiniteScroll()
    }
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

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { threshold: 0.1, rootMargin: '100px' },
    )

    const el = loadMoreRef.current
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleResetFilter = useCallback(() => {
    void setSearch(null)
    void setCategories(null)
    void setTypes(null)
    void setProvinces(null)
    void setSortBy(null)
  }, [setSearch, setCategories, setTypes, setProvinces, setSortBy])

  const handleCardClick = useCallback(
    (destination: DestinasiDestination) => {
      void navigate({
        to: '/destinasi/$destinasiId',
        params: { destinasiId: destination.slug },
      })
    },
    [navigate],
  )

  // Build filter options with counts
  const categoryOptions = useMemo(
    () => buildCategoryOptions(categoryCounts),
    [categoryCounts],
  )
  const typeOptions = useMemo(() => buildTypeOptions(), [])
  const provinsiOptions = useMemo(() => buildProvinsiOptions(), [])

  const hasActiveFilters =
    categories.length > 0 ||
    types.length > 0 ||
    provinces.length > 0 ||
    sortBy !== 'popular' ||
    search !== ''

  if (isLoading) {
    return <DestinasiBlockSkeleton />
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 py-20">
        <div className="text-6xl mb-4">😵</div>
        <p className="text-gray-500 text-lg">
          Terjadi kesalahan saat memuat data
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Coba Lagi
        </Button>
      </div>
    )
  }

  return (
    <section className="container py-3 space-y-5">
      {/* Filters - Category, Type, Provinsi */}
      <FilterToolbar
        showReset={hasActiveFilters}
        className=""
        onReset={handleResetFilter}
      >
        {/* Category Filter */}
        <FacetedFilter
          title="Kategori"
          options={categoryOptions}
          value={categories}
          onChange={(values) =>
            void setCategories(
              values.length > 0 ? (values as Category[]) : null,
            )
          }
          multiple
          popoverWidth="w-[14rem]"
        />

        {/* Type Filter */}
        <FacetedFilter
          title="Tipe"
          options={typeOptions}
          value={types}
          onChange={(values) =>
            void setTypes(
              values.length > 0 ? (values as DestinationType[]) : null,
            )
          }
          multiple
          popoverWidth="w-[14rem]"
        />

        {/* Provinsi Filter */}
        <FacetedFilter
          title="Provinsi"
          options={provinsiOptions}
          value={provinces}
          onChange={(values) =>
            void setProvinces(values.length > 0 ? (values as Provinsi[]) : null)
          }
          multiple
          popoverWidth="w-[14rem]"
        />

        {/* Sort By - keep as Select for simplicity */}
        <Select
          value={sortBy}
          onValueChange={(value) =>
            void setSortBy(value === 'popular' ? null : (value as SortBy))
          }
        >
          <SelectTrigger className="h-full sm:w-fit w-full text-sm border-dashed">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterToolbar>

      {/* Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3  ">
        <p className="text-sm text-muted-foreground">
          Menampilkan{' '}
          <span className="font-semibold text-foreground">
            {destinations.length}
          </span>{' '}
          dari{' '}
          <span className="font-semibold text-foreground">{totalCount}</span>{' '}
          destinasi
          {search && (
            <span className="ml-1">
              untuk "
              <span className="font-semibold text-foreground">{search}</span>"
            </span>
          )}
          {categories.length > 0 && (
            <span className="ml-1">
              di{' '}
              <span className="font-semibold text-foreground">
                {categories.map((c) => categoryLabels[c]).join(', ')}
              </span>
            </span>
          )}
          {types.length > 0 && (
            <span className="ml-1">
              • Tipe:{' '}
              <span className="font-semibold text-foreground">
                {types.map((t) => typeLabels[t] ?? t).join(', ')}
              </span>
            </span>
          )}
          {provinces.length > 0 && (
            <span className="ml-1">
              • Provinsi:{' '}
              <span className="font-semibold text-foreground">
                {provinces.map((p) => provinsiLabels[p] ?? p).join(', ')}
              </span>
            </span>
          )}
        </p>
      </div>

      {/* Grid */}
      <div className="grid    grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full auto-rows-fr">
        {destinations.length > 0 ? (
          destinations.map((destination: DestinasiDestination, i: number) => (
            <DestinasiCard
              key={destination.id}
              index={i}
              hovered={hovered}
              setHovered={setHovered}
              destination={destination}
              totalItems={destinations.length}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center min-h-100 animate-fadeIn">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg text-center mb-2">
              {search
                ? `Tidak ada destinasi yang cocok dengan "${search}"`
                : categories.length > 0
                  ? `Tidak ada destinasi di kategori yang dipilih`
                  : 'Belum ada destinasi tersedia'}
            </p>
            <p className="text-gray-400 text-sm">
              {search
                ? 'Coba kata kunci lain'
                : 'Coba pilih kategori lain atau reset filter'}
            </p>
          </div>
        )}
      </div>

      {/* Infinite Scroll Trigger & Loading */}
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Memuat lebih banyak...</span>
          </div>
        )}
        {!hasNextPage && destinations.length > 0 && (
          <p className="text-muted-foreground text-sm">
            Kamu sudah melihat semua destinasi 🎉
          </p>
        )}
      </div>
    </section>
  )
}

export function DestinasiBlockSkeleton() {
  return (
    <section className="py-1 w-full container md:py-2 sm:px-8 px-1.5 flex-1">
      <div className="space-y-5">
        {/* Filter Toolbar Skeleton */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center px-5 md:px-0">
          <Skeleton className="h-8 w-28 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-28 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>

        {/* Current Filter Info */}
        <div className="flex items-center px-5">
          <Skeleton className="h-4 w-34 rounded-xl" />
        </div>

        {/* Grid */}
        <div className="grid  px-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full auto-rows-fr">
          {Array.from({ length: 6 }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

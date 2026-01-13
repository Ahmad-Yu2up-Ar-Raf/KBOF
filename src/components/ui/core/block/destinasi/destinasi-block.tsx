'use client'
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  useQueryState,
  parseAsString,
  parseAsArrayOf,
  parseAsStringLiteral,
} from 'nuqs'

import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { Loader2 } from 'lucide-react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/fragments/shadcn-ui/carousel'
import { cn } from '@/lib/utils'
import DestinasiCard, {
  SkeletonCard,
} from '@/components/ui/fragments/custom-ui/card/destinasi-card'

import { getDestinasiInfiniteQueryOptions } from '@/lib/query-options'
import type { DestinasiDestination } from '@/lib/server/explore/destinasi-server-queries'
import { destinationCategory } from '@/db/schema'
import { useInfiniteScrollContext } from '@/components/provider/infinite-scroll-context'

const PRIMARY_COLOR = '#63493f'

// Category labels for display
const categoryLabels: Record<string, string> = {
  'lokasi-budaya': 'Lokasi Budaya',
  pariwisata: 'Pariwisata',
  'adat-istiadat': 'Adat Istiadat',
  'kuliner-tradisional': 'Kuliner Tradisional',
  'kesenian-daerah': 'Kesenian Daerah',
  'situs-sejarah': 'Situs Sejarah',
}

const categoryList = destinationCategory.enumValues

// Sort options
const sortOptions = [
  { value: 'popular', label: 'Populer' },
  { value: 'newest', label: 'Terbaru' },
  { value: 'rating', label: 'Rating' },
  { value: 'name', label: 'A-Z' },
] as const

type SortBy = (typeof sortOptions)[number]['value']
type Category = (typeof categoryList)[number]

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
    type: 'all' as const,
    provinsi: 'all' as const,
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

  // Toggle category (multiple selection)
  const handleCategoryToggle = useCallback(
    (category: Category) => {
      const newCategories = categories.includes(category)
        ? categories.filter((c) => c !== category)
        : [...categories, category]
      void setCategories(newCategories.length > 0 ? newCategories : null)
    },
    [categories, setCategories],
  )

  const handleResetFilter = useCallback(() => {
    void setSearch(null)
    void setCategories(null)
    void setSortBy(null)
  }, [setSearch, setCategories, setSortBy])

  const handleCardClick = useCallback(
    (destination: DestinasiDestination) => {
      void navigate({
        to: '/destinasi/$destinasiId',
        params: { destinasiId: destination.slug },
      })
    },
    [navigate],
  )

  const hasActiveFilters =
    categories.length > 0 || sortBy !== 'popular' || search !== ''

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
    <section className="py-1 w-full container md:py-2 sm:px-8 px-1.5 flex-1">
      <div className="space-y-5">
        {/* Category Filter Carousel - Multiple Selection */}
        <Carousel
          className="overflow-hidden"
          opts={{
            align: 'start',
            breakpoints: {
              '(max-width: 768px)': {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="mx-5.5 md:mx-2.5 relative cursor-grab">
            {categoryList.map((cat, i) => {
              const isSelected = categories.includes(cat)
              return (
                <CarouselItem
                  key={cat}
                  className={cn('w-fit', i > 0 ? 'pl-4' : 'pl-0')}
                >
                  <Button
                    variant={isSelected ? 'default' : 'outline'}
                    style={{
                      backgroundColor: isSelected ? PRIMARY_COLOR : undefined,
                      color: isSelected ? 'white' : undefined,
                    }}
                    onClick={() => handleCategoryToggle(cat)}
                  >
                    {categoryLabels[cat] ?? cat}
                    <span className="ml-2 text-xs opacity-70">
                      ({categoryCounts[cat] ?? 0})
                    </span>
                  </Button>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>

        {/* Info & Reset */}
        <div className="flex items-center justify-between px-5">
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
          </p>
          {hasActiveFilters && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetFilter}
              className="text-primary rounded-2xl"
            >
              Reset Semua
            </Button>
          )}
        </div>

        {/* Grid */}
        <div className="grid gap-7 md:gap-3 px-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full auto-rows-fr">
          {destinations.length > 0 ? (
            destinations.map((destination: DestinasiDestination, i: number) => (
              <DestinasiCard
                key={destination.id}
                index={i}
                hovered={hovered}
                setHovered={setHovered}
                destination={destination}
                onClick={handleCardClick}
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
      </div>
    </section>
  )
}

export function DestinasiBlockSkeleton() {
  return (
    <>
      <section className="py-1 w-full container md:py-2 sm:px-8 px-1.5 flex-1">
        <div className="space-y-5">
          <Carousel
            className="overflow-hidden"
            opts={{
              align: 'start',
              breakpoints: {
                '(max-width: 768px)': {
                  dragFree: true,
                },
              },
            }}
          >
            <CarouselContent className="mx-5.5 md:mx-2.5 relative cursor-grab">
              {Array.from({ length: 8 }, (_, cat) => (
                <CarouselItem
                  key={cat}
                  className={cn('w-fit', cat > 0 ? 'pl-4' : 'pl-0')}
                >
                  <Skeleton className="h-8 w-30 rounded-xl" />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Current Filter Info */}
          <div className="flex items-center  px-5">
            <Skeleton className="h-4 w-34 rounded-xl" />
          </div>

          {/* Grid */}
          <div className="grid gap-7 md:gap-3 px-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full auto-rows-fr">
            {Array.from({ length: 3 }, (_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

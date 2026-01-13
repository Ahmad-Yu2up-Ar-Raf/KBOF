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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/fragments/shadcn-ui/select'
import { cn } from '@/lib/utils'
import DestinasiCard, {
  SkeletonCard,
} from '@/components/ui/fragments/custom-ui/card/destinasi-card'

import { getDestinasiInfiniteQueryOptions } from '@/lib/query-options'
import type { DestinasiDestination } from '@/lib/server/explore/destinasi-server-queries'
import {
  destinationCategory,
  destinationType,
  provinsiIndonesia,
} from '@/db/schema'
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
const typeList = destinationType.enumValues
const provinsiList = provinsiIndonesia.enumValues

// Type labels for display
const typeLabels: Record<string, string> = {
  'wisata-alam': 'Wisata Alam',
  'wisata-budaya': 'Wisata Budaya',
  'wisata-sejarah': 'Wisata Sejarah',
  'wisata-religi': 'Wisata Religi',
  'wisata-kuliner': 'Wisata Kuliner',
  'wisata-bahari': 'Wisata Bahari',
  'adat-istiadat': 'Adat Istiadat',
  kesenian: 'Kesenian',
  kerajinan: 'Kerajinan',
  festival: 'Festival',
}

// Provinsi labels for display
const provinsiLabels: Record<string, string> = {
  aceh: 'Aceh',
  'sumatera-utara': 'Sumatera Utara',
  'sumatera-barat': 'Sumatera Barat',
  riau: 'Riau',
  'kepulauan-riau': 'Kepulauan Riau',
  jambi: 'Jambi',
  'sumatera-selatan': 'Sumatera Selatan',
  'kepulauan-bangka-belitung': 'Bangka Belitung',
  bengkulu: 'Bengkulu',
  lampung: 'Lampung',
  'dki-jakarta': 'DKI Jakarta',
  'jawa-barat': 'Jawa Barat',
  banten: 'Banten',
  'jawa-tengah': 'Jawa Tengah',
  'di-yogyakarta': 'DI Yogyakarta',
  'jawa-timur': 'Jawa Timur',
  bali: 'Bali',
  'nusa-tenggara-barat': 'NTB',
  'nusa-tenggara-timur': 'NTT',
  'kalimantan-barat': 'Kalimantan Barat',
  'kalimantan-tengah': 'Kalimantan Tengah',
  'kalimantan-selatan': 'Kalimantan Selatan',
  'kalimantan-timur': 'Kalimantan Timur',
  'kalimantan-utara': 'Kalimantan Utara',
  'sulawesi-utara': 'Sulawesi Utara',
  gorontalo: 'Gorontalo',
  'sulawesi-tengah': 'Sulawesi Tengah',
  'sulawesi-selatan': 'Sulawesi Selatan',
  'sulawesi-barat': 'Sulawesi Barat',
  'sulawesi-tenggara': 'Sulawesi Tenggara',
  maluku: 'Maluku',
  'maluku-utara': 'Maluku Utara',
  papua: 'Papua',
  'papua-barat': 'Papua Barat',
  'papua-barat-daya': 'Papua Barat Daya',
  'papua-tengah': 'Papua Tengah',
  'papua-pegunungan': 'Papua Pegunungan',
  'papua-selatan': 'Papua Selatan',
}

// Sort options
const sortOptions = [
  { value: 'popular', label: 'Populer' },
  { value: 'newest', label: 'Terbaru' },
  { value: 'rating', label: 'Rating' },
  { value: 'name', label: 'A-Z' },
] as const

type SortBy = (typeof sortOptions)[number]['value']
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

  const [type, setType] = useQueryState(
    'type',
    parseAsStringLiteral(['all', ...typeList] as const).withDefault('all'),
  )

  const [provinsi, setProvinsi] = useQueryState(
    'provinsi',
    parseAsStringLiteral(['all', ...provinsiList] as const).withDefault('all'),
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
    type: type as 'all' | DestinationType,
    provinsi: provinsi as 'all' | Provinsi,
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
    void setType(null)
    void setProvinsi(null)
    void setSortBy(null)
  }, [setSearch, setCategories, setType, setProvinsi, setSortBy])

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
    categories.length > 0 ||
    type !== 'all' ||
    provinsi !== 'all' ||
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
                      color: isSelected ? 'primary-foreground ' : undefined,
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

        {/* Type & Provinsi Filters */}
        <div className="flex flex-wrap gap-3 px-5">
          {/* Type Filter */}
          <Select
            value={type}
            onValueChange={(value) =>
              void setType(value === 'all' ? null : (value as DestinationType))
            }
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Tipe Destinasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              {typeList.map((t) => (
                <SelectItem key={t} value={t}>
                  {typeLabels[t] ?? t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Provinsi Filter */}
          <Select
            value={provinsi}
            onValueChange={(value) =>
              void setProvinsi(value === 'all' ? null : (value as Provinsi))
            }
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Provinsi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Provinsi</SelectItem>
              {provinsiList.map((p) => (
                <SelectItem key={p} value={p}>
                  {provinsiLabels[p] ?? p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select
            value={sortBy}
            onValueChange={(value) =>
              void setSortBy(value === 'popular' ? null : (value as SortBy))
            }
          >
            <SelectTrigger className="w-35">
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
        </div>

        {/* Info & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-5">
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
            {type !== 'all' && (
              <span className="ml-1">
                • Tipe:{' '}
                <span className="font-semibold text-foreground">
                  {typeLabels[type] ?? type}
                </span>
              </span>
            )}
            {provinsi !== 'all' && (
              <span className="ml-1">
                • Provinsi:{' '}
                <span className="font-semibold text-foreground">
                  {provinsiLabels[provinsi] ?? provinsi}
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

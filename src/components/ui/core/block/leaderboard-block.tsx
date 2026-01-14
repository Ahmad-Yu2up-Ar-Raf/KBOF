import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs'
import {
  ArrowLeft,
  Trophy,
  Medal,
  Award,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from 'lucide-react'
import { useLottie } from 'lottie-react'
import trophyAnimation from '@/assets/animations/Winner Trophy Emoji.json'

import {
  getLeaderboardQueryOptions,
  getLeaderboardPodiumQueryOptions,
  type LeaderboardFilters,
  type LeaderboardEntry,
} from '@/lib/query-options'
import { cn } from '@/lib/utils'
import {
  buttonVariants,
  Button,
} from '@/components/ui/fragments/shadcn-ui/button'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/fragments/shadcn-ui/avatar'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/fragments/shadcn-ui/card'
import MediaItem from '@/components/ui/fragments/custom-ui/media/media-item'
import {
  FacetedFilter,
  FilterToolbar,
} from '@/components/ui/fragments/custom-ui/filter'

import {
  categoryList,
  typeList,
  provinsiList,
  buildCategoryOptions,
  buildTypeOptions,
  buildProvinsiOptions,
} from '@/lib/utils/destination-labels'

// ============================================
// MAIN COMPONENT
// ============================================

export default function LeaderboardPage() {
  // Hover state for blur effect
  const [hoveredPodium, setHoveredPodium] = useState<number | null>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  // Lottie animation
  const { View: TrophyAnimation } = useLottie({
    animationData: trophyAnimation,
    loop: true,
    autoplay: true,
  }, { width: 170, height: 170 })

  // URL state with nuqs
  const leaderboardParsers = {
    categories: parseAsArrayOf(parseAsStringLiteral(categoryList)).withDefault(
      [],
    ),
    types: parseAsArrayOf(parseAsStringLiteral(typeList)).withDefault([]),
    provinces: parseAsArrayOf(parseAsStringLiteral(provinsiList)).withDefault(
      [],
    ),
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
  }
  const [filters, setFilters] = useQueryStates(leaderboardParsers)

  // Build query filters from URL state
  const queryFilters: LeaderboardFilters = {
    categories: filters.categories as LeaderboardFilters['categories'],
    types: filters.types as LeaderboardFilters['types'],
    provinces: filters.provinces as LeaderboardFilters['provinces'],
    limit: filters.perPage,
    offset: (filters.page - 1) * filters.perPage,
    scope: 'global',
  }

  // Fetch data
  const { data: podium } = useSuspenseQuery(
    getLeaderboardPodiumQueryOptions({
      categories: queryFilters.categories,
      types: queryFilters.types,
      provinces: queryFilters.provinces,
      scope: 'global',
    }),
  )

  const { data: leaderboardData } = useSuspenseQuery(
    getLeaderboardQueryOptions(queryFilters),
  )

  // Build filter options with counts
  const categoryOptions = useMemo(
    () => buildCategoryOptions(leaderboardData.categoryCounts),
    [leaderboardData.categoryCounts],
  )
  const typeOptions = useMemo(
    () => buildTypeOptions(leaderboardData.typeCounts),
    [leaderboardData.typeCounts],
  )
  const provinsiOptions = useMemo(
    () => buildProvinsiOptions(leaderboardData.provinceCounts),
    [leaderboardData.provinceCounts],
  )

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.types.length > 0 ||
    filters.provinces.length > 0

  const handleResetFilters = () => {
    void setFilters({
      categories: null,
      types: null,
      provinces: null,
      page: 1,
    })
  }

  const totalPages = Math.ceil(leaderboardData.totalCount / filters.perPage)

  return (
    <section className="container py-3 space-y-5">
      {/* Navigation */}
      <nav className="flex items-center justify-between">
        <Link
          to="/"
          className={cn(
            buttonVariants({ variant: 'link' }),
            'flex has-[>svg]:px-0 w-fit py-2 items-center gap-2 px-0 group',
          )}
        >
          <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali</span>
        </Link>
      </nav>

      {/* Header */}
      <header className="text-center space-y-2 md:space-y-4 pb-4 md:pb-5 border-b">
        {/* Trophy Animation */}
        <div className="flex justify-center">
          {TrophyAnimation}
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight">
          Leaderboard Destinasi
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto px-2">
          Destinasi dengan dukungan terbanyak dari komunitas. Vote destinasi
          favoritmu untuk membantu mereka naik peringkat!
        </p>
      </header>

      {/* Podium Section - TOP 3 */}
      {podium.length > 0 && (
        <section className="relative py-4 md:py-8">
          <div className="flex items-end justify-center gap-2 sm:gap-6 md:gap-4 md:hover:gap-16 transition-all duration-300">
            {/* 2nd Place */}
            {podium[1] && (
              <div className=" order-1 -mr-8 hover:mr-4 md:translate-y-4 -rotate-5 z-1 hover:scale-105 transition-all duration-300">
                <PodiumCard entry={podium[1]} position={2} size="large" index={1} hovered={hoveredPodium} setHovered={setHoveredPodium} />
              </div>
            )}

            {/* 1st Place - Larger and higher */}
            {podium[0] && (
              <div className=" order-2 -translate-y-4 z-10 hover:mx-4 hover:scale-105 transition-all duration-300">
                <PodiumCard entry={podium[0]} position={1} size="larger" index={0} hovered={hoveredPodium} setHovered={setHoveredPodium} />
              </div>
            )}

            {/* 3rd Place */}
            {podium[2] && (
              <div className="order-3 -ml-8 hover:ml-4 md:translate-y-7 hover:translate-y-4 rotate-5 z-1 hover:scale-105 transition-all duration-300">
                <PodiumCard entry={podium[2]} position={3} size="large" index={2} hovered={hoveredPodium} setHovered={setHoveredPodium} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Leaderboard List */}
      <section className="space-y-3 md:space-y-4">
        <h2 className="text-base md:text-xl text-center font-semibold">
          <span className="text-primary">10 Destinasi</span> Teratas
        </h2>

        <div className="w-full flex items-center justify-center">
          {/* Filters */}
          <FilterToolbar layoutClassName={cn('w-full flex items-center justify-center',)} showReset={hasActiveFilters} onReset={handleResetFilters}>
            {/* Category Filter - Multiple selection */}
            <FacetedFilter
              title="Kategori"
              options={categoryOptions}
              value={filters.categories}
              onChange={(values) =>
                void setFilters({
                  categories:
                    values.length > 0
                      ? (values as typeof filters.categories)
                      : null,
                  page: 1,
                })
              }
              multiple
              popoverWidth="w-[14rem]"
            />

            {/* Type Filter - Multiple selection */}
            <FacetedFilter
              title="Tipe"
              options={typeOptions}
              value={filters.types}
              onChange={(values) =>
                void setFilters({
                  types:
                    values.length > 0 ? (values as typeof filters.types) : null,
                  page: 1,
                })
              }
              multiple
              popoverWidth="w-[14rem]"
            />

            {/* Provinsi Filter - Multiple selection */}
            <FacetedFilter
              title="Provinsi"
              options={provinsiOptions}
              value={filters.provinces}
              onChange={(values) =>
                void setFilters({
                  provinces:
                    values.length > 0 ? (values as typeof filters.provinces) : null,
                  page: 1,
                })
              }
              multiple
              popoverWidth="w-[14rem]"
            />
          </FilterToolbar>
        </div>

        <div className="space-y-3">
          {leaderboardData.data.map((entry, index) => (
            <LeaderboardRow
              key={entry.destinationId}
              entry={entry}
              index={index}
              hovered={hoveredRow}
              setHovered={setHoveredRow}
            />
          ))}
        </div>

        {leaderboardData.data.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Tidak ada destinasi yang cocok dengan filter.
          </div>
        )}
      </section>
    </section>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

function PodiumCard({
  entry,
  position,
  size,
  index,
  hovered,
  setHovered,
}: {
  entry: LeaderboardEntry
  position: 1 | 2 | 3
  size: 'large' | 'medium' | 'larger'
  index: number
  hovered: number | null
  setHovered: React.Dispatch<React.SetStateAction<number | null>>
}) {
  const Icon = position === 1 ? Trophy : position === 2 ? Medal : Award
  const colors = {
    1: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/30 shadow-yellow-500/10',
    2: 'from-slate-400/20 to-slate-500/5 border-slate-400/30 shadow-slate-400/10',
    3: 'from-amber-600/20 to-amber-700/5 border-amber-600/30 shadow-amber-600/10',
  }
  const iconColors = {
    1: 'text-yellow-500',
    2: 'text-slate-400',
    3: 'text-amber-600',
  }
  const badgeBgColors = {
    1: 'bg-yellow-500',
    2: 'bg-slate-400',
    3: 'bg-amber-600',
  }

  return (
    <Link
      to="/destinasi/$destinasiId"
      params={{ destinasiId: entry.slug }}
      className="block group"
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
    >
      <Card
        className={cn(
          'bg-white relative transition-all duration-300 hover:scale-103 md:hover:scale-105 hover:shadow-xl py-0 p-1 md:p-4 rounded-3xl border-2 bg-linear-to-b shadow-none',
          size === 'large' ? 'w-32 md:w-64' : size === 'larger' ? 'w-36 md:w-72' : 'w-32 md:w-48',
          colors[position],
          hovered !== null && hovered !== index && 'lg:blur-sm lg:scale-[0.98]',
        )}
      >

        <div className="relative rounded-3xl border">
          {entry.coverImage ? (
            <div
              className={cn(
                'w-full overflow-hidden rounded-t-3xl',
                size === 'large' ? 'h-fit md:h-40' : size === 'larger' ? 'h-fit md:h-48' : 'h-fit md:h-32',
              )}
            >
              <MediaItem
                webViewLink={entry.coverImage}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 rounded-t-2xl"
              />
            </div>
          ) : (
            <div
              className={cn(
                'w-full bg-muted flex items-center justify-center',
                size === 'large' ? 'h-40' : 'h-32',
              )}
            >
              <Icon className={cn('size-12 opacity-30', iconColors[position])} />
            </div>
          )}
          {/* Strong gradient overlay from bottom - fades image to background */}
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />

          {/* Trophy Badge - positioned centered at top */}
          <div
            className={cn(
              'absolute -top-6 md:-top-9 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-primary-foreground rounded-full flex items-center justify-center gap-1 shadow-md border'
            )}
          >
            <Icon className={cn('size-4 md:size-5 fill-white/70',
              iconColors[position]
            )} />
            <span className={cn('font-bold text-base', iconColors[position])}>#{position}</span>
          </div>
        </div>

        <CardContent className="bg-background p-2 md:p-4 space-y-2 -mt-8 relative z-10 rounded-b-2xl border border-t-0">
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm md:text-base font-semibold truncate">{entry.name}</h3>
            <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
              {entry.description}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {entry.category.replace(/-/g, ' ')}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                <MapPin className="size-3" />
                {entry.provinsi.replace(/-/g, ' ')}
              </span>
            </div>
          </div>

          {/* Vote Count */}
          <div
            className={cn(
              'flex items-center justify-center gap-1.5 py-0.5 md:py-1.5 rounded-full',
              badgeBgColors[position]
            )}
          >
            <ThumbsUp className="size-3 md:size-4 text-primary-foreground fill-primary/20" />
            <span className="text-sm md:text-base font-bold text-primary-foreground">{entry.voteCount}</span>
            <span className="text-xs text-primary-foreground">votes</span>
          </div>
        </CardContent>

        {/* Strong gradient overlay from bottom - fades image to background */}
        <div className="absolute inset-0 -bottom-1 opacity-100 group-hover:opacity-0 bg-linear-to-t h-10 md:h-24 self-end from-background via-background-15 md:via-background/30 to-transparent z-10 rounded-b-3xl scale-102 transition-all duration-300" />
      </Card>
    </Link>
  )
}

function LeaderboardRow({
  entry,
  index,
  hovered,
  setHovered,
}: {
  entry: LeaderboardEntry
  index: number
  hovered: number | null
  setHovered: React.Dispatch<React.SetStateAction<number | null>>
}) {
  const isTop3 = entry.rank <= 3
  const rankColors = {
    1: 'bg-yellow-500 text-white',
    2: 'bg-slate-400 text-white',
    3: 'bg-amber-600 text-white',
  }
  const borderColors = {
    1: 'border-yellow-500/50',
    2: 'border-slate-400/50',
    3: 'border-amber-600/50',
  }

  return (
    <Link
      to="/destinasi/$destinasiId"
      params={{ destinasiId: entry.slug }}
      className="block"
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
    >
      <Card className={cn(
        'hover:shadow-md transition-all duration-300 rounded-2xl md:rounded-3xl p-1.5 hover:scale-105 hover:rotate-1',
        hovered !== null && hovered !== index && 'lg:blur-sm lg:scale-[0.98]',
        isTop3 && borderColors[entry.rank as 1 | 2 | 3],
        isTop3 && 'border-2',
      )}>
        <CardContent className="bg-background flex items-center gap-2 md:gap-4 p-2 md:p-4 rounded-2xl md:rounded-3xl">
          {/* Rank */}
          <div
            className={cn(
              'flex items-center justify-center size-8 md:size-10 rounded-full font-bold text-sm md:text-lg shrink-0',
              isTop3
                ? rankColors[entry.rank as 1 | 2 | 3]
                : 'bg-muted text-muted-foreground',
            )}
          >
            {entry.rank}
          </div>

          {/* Image */}
          {entry.coverImage && (
            <div className="size-14 md:size-24 rounded-lg overflow-hidden shrink-0">
              <MediaItem
                webViewLink={entry.coverImage}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm md:text-base font-semibold truncate">{entry.name}</h3>
            <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
              {entry.description}
            </p>
            <div className="flex items-center gap-1 md:gap-2 mt-0.5 md:mt-1 flex-wrap">
              <Badge variant="secondary" className="text-[10px] md:text-xs px-1.5 md:px-2">
                {entry.category.replace(/-/g, ' ')}
              </Badge>
              <span className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-0.5 md:gap-1 truncate">
                <MapPin className="size-2.5 md:size-3" />
                {entry.provinsi.replace(/-/g, ' ')}
              </span>
            </div>
          </div>

          {/* Vote Count */}
          <div className="flex items-center gap-0.5 md:gap-1 text-primary font-semibold text-sm md:text-base shrink-0">
            <ThumbsUp className="size-3.5 md:size-4" />
            <span>{entry.voteCount} Votes</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// ============================================
// SKELETON
// ============================================

export function LeaderboardSkeleton() {
  return (
    <div className="container max-w-6xl mx-auto py-6 px-4 space-y-8">
      {/* Header skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      {/* Podium skeleton */}
      <div className="flex items-center justify-center gap-4 md:gap-8 py-8">
        <Skeleton className="h-48 w-36 md:w-48 rounded-xl" />
        <Skeleton className="h-56 w-48 md:w-64 rounded-xl" />
        <Skeleton className="h-48 w-36 md:w-48 rounded-xl" />
      </div>

      {/* Filter toolbar skeleton */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
        <Skeleton className="h-8 w-28 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>

      {/* List skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}

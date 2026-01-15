import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import confetti from "canvas-confetti"
import {
  parseAsArrayOf,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs'
import {
  ArrowLeft,
  Award,
  MapPin,
  Medal,
  StarIcon,
  ThumbsUp,
  Trophy,
} from 'lucide-react'
import { useLottie } from 'lottie-react'
import type { LeaderboardEntry, LeaderboardFilters } from '@/lib/query-options'
import trophyAnimation from '@/assets/animations/Winner Trophy Emoji.json'

import {
  getLeaderboardPodiumQueryOptions,
  getLeaderboardQueryOptions,
} from '@/lib/query-options'
import { cn } from '@/lib/utils'
import {
  buttonVariants,
} from '@/components/ui/fragments/shadcn-ui/button'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton'
import {
  Card,
  CardContent,
} from '@/components/ui/fragments/shadcn-ui/card'
import MediaItem from '@/components/ui/fragments/custom-ui/media/media-item'
import {
  FacetedFilter,
  FilterToolbar,
} from '@/components/ui/fragments/custom-ui/filter'

import {
  buildCategoryOptions,
  buildProvinsiOptions,
  buildTypeOptions,
  categoryList,
  provinsiList,
  typeList,
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

  // URL state with nuqs - only filters, no pagination
  const leaderboardParsers = {
    categories: parseAsArrayOf(parseAsStringLiteral(categoryList)).withDefault(
      [],
    ),
    types: parseAsArrayOf(parseAsStringLiteral(typeList)).withDefault([]),
    provinces: parseAsArrayOf(parseAsStringLiteral(provinsiList)).withDefault(
      [],
    ),
  }
  const [filters, setFilters] = useQueryStates(leaderboardParsers)

  // Always fetch global top 10 without filters - ranking stays fixed
  const globalQueryFilters: LeaderboardFilters = {
    categories: [],
    types: [],
    provinces: [],
    limit: 10,
    offset: 0,
    scope: 'global',
  }

  // Fetch data - always get global top 10
  const { data: podium } = useSuspenseQuery(
    getLeaderboardPodiumQueryOptions({
      categories: [],
      types: [],
      provinces: [],
      scope: 'global',
    }),
  )

  const { data: leaderboardData } = useSuspenseQuery(
    getLeaderboardQueryOptions(globalQueryFilters),
  )

  // Client-side filtering - keeps original ranking
  const filteredLeaderboardData = useMemo(() => {
    return leaderboardData.data.filter((entry) => {
      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(entry.category)
      const matchesType =
        filters.types.length === 0 || filters.types.includes(entry.type)
      const matchesProvince =
        filters.provinces.length === 0 ||
        filters.provinces.includes(entry.provinsi)
      return matchesCategory && matchesType && matchesProvince
    })
  }, [leaderboardData.data, filters.categories, filters.types, filters.provinces])

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
    })
  }

  // Confetti effect - runs only once per session (not on filter changes)
  useEffect(() => {
    const confettiKey = 'leaderboard-confetti-played'

    // Check if confetti has already been played this session
    if (sessionStorage.getItem(confettiKey)) return

    // Mark as played
    sessionStorage.setItem(confettiKey, 'true')

    const end = Date.now() + 3 * 1000 // 3 seconds
    const colors = ["#956c42", "#e2d8c3", "#d4c8aa", "#b54a35"]

    const frame = () => {
      if (Date.now() > end) return
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      })
      requestAnimationFrame(frame)
    }
    frame()
  }, []) // Empty array = runs once on mount

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

      {/* Podium Section - TOP 3 - Always show global top 3 */}
      {podium.length > 0 && (
        <section className="relative py-4 md:py-8">
          <div className="flex items-end justify-center gap-3 md:gap-4 md:hover:gap-16 transition-all duration-300">
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
        <h2 className="text-2xl sm:text-3xl md:text-5xl text-center font-semibold">
          <span className="text-primary">{filteredLeaderboardData.length} Destinasi</span> Teratas{hasActiveFilters ? ' dengan filter:' : ''}
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
                })
              }
              multiple
              popoverWidth="w-[14rem]"
            />
          </FilterToolbar>
        </div>

        <div>
          {filteredLeaderboardData.map((entry, index) => (
            <LeaderboardRow
              key={entry.destinationId}
              entry={entry}
              index={index}
              isFirst={index === 0}
              isLast={index === filteredLeaderboardData.length - 1}
              hovered={hoveredRow}
              setHovered={setHoveredRow}
            />
          ))}
        </div>

        {filteredLeaderboardData.length === 0 && (
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
          'bg-white relative transition-all duration-300 hover:scale-103 md:hover:scale-105 hover:shadow-xl py-0 p-1 sm:p-1.5 md:p-2 rounded-2xl sm:rounded-3xl border-2 bg-linear-to-b shadow-none',
          size === 'large' ? 'w-28 xs:w-32 sm:w-40 md:w-48 lg:w-56' : size === 'larger' ? 'w-32 xs:w-36 sm:w-44 md:w-56 lg:w-64' : 'w-28 xs:w-32 sm:w-40 md:w-48',
          colors[position],
          hovered !== null && hovered !== index && 'lg:blur-sm lg:scale-[0.98]',
        )}
      >

        <div className="relative rounded-xl sm:rounded-2xl md:rounded-3xl border">
          {entry.coverImage ? (
            <div
              className={cn(
                'w-full h-fit overflow-hidden rounded-t-xl sm:rounded-t-2xl md:rounded-t-3xl',
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
              'absolute -top-4 sm:-top-5 md:-top-6 left-1/2 -translate-x-1/2 z-10 px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 md:py-1.5 bg-primary-foreground rounded-full flex items-center justify-center gap-0.5 sm:gap-1 shadow-md border'
            )}
          >
            <Icon className={cn('size-3 sm:size-4 md:size-5 fill-white/70',
              iconColors[position]
            )} />
            <span className={cn('font-bold text-xs sm:text-sm md:text-base', iconColors[position])}>#{position}</span>
          </div>
        </div>

        <CardContent className="bg-background p-1.5 sm:p-2 md:p-4 space-y-1.5 sm:space-y-2 md:space-y-2 -mt-6 sm:-mt-7 md:-mt-8 relative z-10 rounded-b-xl sm:rounded-b-2xl border border-t-0">
          <div className="space-y-0 sm:space-y-1 md:space-y-2">
            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xs sm:text-sm md:text-base font-semibold truncate leading-none">{entry.name}</h3>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-clamp-1 hidden sm:block truncate">
                {entry.description}
              </p>
              {/* Location */}
              <div className="flex items-center justify-between gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-0.5 sm:gap-1 truncate">
                  <MapPin className="size-2.5 sm:size-3" />
                  {entry.provinsi.replace(/-/g, ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Hashtags - Multiple tags */}
          <div className="hidden sm:flex flex-nowrap gap-1">
            <Badge className="px-1 sm:px-1.5 py-0 bg-primary/10 text-primary rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium">
              # {entry.category.replace(/-/g, ' ')}
            </Badge>
            <Badge className="px-1 sm:px-1.5 py-0 bg-primary/10 text-primary rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium truncate">
              # {entry.type.replace(/-/g, ' ')}
            </Badge>
          </div>

          {/* Vote Count */}
          <div
            className={cn(
              'flex items-center justify-center gap-1 sm:gap-1.5 py-0.5 sm:py-1 md:py-1.5 rounded-full',
              badgeBgColors[position]
            )}
          >
            <ThumbsUp className="size-2.5 sm:size-3 md:size-4 text-primary-foreground fill-primary/20" />
            <span className="text-xs sm:text-sm md:text-base font-bold text-primary-foreground">{entry.voteCount}</span>
            <span className="text-[10px] sm:text-xs text-primary-foreground">votes</span>
          </div>
        </CardContent>

        {/* Strong gradient overlay from bottom - fades image to background */}
        <div className="absolute inset-0 -bottom-1 opacity-100 group-hover:opacity-0 bg-linear-to-t h-8 sm:h-10 md:h-24 self-end from-background via-background-15 md:via-background/30 to-transparent z-10 rounded-b-2xl sm:rounded-b-3xl scale-102 transition-all duration-300" />
      </Card>
    </Link>
  )
}

function LeaderboardRow({
  entry,
  index,
  isFirst,
  isLast,
  hovered,
  setHovered,
}: {
  entry: LeaderboardEntry
  index: number
  isFirst: boolean
  isLast: boolean
  hovered: number | null
  setHovered: React.Dispatch<React.SetStateAction<number | null>>
}) {
  const isTop3 = entry.rank <= 3
  const rankColors = {
    1: 'bg-yellow-500 text-white',
    2: 'bg-slate-400 text-white',
    3: 'bg-amber-600 text-white',
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
        'group relative overflow-visible shadow-none hover:shadow-md mx-4 md:mx-0 px-0 py-0 hover:scale-105 hover:z-10 hover:rotate-1 transition-all duration-300',
        isFirst && isLast && 'rounded-3xl',
        isFirst && !isLast && 'rounded-t-3xl rounded-b-none',
        isLast && !isFirst && 'rounded-t-none rounded-b-3xl',
        !isFirst && !isLast && 'rounded-none',
        hovered !== null && hovered !== index && 'lg:blur-sm lg:scale-[0.98]'
      )}>
        <CardContent className={cn(
          'bg-background flex items-center gap-2 md:gap-4 p-0',
          isFirst && isLast && 'rounded-3xl',
          isFirst && !isLast && 'rounded-t-3xl rounded-b-none',
          isLast && !isFirst && 'rounded-t-none rounded-b-3xl',
        )}>
          {/* Rank */}
          <div
            className={cn(
              'absolute -top-3 -left-3 md:-top-4 md:-left-4 flex items-center justify-center size-10 md:size-12 rounded-full font-bold text-sm md:text-lg shrink-0 z-10 border-2 border-background shadow-sm',
              isTop3
                ? rankColors[entry.rank as 1 | 2 | 3]
                : 'bg-primary text-primary-foreground',
            )}
          >
            #{entry.rank}
          </div>

          {/* Image */}
          {entry.coverImage && (
            <div className={cn(
              "relative size-22 md:size-36 overflow-hidden shrink-0",
              isFirst && isLast && "rounded-l-3xl",
              isFirst && !isLast && "rounded-tl-3xl",
              isLast && !isFirst && "rounded-bl-3xl",
            )}>
              <MediaItem
                webViewLink={entry.coverImage}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-background" />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 flex flex-col gap-0.5 md:gap-2.5 justify-between min-w-0 px-2 py-1 md:py-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-sm md:text-base font-semibold leading-none truncate">{entry.name}</h3>
                {/* Rating */}
                <Badge variant="outline" className="text-[10px] md:text-xs border-0 p-0 flex items-center gap-0.5 shrink-0">
                  <StarIcon className="size-3 md:size-3.5 fill-primary text-primary" />
                  <span className="font-semibold">{entry.averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({entry.totalReview})</span>
                </Badge>
              </div>
              <div className="flex gap-1 items-center">
                {entry.kabupatenKota && (
                  <span className="text-xs md:text-sm text-muted-foreground flex items-center gap-0.5 md:gap-1 truncate">
                    {entry.kabupatenKota.replace(/-/g, ' ')}
                  </span>
                )}
                -
                <span className="text-xs md:text-sm text-muted-foreground flex items-center gap-0.5 md:gap-1 truncate">
                  {entry.provinsi.replace(/-/g, ' ')}
                </span>
              </div>
            </div>
            <p className="hidden md:block max-w-md 2xl:max-w-lg text-xs md:text-sm text-muted-foreground line-clamp-1">
              {entry.description}
            </p>
            {/* Tags & Rating Row */}
            <div className=" mt-0.5 md:mt-1">
              {/* Multiple Hashtags */}
              <div className="flex items-center gap-1 md:gap-1.5 flex-wrap">
                <Badge className="px-1.5 py-0 bg-primary/10 text-primary rounded-xl text-[10px] md:text-xs font-medium">
                  # {entry.category.replace(/-/g, ' ')}
                </Badge>
                <Badge className="px-1.5 py-0 bg-primary/10 text-primary rounded-xl text-[10px] md:text-xs font-medium">
                  # {entry.type.replace(/-/g, ' ')}
                </Badge>
              </div>
            </div>
          </div>

          {/* Vote Count */}
          <div className="flex items-center gap-0.5 md:gap-1 px-2 md:px-4 text-primary font-semibold text-sm md:text-base shrink-0">
            <ThumbsUp className="size-3.5 md:size-4" />
            {entry.voteCount}
            <span className="hidden sm:block">Votes</span>
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

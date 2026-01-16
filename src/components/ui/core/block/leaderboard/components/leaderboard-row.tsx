// =============================================================================
// LEADERBOARD ROW - Leaderboard
// =============================================================================
// Row component for destinations in the leaderboard list
// =============================================================================

import { Link } from '@tanstack/react-router'
import { StarIcon, ThumbsUp } from 'lucide-react'

import type { LeaderboardEntry } from '@/lib/query-options'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import { Card, CardContent } from '@/components/ui/fragments/shadcn-ui/card'
import MediaItem from '@/components/ui/fragments/custom-ui/media/media-item'

// =============================================================================
// TYPES
// =============================================================================

export type LeaderboardRowProps = {
  entry: LeaderboardEntry
  index: number
  isFirst: boolean
  isLast: boolean
  hovered: number | null
  setHovered: React.Dispatch<React.SetStateAction<number | null>>
}

// =============================================================================
// CONSTANTS
// =============================================================================

const RANK_COLORS = {
  1: 'bg-yellow-500 text-white',
  2: 'bg-slate-400 text-white',
  3: 'bg-amber-600 text-white',
} as const

// =============================================================================
// COMPONENT
// =============================================================================

export function LeaderboardRow({
  entry,
  index,
  isFirst,
  isLast,
  hovered,
  setHovered,
}: LeaderboardRowProps) {
  const isTop3 = entry.rank <= 3

  // Calculate border radius based on position
  const roundedClasses = getRoundedClasses(isFirst, isLast)

  return (
    <Link
      to="/destinasi/$destinasiId"
      params={{ destinasiId: entry.slug }}
      className="block"
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
    >
      <Card
        className={cn(
          'group relative overflow-visible shadow-none',
          'hover:shadow-md mx-4 md:mx-0 px-0 py-0',
          'hover:scale-105 hover:z-10 hover:rotate-1',
          'transition-all duration-300',
          roundedClasses.card,
          hovered !== null && hovered !== index && 'lg:blur-sm lg:scale-[0.98]',
        )}
      >
        <CardContent
          className={cn(
            'bg-background flex items-center gap-2 md:gap-4 p-0',
            roundedClasses.content,
          )}
        >
          {/* Rank Badge */}
          <RankBadge rank={entry.rank} isTop3={isTop3} />

          {/* Image */}
          {entry.coverImage && (
            <RowImage
              coverImage={entry.coverImage}
              roundedClasses={roundedClasses}
            />
          )}

          {/* Info */}
          <RowInfo entry={entry} />

          {/* Vote Count */}
          <VoteCount voteCount={entry.voteCount} />
        </CardContent>
      </Card>
    </Link>
  )
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getRoundedClasses(isFirst: boolean, isLast: boolean) {
  if (isFirst && isLast) {
    return {
      card: 'rounded-3xl',
      content: 'rounded-3xl',
      image: 'rounded-l-3xl',
    }
  }
  if (isFirst) {
    return {
      card: 'rounded-t-3xl rounded-b-none',
      content: 'rounded-t-3xl rounded-b-none',
      image: 'rounded-tl-3xl',
    }
  }
  if (isLast) {
    return {
      card: 'rounded-t-none rounded-b-3xl',
      content: 'rounded-t-none rounded-b-3xl',
      image: 'rounded-bl-3xl',
    }
  }
  return {
    card: 'rounded-none',
    content: '',
    image: '',
  }
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

type RankBadgeProps = {
  rank: number
  isTop3: boolean
}

function RankBadge({ rank, isTop3 }: RankBadgeProps) {
  return (
    <div
      className={cn(
        'absolute -top-2 -left-3 md:-top-4 md:-left-4',
        'flex items-center justify-center',
        'size-9 md:size-12 rounded-3xl   ',
        'font-bold text-sm md:text-lg shrink-0 z-10',
        'border-2 border-background shadow-sm',
        isTop3
          ? RANK_COLORS[rank as 1 | 2 | 3]
          : 'bg-primary text-primary-foreground',
      )}
    >
      #{rank}
    </div>
  )
}

type RowImageProps = {
  coverImage: string
  roundedClasses: { image: string }
}

function RowImage({ coverImage, roundedClasses }: RowImageProps) {
  return (
    <div
      className={cn(
        'relative size-22 md:size-36 overflow-hidden shrink-0',
        roundedClasses.image,
      )}
    >
      <MediaItem
        webViewLink={coverImage}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-background" />
    </div>
  )
}

type RowInfoProps = {
  entry: LeaderboardEntry
}

function RowInfo({ entry }: RowInfoProps) {
  return (
    <div className="flex-1 flex flex-col gap-2 md:gap-2.5 justify-between min-w-0 px-2 py-1 md:py-2">
      {/* Header */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h3 className="text-sm md:text-base font-semibold leading-none truncate">
            {entry.name}
          </h3>
          {/* Rating */}
          <Badge
            variant="outline"
            className="text-[10px] md:text-xs border-0 p-0 flex items-center gap-0.5 shrink-0"
          >
            <StarIcon className="size-3 md:size-3.5 fill-primary text-primary" />
            <span className="font-semibold">
              {entry.averageRating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">({entry.totalReview})</span>
          </Badge>
        </div>
        {/* Location */}
        <div className="flex gap-1 items-center">
          {entry.kabupatenKota && (
            <span className="text-xs md:text-sm text-muted-foreground truncate">
              {entry.kabupatenKota.replace(/-/g, ' ')}
            </span>
          )}
          -
          <span className="text-xs md:text-sm text-muted-foreground truncate">
            {entry.provinsi.replace(/-/g, ' ')}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="hidden md:block max-w-md 2xl:max-w-lg text-xs md:text-sm text-muted-foreground line-clamp-1 sr-only">
        {entry.description}
      </p>

      {/* Tags */}
      <div className="mt-0.5 md:mt-1">
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
  )
}

type VoteCountProps = {
  voteCount: number
}

function VoteCount({ voteCount }: VoteCountProps) {
  return (
    <div className="flex items-center gap-0.5 md:gap-1 px-2 md:px-4 text-primary font-semibold text-sm md:text-base shrink-0">
      <ThumbsUp className="size-3.5 md:size-4" />
      {voteCount}
      <span className="hidden sm:block">Votes</span>
    </div>
  )
}

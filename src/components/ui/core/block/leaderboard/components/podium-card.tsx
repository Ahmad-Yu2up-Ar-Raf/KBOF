// =============================================================================
// PODIUM CARD - Leaderboard
// =============================================================================
// Card component for top 3 destinations on the podium
// =============================================================================

import { Link } from '@tanstack/react-router'
import { Award, MapPin, Medal, ThumbsUp, Trophy } from 'lucide-react'

import type { LeaderboardEntry } from '@/lib/query-options'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import { Card, CardContent } from '@/components/ui/fragments/shadcn-ui/card'
import MediaItem from '@/components/ui/fragments/custom-ui/media/media-item'

// =============================================================================
// TYPES
// =============================================================================

export type PodiumPosition = 1 | 2 | 3
export type PodiumSize = 'large' | 'medium' | 'larger'

export type PodiumCardProps = {
  entry: LeaderboardEntry
  position: PodiumPosition
  size: PodiumSize
  index: number
  hovered: number | null
  setHovered: React.Dispatch<React.SetStateAction<number | null>>
}

// =============================================================================
// CONSTANTS
// =============================================================================

const POSITION_ICONS = {
  1: Trophy,
  2: Medal,
  3: Award,
} as const

const POSITION_COLORS = {
  1: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/30 shadow-yellow-500/10',
  2: 'from-slate-400/20 to-slate-500/5 border-slate-400/30 shadow-slate-400/10',
  3: 'from-amber-600/20 to-amber-700/5 border-amber-600/30 shadow-amber-600/10',
} as const

const ICON_COLORS = {
  1: 'text-yellow-500',
  2: 'text-slate-400',
  3: 'text-amber-600',
} as const

const BADGE_BG_COLORS = {
  1: 'bg-yellow-500',
  2: 'bg-slate-400',
  3: 'bg-amber-600',
} as const

const SIZE_CLASSES = {
  large: 'w-28 xs:w-32 sm:w-40 md:w-48 lg:w-56',
  larger: 'w-32 xs:w-36 sm:w-44 md:w-56 lg:w-64',
  medium: 'w-28 xs:w-32 sm:w-40 md:w-48',
} as const

// =============================================================================
// COMPONENT
// =============================================================================

export function PodiumCard({
  entry,
  position,
  size,
  index,
  hovered,
  setHovered,
}: PodiumCardProps) {
  const Icon = POSITION_ICONS[position]

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
          'bg-white relative transition-all duration-300',
          'hover:scale-103 md:hover:scale-105 hover:shadow-xl',
          'py-0 p-1 sm:p-1.5 md:p-2 rounded-2xl sm:rounded-3xl',
          'border-2 bg-linear-to-b shadow-none',
          SIZE_CLASSES[size],
          POSITION_COLORS[position],
          hovered !== null && hovered !== index && 'lg:blur-sm lg:scale-[0.98]',
        )}
      >
        {/* Image Section */}
        <PodiumImage entry={entry} position={position} Icon={Icon} />

        {/* Content Section */}
        <PodiumContent entry={entry} position={position} />

        {/* Gradient Overlay */}
        <div
          className={cn(
            'absolute inset-0 -bottom-1 opacity-100 group-hover:opacity-0',
            'bg-linear-to-t h-8 sm:h-10 md:h-24 self-end',
            'from-background via-background-15 md:via-background/30 to-transparent',
            'z-10 rounded-b-2xl sm:rounded-b-3xl scale-102 transition-all duration-300',
          )}
        />
      </Card>
    </Link>
  )
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

type PodiumImageProps = {
  entry: LeaderboardEntry
  position: PodiumPosition
  Icon: typeof Trophy
}

function PodiumImage({ entry, position, Icon }: PodiumImageProps) {
  return (
    <div className="relative rounded-xl sm:rounded-2xl md:rounded-3xl border">
      {entry.coverImage ? (
        <div className="w-full h-fit overflow-hidden rounded-t-xl sm:rounded-t-2xl md:rounded-t-3xl">
          <MediaItem
            webViewLink={entry.coverImage}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 rounded-t-2xl"
          />
        </div>
      ) : (
        <div className="w-full h-32 bg-muted flex items-center justify-center">
          <Icon className={cn('size-12 opacity-30', ICON_COLORS[position])} />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />

      {/* Position Badge */}
      <PositionBadge position={position} Icon={Icon} />
    </div>
  )
}

type PositionBadgeProps = {
  position: PodiumPosition
  Icon: typeof Trophy
}

function PositionBadge({ position, Icon }: PositionBadgeProps) {
  return (
    <div
      className={cn(
        'absolute -top-4 sm:-top-5 md:-top-6 left-1/2 -translate-x-1/2 z-10',
        'px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 md:py-1.5',
        'bg-primary-foreground rounded-full',
        'flex items-center justify-center gap-0.5 sm:gap-1',
        'shadow-md border',
      )}
    >
      <Icon
        className={cn(
          'size-3 sm:size-4 md:size-5 fill-white/70',
          ICON_COLORS[position],
        )}
      />
      <span
        className={cn(
          'font-bold text-xs sm:text-sm md:text-base',
          ICON_COLORS[position],
        )}
      >
        #{position}
      </span>
    </div>
  )
}

type PodiumContentProps = {
  entry: LeaderboardEntry
  position: PodiumPosition
}

function PodiumContent({ entry, position }: PodiumContentProps) {
  return (
    <CardContent
      className={cn(
        'bg-background p-1.5 sm:p-2 md:p-4',
        'space-y-1.5 sm:space-y-2 md:space-y-2',
        '-mt-6 sm:-mt-7 md:-mt-8 relative z-10',
        'rounded-b-xl sm:rounded-b-2xl border border-t-0',
      )}
    >
      {/* Info */}
      <div className="space-y-0 sm:space-y-1 md:space-y-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-xs sm:text-sm md:text-base font-semibold truncate leading-none">
            {entry.name}
          </h3>
          {/* <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-clamp-1 hidden sm:block truncate">
            {entry.description}
          </p> */}
          {/* Location */}
          <div className="flex items-center justify-between gap-1 sm:gap-2 mt-0.5 sm:mt-1">
            <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-0.5 sm:gap-1 truncate">
              <MapPin className="size-2.5 sm:size-3" />
              {entry.provinsi.replace(/-/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Tags */}
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
          BADGE_BG_COLORS[position],
        )}
      >
        <ThumbsUp className="size-2.5 sm:size-3 md:size-4 text-primary-foreground fill-primary/20" />
        <span className="text-xs sm:text-sm md:text-base font-bold text-primary-foreground">
          {entry.voteCount}
        </span>
        <span className="text-[10px] sm:text-xs text-primary-foreground">
          votes
        </span>
      </div>
    </CardContent>
  )
}

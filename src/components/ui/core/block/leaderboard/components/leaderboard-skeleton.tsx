// =============================================================================
// LEADERBOARD SKELETON - Leaderboard
// =============================================================================
// Loading skeleton for leaderboard page
// =============================================================================

import { LeaderboardHeader } from './leaderboard-header'
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton'

// =============================================================================
// COMPONENT
// =============================================================================

export function LeaderboardSkeleton() {
  return (
    <div className="container overflow-hidden px-6 py-4.5 space-y-5">
      {/* Header skeleton */}
      <LeaderboardHeader />

      {/* Podium skeleton */}
      <section className="relative py-4 md:py-8 mb-10">
        <div className="flex items-end justify-center gap-3 md:gap-4 md:hover:gap-16 transition-all duration-300">
          <Skeleton className="h-30 md:h-50  w-36 md:w-48 rounded-xl" />
          <Skeleton className="h-38  md:h-70 w-48 md:w-64 rounded-xl" />
          <Skeleton className="h-30 md:h-50 w-36 md:w-48 rounded-xl" />
        </div>
      </section>
      {/* Filter toolbar skeleton */}
      <section className="space-y-3 md:space-y-4">
        <div className=" w-full flex   gap-5 flex-col items-center justify-center mb-10">
          <Skeleton className="h-5 w-40 md:h-10 md:w-96 rounded-xl" />
          <div className=" flex  gap-2 flex-wrap sm:items-center">
            <Skeleton className="h-5 w-16 md:h-8 md:w-25 rounded-xl" />
            <Skeleton className="h-5 w-16 md:h-8 md:w-25 rounded-xl" />
            <Skeleton className="h-5 w-16 md:h-8 md:w-25 rounded-xl" />
          </div>
        </div>

        {/* List skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </section>
    </div>
  )
}

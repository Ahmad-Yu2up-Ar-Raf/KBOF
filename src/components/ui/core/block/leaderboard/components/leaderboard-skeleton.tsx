// =============================================================================
// LEADERBOARD SKELETON - Leaderboard
// =============================================================================
// Loading skeleton for leaderboard page
// =============================================================================

import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton'

// =============================================================================
// COMPONENT
// =============================================================================

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

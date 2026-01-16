// =============================================================================
// LEADERBOARD ROUTE - SUASANA
// =============================================================================
// Displays top destinations ranked by vote count
// Features: Podium (TOP 3), filtered list, pagination
// =============================================================================

import { createFileRoute } from '@tanstack/react-router'

import { queryClient } from '@/components/provider/Provider'
import {
  getLeaderboardQueryOptions,
  getLeaderboardPodiumQueryOptions,
  type LeaderboardFilters,
} from '@/lib/query-options'

import LeaderboardPage, {
  LeaderboardSkeleton,
} from '@/components/ui/core/block/leaderboard/leaderboard-block'

// ============================================
// ROUTE DEFINITION
// ============================================

export const Route = createFileRoute('/destinasi/leaderboard')({
  // Server loader - prefetch podium and first page
  loader: async () => {
    const defaultFilters: LeaderboardFilters = {
      categories: [],
      types: [],
      provinces: [],
      limit: 10,
      offset: 0,
      scope: 'global',
    }

    const podiumFilters: Omit<LeaderboardFilters, 'limit' | 'offset'> = {
      categories: [],
      types: [],
      provinces: [],
      scope: 'global',
    }

    // Prefetch both podium and list data in parallel
    await Promise.all([
      queryClient.ensureQueryData(
        getLeaderboardPodiumQueryOptions(podiumFilters),
      ),
      queryClient.ensureQueryData(getLeaderboardQueryOptions(defaultFilters)),
    ])
  },
  component: LeaderboardPage,
  pendingComponent: LeaderboardSkeleton,
})

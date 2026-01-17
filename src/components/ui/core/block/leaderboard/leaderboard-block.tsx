// =============================================================================
// LEADERBOARD PAGE - Main Component
// =============================================================================
// Displays top destinations ranked by vote count
// Features: Podium (TOP 3), filtered list, confetti effect
// =============================================================================

import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'

import type { LeaderboardFilters } from '@/lib/query-options'
import {
  getLeaderboardPodiumQueryOptions,
  getLeaderboardQueryOptions,
} from '@/lib/query-options'

import {
  LeaderboardHeader,
  LeaderboardListSection,
  LeaderboardSkeleton,
  PodiumSection,
} from './components'
import { useConfettiEffect, useLeaderboardFilters } from './hooks'

// =============================================================================
// CONSTANTS
// =============================================================================

const GLOBAL_QUERY_FILTERS: LeaderboardFilters = {
  categories: [],
  types: [],
  provinces: [],
  limit: 10,
  offset: 0,
  scope: 'global',
}

const PODIUM_FILTERS = {
  categories: [],
  types: [],
  provinces: [],
  scope: 'global' as const,
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function LeaderboardPage() {
  // Hover states for blur effect
  const [hoveredPodium, setHoveredPodium] = useState<number | null>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  // Confetti effect - runs only once per session
  useConfettiEffect()

  // Fetch data - always get global top 10
  const { data: podium } = useSuspenseQuery(
    getLeaderboardPodiumQueryOptions(PODIUM_FILTERS),
  )
  const { data: leaderboardData } = useSuspenseQuery(
    getLeaderboardQueryOptions(GLOBAL_QUERY_FILTERS),
  )

  // Filter management
  const {
    filters,
    filteredData,
    categoryOptions,
    typeOptions,
    provinsiOptions,
    hasActiveFilters,
    handleResetFilters,
    handleFiltersChange,
  } = useLeaderboardFilters(leaderboardData)

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <section className="container py-4.5 space-y-5">
      <LeaderboardHeader />

      <PodiumSection
        podium={podium}
        hoveredPodium={hoveredPodium}
        setHoveredPodium={setHoveredPodium}
      />

      <LeaderboardListSection
        data={filteredData}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categoryOptions={categoryOptions}
        typeOptions={typeOptions}
        provinsiOptions={provinsiOptions}
        hoveredRow={hoveredRow}
        setHoveredRow={setHoveredRow}
      />
    </section>
  )
}

// =============================================================================
// RE-EXPORT SKELETON
// =============================================================================

export { LeaderboardSkeleton }

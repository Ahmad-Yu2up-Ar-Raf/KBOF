// =============================================================================
// USE LEADERBOARD FILTERS - Leaderboard
// =============================================================================
// Hook for managing leaderboard filter state with URL sync
// =============================================================================

import { useMemo } from 'react'
import { parseAsArrayOf, parseAsStringLiteral, useQueryStates } from 'nuqs'

import type { LeaderboardEntry } from '@/lib/query-options'
import {
  buildCategoryOptions,
  buildProvinsiOptions,
  buildTypeOptions,
  categoryList,
  provinsiList,
  typeList,
} from '@/lib/utils/destination-labels'

// =============================================================================
// TYPES
// =============================================================================

type LeaderboardData = {
  data: LeaderboardEntry[]
  categoryCounts: Record<string, number>
  typeCounts: Record<string, number>
  provinceCounts: Record<string, number>
}

// =============================================================================
// HOOK
// =============================================================================

export function useLeaderboardFilters(leaderboardData: LeaderboardData) {
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

  // Client-side filtering - keeps original ranking
  const filteredData = useMemo(() => {
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
  }, [
    leaderboardData.data,
    filters.categories,
    filters.types,
    filters.provinces,
  ])

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

  const handleFiltersChange = (
    key: 'categories' | 'types' | 'provinces',
    values: string[] | null,
  ) => {
    void setFilters({ [key]: values })
  }

  return {
    filters,
    filteredData,
    categoryOptions,
    typeOptions,
    provinsiOptions,
    hasActiveFilters,
    handleResetFilters,
    handleFiltersChange,
  }
}

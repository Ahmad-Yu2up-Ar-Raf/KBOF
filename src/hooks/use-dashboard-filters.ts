'use client'

import { useQueryStates, parseAsArrayOf, parseAsInteger } from 'nuqs'
import { useCallback } from 'react'
import type { DateRange } from 'react-day-picker'

// Parser yang sama dengan validasi schema
const dashboardFiltersParser = {
  createdAt: parseAsArrayOf(parseAsInteger).withDefault([]),
}

export function useDashboardFilters() {
  const [filters, setFilters] = useQueryStates(dashboardFiltersParser, {
    // Shallow routing untuk performa yang lebih baik
    shallow: false,
    // History mode untuk browser back/forward
    history: 'push',
    // Debounce untuk menghindari terlalu banyak request
    throttleMs: 300,
  })

  // Convert timestamps ke DateRange untuk UI
  const dateRange: DateRange | undefined = (() => {
    if (!filters.createdAt || filters.createdAt.length === 0) {
      return undefined
    }

    const [fromTimestamp, toTimestamp] = filters.createdAt

    return {
      from: fromTimestamp ? new Date(fromTimestamp) : undefined,
      to: toTimestamp ? new Date(toTimestamp) : undefined,
    }
  })()

  // Handler untuk update date range
  const setDateRange = useCallback(
    async (dateRange: DateRange | undefined) => {
      if (!dateRange || (!dateRange.from && !dateRange.to)) {
        // Clear filter
        await setFilters({ createdAt: null })
        return
      }

      const timestamps: number[] = []

      // Set time to start of day for 'from' date
      if (dateRange.from) {
        const fromDate = new Date(dateRange.from)
        fromDate.setHours(0, 0, 0, 0)
        timestamps.push(fromDate.getTime())
      }

      // Set time to end of day for 'to' date
      if (dateRange.to) {
        const toDate = new Date(dateRange.to)
        toDate.setHours(23, 59, 59, 999)
        timestamps.push(toDate.getTime())
      }

      await setFilters({ createdAt: timestamps.length > 0 ? timestamps : null })
    },
    [setFilters],
  )

  // Clear all filters
  const clearFilters = useCallback(async () => {
    await setFilters({ createdAt: null })
  }, [setFilters])

  // Check if any filter is active
  const hasActiveFilters = filters.createdAt && filters.createdAt.length > 0

  // Get formatted date range for display
  const getFormattedDateRange = useCallback(() => {
    if (!dateRange?.from) return null

    if (dateRange.from && dateRange.to) {
      return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
    }

    return dateRange.from.toLocaleDateString()
  }, [dateRange])

  return {
    filters,
    dateRange,
    setDateRange,
    clearFilters,
    hasActiveFilters,
    getFormattedDateRange,
    // Raw filters untuk dikirim ke server queries
    rawFilters: {
      createdAt: filters.createdAt,
    },
  }
}

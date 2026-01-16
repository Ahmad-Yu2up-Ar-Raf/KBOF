// =============================================================================
// USE DESTINASI FILTERS - URL State Management Hook
// =============================================================================

'use client'

import { useCallback } from 'react'
import {
  useQueryState,
  parseAsString,
  parseAsArrayOf,
  parseAsStringLiteral,
} from 'nuqs'

import {
  categoryList,
  typeList,
  provinsiList,
  sortOptions,
  type SortBy,
} from '@/lib/utils/destination-labels'

// ============================================
// TYPES
// ============================================

type Category = (typeof categoryList)[number]
type DestinationType = (typeof typeList)[number]
type Provinsi = (typeof provinsiList)[number]

export interface DestinasiFilters {
  limit: number
  search: string
  categories: Category[]
  types: DestinationType[]
  provinces: Provinsi[]
  sortBy: SortBy
}

// ============================================
// HOOK
// ============================================

export function useDestinasiFilters() {
  // URL State with nuqs - clean URLs (no default values in URL)
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault(''),
  )

  const [categories, setCategories] = useQueryState(
    'categories',
    parseAsArrayOf(parseAsStringLiteral(categoryList)).withDefault([]),
  )

  const [types, setTypes] = useQueryState(
    'types',
    parseAsArrayOf(parseAsStringLiteral(typeList)).withDefault([]),
  )

  const [provinces, setProvinces] = useQueryState(
    'provinces',
    parseAsArrayOf(parseAsStringLiteral(provinsiList)).withDefault([]),
  )

  const [sortBy, setSortBy] = useQueryState(
    'sortBy',
    parseAsStringLiteral(sortOptions.map((o) => o.value)).withDefault('popular'),
  )

  // Build filters for query
  const filters: DestinasiFilters = {
    limit: 12,
    search,
    categories: categories as Category[],
    types: types as DestinationType[],
    provinces: provinces as Provinsi[],
    sortBy: sortBy as SortBy,
  }

  // Check if any filters are active
  const hasActiveFilters =
    categories.length > 0 ||
    types.length > 0 ||
    provinces.length > 0 ||
    sortBy !== 'popular' ||
    search !== ''

  // Reset all filters
  const handleResetFilter = useCallback(() => {
    void setSearch(null)
    void setCategories(null)
    void setTypes(null)
    void setProvinces(null)
    void setSortBy(null)
  }, [setSearch, setCategories, setTypes, setProvinces, setSortBy])

  // Individual setters with proper type handling
  const handleCategoriesChange = useCallback(
    (values: string[]) => {
      void setCategories(values.length > 0 ? (values as Category[]) : null)
    },
    [setCategories],
  )

  const handleTypesChange = useCallback(
    (values: string[]) => {
      void setTypes(values.length > 0 ? (values as DestinationType[]) : null)
    },
    [setTypes],
  )

  const handleProvincesChange = useCallback(
    (values: string[]) => {
      void setProvinces(values.length > 0 ? (values as Provinsi[]) : null)
    },
    [setProvinces],
  )

  const handleSortByChange = useCallback(
    (value: string) => {
      void setSortBy(value === 'popular' ? null : (value as SortBy))
    },
    [setSortBy],
  )

  return {
    // Raw values
    search,
    categories,
    types,
    provinces,
    sortBy,

    // Computed
    filters,
    hasActiveFilters,

    // Handlers
    handleResetFilter,
    handleCategoriesChange,
    handleTypesChange,
    handleProvincesChange,
    handleSortByChange,
  }
}

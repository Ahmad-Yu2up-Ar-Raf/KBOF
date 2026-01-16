// =============================================================================
// DESTINASI FILTER SECTION - Filter Toolbar Component
// =============================================================================

'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/fragments/shadcn-ui/select'
import {
  FacetedFilter,
  FilterToolbar,
} from '@/components/ui/fragments/custom-ui/filter'
import type { FilterOption } from '@/components/ui/fragments/custom-ui/filter'
import { sortOptions } from '@/lib/utils/destination-labels'

// ============================================
// TYPES
// ============================================

interface DestinasiFilterSectionProps {
  // Filter values
  categories: string[]
  types: string[]
  provinces: string[]
  sortBy: string

  // Filter options
  categoryOptions: FilterOption[]
  typeOptions: FilterOption[]
  provinsiOptions: FilterOption[]

  // Handlers
  onCategoriesChange: (values: string[]) => void
  onTypesChange: (values: string[]) => void
  onProvincesChange: (values: string[]) => void
  onSortByChange: (value: string) => void
  onReset: () => void

  // State
  hasActiveFilters: boolean
}

// ============================================
// COMPONENT
// ============================================

export function DestinasiFilterSection({
  categories,
  types,
  provinces,
  sortBy,
  categoryOptions,
  typeOptions,
  provinsiOptions,
  onCategoriesChange,
  onTypesChange,
  onProvincesChange,
  onSortByChange,
  onReset,
  hasActiveFilters,
}: DestinasiFilterSectionProps) {
  return (
    <FilterToolbar showReset={hasActiveFilters} className="" onReset={onReset}>
      {/* Category Filter */}
      <FacetedFilter
        title="Kategori"
        options={categoryOptions}
        value={categories}
        onChange={onCategoriesChange}
        multiple
        popoverWidth="w-[14rem]"
      />

      {/* Type Filter */}
      <FacetedFilter
        title="Tipe"
        options={typeOptions}
        value={types}
        onChange={onTypesChange}
        multiple
        popoverWidth="w-[14rem]"
      />

      {/* Provinsi Filter */}
      <FacetedFilter
        title="Provinsi"
        options={provinsiOptions}
        value={provinces}
        onChange={onProvincesChange}
        multiple
        popoverWidth="w-[14rem]"
      />

      {/* Sort By */}
      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="h-full sm:w-fit w-full text-sm border-dashed">
          <SelectValue placeholder="Urutkan" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FilterToolbar>
  )
}

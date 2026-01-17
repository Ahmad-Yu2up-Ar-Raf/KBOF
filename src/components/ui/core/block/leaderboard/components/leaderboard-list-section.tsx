// =============================================================================
// LEADERBOARD LIST SECTION - Leaderboard
// =============================================================================
// List of destinations with filtering and ranking
// =============================================================================

import type { LeaderboardEntry } from '@/lib/query-options'
import { cn } from '@/lib/utils'
import {
  FacetedFilter,
  FilterToolbar,
} from '@/components/ui/fragments/custom-ui/filter'

import { LeaderboardRow } from './leaderboard-row'

// =============================================================================
// TYPES
// =============================================================================

type FilterOption = {
  value: string
  label: string
  count?: number
}

export type LeaderboardListSectionProps = {
  data: LeaderboardEntry[]
  hasActiveFilters: boolean
  onResetFilters: () => void
  // Filter state
  filters: {
    categories: string[]
    types: string[]
    provinces: string[]
  }
  onFiltersChange: (
    key: 'categories' | 'types' | 'provinces',
    values: string[] | null,
  ) => void
  // Filter options
  categoryOptions: FilterOption[]
  typeOptions: FilterOption[]
  provinsiOptions: FilterOption[]
  // Hover state
  hoveredRow: number | null
  setHoveredRow: React.Dispatch<React.SetStateAction<number | null>>
}

// =============================================================================
// COMPONENT
// =============================================================================

export function LeaderboardListSection({
  data,
  hasActiveFilters,
  onResetFilters,
  filters,
  onFiltersChange,
  categoryOptions,
  typeOptions,
  provinsiOptions,
  hoveredRow,
  setHoveredRow,
}: LeaderboardListSectionProps) {
  return (
    <section className="space-y-3 md:space-y-4">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl md:text-5xl text-center font-semibold">
        <span className="text-primary">{data.length} Destinasi</span> Teratas
        {hasActiveFilters ? ' dengan filter:' : ''}
      </h2>

      {/* Filters */}
      <FilterBar
        
        filters={filters}
        onFiltersChange={onFiltersChange}
        categoryOptions={categoryOptions}
        typeOptions={typeOptions}
        provinsiOptions={provinsiOptions}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={onResetFilters}
      />

      {/* List */}
      <div className=' mt-10'>
        {data.map((entry, index) => (
          <LeaderboardRow
            key={entry.destinationId}
            entry={entry}
            index={index}
            isFirst={index === 0}
            isLast={index === data.length - 1}
            hovered={hoveredRow}
            setHovered={setHoveredRow}
          />
        ))}
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Tidak ada destinasi yang cocok dengan filter.
        </div>
      )}
    </section>
  )
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

type FilterBarProps = {
  filters: {
    categories: string[]
    types: string[]
    provinces: string[]
  }
  onFiltersChange: (
    key: 'categories' | 'types' | 'provinces',
    values: string[] | null,
  ) => void
  categoryOptions: FilterOption[]
  typeOptions: FilterOption[]
  provinsiOptions: FilterOption[]
  hasActiveFilters: boolean
  onResetFilters: () => void
}

function FilterBar({
  filters,
  onFiltersChange,
  categoryOptions,
  typeOptions,
  provinsiOptions,
  hasActiveFilters,
  onResetFilters,
}: FilterBarProps) {
  return (
    <div className="w-full flex items-center justify-center">
      <FilterToolbar
        layoutClassName={cn('w-full flex items-center justify-center')}
        showReset={hasActiveFilters}
        onReset={onResetFilters}
      >
        <FacetedFilter
          
          title="Kategori"
          options={categoryOptions}
          value={filters.categories}
          onChange={(values) =>
            onFiltersChange('categories', values.length > 0 ? values : null)
          }
          multiple
          popoverWidth="w-[14rem]"
        />

        <FacetedFilter
          title="Tipe"
          options={typeOptions}
          value={filters.types}
          onChange={(values) =>
            onFiltersChange('types', values.length > 0 ? values : null)
          }
          multiple
          popoverWidth="w-[14rem]"
        />

        <FacetedFilter
          title="Provinsi"
          options={provinsiOptions}
          value={filters.provinces}
          onChange={(values) =>
            onFiltersChange('provinces', values.length > 0 ? values : null)
          }
          multiple
          popoverWidth="w-[14rem]"
        />
      </FilterToolbar>
    </div>
  )
}

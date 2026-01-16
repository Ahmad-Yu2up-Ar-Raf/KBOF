// =============================================================================
// DESTINASI GRID SECTION - Destination Cards Grid
// =============================================================================

'use client'

import type { Dispatch, SetStateAction } from 'react'
import DestinasiCard from '@/components/ui/fragments/custom-ui/card/destinasi-card'
import type { DestinasiDestination } from '@/lib/server/explore/destinasi-server-queries'

// ============================================
// TYPES
// ============================================

interface DestinasiGridSectionProps {
  destinations: DestinasiDestination[]
  hovered: number | null
  setHovered: Dispatch<SetStateAction<number | null>>
  search: string
  hasFilters: boolean
}

// ============================================
// COMPONENT
// ============================================

export function DestinasiGridSection({
  destinations,
  hovered,
  setHovered,
  search,
  hasFilters,
}: DestinasiGridSectionProps) {
  if (destinations.length === 0) {
    return <DestinasiEmptyState search={search} hasFilters={hasFilters} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full auto-rows-fr">
      {destinations.map((destination, i) => (
        <DestinasiCard
          key={destination.id}
          index={i}
          hovered={hovered}
          setHovered={setHovered}
          destination={destination}
          totalItems={destinations.length}
        />
      ))}
    </div>
  )
}

// ============================================
// EMPTY STATE
// ============================================

interface DestinasiEmptyStateProps {
  search: string
  hasFilters: boolean
}

function DestinasiEmptyState({ search, hasFilters }: DestinasiEmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center min-h-100 animate-fadeIn">
      <div className="text-6xl mb-4">🔍</div>
      <p className="text-gray-500 text-lg text-center mb-2">
        {search
          ? `Tidak ada destinasi yang cocok dengan "${search}"`
          : hasFilters
            ? `Tidak ada destinasi di kategori yang dipilih`
            : 'Belum ada destinasi tersedia'}
      </p>
      <p className="text-gray-400 text-sm">
        {search
          ? 'Coba kata kunci lain'
          : 'Coba pilih kategori lain atau reset filter'}
      </p>
    </div>
  )
}

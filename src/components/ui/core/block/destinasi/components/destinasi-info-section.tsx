// =============================================================================
// DESTINASI INFO SECTION - Result Count Display
// =============================================================================

import {
  categoryLabels,
  typeLabels,
  provinsiLabels,
} from '@/lib/utils/destination-labels'

// ============================================
// TYPES
// ============================================

interface DestinasiInfoSectionProps {
  currentCount: number
  totalCount: number
  search: string
  categories: string[]
  types: string[]
  provinces: string[]
}

// ============================================
// COMPONENT
// ============================================

export function DestinasiInfoSection({
  currentCount,
  totalCount,
  search,
  categories,
  types,
  provinces,
}: DestinasiInfoSectionProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-3">
      <p className="text-sm text-muted-foreground">
        Menampilkan{' '}
        <span className="font-semibold text-foreground">{currentCount}</span>{' '}
        dari <span className="font-semibold text-foreground">{totalCount}</span>{' '}
        destinasi
        {search && (
          <span className="ml-1">
            untuk "
            <span className="font-semibold text-foreground">{search}</span>"
          </span>
        )}
        {categories.length > 0 && (
          <span className="ml-1">
            di{' '}
            <span className="font-semibold text-foreground">
              {categories.map((c) => categoryLabels[c] ?? c).join(', ')}
            </span>
          </span>
        )}
        {types.length > 0 && (
          <span className="ml-1">
            • Tipe:{' '}
            <span className="font-semibold text-foreground">
              {types.map((t) => typeLabels[t] ?? t).join(', ')}
            </span>
          </span>
        )}
        {provinces.length > 0 && (
          <span className="ml-1">
            • Provinsi:{' '}
            <span className="font-semibold text-foreground">
              {provinces.map((p) => provinsiLabels[p] ?? p).join(', ')}
            </span>
          </span>
        )}
      </p>
    </div>
  )
}

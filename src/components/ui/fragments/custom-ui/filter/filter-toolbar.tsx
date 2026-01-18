'use client'

import * as React from 'react'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'

// ============================================
// TYPES
// ============================================

export interface FilterToolbarProps extends React.ComponentProps<'div'> {
  /** Show reset button when there are active filters */
  showReset?: boolean
  /** Callback when reset button is clicked */
  onReset?: () => void
  /** Custom reset button label */
  resetLabel?: string
  layoutClassName?: string
}

// ============================================
// FILTER TOOLBAR COMPONENT
// ============================================

/**
 * FilterToolbar - Responsive container for filter components
 *
 * Layout:
 * - Mobile: 2-column grid
 * - Tablet+: Flex wrap
 *
 * Usage:
 * ```tsx
 * <FilterToolbar showReset={hasFilters} onReset={handleReset}>
 *   <FacetedFilter ... />
 *   <FacetedFilter ... />
 * </FilterToolbar>
 * ```
 */
export function FilterToolbar({
  children,
  className,
  showReset = false,
  onReset,
  layoutClassName,
  resetLabel = 'Reset',
  ...props
}: FilterToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      aria-label="Filter toolbar"
      className={cn(
        // Base layout - responsive grid/flex
        'flex flex-col gap-3',
        className,
      )}
      {...props}
    >
      {/* Filter items container */}
      <div
        className={cn(
          'grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center',

          layoutClassName,
        )}
      >
        {children}

        {/* Reset button - shown when there are active filters */}
        {showReset && onReset && (
          <Button
            aria-label="Reset semua filter"
            variant="outline"
            size="sm"
            className="border-dashed text-destructive hover:text-destructive col-span-2 sm:col-span-1"
            onClick={onReset}
          >
            <X className="size-4" />
            {resetLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

export default FilterToolbar

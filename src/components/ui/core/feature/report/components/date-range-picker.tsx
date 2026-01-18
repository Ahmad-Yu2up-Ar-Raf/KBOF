'use client'

// React Imports

// Third-party Imports
import { format } from 'date-fns'
import { CalendarIcon, XCircle } from 'lucide-react'
import type { HTMLAttributes } from 'react'

// Component Imports
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { Calendar } from '@/components/ui/fragments/shadcn-ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/fragments/shadcn-ui/popover'

// Custom Hook
import { useDashboardFilters } from '@/hooks/use-dashboard-filters'

export function CalendarDateRangePicker({
  className,
}: HTMLAttributes<HTMLDivElement>) {
  const { dateRange, setDateRange, hasActiveFilters } = useDashboardFilters()

  // Handler untuk clear filter
  const handleClearFilter = async (event: React.MouseEvent) => {
    event.stopPropagation()
    await setDateRange(undefined)
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[260px] justify-start text-left font-normal border-dashed',
              !dateRange && 'text-muted-foreground',
            )}
          >
            {hasActiveFilters ? (
              <div
                role="button"
                aria-label="Clear date filter"
                tabIndex={0}
                onClick={handleClearFilter}
                className="rounded-xl opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mr-2"
              >
                <XCircle className="h-4 w-4" />
              </div>
            ) : (
              <CalendarIcon className="mr-2 h-4 w-4" />
            )}

            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} -{' '}
                  {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

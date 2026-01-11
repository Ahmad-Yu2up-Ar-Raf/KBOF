'use client'

import * as React from 'react'

import { DataTable } from '@/components/ui/fragments/shadcn-ui/data-table/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTableAdvancedToolbar } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-advanced-toolbar'
import { DataTableFilterList } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-filter-list'
import { DataTableSortList } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-sort-list'
import { DataTableToolbar } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-toolbar'
import type { DonationAggregateResult, DonationWithDetails } from '@/types'

import { useFeatureFlags } from '../feature-flag-provider'
import { getDonationTableColumns } from './donation-table-columns'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableFilterMenu } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-filter-menu'
import { formatCurrency } from '@/lib/format'
import { Card, CardContent } from '@/components/ui/fragments/shadcn-ui/card'
import { Banknote, TrendingUp } from 'lucide-react'

// ============================================
// TYPE DEFINITIONS
// ============================================

interface DonationTableProps {
  /** Resolved data from query */
  data: DonationAggregateResult
}

// ============================================
// MAIN COMPONENT
// ============================================

export function DonationTable({ data: donationData }: DonationTableProps) {
  const { enableAdvancedFilter, filterFlag } = useFeatureFlags()

  // Extract data from resolved result
  const { data, pageCount, statusCounts, totalAmount } = donationData

  const columns = React.useMemo(
    () =>
      getDonationTableColumns({
        statusCounts,
      }) as ColumnDef<DonationWithDetails>[],
    [statusCounts],
  )

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data,
    columns,
    pageCount,
    enableAdvancedFilter,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
    },
    getRowId: (originalRow) => String(originalRow.id),
    shallow: false,
    clearOnDefault: true,
  })

  return (
    <>
      {/* Stats Cards */}

      {/* Data Table */}
      <DataTable table={table}>
        {enableAdvancedFilter ? (
          <DataTableAdvancedToolbar table={table}>
            <DataTableSortList table={table} align="start" />
            {filterFlag === 'advancedFilters' ? (
              <DataTableFilterList
                table={table}
                shallow={shallow}
                debounceMs={debounceMs}
                throttleMs={throttleMs}
                align="start"
              />
            ) : (
              <DataTableFilterMenu
                table={table}
                shallow={shallow}
                debounceMs={debounceMs}
                throttleMs={throttleMs}
              />
            )}
          </DataTableAdvancedToolbar>
        ) : (
          <DataTableToolbar table={table}>
            <DataTableSortList table={table} align="end" />
          </DataTableToolbar>
        )}
      </DataTable>
    </>
  )
}

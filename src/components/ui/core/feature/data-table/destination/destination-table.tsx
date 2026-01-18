'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { useFeatureFlags } from '../feature-flag-provider'
import { DeleteDestinationDialog } from './delete-destination-dialog'
import { DestinationTableActionBar } from './destination-table-action-bar'
import { getDestinationTableColumns } from './destination-table-columns'
import UpdateDestinationSheet from './update-destination-sheet'
import type { DataTableRowAction } from '@/types/data-table'

import type { DestinationAggregateResult, DestinationStatus } from '@/types'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/fragments/shadcn-ui/data-table/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTableAdvancedToolbar } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-advanced-toolbar'
import { DataTableFilterList } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-filter-list'
import { DataTableSortList } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-sort-list'
import { DataTableToolbar } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-toolbar'

import { exportTableToCSV } from '@/lib/export'
import {
  useBulkUpdateDestinationStatusMutation,
  useBulkUpdateDestinationTypeMutation,
  useDeleteDestinationMutation,
} from '@/hooks/use-destination-mutations'
import { DataTableFilterMenu } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-filter-menu'

// ============================================
// TYPE DEFINITIONS
// ============================================

type DestinationRow = DestinationAggregateResult['data'][number]

interface DestinationTableProps {
  /** Resolved data from query */
  data: DestinationAggregateResult
  createSheet?: React.ReactNode
}

// ============================================
// MAIN COMPONENT
// ============================================

export function DestinationTable({
  data: destinationData,
  createSheet,
}: DestinationTableProps) {
  // const { enableAdvancedFilter, filterFlag } = useFeatureFlags()

  // Extract data from resolved result
  const { data, pageCount, statusCounts, typeCounts, categoryCounts } =
    destinationData

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<DestinationRow> | null>(null)

  const columns = React.useMemo(
    () =>
      getDestinationTableColumns({
        statusCounts,
        categoriesCounts: categoryCounts,
        setRowAction,
        typeCounts,
      }),
    [statusCounts, typeCounts, categoryCounts],
  )

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data,
    columns,
    pageCount,
    // enableAdvancedFilter,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow) => String(originalRow.id),
    shallow: false,
    clearOnDefault: true,
  })

  // Use mutation hooks for proper cache invalidation
  const bulkUpdateMutation = useBulkUpdateDestinationStatusMutation()
  const deleteMutation = useDeleteDestinationMutation()
  const bulkUpdateTypeMutation = useBulkUpdateDestinationTypeMutation()

  const rows = table.getFilteredSelectedRowModel().rows
  const selectedIds = React.useMemo(
    () => rows.map((row) => row.original.id),
    [rows],
  )

  // Action handlers using mutations
  const onStatusUpdate = React.useCallback(
    (value: DestinationStatus) => {
      toast.promise(
        bulkUpdateMutation.mutateAsync({ id: selectedIds, status: value }),
        {
          loading: 'Memperbarui status...',
          success: 'Status berhasil diperbarui',
          error: (err) =>
            err && err.message && err.message.includes('izin')
              ? 'Anda tidak memiliki izin untuk tindakan ini.'
              : 'Gagal memperbarui status',
        },
      )
    },
    [selectedIds, bulkUpdateMutation],
  )

  const onExport = React.useCallback(() => {
    exportTableToCSV(table, {
      excludeColumns: ['select', 'actions'],
      onlySelected: true,
    })
  }, [table])

  const onDelete = React.useCallback(() => {
    toast.promise(
      deleteMutation.mutateAsync(selectedIds).then(() => {
        table.toggleAllRowsSelected(false)
      }),
      {
        loading: 'Menghapus item...',
        success: 'Item berhasil dihapus',
        error: (err) =>
          err && err.message && err.message.includes('izin')
            ? 'Anda tidak memiliki izin untuk tindakan ini.'
            : 'Gagal menghapus item',
      },
    )
  }, [selectedIds, deleteMutation, table])

  const onTypeUpdate = React.useCallback(
    (value: string) => {
      toast.promise(
        bulkUpdateTypeMutation.mutateAsync({ ids: selectedIds, type: value }),
        {
          loading: 'Memperbarui tipe...',
          success: 'Tipe berhasil diperbarui',
          error: (err) => err.message || 'Gagal memperbarui tipe',
        },
      )
    },
    [selectedIds, bulkUpdateTypeMutation],
  )

  // Determine if any action is pending
  const getIsActionPending = React.useCallback(
    (action: 'update-status' | 'export' | 'delete') => {
      if (action === 'delete') return deleteMutation.isPending
      if (action === 'update-status') return bulkUpdateMutation.isPending
      return false
    },
    [deleteMutation.isPending, bulkUpdateMutation.isPending],
  )

  return (
    <>
      <DataTable
        table={table}
        actionBar={
          <DestinationTableActionBar
            onDelete={onDelete}
            onStatusUpdate={onStatusUpdate}
            onExport={onExport}
            onTypeUpdate={onTypeUpdate}
            table={table}
            getIsActionPending={getIsActionPending}
          />
        }
      >
        {/* {enableAdvancedFilter ? (
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
        )} */}
        <DataTableToolbar table={table}>
          {createSheet}
          {/* <DataTableSortList table={table} align="end" /> */}
        </DataTableToolbar>
      </DataTable>
      {rowAction?.row.original && (
        <UpdateDestinationSheet
          open={rowAction?.variant === 'update'}
          onOpenChange={() => setRowAction(null)}
          destination={rowAction.row.original}
        />
      )}

      <DeleteDestinationDialog
        open={rowAction?.variant === 'delete'}
        onOpenChange={() => setRowAction(null)}
        destinations={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  )
}

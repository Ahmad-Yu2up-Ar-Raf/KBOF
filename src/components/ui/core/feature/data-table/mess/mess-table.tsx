'use client'

import type { Mess } from '@/db/schema'
import type { DataTableRowAction, QueryKeys } from '@/types/data-table'
import * as React from 'react'

import { DataTable } from '@/components/ui/fragments/shadcn-ui/data-table/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTableAdvancedToolbar } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-advanced-toolbar'
import { DataTableFilterList } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-filter-list'
import { DataTableFilterMenu } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-filter-menu'
import { DataTableSortList } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-sort-list'
import { DataTableToolbar } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-toolbar'
import type { MessAggregateResult } from '@/types'

import { DeleteMessDialog } from './delete-mess-dialog'
import { useFeatureFlags } from '../feature-flag-provider'
import { TasksTableActionBar } from './mess-table-action-bar'
import { getTasksTableColumns } from './mess-table-columns'
import UpdateMessSheet from './update-mess-sheet'
import { toast } from 'sonner'
import { exportTableToCSV } from '@/lib/export'
import { typeMessColum } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import {
  useBulkUpdateMessMutation,
  useDeleteMessMutation,
} from '@/hooks/use-mess-mutations'

// ============================================
// TYPE DEFINITIONS
// ============================================

interface TasksTableProps {
  /** Resolved data from query - no longer a Promise */
  data: MessAggregateResult
  queryKeys?: Partial<QueryKeys>
}

// ============================================
// MAIN COMPONENT
// ============================================

export function TasksTable({ data: messData }: TasksTableProps) {
  const { enableAdvancedFilter, filterFlag } = useFeatureFlags()

  // Extract data from resolved result
  const { data, pageCount, statusCounts, typeCounts, capacityCounts } = messData

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<typeMessColum> | null>(null)

  const typedData = data as typeMessColum[]

  const columns = React.useMemo(
    () =>
      getTasksTableColumns({
        statusCounts,
        typeCounts,
        capacityCounts,
        setRowAction: setRowAction as React.Dispatch<
          React.SetStateAction<DataTableRowAction<Mess> | null>
        >,
      }) as ColumnDef<typeMessColum>[],
    [statusCounts, typeCounts, capacityCounts],
  )

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data: typedData,
    columns,
    pageCount,
    enableAdvancedFilter,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow) => originalRow.id.toString(),
    shallow: false,
    clearOnDefault: true,
  })

  // ⭐ Use mutation hooks for proper cache invalidation
  const bulkUpdateMutation = useBulkUpdateMessMutation()
  const deleteMutation = useDeleteMessMutation()

  const rows = table.getFilteredSelectedRowModel().rows
  const Ids = React.useMemo(() => rows.map((row) => row.original.id), [rows])

  // ⭐ Simplified action handlers using mutations
  const onTaskUpdate = React.useCallback(
    ({
      field,
      value,
    }: {
      field: 'status' | 'type' | 'statusCapacity'
      value: string
    }) => {
      const actionLabel = field === 'status' ? 'status' : 'type'

      toast.promise(
        bulkUpdateMutation.mutateAsync({
          ids: Ids,
          [field]: value as Mess[typeof field],
        }),
        {
          loading: `Updating ${actionLabel}...`,
          success: `${actionLabel.charAt(0).toUpperCase() + actionLabel.slice(1)} updated successfully`,
          error: (err) => err.message || `Failed to update ${actionLabel}`,
        },
      )
    },
    [Ids, bulkUpdateMutation],
  )

  const onTaskExport = React.useCallback(() => {
    exportTableToCSV(table, {
      excludeColumns: ['select', 'actions'],
      onlySelected: true,
    })
  }, [table])

  const onTaskDelete = React.useCallback(() => {
    toast.promise(
      deleteMutation.mutateAsync(Ids).then(() => {
        table.toggleAllRowsSelected(false)
      }),
      {
        loading: 'Deleting items...',
        success: 'Items deleted successfully',
        error: (err) => err.message || 'Failed to delete items',
      },
    )
  }, [Ids, deleteMutation, table])

  // Determine if any action is pending
  const getIsActionPending = React.useCallback(
    (action: 'update-status' | 'update-type' | 'export' | 'delete') => {
      if (action === 'delete') return deleteMutation.isPending
      if (action === 'update-status' || action === 'update-type')
        return bulkUpdateMutation.isPending
      return false
    },
    [deleteMutation.isPending, bulkUpdateMutation.isPending],
  )

  return (
    <>
      <DataTable
        table={table}
        actionBar={
          <TasksTableActionBar
            onTaskDelete={onTaskDelete}
            onTaskUpdate={onTaskUpdate}
            onTaskExport={onTaskExport}
            table={table}
            getIsActionPending={getIsActionPending}
          />
        }
      >
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
      <React.Activity mode={rowAction ? 'visible' : 'hidden'}>
        <UpdateMessSheet
          open={rowAction?.variant === 'update'}
          onOpenChange={() => setRowAction(null)}
          mess={rowAction?.row.original!}
        />
      </React.Activity>

      <DeleteMessDialog
        open={rowAction?.variant === 'delete'}
        onOpenChange={() => setRowAction(null)}
        mess={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  )
}

'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { useFeatureFlags } from '../feature-flag-provider'
import { DeleteArticleDialog } from './delete-article-dialog'
import { ArticleTableActionBar } from './article-table-action-bar'
import { getArticleTableColumns } from './article-table-columns'
import UpdateArticleSheet from './update-article-sheet'
import type { DataTableRowAction } from '@/types/data-table'

import type { ArticleAggregateResult, DestinationStatus } from '@/types'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/fragments/shadcn-ui/data-table/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTableAdvancedToolbar } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-advanced-toolbar'
import { DataTableFilterList } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-filter-list'
import { DataTableSortList } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-sort-list'
import { DataTableToolbar } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-toolbar'

import { exportTableToCSV } from '@/lib/export'
import {
  useBulkDeleteArticlesMutation,
  useBulkUpdateArticleStatusMutation,
} from '@/hooks/use-article-mutations'
import { DataTableFilterMenu } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-filter-menu'

// ============================================
// TYPE DEFINITIONS
// ============================================

type ArticleRow = ArticleAggregateResult['data'][number]

interface ArticleTableProps {
  /** Resolved data from query */
  data: ArticleAggregateResult
  createSheet?: React.ReactNode
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ArticleTable({
  data: articleData,
  createSheet,
}: ArticleTableProps) {
  // const { enableAdvancedFilter, filterFlag } = useFeatureFlags()

  // Extract data from resolved result
  const { data, pageCount, statusCounts } = articleData

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<ArticleRow> | null>(null)

  const columns = React.useMemo(
    () =>
      getArticleTableColumns({
        statusCounts,
        setRowAction,
      }),
    [statusCounts],
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
  const bulkUpdateMutation = useBulkUpdateArticleStatusMutation()
  const bulkDeleteMutation = useBulkDeleteArticlesMutation()

  const rows = table.getFilteredSelectedRowModel().rows
  const selectedIds = React.useMemo(
    () => rows.map((row) => row.original.id),
    [rows],
  )

  // Action handlers using mutations
  const onStatusUpdate = React.useCallback(
    (value: DestinationStatus) => {
      toast.promise(
        bulkUpdateMutation.mutateAsync({
          data: { ids: selectedIds, status: value },
        }),
        {
          loading: 'Updating status...',
          success: 'Status updated successfully',
          error: (err) => err.message || 'Failed to update status',
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
      bulkDeleteMutation
        .mutateAsync({ data: { ids: selectedIds } })
        .then(() => {
          table.toggleAllRowsSelected(false)
        }),
      {
        loading: 'Deleting items...',
        success: 'Items deleted successfully',
        error: (err) => err.message || 'Failed to delete items',
      },
    )
  }, [selectedIds, bulkDeleteMutation, table])

  // Determine if any action is pending
  const getIsActionPending = React.useCallback(
    (action: 'update-status' | 'export' | 'delete') => {
      if (action === 'delete') return bulkDeleteMutation.isPending
      if (action === 'update-status') return bulkUpdateMutation.isPending
      return false
    },
    [bulkDeleteMutation.isPending, bulkUpdateMutation.isPending],
  )

  return (
    <>
      <DataTable
        table={table}
        actionBar={
          <ArticleTableActionBar
            onDelete={onDelete}
            onStatusUpdate={onStatusUpdate}
            onExport={onExport}
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
          <DataTableToolbar table={table}>
            {createSheet}
            <DataTableSortList table={table} align="end" />
          </DataTableToolbar>
        )} */}
        <DataTableToolbar table={table}>
          {createSheet}
          {/* <DataTableSortList table={table} align="end" /> */}
        </DataTableToolbar>
      </DataTable>
      {rowAction?.row.original && (
        <UpdateArticleSheet
          open={rowAction?.variant === 'update'}
          onOpenChange={() => setRowAction(null)}
          article={rowAction.row.original}
        />
      )}

      <DeleteArticleDialog
        open={rowAction?.variant === 'delete'}
        onOpenChange={() => setRowAction(null)}
        articles={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  )
}

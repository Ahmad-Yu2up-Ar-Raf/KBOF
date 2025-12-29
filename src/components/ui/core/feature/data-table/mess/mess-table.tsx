'use client'

import type { Mess } from '@/db/schema'
import type { DataTableRowAction, QueryKeys } from '@/types/data-table'
import * as React from 'react'

import { DataTable } from '@/components/ui/fragments/shadcn-ui/data-table/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
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
import {
  deleteMess,
  updateBulkMess,
} from '@/lib/server/mess/mess-server-actions'
import { exportTableToCSV } from '@/lib/export'
import { typeMessColum } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { useServerFn } from '@tanstack/react-start'
import { MESS_QUERY_KEYS } from '@/lib/utils/mess-utils'
import { useSession } from '@/lib/auth/auth-client'

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

  // ✅ Hooks at top level - not inside callbacks
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: session } = useSession()
  const deleteMessFn = useServerFn(deleteMess)
  const updateMessFn = useServerFn(updateBulkMess)

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

  const actions = ['update-status', 'update-type', 'export', 'delete'] as const

  type Action = (typeof actions)[number]

  const rows = table.getFilteredSelectedRowModel().rows

  const [isPending, startTransition] = React.useTransition()
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null)
  const [lastAction, setLastAction] = React.useState<Action | null>(null)

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction],
  )

  // Monitor isPending state changes for toast feedback
  React.useEffect(() => {
    if (isPending && currentAction) {
      const actionLabels = {
        'update-status': 'Updating status',
        'update-type': 'Updating type',
        export: 'Exporting data',
        delete: 'Deleting items',
      }

      toast.loading(actionLabels[currentAction] + '...', {
        id: currentAction,
      })
      setLastAction(currentAction)
    } else if (!isPending && lastAction) {
      const successLabels = {
        'update-status': 'Status updated successfully',
        'update-type': 'Type updated successfully',
        export: 'Data exported successfully',
        delete: 'Items deleted successfully',
      }

      toast.success(successLabels[lastAction], {
        id: lastAction,
      })
      setLastAction(null)
      setCurrentAction(null)
    }
  }, [isPending, currentAction, lastAction])

  const Ids = React.useMemo(() => rows.map((row) => row.original.id), [rows])

  const onTaskUpdate = React.useCallback(
    ({
      field,
      value,
    }: {
      field: 'status' | 'type' | 'statusCapacity'
      value: string
    }) => {
      const actionType: Action =
        field === 'status' ? 'update-status' : 'update-type'
      setCurrentAction(actionType)

      startTransition(async () => {
        try {
          const { error } = await updateMessFn({
            data: {
              ids: Ids,
              [field]: value as Mess[typeof field],
            },
          })

          if (error) {
            toast.error(error, { id: actionType })
            setCurrentAction(null)
            setLastAction(null)
            return
          }

          // Invalidate with userId for proper cache isolation
          if (session?.user?.id) {
            await queryClient.invalidateQueries({
              queryKey: MESS_QUERY_KEYS.all(session.user.id),
            })
          }

          // ⭐ IMPORTANT: Invalidate + navigate to force fresh loader data
          await router.invalidate()
        } catch (error) {
          toast.error(`Failed to update ${field}`, { id: actionType })
          setCurrentAction(null)
          setLastAction(null)
        }
      })
    },
    [Ids, updateMessFn, queryClient, router, session?.user?.id],
  )

  const onTaskExport = React.useCallback(() => {
    exportTableToCSV(table, {
      excludeColumns: ['select', 'actions'],
      onlySelected: true,
    })
  }, [table])

  const onTaskDelete = React.useCallback(() => {
    setCurrentAction('delete')

    startTransition(async () => {
      try {
        const { error } = await deleteMessFn({
          data: { ids: Ids },
        })

        if (error) {
          toast.error(error, { id: 'delete' })
          setCurrentAction(null)
          setLastAction(null)
          return
        }

        table.toggleAllRowsSelected(false)

        // Invalidate with userId for proper cache isolation
        if (session?.user?.id) {
          await queryClient.invalidateQueries({
            queryKey: MESS_QUERY_KEYS.all(session.user.id),
          })
        }

        // ⭐ IMPORTANT: Invalidate + navigate to force fresh loader data
        await router.invalidate()
      } catch (error) {
        toast.error(`${error} Failed to delete items`, { id: 'delete' })
        console.log(error)
        setCurrentAction(null)
        setLastAction(null)
      }
    })
  }, [Ids, deleteMessFn, queryClient, router, session?.user?.id, table])

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
      {rowAction?.row.original && (
        <UpdateMessSheet
          open={rowAction?.variant === 'update'}
          onOpenChange={() => setRowAction(null)}
          mess={rowAction.row.original}
        />
      )}

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

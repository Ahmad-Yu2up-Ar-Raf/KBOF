'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { useFeatureFlags } from '../feature-flag-provider'
import { getUserTableColumns } from './user-table-columns'
import { UserTableActionBar } from './user-table-action-bar'
import {
  BanUserDialog,
  DeleteUserDialog,
  UnbanUserDialog,
  UpdateRoleDialog,
  ViewUserDialog,
} from './user-table-dialogs'
import type { DataTableRowAction } from '@/types/data-table'
import type { ColumnDef } from '@tanstack/react-table'

import type { UserAggregateResult } from '@/lib/server/user/user-server-queries'
import type { UserRoleType } from '@/db/schema'
import type { UserTableRow } from './user-table-columns'
import { authClient } from '@/lib/auth/auth-client'
import { DataTable } from '@/components/ui/fragments/shadcn-ui/data-table/data-table'
import { DataTableAdvancedToolbar } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-advanced-toolbar'
import { DataTableFilterList } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-filter-list'
import { DataTableSortList } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-sort-list'
import { DataTableToolbar } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-toolbar'
import { DataTableFilterMenu } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-filter-menu'

import { useDataTable } from '@/hooks/use-data-table'
import { exportTableToCSV } from '@/lib/export'

import {
  useBanUserMutation,
  useBulkBanUsersMutation,
  useBulkDeleteUsersMutation,
  useBulkUnbanUsersMutation,
  useBulkUpdateUserRoleMutation,
  useDeleteUserMutation,
  useUnbanUserMutation,
  useUpdateUserRoleMutation,
} from '@/hooks/use-user-mutations'

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface UserTableProps {
  /** Resolved data from query */
  data: UserAggregateResult
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function UserTable({ data: userData }: UserTableProps) {
  const { enableAdvancedFilter, filterFlag } = useFeatureFlags()
  const { data: session } = authClient.useSession()
  const currentUserId = session?.user?.id

  // Extract data from resolved result
  const { data, pageCount, roleCounts } = userData

  // Row action state for dialogs
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<UserTableRow> | null>(null)

  // Columns definition
  const columns = React.useMemo(
    () =>
      getUserTableColumns({
        roleCounts,
        setRowAction,
        currentUserId,
      }),
    [roleCounts, currentUserId],
  )

  // Use the useDataTable hook like destination-table
  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data,
    columns,
    pageCount,
    enableAdvancedFilter,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow) => String(originalRow.id),
    shallow: false,
    clearOnDefault: true,
  })

  // =========================================================================
  // MUTATION HOOKS
  // =========================================================================

  // Single row mutations
  const updateRoleMutation = useUpdateUserRoleMutation({
    onSuccess: () => {
      toast.success('Role berhasil diubah')
      setRowAction(null)
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal mengubah role')
    },
  })

  const banMutation = useBanUserMutation({
    onSuccess: () => {
      toast.success('User berhasil di-ban')
      setRowAction(null)
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal mem-ban user')
    },
  })

  const unbanMutation = useUnbanUserMutation({
    onSuccess: () => {
      toast.success('User berhasil di-unban')
      setRowAction(null)
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal meng-unban user')
    },
  })

  const deleteMutation = useDeleteUserMutation({
    onSuccess: () => {
      toast.success('User berhasil dihapus')
      setRowAction(null)
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal menghapus user')
    },
  })

  // Bulk mutations
  const bulkDeleteMutation = useBulkDeleteUsersMutation()
  const bulkUpdateRoleMutation = useBulkUpdateUserRoleMutation()
  const bulkBanMutation = useBulkBanUsersMutation()
  const bulkUnbanMutation = useBulkUnbanUsersMutation()

  // =========================================================================
  // SELECTED ROWS
  // =========================================================================

  const rows = table.getFilteredSelectedRowModel().rows
  const selectedIds = React.useMemo(
    () => rows.map((row) => row.original.id),
    [rows],
  )

  // =========================================================================
  // ACTION BAR HANDLERS (Bulk Operations)
  // =========================================================================

  const onBulkRoleUpdate = React.useCallback(
    (role: UserRoleType) => {
      toast.promise(
        bulkUpdateRoleMutation.mutateAsync({
          userIds: selectedIds,
          role,
        }),
        {
          loading: 'Updating roles...',
          success: () => {
            table.toggleAllRowsSelected(false)
            return 'Roles updated successfully'
          },
          error: (err) => err.message || 'Failed to update roles',
        },
      )
    },
    [selectedIds, bulkUpdateRoleMutation, table],
  )

  const onBulkBan = React.useCallback(() => {
    toast.promise(
      bulkBanMutation.mutateAsync({
        userIds: selectedIds,
      }),
      {
        loading: 'Banning users...',
        success: () => {
          table.toggleAllRowsSelected(false)
          return 'Users banned successfully'
        },
        error: (err) => err.message || 'Failed to ban users',
      },
    )
  }, [selectedIds, bulkBanMutation, table])

  const onBulkUnban = React.useCallback(() => {
    toast.promise(
      bulkUnbanMutation.mutateAsync({
        userIds: selectedIds,
      }),
      {
        loading: 'Unbanning users...',
        success: () => {
          table.toggleAllRowsSelected(false)
          return 'Users unbanned successfully'
        },
        error: (err) => err.message || 'Failed to unban users',
      },
    )
  }, [selectedIds, bulkUnbanMutation, table])

  const onExport = React.useCallback(() => {
    exportTableToCSV(table, {
      excludeColumns: ['select', 'actions'],
      onlySelected: true,
    })
  }, [table])

  const onBulkDelete = React.useCallback(() => {
    toast.promise(
      bulkDeleteMutation.mutateAsync({ userIds: selectedIds }).then(() => {
        table.toggleAllRowsSelected(false)
      }),
      {
        loading: 'Deleting users...',
        success: 'Users deleted successfully',
        error: (err) => err.message || 'Failed to delete users',
      },
    )
  }, [selectedIds, bulkDeleteMutation, table])

  // =========================================================================
  // DIALOG HANDLERS (Single Row Operations)
  // =========================================================================

  const handleUpdateRole = React.useCallback(async () => {
    if (!rowAction?.row?.original || rowAction.variant !== 'update') return
    updateRoleMutation.mutate({
      userId: rowAction.row.original.id,
      role: rowAction.row.original.role,
    })
  }, [rowAction, updateRoleMutation])

  const handleBanUser = React.useCallback(
    async (reason?: string) => {
      if (!rowAction?.row?.original || (rowAction.variant as string) !== 'ban')
        return
      banMutation.mutate({
        userId: rowAction.row.original.id,
        reason,
      })
    },
    [rowAction, banMutation],
  )

  const handleUnbanUser = React.useCallback(async () => {
    if (!rowAction?.row?.original || (rowAction.variant as string) !== 'unban')
      return
    unbanMutation.mutate({
      userId: rowAction.row.original.id,
    })
  }, [rowAction, unbanMutation])

  const handleDeleteUser = React.useCallback(async () => {
    if (!rowAction?.row?.original || rowAction.variant !== 'delete') return
    deleteMutation.mutate({
      userId: rowAction.row.original.id,
    })
  }, [rowAction, deleteMutation])

  // =========================================================================
  // PENDING STATE
  // =========================================================================

  const getIsActionPending = React.useCallback(
    (action: 'update-role' | 'ban' | 'unban' | 'export' | 'delete') => {
      if (action === 'delete') return bulkDeleteMutation.isPending
      if (action === 'update-role') return bulkUpdateRoleMutation.isPending
      if (action === 'ban') return bulkBanMutation.isPending
      if (action === 'unban') return bulkUnbanMutation.isPending
      return false
    },
    [
      bulkDeleteMutation.isPending,
      bulkUpdateRoleMutation.isPending,
      bulkBanMutation.isPending,
      bulkUnbanMutation.isPending,
    ],
  )

  const isDialogActionLoading =
    updateRoleMutation.isPending ||
    banMutation.isPending ||
    unbanMutation.isPending ||
    deleteMutation.isPending

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <>
      <DataTable
        table={table}
        actionBar={
          <UserTableActionBar
            table={table}
            onDelete={onBulkDelete}
            onRoleUpdate={onBulkRoleUpdate}
            onBan={onBulkBan}
            onUnban={onBulkUnban}
            onExport={onExport}
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

      {/* View Dialog */}
      <ViewUserDialog
        open={(rowAction?.variant as string) === 'view'}
        onOpenChange={(open) => !open && setRowAction(null)}
        user={rowAction?.row?.original ?? null}
      />

      {/* Update Role Dialog */}
      <UpdateRoleDialog
        open={rowAction?.variant === 'update'}
        onOpenChange={(open) => !open && setRowAction(null)}
        user={rowAction?.row?.original ?? null}
        newRole={rowAction?.row?.original?.role ?? null}
        onConfirm={handleUpdateRole}
        loading={isDialogActionLoading}
      />

      {/* Ban Dialog */}
      <BanUserDialog
        open={(rowAction?.variant as string) === 'ban'}
        onOpenChange={(open) => !open && setRowAction(null)}
        user={rowAction?.row?.original ?? null}
        onConfirm={handleBanUser}
        loading={isDialogActionLoading}
      />

      {/* Unban Dialog */}
      <UnbanUserDialog
        open={(rowAction?.variant as string) === 'unban'}
        onOpenChange={(open) => !open && setRowAction(null)}
        user={rowAction?.row?.original ?? null}
        onConfirm={handleUnbanUser}
        loading={isDialogActionLoading}
      />

      {/* Delete Dialog */}
      <DeleteUserDialog
        open={rowAction?.variant === 'delete'}
        onOpenChange={(open) => !open && setRowAction(null)}
        user={rowAction?.row?.original ?? null}
        onConfirm={handleDeleteUser}
        loading={isDialogActionLoading}
      />
    </>
  )
}

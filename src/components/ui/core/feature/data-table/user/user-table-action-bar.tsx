'use client'

import { SelectTrigger } from '@radix-ui/react-select'
import { Ban, Download, ShieldCheck, Trash2, UserCog } from 'lucide-react'
import type { Table } from '@tanstack/react-table'

import type { UserRoleType } from '@/db/schema'
import type { UserTableRow } from './user-table-columns'
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from '@/components/ui/fragments/shadcn-ui/data-table/data-table-action-bar'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/fragments/shadcn-ui/select'
import { Separator } from '@/components/ui/fragments/shadcn-ui/separator'

const actions = ['update-role', 'ban', 'unban', 'export', 'delete'] as const

type Action = (typeof actions)[number]

// Role enum values (excluding superAdmin for bulk operations)
const roleEnumValues: Array<UserRoleType> = ['pribumi', 'admin']

interface UserTableActionBarProps {
  table: Table<UserTableRow>
  getIsActionPending: (action: Action) => boolean
  onDelete: () => void
  onExport: () => void
  onBan: () => void
  onUnban: () => void
  onRoleUpdate: (role: UserRoleType) => void
}

export function UserTableActionBar({
  table,
  onDelete,
  onRoleUpdate,
  onExport,
  onBan,
  onUnban,
  getIsActionPending,
}: UserTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows
  const isPending =
    getIsActionPending('update-role') ||
    getIsActionPending('delete') ||
    getIsActionPending('ban') ||
    getIsActionPending('unban') ||
    getIsActionPending('export')

  // Check if any selected user is banned or active
  const hasBannedUsers = rows.some((row) => row.original.banned)
  const hasActiveUsers = rows.some((row) => !row.original.banned)

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5">
        {/* Update Role */}
        <Select onValueChange={(value) => onRoleUpdate(value as UserRoleType)}>
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update role"
              isPending={isPending}
            >
              <UserCog />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              {roleEnumValues.map((role) => (
                <SelectItem key={role} value={role} className="capitalize">
                  {role === 'pribumi' ? 'Pribumi' : 'Admin'}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Ban Users (only show if some users are active) */}
        {hasActiveUsers && (
          <DataTableActionBarAction
            size="icon"
            tooltip="Ban users"
            onClick={onBan}
            isPending={isPending}
          >
            <Ban />
          </DataTableActionBarAction>
        )}

        {/* Unban Users (only show if some users are banned) */}
        {hasBannedUsers && (
          <DataTableActionBarAction
            size="icon"
            tooltip="Unban users"
            onClick={onUnban}
            isPending={isPending}
          >
            <ShieldCheck />
          </DataTableActionBarAction>
        )}

        {/* Export */}
        <DataTableActionBarAction
          size="icon"
          tooltip="Export users"
          onClick={onExport}
          isPending={isPending}
        >
          <Download />
        </DataTableActionBarAction>

        {/* Delete */}
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete users"
          onClick={onDelete}
          isPending={isPending}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  )
}

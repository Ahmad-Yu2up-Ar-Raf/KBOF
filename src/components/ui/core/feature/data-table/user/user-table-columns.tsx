'use client'

import * as React from 'react'
import {
  Ban,
  CalendarIcon,
  CheckCircle2,
  Ellipsis,
  Eye,
  Shield,
  ShieldCheck,
  Text,
  Trash2,
  User,
  UserCog,
  XCircle,
} from 'lucide-react'
import type { DataTableRowAction } from '@/types/data-table'
import type { ColumnDef } from '@tanstack/react-table'

import type { UserRoleType } from '@/db/schema'
import type { UserAggregateResult } from '@/lib/server/user/user-server-queries'
import { DataTableColumnHeader } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-column-header'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { Checkbox } from '@/components/ui/fragments/shadcn-ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/fragments/shadcn-ui/dropdown-menu'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/fragments/shadcn-ui/avatar'
import { formatDate } from '@/lib/format'
import { useInitials } from '@/hooks/use-initials'

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type UserTableRow = UserAggregateResult['data'][number]

interface GetUserTableColumnsProps {
  roleCounts: Record<UserRoleType, number>
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<UserTableRow> | null>
  >
  currentUserId?: string
}

// =============================================================================
// ROLE ENUM VALUES
// =============================================================================

const roleEnumValues: Array<UserRoleType> = ['pribumi', 'admin', 'superAdmin']

// =============================================================================
// ROLE CONFIG
// =============================================================================

const roleConfig: Record<
  UserRoleType,
  {
    label: string
    icon: React.FC<React.SVGProps<SVGSVGElement>>
    variant: 'default' | 'secondary' | 'destructive'
  }
> = {
  pribumi: {
    label: 'Pribumi',
    icon: User,
    variant: 'secondary',
  },
  admin: {
    label: 'Admin',
    icon: Shield,
    variant: 'default',
  },
  superAdmin: {
    label: 'Super Admin',
    icon: ShieldCheck,
    variant: 'destructive',
  },
}

// =============================================================================
// COLUMNS DEFINITION
// =============================================================================

export function getUserTableColumns({
  roleCounts,
  setRowAction,
  currentUserId,
}: GetUserTableColumnsProps): Array<ColumnDef<UserTableRow>> {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5 mx-3 mr-4"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5 mx-3 mr-4"
          disabled={row.original.id === currentUserId}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Pengguna" />
      ),
      cell: function Cell({ row }) {
        const getInitials = useInitials()
        return (
          <div className="flex items-center gap-3 max-w-62.5">
            <Avatar className="h-9 w-9">
              <AvatarImage src={row.original.image ?? undefined} />
              <AvatarFallback className="text-xs">
                {getInitials(row.original.name ?? row.original.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="font-medium truncate">{row.original.name}</span>
              <span className="text-xs text-muted-foreground truncate">
                {row.original.email}
              </span>
            </div>
          </div>
        )
      },
      meta: {
        label: 'Pengguna',
        placeholder: 'Cari nama atau email...',
        variant: 'text',
        icon: Text,
      },
      size: 250,
      // enableColumnFilter: true,
      enableHiding: false,
    },
    {
      id: 'username',
      accessorKey: 'username',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Username" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.username ? `@${row.original.username}` : '-'}
        </span>
      ),
      meta: {
        label: 'Username',
        placeholder: 'Cari username...',
        variant: 'text',
        icon: Text,
      },
      size: 150,
      enableColumnFilter: true,
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Role" />
      ),
      cell: ({ row }) => {
        const role = row.original.role
        const config = roleConfig[role]
        const Icon = config.icon
        return (
          <Badge variant={config.variant} className="gap-1">
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        )
      },
      meta: {
        label: 'Role',
        variant: 'multiSelect',
        options: roleEnumValues.map((role) => ({
          label: roleConfig[role].label,
          value: role,
          count: roleCounts[role],
          icon: roleConfig[role].icon,
        })),
        icon: UserCog,
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
      enableColumnFilter: true,
      size: 130,
    },
    {
      id: 'banned',
      accessorKey: 'banned',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ row }) => {
        const banned = row.original.banned
        return (
          <Badge variant={banned ? 'destructive' : 'outline'} className="gap-1">
            {banned ? (
              <>
                <Ban className="h-3 w-3" />
                Banned
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3 w-3" />
                Active
              </>
            )}
          </Badge>
        )
      },
      meta: {
        label: 'Status',
        variant: 'multiSelect',
        options: [
          { label: 'Active', value: 'false', icon: CheckCircle2 },
          { label: 'Banned', value: 'true', icon: Ban },
        ],
        icon: Ban,
      },
      filterFn: (row, _id, value) => {
        const banned = row.original.banned
        const bannedStr = banned ? 'true' : 'false'
        return Array.isArray(value) && value.includes(bannedStr)
      },
      enableColumnFilter: true,
      size: 110,
    },
    {
      id: 'emailVerified',
      accessorKey: 'emailVerified',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Email" />
      ),
      cell: ({ row }) => {
        const verified = row.original.emailVerified
        return (
          <Badge variant={verified ? 'default' : 'secondary'} className="gap-1">
            {verified ? (
              <>
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />
                Unverified
              </>
            )}
          </Badge>
        )
      },
      meta: {
        label: 'Email Status',
        variant: 'multiSelect',
        options: [
          { label: 'Verified', value: 'true', icon: CheckCircle2 },
          { label: 'Unverified', value: 'false', icon: XCircle },
        ],
        icon: CheckCircle2,
      },
      filterFn: (row, _id, value) => {
        const verified = row.original.emailVerified
        const verifiedStr = verified ? 'true' : 'false'
        return Array.isArray(value) && value.includes(verifiedStr)
      },
      enableColumnFilter: true,
      size: 120,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Bergabung" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm whitespace-nowrap">
          {formatDate(row.original.createdAt)}
        </span>
      ),
      meta: {
        label: 'Tanggal Bergabung',
        variant: 'dateRange',
        icon: CalendarIcon,
      },
      enableColumnFilter: true,
      size: 130,
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const isCurrentUser = row.original.id === currentUserId
        const isSuperAdmin = row.original.role === 'superAdmin'

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: 'view' as never })}
              >
                <Eye className="mr-2 h-4 w-4" />
                Lihat Detail
              </DropdownMenuItem>

              {!isCurrentUser && !isSuperAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <UserCog className="mr-2 h-4 w-4" />
                      Ubah Role
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup value={row.original.role}>
                        {Object.entries(roleConfig).map(([role, config]) => {
                          const Icon = config.icon
                          return (
                            <DropdownMenuRadioItem
                              key={role}
                              value={role}
                              disabled={role === 'superAdmin'}
                              onSelect={() =>
                                setRowAction({
                                  row: {
                                    ...row,
                                    original: {
                                      ...row.original,
                                      role: role as UserRoleType,
                                    },
                                  } as never,
                                  variant: 'update',
                                })
                              }
                            >
                              <Icon className="h-4 w-4" />
                              <span className="ml-2">{config.label}</span>
                            </DropdownMenuRadioItem>
                          )
                        })}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuSeparator />

                  {row.original.banned ? (
                    <DropdownMenuItem
                      onSelect={() =>
                        setRowAction({ row, variant: 'unban' as never })
                      }
                    >
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Unban User
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onSelect={() =>
                        setRowAction({ row, variant: 'ban' as never })
                      }
                      className="text-orange-600 focus:text-orange-600"
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      Ban User
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => setRowAction({ row, variant: 'delete' })}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus User
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      size: 40,
      enableHiding: false,
    },
  ]
}

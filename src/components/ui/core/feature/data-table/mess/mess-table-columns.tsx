'use client'

import { type Mess, mess } from '@/db/schema'
import type { DataTableRowAction } from '@/types/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import {
  CalendarIcon,
  CheckCircle2,
  DoorOpen,
  Ellipsis,
  Settings,
  Text,
  Users2Icon,
  VenusAndMars,
} from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'

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
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/fragments/shadcn-ui/dropdown-menu'
import { formatDate } from '@/lib/format'

import {
  getType,
  getStatusCapacity,
  getStatusIcon,
} from '@/lib/utils/mess-utils'

import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

import { typeMessColum } from '@/types'

import { usePartialUpdateMessMutation } from '@/hooks/use-mess-mutations'

interface GetTasksTableColumnsProps {
  statusCounts: Record<Mess['status'], number>
  typeCounts: Record<Mess['type'], number>
  capacityCounts: Record<Mess['statusCapacity'], number>

  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Mess> | null>
  >
}

export function getTasksTableColumns({
  statusCounts,
  typeCounts,
  capacityCounts,

  setRowAction,
}: GetTasksTableColumnsProps): ColumnDef<typeMessColum>[] {
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
          className="translate-y-0.5  mx-3   mr-4"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5  mx-3   mr-4"
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
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => (
        <div className="35 ">
          <Link to="/dashboard/mess/$messId" params={{ messId: row.id }}>
            <span className=" underline-offset-4  hover:underline">
              {row.getValue('name')}
            </span>
          </Link>
        </div>
      ),
      meta: {
        label: 'Name',
        placeholder: 'Search name...',
        variant: 'text',
        icon: Text,
      },
      enableColumnFilter: true,
    },
    {
      id: 'capacityRoom',
      accessorKey: 'capacityRoom', // Ubah dari "Capacity_Room" ke "capacityRoom"
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Rooms Max" />
      ),
      cell: ({ row }) => (
        <div className="20 font-mono!">{row.getValue('capacityRoom')}</div>
      ),
      meta: {
        label: 'Rooms Max',
        variant: 'number',
        icon: Text,
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: 'capacityEmploye',
      accessorKey: 'capacityEmploye', // Ubah dari "Capacity_Room" ke "capacityRoom"
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Employe Max" />
      ),
      cell: ({ row }) => (
        <div
          className={cn(
            '25 ',
            !row.getValue('capacityEmploye')
              ? 'text-muted-foreground '
              : 'font-mono!',
          )}
        >
          {row.getValue('capacityEmploye')
            ? row.getValue('capacityEmploye')
            : 'N/A'}
        </div>
      ),
      meta: {
        label: 'Employe Max',
        variant: 'number',
        icon: Text,
      },
      enableSorting: false,
      enableHiding: true,
    },

    {
      id: 'roomCount',
      accessorKey: 'roomCount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Total Rooms" />
      ),
      cell: ({ row }) => {
        const roomCount = row.original.roomCount

        if (!roomCount) {
          return (
            <Badge variant="outline" className="py-1 [&>svg]:size-3.5">
              <DoorOpen />

              <span className="capitalize font-mono! underline-offset-4  ">
                0
              </span>
            </Badge>
          )
        }

        return (
          <Badge variant="outline" className="py-1 [&>svg]:size-3.5">
            <DoorOpen />

            <span className="capitalize font-mono! underline-offset-4  ">
              {roomCount > 30 || roomCount == 30 ? '30+' : roomCount}
            </span>
          </Badge>
        )
      },
      meta: {
        label: 'Total Rooms',
        variant: 'number',
        icon: DoorOpen,
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: 'employeeCount',
      accessorKey: 'employeeCount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Total Employe" />
      ),
      cell: ({ row }) => {
        const employeeCount = row.original.employeeCount

        if (!employeeCount) {
          return (
            <Badge variant="outline" className="py-1 [&>svg]:size-3.5 ">
              <Users2Icon />

              <span className="capitalize font-mono! underline-offset-4  hover:underline">
                0
              </span>
            </Badge>
          )
        }

        return (
          <Badge variant="outline" className="py-1 [&>svg]:size-3.5">
            <Users2Icon />

            <span className="capitalize font-mono! underline-offset-4  hover:underline">
              {employeeCount > 30 || employeeCount == 30
                ? '30+'
                : employeeCount}
            </span>
          </Badge>
        )
      },
      meta: {
        label: 'Total Employe',
        variant: 'number',
        icon: Users2Icon,
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ cell }) => {
        const status = mess.status.enumValues.find(
          (status) => status === (cell.getValue<Mess['status']>() ?? ''),
        )

        if (!status) return null

        const Icon = getStatusIcon(status)

        return (
          <Badge variant="outline" className="py-1 [&>svg]:size-3.5">
            <Icon />
            <span className="capitalize">{status}</span>
          </Badge>
        )
      },
      meta: {
        label: 'Status',
        variant: 'multiSelect',
        options: mess.status.enumValues.map((status) => ({
          label: status.charAt(0).toUpperCase() + status.slice(1),
          value: status,
          count: statusCounts[status],
          icon: getStatusIcon(status),
        })),
        icon: CheckCircle2,
      },
      enableColumnFilter: true,
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Type" />
      ),
      cell: ({ cell }) => {
        const priority = mess.type.enumValues.find(
          (priority) => priority === cell.getValue<Mess['type']>(),
        )

        if (!priority) return null

        const Icon = getType(priority)

        return (
          <Badge variant="outline" className="py-1 [&>svg]:size-3.5">
            <Icon />
            <span className="capitalize">{priority}</span>
          </Badge>
        )
      },
      meta: {
        label: 'Type',
        variant: 'multiSelect',
        options: mess.type.enumValues.map((priority) => ({
          label: priority.charAt(0).toUpperCase() + priority.slice(1),
          value: priority,
          count: typeCounts[priority],
          icon: getType(priority),
        })),
        icon: Settings,
      },
      enableColumnFilter: true,
    },
    {
      id: 'statusCapacity',
      accessorKey: 'statusCapacity',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Capacity Status " />
      ),
      cell: ({ cell }) => {
        const priority = mess.statusCapacity.enumValues.find(
          (priority) => priority === cell.getValue<Mess['statusCapacity']>(),
        )

        if (!priority) return null

        const Icon = getStatusCapacity(priority)

        return (
          <Badge variant="outline" className="py-1 [&>svg]:size-3.5">
            <Icon />
            <span className="capitalize">{priority}</span>
          </Badge>
        )
      },
      meta: {
        label: 'Capacity',
        variant: 'multiSelect',
        options: mess.statusCapacity.enumValues.map((priority) => ({
          label: priority.charAt(0).toUpperCase() + priority.slice(1),
          value: priority,
          count: capacityCounts[priority],
          icon: getStatusCapacity(priority),
        })),
        icon: VenusAndMars,
      },
      enableColumnFilter: true,
    },

    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
      meta: {
        label: 'Created At',
        variant: 'dateRange',
        icon: CalendarIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition()
        const updateMutation = usePartialUpdateMessMutation({
          onSuccess: () => {
            toast.success('Status updated', { id: 'update-mess-success' })
          },
          onError: (error) => {
            toast.error(error.message || 'Failed to update mess', {
              id: 'update-mess-success',
            })
          },
        })

        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: 'update' })}
              >
                Edit
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={`${row.original.status}`}
                    onValueChange={(value) => {
                      toast.loading('Updating...', {
                        id: 'update-mess-success',
                      })
                      startUpdateTransition(async () => {
                        await updateMutation.mutateAsync({
                          id: row.original.id,
                          status: value as Mess['status'],
                        })
                      })
                    }}
                  >
                    {mess.status.enumValues.map((label) => (
                      <DropdownMenuRadioItem
                        key={label}
                        value={label}
                        className="capitalize"
                        disabled={isUpdatePending}
                      >
                        {label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: 'delete' })}
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      size: 40,
    },
  ]
}

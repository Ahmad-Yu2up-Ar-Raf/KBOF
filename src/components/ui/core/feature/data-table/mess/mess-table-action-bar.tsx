'use client'

import { mess } from '@/db/schema'
import { SelectTrigger } from '@radix-ui/react-select'
import type { Table } from '@tanstack/react-table'
import { CheckCircle2, Download, Trash2, VenusAndMars } from 'lucide-react'

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
import { typeMessColum } from '@/types'

const actions = ['update-status', 'update-type', 'export', 'delete'] as const

type Action = (typeof actions)[number]

interface TasksTableActionBarProps {
  table: Table<typeMessColum>

  getIsActionPending: (action: Action) => boolean
  onTaskDelete: () => void
  onTaskExport: () => void
  onTaskUpdate: ({
    field,
    value,
  }: {
    field: 'status' | 'type' | 'statusCapacity'
    value: string
  }) => void
}

export function TasksTableActionBar({
  table,

  onTaskDelete,
  onTaskUpdate,
  onTaskExport,
  getIsActionPending,
}: TasksTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows
  const isPending =
    getIsActionPending('update-status') ||
    getIsActionPending('delete') ||
    getIsActionPending('update-type') ||
    getIsActionPending('export')
  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5">
        <Select
          onValueChange={(value: string) =>
            onTaskUpdate({ field: 'status', value })
          }
        >
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update status"
              isPending={isPending}
            >
              <CheckCircle2 />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              {mess.status.enumValues.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value: string) =>
            onTaskUpdate({ field: 'type', value })
          }
        >
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update Type"
              isPending={isPending}
            >
              <VenusAndMars />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              {mess.type.enumValues.map((priority) => (
                <SelectItem
                  key={priority}
                  value={priority}
                  className="capitalize"
                >
                  {priority}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <DataTableActionBarAction
          size="icon"
          tooltip="Export tasks"
          onClick={onTaskExport}
          isPending={isPending}
        >
          <Download />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete tasks"
          isPending={isPending}
          onClick={onTaskDelete}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  )
}

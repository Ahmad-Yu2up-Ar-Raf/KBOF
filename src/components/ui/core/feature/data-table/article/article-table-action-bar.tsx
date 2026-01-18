'use client'

import { SelectTrigger } from '@radix-ui/react-select'
import { CheckCircle2, Download, Trash2 } from 'lucide-react'
import type { Table } from '@tanstack/react-table'

import type { ArticleAggregateResult, DestinationStatus } from '@/types'
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

const actions = ['update-status', 'export', 'delete'] as const

type Action = (typeof actions)[number]

type ArticleRow = ArticleAggregateResult['data'][number]

// Status enum values
const statusEnumValues: Array<DestinationStatus> = [
  'published',
  'draft',
  'archived',
]

interface ArticleTableActionBarProps {
  table: Table<ArticleRow>
  getIsActionPending: (action: Action) => boolean
  onDelete: () => void
  onExport: () => void
  onStatusUpdate: (status: DestinationStatus) => void
}

export function ArticleTableActionBar({
  table,
  onDelete,
  onStatusUpdate,
  onExport,
  getIsActionPending,
}: ArticleTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows
  const isPending =
    getIsActionPending('update-status') ||
    getIsActionPending('delete') ||
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
          onValueChange={(value) => onStatusUpdate(value as DestinationStatus)}
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
              {statusEnumValues.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <DataTableActionBarAction
          size="icon"
          tooltip="Export articles"
          onClick={onExport}
          isPending={isPending}
        >
          <Download />
        </DataTableActionBarAction>

        <DataTableActionBarAction
          size="icon"
          tooltip="Delete articles"
          onClick={onDelete}
          isPending={isPending}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  )
}

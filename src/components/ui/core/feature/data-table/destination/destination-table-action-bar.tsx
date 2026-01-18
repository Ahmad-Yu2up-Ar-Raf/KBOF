'use client'

import { SelectTrigger } from '@radix-ui/react-select'
import { CheckCircle2, Download, Settings, Trash2 } from 'lucide-react'
import type { Table } from '@tanstack/react-table'
import type { DestinationAggregateResult, DestinationStatus } from '@/types'
import { useSession } from '@/lib/auth/auth-client'
import { TYPE_OPTIONS } from '@/lib/utils/destination-utils'

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

type DestinationRow = DestinationAggregateResult['data'][number]

// Status enum values
const statusEnumValues: Array<DestinationStatus> = [
  'published',
  'draft',
  'archived',
  'pending',
  'cancel',
]

interface DestinationTableActionBarProps {
  table: Table<DestinationRow>
  getIsActionPending: (action: Action) => boolean
  onDelete: () => void
  onExport: () => void
  onStatusUpdate: (status: DestinationStatus) => void
  onTypeUpdate?: (type: string) => void
}

export function DestinationTableActionBar({
  table,
  onDelete,
  onStatusUpdate,
  onTypeUpdate,
  onExport,
  getIsActionPending,
}: DestinationTableActionBarProps) {
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
        {/* Only superAdmin may update status in bulk */}
        {(() => {
          const session = useSession()
          const role = session?.data?.user.role
          if (role === 'superAdmin') {
            return (
              <Select
                onValueChange={(value) =>
                  onStatusUpdate(value as DestinationStatus)
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
                    {statusEnumValues.map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="capitalize"
                      >
                        {status}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )
          }
          return null
        })()}

        {/* Bulk update type - available to admin & superAdmin (ownership enforced server-side) */}
        <Select onValueChange={(value) => onTypeUpdate?.(value)}>
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update type"
              isPending={isPending}
            >
              <Settings />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              {TYPE_OPTIONS.map((t) => (
                <SelectItem
                  key={t.value}
                  value={t.value}
                  className="capitalize"
                >
                  {t.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <DataTableActionBarAction
          size="icon"
          tooltip="Export destinations"
          onClick={onExport}
          isPending={isPending}
        >
          <Download />
        </DataTableActionBarAction>

        <DataTableActionBarAction
          size="icon"
          tooltip="Delete destinations"
          onClick={onDelete}
          isPending={isPending}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  )
}

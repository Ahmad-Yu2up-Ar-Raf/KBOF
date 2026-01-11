'use client'

import type { DataTableRowAction } from '@/types/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import {
  CalendarIcon,
  CheckCircle2,
  Ellipsis,
  Eye,
  MapPin,
  Settings,
  Text,
  Vote,
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
  getTypeIcon,
  getTypeLabel,
  getStatusIcon,
  getCategoryIcon,
  getCategoryLabel,
  CATEGORY_OPTIONS,
} from '@/lib/utils/destination-utils'

import { Link } from '@tanstack/react-router'

import type {
  DestinationAggregateResult,
  DestinationCategory,
  DestinationStatus,
  DestinationType,
} from '@/types'
import { useBulkUpdateDestinationStatusMutation } from '@/hooks/use-destination-mutations'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/fragments/shadcn-ui/avatar'
import { useInitials } from '@/hooks/use-initials'
import { batasiKata } from '@/hooks/use-word'
import { destinationCategory } from '@/db/schema'
// Status enum values
const statusEnumValues: DestinationStatus[] = ['published', 'draft', 'archived']

// Type enum values
const typeEnumValues: DestinationType[] = [
  'wisata-alam',
  'wisata-budaya',
  'wisata-sejarah',
  'wisata-religi',
  'wisata-kuliner',
  'wisata-bahari',
  'adat-istiadat',
  'kesenian',
  'kerajinan',
  'festival',
]

type DestinationRow = DestinationAggregateResult['data'][number]

interface GetDestinationTableColumnsProps {
  statusCounts: Record<DestinationStatus, number>
  typeCounts: Record<DestinationType, number>
  categoriesCounts: Record<DestinationCategory, number>
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<DestinationRow> | null>
  >
}

export function getDestinationTableColumns({
  statusCounts,
  typeCounts,
  categoriesCounts,
  setRowAction,
}: GetDestinationTableColumnsProps): ColumnDef<DestinationRow>[] {
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
        <DataTableColumnHeader column={column} label="Nama Destinasi" />
      ),
      cell: ({ row }) => {
        const getInitial = useInitials()
        const batasiHurufNama = batasiKata(row.original.name, 2)
        return (
          <div className="max-w-50 truncate  flex items-center gap-3">
            <Avatar className=" rounded-xl  relative flex size-10 shrink-0 overflow-hidden">
              <AvatarImage
                src={`${row.original.coverImage}`}
                alt={row.original.name}
              />
              <AvatarFallback className="rounded-xl ">
                {getInitial(row.original.name)}
              </AvatarFallback>
            </Avatar>
            <span className=" font-medium offset-3 cursor-pointer hover:underline">
              {batasiHurufNama}
            </span>
            {/* <span className="underline-offset-4 hover:underline font-medium">
            {row.getValue('name')}
          </span> */}
          </div>
        )
      },

      meta: {
        label: 'Nama',
        placeholder: 'Cari nama...',
        variant: 'text',
        icon: Text,
      },
      enableColumnFilter: true,
    },
    {
      id: 'provinsi',
      accessorKey: 'provinsi',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Provinsi" />
      ),
      cell: ({ row }) => (
        <div className="flex columns-center gap-1.5">
          <MapPin className="size-3.5 text-muted-foreground" />
          <span className="truncate max-w-30">
            {row.getValue('provinsi') || '-'}
          </span>
        </div>
      ),
      meta: {
        label: 'Provinsi',
        placeholder: 'Cari provinsi...',
        variant: 'text',
        icon: MapPin,
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="type" />
      ),
      cell: ({ cell }) => {
        const type = cell.getValue<DestinationType>()
        if (!type) return null

        const Icon = getTypeIcon(type)

        return (
          <Badge variant="outline" className="py-1 [&>svg]:size-3.5">
            <Icon />
            <span className="capitalize">{getTypeLabel(type)}</span>
          </Badge>
        )
      },
      meta: {
        label: 'Type',
        variant: 'multiSelect',
        options: typeEnumValues.map((type) => ({
          label: getTypeLabel(type),
          value: type,
          count: typeCounts[type],
          icon: getTypeIcon(type),
        })),
        icon: Settings,
      },
      enableColumnFilter: true,
    },
    {
      id: 'kategori',
      accessorKey: 'kategori',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="kategori" />
      ),
      cell: ({ cell, row }) => {
        const kategori = row.original.category as DestinationCategory
        if (!kategori) return null

        const Icon = getCategoryIcon(kategori)

        return (
          <Badge variant="outline" className="py-1 [&>svg]:size-3.5">
            <Icon />
            <span className="capitalize">{getCategoryLabel(kategori)}</span>
          </Badge>
        )
      },
      meta: {
        label: 'Kategori',
        variant: 'multiSelect',
        options: destinationCategory.enumValues.map((type) => ({
          label: getCategoryLabel(type),
          value: type,
          count: categoriesCounts[type],
          icon: getCategoryIcon(type),
        })),
        icon: Settings,
      },
      enableColumnFilter: true,
    },

    {
      id: 'totalVote',
      accessorKey: 'totalVote',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Votes" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="py-1 [&>svg]:size-3.5">
          <Vote />
          <span className="font-mono">{row.getValue('totalVote') ?? 0}</span>
        </Badge>
      ),
      meta: {
        label: 'Total Votes',
        variant: 'number',
        icon: Vote,
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ cell }) => {
        const status = cell.getValue<DestinationStatus>()
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
        options: statusEnumValues.map((status) => ({
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
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Dibuat" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
      meta: {
        label: 'Dibuat',
        variant: 'dateRange',
        icon: CalendarIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition()
        const updateMutation = useBulkUpdateDestinationStatusMutation({
          onSuccess: () => {
            toast.success('Status updated', {
              id: 'update-destination-success',
            })
          },
          onError: (error) => {
            toast.error(error.message || 'Failed to update destination', {
              id: 'update-destination-success',
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
              <DropdownMenuItem asChild>
                <Link
                  to="/explore/$exploreId"
                  params={{ exploreId: row.original.slug }}
                >
                  Preview
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: 'update' })}
              >
                Edit
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.original.status}
                    onValueChange={(value) => {
                      toast.loading('Updating...', {
                        id: 'update-destination-success',
                      })
                      startUpdateTransition(async () => {
                        await updateMutation.mutateAsync({
                          id: row.original.id,
                          status: value as DestinationStatus,
                        })
                      })
                    }}
                  >
                    {statusEnumValues.map((label) => (
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

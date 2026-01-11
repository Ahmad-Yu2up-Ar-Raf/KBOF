'use client'

import type { ColumnDef } from '@tanstack/react-table'
import {
  CalendarIcon,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  User,
  MapPin,
  Banknote,
} from 'lucide-react'

import { DataTableColumnHeader } from '@/components/ui/fragments/shadcn-ui/data-table/data-table-column-header'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import { formatDate, formatCurrency } from '@/lib/format'

import type { DonationWithDetails } from '@/types'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/fragments/shadcn-ui/avatar'
import { useInitials } from '@/hooks/use-initials'
import { batasiKata } from '@/hooks/use-word'

type DonationStatus = 'pending' | 'completed' | 'failed' | 'refunded'

// Status enum values
const statusEnumValues: DonationStatus[] = [
  'pending',
  'completed',
  'failed',
  'refunded',
]

// Status helpers
function getStatusIcon(status: DonationStatus) {
  switch (status) {
    case 'completed':
      return CheckCircle2
    case 'pending':
      return Clock
    case 'failed':
      return XCircle
    case 'refunded':
      return RotateCcw
    default:
      return Clock
  }
}

function getStatusLabel(status: DonationStatus) {
  switch (status) {
    case 'completed':
      return 'Selesai'
    case 'pending':
      return 'Menunggu'
    case 'failed':
      return 'Gagal'
    case 'refunded':
      return 'Dikembalikan'
    default:
      return status
  }
}

function getStatusVariant(status: DonationStatus) {
  switch (status) {
    case 'completed':
      return 'default'
    case 'pending':
      return 'secondary'
    case 'failed':
      return 'destructive'
    case 'refunded':
      return 'outline'
    default:
      return 'secondary'
  }
}

interface GetDonationTableColumnsProps {
  statusCounts: Record<DonationStatus, number>
}

export function getDonationTableColumns({
  statusCounts,
}: GetDonationTableColumnsProps): ColumnDef<DonationWithDetails>[] {
  return [
    {
      id: 'donor',
      accessorFn: (row) => row.donor.name,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Donatur" />
      ),
      cell: ({ row }) => {
        const getInitial = useInitials()
        const donor = row.original.donor
        const isAnonymous = row.original.isAnonymous

        return (
          <div className="max-w-50 truncate flex items-center gap-3">
            <Avatar className="rounded-xl relative flex size-10 shrink-0 overflow-hidden">
              <AvatarImage
                src={isAnonymous ? undefined : donor.image || undefined}
                alt={isAnonymous ? 'Anonim' : donor.name}
              />
              <AvatarFallback className="rounded-xl">
                {isAnonymous ? '?' : getInitial(donor.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">
                {isAnonymous ? 'Anonim' : donor.name}
              </span>
              {!isAnonymous && (
                <span className="text-xs text-muted-foreground">
                  {donor.email}
                </span>
              )}
            </div>
          </div>
        )
      },
      meta: {
        label: 'Donatur',
        placeholder: 'Cari donatur...',
        variant: 'text',
        icon: User,
      },
      enableColumnFilter: true,
    },
    {
      id: 'destination',
      accessorFn: (row) => row.destination.name,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Destinasi" />
      ),
      cell: ({ row }) => {
        const getInitial = useInitials()
        const destination = row.original.destination
        const batasiNama = batasiKata(destination.name, 3)

        return (
          <div className="max-w-40 truncate flex items-center gap-3">
            <Avatar className="rounded-xl relative flex size-8 shrink-0 overflow-hidden">
              <AvatarImage
                src={destination.coverImage || undefined}
                alt={destination.name}
              />
              <AvatarFallback className="rounded-xl text-xs">
                {getInitial(destination.name)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{batasiNama}</span>
          </div>
        )
      },
      meta: {
        label: 'Destinasi',
        icon: MapPin,
      },
    },
    {
      id: 'amount',
      accessorKey: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Jumlah" />
      ),
      cell: ({ row }) => {
        const amount = row.getValue('amount') as number
        return (
          <div className="font-semibold text-primary">
            {formatCurrency(amount)}
          </div>
        )
      },
      meta: {
        label: 'Jumlah',
        icon: Banknote,
      },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as DonationStatus
        const Icon = getStatusIcon(status)
        return (
          <Badge variant={"outline"} className="gap-1">
            <Icon className="size-3" />
            {getStatusLabel(status)}
          </Badge>
        )
      },
      meta: {
        label: 'Status',
        variant: 'multiSelect',
        options: statusEnumValues.map((s) => ({
          label: getStatusLabel(s),
          value: s,
          count: statusCounts[s] ?? 0,
          icon: getStatusIcon(s),
        })),
      },
      filterFn: (row, id, value) =>
        (value as string[]).includes(row.getValue(id)),
      enableColumnFilter: true,
    },
    {
      id: 'message',
      accessorKey: 'message',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Pesan" />
      ),
      cell: ({ row }) => {
        const message = row.getValue('message') as string | null
        return (
          <span className="text-sm text-muted-foreground max-w-40 truncate block">
            {message || '-'}
          </span>
        )
      },
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Tanggal" />
      ),
      cell: ({ row }) => formatDate(row.getValue('createdAt')),
      meta: {
        label: 'Tanggal',
        variant: 'dateRange',
        icon: CalendarIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: 'paidAt',
      accessorKey: 'paidAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Dibayar" />
      ),
      cell: ({ row }) => {
        const paidAt = row.getValue('paidAt') as Date | null
        return paidAt ? formatDate(paidAt) : '-'
      },
    },
  ]
}

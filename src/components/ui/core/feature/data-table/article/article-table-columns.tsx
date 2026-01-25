'use client'

import {
  CalendarIcon,
  CheckCircle2,
  Ellipsis,
  FileText,
  Settings,
  UserRound,
} from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'
import type { DataTableRowAction } from '@/types/data-table'
import type { ColumnDef } from '@tanstack/react-table'

import type { ArticleAggregateResult, DestinationStatus } from '@/types'
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

import { useBulkUpdateArticleStatusMutation } from '@/hooks/use-article-mutations'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/fragments/shadcn-ui/avatar'
import { useInitials } from '@/hooks/use-initials'
import { batasiKata } from '@/hooks/use-word'
import { useModal } from '@/components/provider/context-provider'
import { Link } from '@tanstack/react-router'

// Status enum values
const statusEnumValues: Array<DestinationStatus> = [
  'published',
  'draft',
  'archived',
]

type ArticleRow = ArticleAggregateResult['data'][number]

// Status helpers
function getStatusIcon(status: DestinationStatus) {
  switch (status) {
    case 'published':
      return CheckCircle2
    case 'draft':
      return FileText
    case 'archived':
      return Settings
    default:
      return FileText
  }
}

function getStatusLabel(status: DestinationStatus) {
  switch (status) {
    case 'published':
      return 'Dipublikasikan'
    case 'draft':
      return 'Draf'
    case 'archived':
      return 'Diarsipkan'
    default:
      return status
  }
}

interface GetArticleTableColumnsProps {
  statusCounts: Record<DestinationStatus, number>
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<ArticleRow> | null>
  >
}

export function getArticleTableColumns({
  statusCounts,
  setRowAction,
}: GetArticleTableColumnsProps): Array<ColumnDef<ArticleRow>> {
  const { openImage } = useModal()
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
      id: 'title',
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Judul Artikel" />
      ),
      cell: ({ row }) => {
        const getInitial = useInitials()
        const batasiHurufJudul = batasiKata(row.original.title, 5)
        return (
          <div className="max-w-60 truncate flex items-center gap-3">
            <Avatar
              onClick={() => openImage(`${row.original.coverImage}`)}
              className="rounded-xl cursor-zoom-in relative flex size-10 shrink-0 overflow-hidden"
            >
              <AvatarImage
                src={`${row.original.coverImage}`}
                alt={row.original.title}
              />
              <AvatarFallback className="rounded-xl">
                {getInitial(row.original.title)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium offset-3 cursor-pointer hover:underline">
              {batasiHurufJudul}
            </span>
          </div>
        )
      },
      meta: {
        label: 'Judul',
        placeholder: 'Cari judul...',
        variant: 'text',
        icon: FileText,
      },
      enableColumnFilter: true,
    },
    {
      id: 'createdBy',
      accessorKey: 'authorName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Diciptakan Oleh" />
      ),
      cell: ({ row }) => {
        const name = row.original.authorName || '-'
        const avatar = row.original.authorAvatar || undefined
        const getInitial = useInitials()

        return (
          <div className="flex items-center gap-3 max-w-40 truncate">
            <Avatar className="size-8">
              {avatar ? (
                <AvatarImage src={avatar} alt={String(name)} />
              ) : (
                <AvatarFallback>{getInitial(String(name))}</AvatarFallback>
              )}
            </Avatar>
            <span className="truncate">{name}</span>
          </div>
        )
      },
      meta: {
        label: 'Diciptakan Oleh',
        variant: 'text',
        icon: UserRound,
      },
      // enableColumnFilter: true,
      enableHiding: true,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue('status')
        const Icon = getStatusIcon(status)
        return (
          <Badge variant={'outline'} className="gap-1">
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
        icon: Settings,
      },
      filterFn: (row, id, value) =>
        (value as Array<string>).includes(row.getValue(id)),
      enableColumnFilter: true,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Tanggal Dibuat" />
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
      id: 'publishedAt',
      accessorKey: 'publishedAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Tanggal Publikasi" />
      ),
      cell: ({ row }) => {
        const publishedAt = row.getValue('publishedAt')
        return publishedAt ? formatDate(publishedAt) : '-'
      },
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition()
        const bulkUpdateMutation = useBulkUpdateArticleStatusMutation()

        const handleStatusUpdate = (status: DestinationStatus) => {
          startUpdateTransition(async () => {
            try {
              await bulkUpdateMutation.mutateAsync({
                data: { ids: [row.original.id], status },
              })
              toast.success('Status berhasil diperbarui')
            } catch (error) {
              toast.error('Gagal memperbarui status')
            }
          })
        }

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
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem asChild>
                <Link
                  to="/artikel/$artikelId"
                  params={{ artikelId: row.original.slug }}
                >
                  Preview
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: 'update' })}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Ubah Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.original.status}
                    onValueChange={(value) =>
                      handleStatusUpdate(value as DestinationStatus)
                    }
                  >
                    {statusEnumValues.map((status) => (
                      <DropdownMenuRadioItem
                        key={status}
                        value={status}
                        disabled={isUpdatePending}
                      >
                        {getStatusLabel(status)}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: 'delete' })}
                className="text-destructive"
              >
                Hapus
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

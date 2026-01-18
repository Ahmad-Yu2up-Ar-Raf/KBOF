import { Skeleton } from '../skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/fragments/shadcn-ui/table'
import { cn } from '@/lib/utils'

interface DataTableSkeletonProps extends React.ComponentProps<'div'> {
  columnCount?: number
  rowCount?: number
  filterCount?: number
  cellWidths?: Array<string>
  withViewOptions?: boolean
  withPagination?: boolean
  shrinkZero?: boolean
}

export function DataTableSkeleton({
  columnCount = 8,

  rowCount = 10,
  filterCount = 2,
  cellWidths = [
    '3rem', // select
    '8rem', // name
    '6rem', // status
    '6rem', // type
    '6rem', // capacity
    '5rem', // rooms
    '5rem', // employees
    '8rem', // created
  ],
  withViewOptions = true,
  withPagination = true,
  shrinkZero = true,
  className,
  ...props
}: DataTableSkeletonProps) {
  const cozyCellWidths = Array.from(
    { length: columnCount },
    (_, index) => cellWidths[index % cellWidths.length] ?? 'auto',
  )

  return (
    <div
      className={cn('flex w-full flex-col gap-2.5 overflow-auto', className)}
      {...props}
    >
      <div className="flex w-full items-center justify-between gap-2 overflow-auto p-1">
        <div className="flex flex-1 items-center gap-2">
          {filterCount > 0
            ? Array.from({ length: filterCount }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-18 border-dashed" />
              ))
            : null}
        </div>
        {withViewOptions ? (
          <Skeleton className="ml-auto hidden h-7 w-18 lg:flex" />
        ) : null}
      </div>
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            {Array.from({ length: 1 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableHead
                    key={j}
                    style={{
                      width: cozyCellWidths[j],
                      minWidth: shrinkZero ? cozyCellWidths[j] : 'auto',
                    }}
                  >
                    <Skeleton className="h-6 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableCell
                    key={j}
                    style={{
                      width: cozyCellWidths[j],
                      minWidth: shrinkZero ? cozyCellWidths[j] : 'auto',
                    }}
                  >
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {withPagination ? (
        <div className="flex w-full items-center justify-between gap-4 overflow-auto p-1 sm:gap-8">
          <Skeleton className="h-7 w-40 shrink-0" />
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-18" />
            </div>
            <div className="flex items-center justify-center font-medium text-sm">
              <Skeleton className="h-7 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="hidden size-7 lg:block" />
              <Skeleton className="size-7" />
              <Skeleton className="size-7" />
              <Skeleton className="hidden size-7 lg:block" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

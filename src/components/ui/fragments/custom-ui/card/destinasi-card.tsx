import React from 'react'
import { ArrowRight, MapPin, StarIcon, Tag, ThumbsUp } from 'lucide-react'
import { Badge } from '../../shadcn-ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../shadcn-ui/card'
import { buttonVariants } from '../../shadcn-ui/button'
import MediaItem from '@/components/ui/fragments/custom-ui/media/media-item'
import { cn } from '@/lib/utils'

import { Link } from '@tanstack/react-router'

import type { DestinasiDestination } from '@/lib/server/explore/destinasi-server-queries'
import { Skeleton } from '../../shadcn-ui/skeleton'
import { getProvinsiLabel } from '@/lib/utils/destination-utils'

interface DestinasiCardProps {
  destination: DestinasiDestination
  className?: string
  index: number
  hovered: number | null
  totalItems?: number
  setHovered: React.Dispatch<React.SetStateAction<number | null>>
  /**
   * Layout variant:
   * - 'grid' (default): For vertical grid layout (3 columns), rounded corners on grid corners
   * - 'horizontal': For horizontal carousel, rounded-l on first item, rounded-r on last item
   */
  variant?: 'grid' | 'horizontal'
}

function DestinasiCard({
  destination,
  className,

  totalItems = 0,

  index,
  hovered,
  setHovered,
  variant = 'grid',
}: DestinasiCardProps) {
  // Get primary image
  const primaryImage = destination.coverImage
  const columns = 3

  // Grid layout calculations
  const isFirstRow = index < columns
  const totalRows = Math.ceil(totalItems / columns)
  const currentRow = Math.floor(index / columns) + 1
  const isLastRow = currentRow === totalRows
  const isFirstCol = index % columns === 0
  const isLastCol = (index + 1) % columns === 0 || index === totalItems - 1

  // Horizontal carousel calculations
  const isFirstItem = index === 0
  const isLastItem = index === totalItems - 1

  // Corner classes based on variant
  const cornerClasses = cn(
    // Grid variant - rounded corners on grid corners only
    variant === 'grid' && [
      isFirstRow &&
        isFirstCol &&
        'rounded-t-3xl md:rounded-t-none md:rounded-tl-3xl',
      isFirstRow && isLastCol && 'md:rounded-tr-3xl',
      isLastRow && isFirstCol && 'md:rounded-bl-3xl',
      isLastRow &&
        isLastCol &&
        'rounded-b-3xl md:rounded-b-none md:rounded-br-3xl',
    ],
    // Horizontal variant - rounded-l on first, rounded-r on last
    variant === 'horizontal' && [
      isFirstItem && 'rounded-l-3xl',
      isLastItem && 'rounded-r-3xl',
      !isFirstItem && !isLastItem && 'rounded-none',
    ],
  )
  return (
    <Card
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        'relative  group  cursor-target w-full  m-auto         rounded-2xl',
        'transform transition-all duration-300 hover:scale-105 hover:rotate-1 ',
        'mx-auto cursor-target content-center w-full        p-5  rounded-none shadow-none      bg-background  ',
        ' overflow-hidden hover:shadow-2xl flex flex-col h-full',
        'cursor-target',
        cornerClasses,
        hovered !== null && hovered !== index && 'lg:blur-sm   lg:scale-[0.98]',
        className,
      )}
      style={{ willChange: 'transform' }}
      // onClick={() => onClick?.(destination)}
    >
      <CardContent className=" rounded-[30px] content-center justify-center gap-4.5 flex flex-col flex-1 relative mx-auto w-full      shadow-none  border-0   p-0 h-full   md:items-start     ">
        {/* Category Badge */}

        {/* Header */}
        <CardHeader className="p-0 w-full max-w-[15em] gap-2">
          <Badge
            variant="secondary"
            className={cn('text-xs  font-semibold w-fit')}
          >
            <Tag className="mr-1 size-3 " />
            {destination.category}
          </Badge>
          <CardTitle className="text-xl  w-full  leading-6 font-bold tracking-tighter md:leading-6 line-clamp-1">
            {destination.name}
          </CardTitle>

          <CardDescription className="text-muted-foreground  text-sm line-clamp-2 ">
            {destination.description}
          </CardDescription>
        </CardHeader>

        {/* Image */}
        {primaryImage && (
          <div className="  h-45 w-full rounded-xl overflow-hidden">
            <MediaItem
              webViewLink={primaryImage}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        )}

        {/* Creator Info */}
        <div className="space-y-4 w-full">
          <div className="  gap-20 items-center relative     w-full ">
            <div className="flex  gap-2.5  w-full items-start  justify-between   text-xs">
              <MapPin className=" size-6.5 fill-primary   text-background" />

              <div className="flex-1">
                <p className="font-medium  truncate">
                  {destination.kabupatenKota}
                </p>
                <p className="text-muted-foreground   text-xs  capitalize  truncate flex items-center gap-1">
                  {getProvinsiLabel(destination.provinsi)}
                </p>
              </div>
            </div>
            <div className="flex flex-col absolute  bottom-1/2 right-0 top-1/2  gap-1 items-end">
              <Badge
                variant="outline"
                className="text-accent-foreground text-xs w-fit border-0 p-0"
              >
                <ThumbsUp className="size-3.5 fill-primary text-primary mr-1" />
                <span className="font-semibold ">{destination.totalVote}</span>
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
              # {destination.type}
            </Badge>
            <Badge
              variant={'outline'}
              className="px-2 py-0 bg-background text-primary rounded-full text-xs font-medium"
            >
              <StarIcon className=" fill-primary" />
              {(destination.averageRating ?? 0).toLocaleString('id-ID')}
            </Badge>
          </div>
        </div>

        {/* Footer */}
        <CardFooter className="flex mt-0  [.border-t]:pt-4  w-full border-t pt- py-1 items-center justify-between  px-0 ">
          <Link
            to={'/destinasi/$destinasiId'}
            params={{ destinasiId: destination.slug }}
            className={cn(
              buttonVariants({ variant: 'default', size: 'sm' }),
              'hover:opacity-90 transition-transform w-full hover:scale-105 text-xs ',
            )}
          >
            Jelajahi Sekarang{' '}
            <ArrowRight className="ml-2 w-3 h-3 md:w-4 md:h-4" />
          </Link>
        </CardFooter>
      </CardContent>
    </Card>
  )
}

export default DestinasiCard

export function SkeletonCard() {
  return (
    <Card
      className={cn(
        'relative group w-full m-auto p-4 shadow-none border rounded-2xl',
        'mx-auto content-center w-full    border   bg-background shadow-sm rounded-0',
        'overflow-hidden flex flex-col h-full',
      )}
    >
      <CardContent className="  content-center justify-center  gap-5 flex flex-col flex-1 relative mx-auto p-0 w-full h-full   shadow-none md:items-start">
        {/* Header Section */}
        <CardHeader className="p-0 w-full max-w-[15em] gap-2.5">
          {/* Category Badge Skeleton */}
          <Skeleton className="h-6 w-32 rounded-xl" />

          {/* Title Skeleton - 2 lines */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>

          {/* Description Skeleton - 2 lines */}
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        </CardHeader>

        {/* Image Skeleton */}
        <Skeleton className="h-45 w-full rounded-xl" />

        {/* Creator Info & Stats Section */}
        <div className="space-y-4 w-full">
          <div className="gap-20  relative flex w-full justify-between">
            {/* Creator Info - Left */}
            <div className="flex gap-3 w-full items-start justify-between text-xs">
              {/* Avatar Skeleton */}
              <Skeleton className="h-10 w-10 rounded-full" />

              {/* Name & Location */}
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            {/* Stats - Right */}
            <div className=" absolute gap-1 top-0  right-0 items-end">
              {/* Vote Badge Skeleton */}
              <Skeleton className="h-5 w-12 rounded-xl" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className={cn('h-3.5 w-15')} />
          ))}
        </div>
        {/* Footer Button */}
        <CardFooter className="flex mt-0 [.border-t]:pt-4 w-full border-t pt- py-1 items-center justify-between px-0">
          <Skeleton className="h-9 w-full rounded-xl" />
        </CardFooter>
      </CardContent>
    </Card>
  )
}

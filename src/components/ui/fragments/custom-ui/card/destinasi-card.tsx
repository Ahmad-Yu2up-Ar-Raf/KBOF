import React from 'react'
import { ArrowRight, Tag, ThumbsUp } from 'lucide-react'
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
import { batasiHuruf } from '@/hooks/use-word'
import { Avatar, AvatarFallback, AvatarImage } from '../../shadcn-ui/avatar'
import type { DestinasiDestination } from '@/lib/server/explore/destinasi-server-queries'
import { Skeleton } from '../../shadcn-ui/skeleton'
import {
  categoryColors,
  categoryLabels,
  provinsiLabels,
} from '@/lib/utils/destination-utils'

interface DestinasiCardProps {
  destination: DestinasiDestination
  className?: string
  index: number
  hovered: number | null
  setHovered: React.Dispatch<React.SetStateAction<number | null>>
  onClick?: (destination: DestinasiDestination) => void
}

function DestinasiCard({
  destination,
  className,
  onClick,
  index,
  hovered,
  setHovered,
}: DestinasiCardProps) {
  // Get primary image
  const primaryImage = destination.coverImage

  // Creator info
  const creator = destination.user
  const creatorName = batasiHuruf(creator?.name ?? 'Unknown', 9)
  const provinsiLabel = batasiHuruf(
    provinsiLabels[destination.provinsi] ?? destination.provinsi,
    15,
  )

  const tags: string[] = [
    destination.provinsi,
    destination.category,
    destination.type,
    destination.slug,
  ]
  return (
    <Card
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        'relative  group  cursor-target w-full  m-auto  md:px-4 md:py-4  shadow-none  border  rounded-2xl',
        'transform transition-all duration-300 hover:scale-105 hover:rotate-1 ',
        'mx-auto cursor-target content-center w-full  p-3   border border-black/5  shadow-sm  rounded-[30px]',
        ' overflow-hidden hover:shadow-2xl flex flex-col h-full',
        'cursor-target',
        hovered !== null && hovered !== index && 'lg:blur-sm lg:scale-[0.98]',
        className,
      )}
      style={{ willChange: 'transform' }}
      onClick={() => onClick?.(destination)}
    >
      <CardContent className=" rounded-[30px] content-center justify-center gap-5 flex flex-col flex-1 relative mx-auto  p-6 w-full   border border-black/5 bg-neutral-800/5    h-full  overflow-hidden shadow-sm md:items-start   ">
        {/* Category Badge */}

        {/* Header */}
        <CardHeader className="p-0 w-full max-w-[15em] gap-2.5">
          <Badge
            variant="outline"
            className={cn(
              'text-xs md:text-xs font-semibold w-fit',
              categoryColors[destination.category] ||
                'bg-gray-100 text-gray-700',
            )}
          >
            <Tag className="mr-1 size-3 md:size-4" />
            {destination.category}
          </Badge>
          <CardTitle className="text-xl w-full  leading-6 font-bold tracking-tighter md:leading-6 line-clamp-2">
            {destination.name}
          </CardTitle>

          <CardDescription className="text-muted-foreground text-xs line-clamp-2 ">
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
          <div className="  gap-20  flex w-full justify-between">
            <div className="flex  gap-3  w-full items-start  justify-between   text-xs">
              <Avatar className="">
                {creator?.image && (
                  <AvatarImage src={creator.image} alt={creator.name ?? ''} />
                )}
                <AvatarFallback>
                  {(creator?.name ?? 'U').charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium  truncate">{creatorName}</p>
                <p className="text-muted-foreground text-xs truncate flex items-center gap-1">
                  {provinsiLabel}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <Badge
                variant="outline"
                className="text-accent-foreground text-sm w-fit border-0 p-0"
              >
                <ThumbsUp className="size-4 fill-primary text-primary mr-1" />
                <span className="font-semibold ">
                  {(destination.totalVote ?? 0).toLocaleString('id-ID')}
                </span>
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 2).map((tag, idx) => (
              <Badge
                key={idx}
                className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
              >
                #{tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{tags.length - 3}
              </Badge>
            )}
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
            Lihat Detail <ArrowRight className="ml-2 w-3 h-3 md:w-4 md:h-4" />
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
        'relative group w-full m-auto md:px-4 md:py-4 shadow-none border rounded-2xl',
        'mx-auto content-center w-full p-3 border border-black/5 shadow-sm rounded-[30px]',
        'overflow-hidden flex flex-col h-full',
      )}
    >
      <CardContent className="rounded-[30px] content-center justify-center gap-5 flex flex-col flex-1 relative mx-auto p-6 w-full border border-black/5 bg-neutral-800/5 h-full overflow-hidden shadow-sm md:items-start">
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
          <div className="gap-20 flex w-full justify-between">
            {/* Creator Info - Left */}
            <div className="flex gap-3 w-full items-start justify-between text-xs">
              {/* Avatar Skeleton */}
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />

              {/* Name & Location */}
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            {/* Stats - Right */}
            <div className="flex flex-col gap-1 items-end">
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

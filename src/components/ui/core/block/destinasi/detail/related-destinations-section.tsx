'use client'

import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Star, ThumbsUp, MapPin, ChevronRight } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton'
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'
import { cn } from '@/lib/utils'
import {
  getRelatedDestinationsQueryOptions,
  type RelatedDestination,
} from '@/lib/query-options'
import {
  getCategoryLabel,
  getProvinsiLabel,
} from '@/lib/utils/destination-utils'
import MediaItem from '@/components/ui/fragments/custom-ui/media/media-item'
import { useIsMobile } from '@/hooks/use-mobile'

// ============================================
// TYPES
// ============================================

interface RelatedDestinationsSectionProps {
  destinationId: number
  category: string
  provinsi: string
}

// ============================================
// SINGLE RELATED DESTINATION CARD
// ============================================

function RelatedDestinationCard({
  destination,
}: {
  destination: RelatedDestination
}) {
  return (
    <Card
      className={cn(
        'group  cursor-target  font-serif! cursor-target   rounded-xl overflow-hidden bg-background  p-0   shadow-none border-0     relative min-h-[10em]  w-full cursor-pointer transition-transform   ',
      )}
    >
      <Link
        params={{ destinasiId: destination.slug }}
        to={`/destinasi/$destinasiId`}
      >
        <div className="pointer-events-none z-30 absolute inset-x-0 bottom-0 h-5/6 bg-gradient-to-t from-black/90 dark:from-black" />

        <CardContent className=" p-0  z-20 w-full h-full absolute shadow-none">
          <MediaItem
            webViewLink={destination?.coverImage!}
            className="    group-hover:scale-110  transition-all duration-300 ease-out      object-center  object-cover w-full h-full"
          />
        </CardContent>

        <CardHeader className="w-full px-3  text-muted bottom-1.5 absolute z-40    line-clamp-2  ">
          <CardTitle className="text-lg  lg:text-xl ">
            {destination.name}
          </CardTitle>
          <CardDescription className=" flex items-center gap-1 text-muted">
            <MapPin className=" size-3" />
            <p>{getProvinsiLabel(destination.provinsi)}</p>
          </CardDescription>
        </CardHeader>
      </Link>
    </Card>
  )
}

// ============================================
// LOADING SKELETON
// ============================================

function RelatedDestinationsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden py-0 gap-0">
          <Skeleton className="h-32 w-full rounded-none" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <div className="flex gap-3 pt-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export function RelatedDestinationsSection({
  destinationId,
  category,
  provinsi,
}: RelatedDestinationsSectionProps) {
  const isMobile = useIsMobile()
  const { data: relatedDestinations, isLoading } = useQuery(
    getRelatedDestinationsQueryOptions({
      destinationId,
      category,
      provinsi,
      limit: isMobile ? 3 : 6,
    }),
  )

  // Don't render if no related destinations
  if (
    !isLoading &&
    (!relatedDestinations || relatedDestinations.length === 0)
  ) {
    return null
  }

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Destinasi Serupa</h3>
        <Link
          to="/destinasi"
          search={{ categories: [category] }}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'text-xs text-muted-foreground hover:text-primary gap-1',
          )}
        >
          Lihat Semua
          <ChevronRight className="size-3" />
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <RelatedDestinationsSkeleton />
      ) : (
        <div className="grid sm:grid-cols-2  md:grid-cols-3   gap-3">
          {relatedDestinations?.map((destination) => (
            <RelatedDestinationCard
              key={destination.id}
              destination={destination}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export { RelatedDestinationsSkeleton }

'use client'

import { Link } from '@tanstack/react-router'

import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'
import {
  ArrowLeft,
  ThumbsUp,
  Star,
  MapPin,
  Calendar,
  StarIcon,
  MoreVertical,
} from 'lucide-react'

import { cn } from '@/lib/utils'

import MediaItem from '@/components/ui/fragments/custom-ui/media/media-item'
import type { DestinasiDetailDestination } from '@/lib/query-options'
import { formatDate } from '@/lib/format'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import { getProvinsiLabel } from '@/lib/utils/destination-utils'
import { useIsMobile } from '@/hooks/use-mobile'
import ThumnailSlider from '@/components/ui/fragments/custom-ui/media/image-carousel'
import VoteButton from '@/components/ui/fragments/custom-ui/button/vote-button'
import AddReviewSheet from '@/components/ui/core/feature/review/add-review-sheet'
import { ReviewsSection } from './reviews-section'
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton'
import { DestinationMap } from '@/components/ui/fragments/custom-ui/destination-map'
// ==================================================
// MAIN COMPONENT
// ==================================================
export type DestinasiDetailBlockProps = {
  destination: DestinasiDetailDestination
}

export default function DestinasiDetailBlock({
  destination,
}: DestinasiDetailBlockProps) {
  // Format date helper
  const isMobile = useIsMobile()
  const imagesGallery: string[] = [
    ...destination.images,
    destination.coverImage!,
  ]
  if (isMobile)
    return (
      <div className="   ">
        {destination.coverImage && (
          <MediaItem
            className=" max-w-5xl m-auto   md:mask-[linear-gradient(to_right,transparent_0,black_128px,black_calc(100%-200px),transparent_100%)] mask-[linear-gradient(to_bottom,black_128px,black_calc(100%-200px),transparent_100%)]   relative overflow-hidden md:h-[17em] h-[12em] w-full"
            webViewLink={destination.coverImage}
          />
        )}
        <nav className="z-50 absolute  top-3  w-full    ">
          <div className=" relative  w-full     px-5 container    flex items-center justify-between ">
            <Link
              to={'/destinasi'}
              className={cn(
                buttonVariants({ variant: 'link', size: 'lg' }),
                'flex has-[>svg]:px-0 text-sm  text-background w-fit py-2 md:flex items-center gap-2 px-0 group transition-colors',
              )}
            >
              <ArrowLeft className="size-5 group-hover:-translate-x-1  group-hover:transform transition-all ease-out duration-300" />
              <span className=" sr-only ">Kembali</span>
            </Link>
            <Link
              to={'/destinasi'}
              className={cn(
                buttonVariants({ variant: 'link', size: 'lg' }),
                'flex has-[>svg]:px-0 text-sm  text-background w-fit py-2 md:flex items-center gap-2 px-0 group transition-colors',
              )}
            >
              <MoreVertical className="size-5 group-hover:-translate-x-1  group-hover:transform transition-all ease-out duration-300" />
              <span className=" sr-only ">Kembali</span>
            </Link>
          </div>
        </nav>
        <div className="space-y-2 ">
          {/* Tombol Kembali */}

          {/* Header Section */}
          <section className="min-h-lvh space-y-6">
            <section className="max-w-5xl h-full sm:px-10 pt-2.5   w-full md:grid grid-cols-1 lg:grid-cols-2   md:gap-10 gap-4   lg:gap-15   container content-center    sm:pt-0 px-6    space-y-6">
              {/* Judul & Deskripsi Singkat */}
              <div className="space-y-4">
                <header className=" space-y-1.5">
                  <h1 className="text-3xl md:text-5xl font-bold">
                    {destination.name}
                  </h1>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {`${destination.kabupatenKota} • ${getProvinsiLabel(destination.provinsi)}  `}
                  </span>
                </header>
                <div className="mb-6 h-0.5 w-full max-w-xs bg-primary rounded-full" />

                {/* Stats badges */}
                <div className="flex flex-wrap gap-2 text-sm">
                  <Badge variant={'outline'}>
                    <StarIcon className="size-3.5 fill-amber-200" />
                    {destination.totalVote} Rating
                  </Badge>
                  <Badge variant={'outline'}>
                    <ThumbsUp className="size-3.5" />
                    {destination.totalVote} votes
                  </Badge>

                  {destination.averageRating > 0 && (
                    <Badge variant={'outline'}>
                      <Star className="size-3.5 fill-current" />
                      {destination.averageRating} ({destination.totalReview}{' '}
                      ulasan)
                    </Badge>
                  )}
                  <Badge variant={'outline'}>
                    <Calendar className="size-3.5" />
                    {formatDate(destination.createdAt)}
                  </Badge>
                </div>

                <p className="text-muted-foreground text-sm sm:text-base leading-snug max-w-5xl">
                  {destination.description}
                </p>

                {/* Tombol Voting */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <AddReviewSheet
                    destinationId={destination.id}
                    destinationSlug={destination.slug}
                  />
                  <VoteButton destination={destination} />
                </div>
              </div>

              <ThumnailSlider images={imagesGallery} />
              <DestinationMap />
            </section>

            <section className="sm:px-10 pt-2.5 sm:pt-0 px-6 container content-center space-y-6">
              <ReviewsSection
                destinationId={destination.id}
                destinationSlug={destination.slug}
                reviews={destination.reviews}
                totalReview={destination.totalReview}
              />
            </section>
          </section>
        </div>
      </div>
    )

  return (
    <div className=" relative m-auto  w-full ">
      {/* <nav className="z-50 top-5 left-2 absolute    backdrop-blur flex items-center justify-between">
        <Link
          to="/destinasi"
          className={cn(
            buttonVariants({ variant: 'link' }),
            'flex has-[>svg]:px-0 w-fit py-2 md:flex text-base items-center gap-2 px-0 group transition-colors',
          )}
        >
          <ArrowLeft className="size-5 group-hover:-translate-x-1 group-hover:transform transition-all ease-out duration-300" />
          <span>Kembali</span>
        </Link>
      </nav> */}
      {destination.coverImage && (
        <MediaItem
          className="  m-auto    mask-[linear-gradient(to_bottom,black_128px,black_calc(100%-200px),transparent_100%)]   relative overflow-hidden md:h-[17em] h-[12em] w-full"
          webViewLink={destination.coverImage}
        />
      )}

      <section className=" h-full sm:px-10 pt-2.5   w-full md:flex   md:justify-between  md:gap-30 gap-4      container content-center    sm:pt-0 px-0   max-w-5xl   relative  space-y-6">
        {/* Judul & Deskripsi Singkat */}
        <div className=" max-w-md space-y-10">
          <div className="space-y-5">
            <header className=" space-y-3">
              <h1 className="text-3xl md:text-5xl font-bold">
                {destination.name}
              </h1>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-3.5" />
                {`${destination.kabupatenKota} • ${getProvinsiLabel(destination.provinsi)}  `}
              </span>
            </header>
            <div className="mb-6 h-0.5 w-full max-w-xs bg-primary rounded-full" />

            {/* Stats badges */}
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge variant={'outline'}>
                <StarIcon className="size-3.5 fill-amber-200" />
                {destination.totalVote} Rating
              </Badge>
              <Badge variant={'outline'}>
                <ThumbsUp className="size-3.5" />
                {destination.totalVote} votes
              </Badge>

              {destination.averageRating > 0 && (
                <Badge variant={'outline'}>
                  <Star className="size-3.5 fill-current" />
                  {destination.averageRating} ({destination.totalReview} ulasan)
                </Badge>
              )}
              <Badge variant={'outline'}>
                <Calendar className="size-3.5" />
                {formatDate(destination.createdAt)}
              </Badge>
            </div>

            <p className="text-muted-foreground text-sm sm:text-base leading-snug max-w-5xl">
              {destination.description}
            </p>

            {/* Tombol Voting */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <AddReviewSheet
                destinationId={destination.id}
                destinationSlug={destination.slug}
              />
              <VoteButton destination={destination} />
            </div>
          </div>
          <DestinationMap />
          <section>
            <ReviewsSection
              destinationId={destination.id}
              destinationSlug={destination.slug}
              reviews={destination.reviews}
              totalReview={destination.totalReview}
            />
          </section>
        </div>

        <ThumnailSlider images={imagesGallery} />
      </section>
    </div>
  )
}
function DestinasiDetailSkeleton() {
  const isMobile = useIsMobile()

  // Mobile Skeleton
  if (isMobile) {
    return (
      <div>
        {/* Cover Image Skeleton */}
        <Skeleton className="h-[12em] w-full" />

        {/* Navigation Skeleton */}
        <nav className="z-50 absolute top-3 w-full">
          <div className="relative w-full px-5 container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowLeft className="size-5 text-muted-foreground/50" />
            </div>
            <MoreVertical className="size-5 text-muted-foreground/50" />
          </div>
        </nav>

        <div className="space-y-2">
          <section className="min-h-lvh space-y-6">
            <section className="max-w-5xl h-full sm:px-10 pt-2.5 w-full container content-center sm:pt-0 px-6 space-y-6">
              {/* Title & Location Skeleton */}
              <div className="space-y-4">
                <header className="space-y-2">
                  <Skeleton className="h-9 w-3/4" />
                  <Skeleton className="h-4 w-48" />
                </header>
                <div className="h-0.5 w-36 bg-muted rounded-full" />

                {/* Stats Badges Skeleton */}
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>

                {/* Description Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Skeleton className="h-10 w-full sm:w-36" />
                  <Skeleton className="h-10 w-full sm:w-28" />
                </div>
              </div>

              {/* Image Gallery Skeleton */}
              <div className="w-full space-y-2">
                <Skeleton className="h-[45lvh] w-full rounded-xl" />
                <div className="flex gap-2 overflow-hidden">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton
                      key={i}
                      className="h-18 w-1/4 rounded-xl shrink-0"
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Reviews Section Skeleton */}
            <section className="sm:px-10 pt-2.5 sm:pt-0 px-6 container content-center space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-7 w-32" />
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 border rounded-xl space-y-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </section>
        </div>
      </div>
    )
  }

  // Desktop Skeleton
  return (
    <div className="max-w-5xl m-auto w-full">
      {/* Navigation Skeleton */}
      <nav className="z-50 absolute max-w-6xl m-auto top-3 w-full">
        <div className="relative w-full px-10 container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeft className="size-5 text-muted-foreground/50" />
            <Skeleton className="h-5 w-16" />
          </div>
          <MoreVertical className="size-5 text-muted-foreground/50" />
        </div>
      </nav>

      {/* Cover Image Skeleton */}
      <Skeleton className="h-[17em] w-full" />

      <div className="space-y-2 mt-10">
        <section className="min-h-lvh space-y-6">
          <section className="h-full sm:px-10 pt-4 w-full md:flex md:justify-between md:gap-10 lg:gap-25 container content-center sm:pt-0 px-6 relative space-y-6">
            {/* Left Content */}
            <div className="space-y-10 flex-1">
              <div className="space-y-4">
                {/* Title & Location */}
                <header className="space-y-2">
                  <Skeleton className="h-12 w-3/4" />
                  <Skeleton className="h-4 w-48" />
                </header>
                <div className="h-0.5 w-36 bg-muted rounded-full" />

                {/* Stats Badges */}
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>

                {/* Description */}
                <div className="space-y-2 max-w-xl">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Skeleton className="h-10 w-36" />
                  <Skeleton className="h-10 w-28" />
                </div>
              </div>

              {/* Reviews Section Skeleton */}
              <section className="space-y-4">
                <Skeleton className="h-7 w-32" />
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 border rounded-xl space-y-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right: Image Gallery Skeleton */}
            <div className="w-full md:w-[28em] h-full sticky top-2 space-y-2">
              <Skeleton className="md:h-[27em] h-[45lvh] w-full rounded-xl" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-18 flex-1 rounded-xl" />
                ))}
              </div>
            </div>
          </section>
        </section>
      </div>
    </div>
  )
}

export { DestinasiDetailSkeleton }

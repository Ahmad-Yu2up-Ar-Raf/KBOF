'use client'

import { Link } from '@tanstack/react-router'

import {
  ArrowLeft,
  Calendar,
  MapPin,
  MoreVertical,
  Star,
  StarIcon,
  ThumbsUp,
} from 'lucide-react'
import React from 'react'
import { ReviewsSection } from './reviews-section'
import { RelatedDestinationsSection } from './related-destinations-section'
import type { DestinasiDetailDestination } from '@/lib/query-options'
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'

import { cn } from '@/lib/utils'

import MediaItem from '@/components/ui/fragments/custom-ui/media/media-item'
import { formatDate } from '@/lib/format'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import { getProvinsiLabel } from '@/lib/utils/destination-utils'
import { useIsMobile } from '@/hooks/use-mobile'
import ThumnailSlider from '@/components/ui/fragments/custom-ui/media/image-carousel'
import VoteButton from '@/components/ui/fragments/custom-ui/button/vote-button'
import AddReviewSheet from '@/components/ui/core/feature/review/add-review-sheet'
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
  const imagesGallery: Array<string> = [
    ...destination.images,
    destination.coverImage!,
  ]
  const [OpenAddReview, setOpenAddReview] = React.useState(false)
  if (isMobile)
    return (
      <div className="   ">
        <section
          style={{
            backgroundImage: `url(${destination.coverImage})`,
          }}
          className={cn(
            'relative min-h-50  bg-fixed bg-no-repeat     z-10   flex items-center justify-center overflow-hidden hero-parallax ',
          )}
        >
          <div className="absolute inset-0 bg-linear-to-b from-background/10 via-background/50 to-background     " />
        </section>
        <div className=" relative  space-y-6 z-20 -mt-20  container content-center   px-6  ">
          <section className="  h-full     w-full md:grid grid-cols-1 lg:grid-cols-2   md:gap-10 gap-4   lg:gap-15    sm:pt-0     space-y-6">
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
                {/* <Badge variant={'outline'}>
                  <StarIcon className="size-3.5 fill-amber-200" />
                  {destination.averageRating} Rating
                </Badge> */}
                {destination.averageRating > 0 && (
                  <Badge variant={'outline'}>
                    <Star className="size-3.5 fill-amber-200" />
                    {destination.averageRating} ({destination.totalReview}{' '}
                    ulasan)
                  </Badge>
                )}
                <Badge variant={'outline'}>
                  <ThumbsUp className="size-3.5" />
                  {destination.totalVote} votes
                </Badge>

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
                  open={OpenAddReview}
                  onOpenChange={setOpenAddReview}
                  destinationId={destination.id}
                  destinationSlug={destination.slug}
                />
                <VoteButton destination={destination} />
              </div>
            </div>

            {/* Key prop forces remount when destination changes */}
            <ThumnailSlider
              key={`gallery-${destination.id}`}
              images={imagesGallery}
            />
            <DestinationMap
              destinationName={destination.name}
              address={`${destination.alamat ?? ''} ${destination.kabupatenKota ?? ''} ${destination.provinsi ?? ''}`.trim()}
            />
          </section>

          <section className="    space-y-6">
            <ReviewsSection
              setOpenAddReview={setOpenAddReview}
              OpenAddReview={OpenAddReview}
              destinationId={destination.id}
              destinationSlug={destination.slug}
              reviews={destination.reviews}
              totalReview={destination.totalReview}
            />
          </section>

          {/* Related Destinations */}
          <RelatedDestinationsSection
            destinationId={destination.id}
            category={destination.category}
            provinsi={destination.provinsi}
          />
        </div>
      </div>
    )

  return (
    <div className=" relative m-auto  w-full ">
      <section
        style={{
          backgroundImage: `url(${destination.coverImage})`,
        }}
        className={cn(
          'relative min-h-67  bg-fixed bg-no-repeat bg-center  bg-cover  flex items-center justify-center overflow-hidden hero-parallax  ',
        )}
      >
        <div className="absolute inset-0 bg-linear-to-b from-background/10 via-background/10 to-background     " />
        <div className="absolute inset-0 bg-linear-to-r from-background/10 via-background/0 to-background     " />
        <div className="absolute inset-0 bg-linear-to-l from-background/10 via-background/0 to-background     " />
      </section>
      <div className="container space-y-4 -mt-13 h-full  relative ">
        <div className="        md:flex    gap-4    sm:gap-20            relative  space-y-6">
          <ThumnailSlider
            key={`gallery-${destination.id}`}
            images={imagesGallery}
          />
          {/* Key prop forces remount when destination changes */}

          {/* Judul & Deskripsi Singkat */}
          <div className=" max-w-6xl  w-full  space-y-10">
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
                {destination.averageRating > 0 && (
                  <Badge variant={'outline'}>
                    <Star className="size-3.5 fill-amber-200" />
                    {destination.averageRating} ({destination.totalReview}{' '}
                    ulasan)
                  </Badge>
                )}
                <Badge variant={'outline'}>
                  <ThumbsUp className="size-3.5" />
                  {destination.totalVote} votes
                </Badge>

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
            <DestinationMap
              destinationName={destination.name}
              address={`${destination.alamat ?? ''} ${destination.kabupatenKota ?? ''} ${destination.provinsi ?? ''}`.trim()}
            />
            <section>
              <ReviewsSection
                setOpenAddReview={setOpenAddReview}
                OpenAddReview={OpenAddReview}
                destinationId={destination.id}
                destinationSlug={destination.slug}
                reviews={destination.reviews}
                totalReview={destination.totalReview}
              />
            </section>

            {/* Related Destinations */}
          </div>
        </div>
        <RelatedDestinationsSection
          destinationId={destination.id}
          category={destination.category}
          provinsi={destination.provinsi}
        />
      </div>
    </div>
  )
}
function DestinasiDetailSkeleton() {
  const isMobile = useIsMobile()

  // Mobile Skeleton - matches mobile layout structure
  if (isMobile) {
    return (
      <div>
        {/* Hero Cover Image Skeleton - matches min-h-50 */}
        <section className="relative min-h-50 bg-muted">
          <div className="absolute inset-0 bg-linear-to-b from-background/10 via-background/50 to-background" />
          {/* Navigation */}
        </section>

        {/* Content Container - matches -mt-20 and space-y-6 */}
        <div className="relative space-y-6 z-20 -mt-20 container content-center px-6">
          <section className="h-full w-full space-y-6">
            {/* Title & Description */}
            <div className="space-y-4">
              <header className="space-y-1.5">
                <Skeleton className="h-9 w-4/5" />
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
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Skeleton className="h-10 w-full sm:w-36" />
                <Skeleton className="h-10 w-full sm:w-28" />
              </div>
            </div>

            {/* Image Gallery Skeleton */}
            <div className="w-full space-y-2">
              <Skeleton className="h-[45svh] w-full rounded-xl" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-18 flex-1 rounded-xl" />
                ))}
              </div>
            </div>

            {/* Map Skeleton */}
            <Skeleton className="h-48 w-full rounded-xl" />
          </section>

          {/* Reviews Section Skeleton */}
          <section className="space-y-4">
            <Skeleton className="h-7 w-32" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 border rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-8 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-2.5 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </section>

          {/* Related Destinations Skeleton */}
          <section className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          </section>
        </div>
      </div>
    )
  }

  // Desktop Skeleton - matches desktop layout structure
  return (
    <div className="relative m-auto w-full">
      {/* Hero Cover Image Skeleton - matches min-h-67 */}
      <section className="relative min-h-67 bg-muted">
        <div className="absolute inset-0 bg-linear-to-b from-background/10 via-background/50 to-background" />
        {/* Navigation */}
      </section>

      {/* Content Container - matches container space-y-4 -mt-10 */}
      <div className="container space-y-4 -mt-10 h-full relative">
        {/* Main Flex Layout - matches md:flex gap-4 sm:gap-20 */}
        <div className="md:flex gap-4 sm:gap-20 relative space-y-6">
          {/* Left: Image Gallery Skeleton (sticky) */}
          <div className="w-full md:w-auto md:sticky top-10 h-fit space-y-2">
            <div className="w-full md:w-80 lg:w-96">
              <Skeleton className="h-[80svh] w-full rounded-xl" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-18 w-20 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Right: Content - matches max-w-6xl w-full space-y-10 */}
          <div className="max-w-6xl w-full space-y-10">
            <div className="space-y-5">
              {/* Title & Location */}
              <header className="space-y-3">
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

            {/* Map Skeleton */}
            <Skeleton className="h-64 w-full rounded-xl" />

            {/* Reviews Section Skeleton */}
            <section className="space-y-4">
              <Skeleton className="h-7 w-32" />
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 border rounded-xl space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-8 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-2.5 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Related Destinations Skeleton */}
        <section className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export { DestinasiDetailSkeleton }

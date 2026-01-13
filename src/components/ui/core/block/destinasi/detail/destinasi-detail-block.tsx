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
          <div className="max-w-5xl m-auto relative overflow-hidden md:h-[17em] h-[12em] w-full">
            <MediaItem
              className="w-full h-full"
              webViewLink={destination.coverImage}
            />

            {/* Mobile: bottom fade only */}
            <div className="md:hidden pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background via-background/50 to-transparent" />

            {/* Tablet/Desktop: all sides fade */}
            <div className="hidden md:block pointer-events-none absolute inset-0">
              {/* Top */}
              <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-background via-background/60 to-transparent" />
              {/* Bottom */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background via-background/60 to-transparent" />
              {/* Left */}
              <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-background via-background/60 to-transparent" />
              {/* Right */}
              <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-background via-background/60 to-transparent" />
            </div>
          </div>
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
              {/* <div className="md:flex-row gap-8 items-center">
              <div className="flex items-center gap-3">
                <Avatar className="size-10 md:size-12">
                  <AvatarImage
                    src={destination.user.image ?? undefined}
                    alt={destination.user.name}
                  />
                  <AvatarFallback>
                    {destination.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold">{destination.user.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" />
                    <span>{destination.provinsi.replace(/-/g, ' ')}</span>
                    {destination.kabupatenKota && (
                      <span>• {destination.kabupatenKota}</span>
                    )}
                  </div>
                </div>
              </div>
            </div> */}

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
              {/* {isMobile ? (
              imagesGallery.length > 0 && (
                <Carousel
                  className="overflow-hidden"
                  opts={{
                    align: 'start',
                    breakpoints: {
                      '(max-width: 768px)': {
                        dragFree: true,
                      },
                    },
                  }}
                >
                  <CarouselContent className="mx-6 md:mx-2.5 relative cursor-grab">
                    {imagesGallery.map((cat, i) => {
                      return (
                        <CarouselItem
                          key={cat}
                          className={cn('w-fit', i > 0 ? 'pl-2' : 'pl-0')}
                        >
                          <MediaItem
                            className="rounded-xl md:h-[30em] h-[10em] relative overflow-hidden   w-60"
                            webViewLink={cat}
                          />
                        </CarouselItem>
                      )
                    })}
                  </CarouselContent>
                </Carousel>
              )
            ) : (
             
            )} */}
            </section>
            {/* Cover Image */}
            {/* {destination.coverImage && (
            <div className="  rounded-2xl">
              <MediaItem
                className="rounded-2xl md:min-h-[30em] min-h-[20em] relative overflow-hidden h-full w-full"
                webViewLink={destination.coverImage}
              />
            </div>
          )} */}
            {/* Gallery Images */}
            {/* {imagesGallery && imagesGallery.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Galeri</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagesGallery.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl overflow-hidden"
                  >
                    <MediaItem
                      className="h-full w-full object-cover"
                      webViewLink={image}
                    />
                  </div>
                ))}
              </div>
            </div>
          )} */}
            {/* Reviews Section */}
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
    <div className=" max-w-5xl m-auto  w-full ">
      <nav className="z-50 absolute  max-w-6xl m-auto top-3  w-full    ">
        <div className=" relative  w-full       px-10 container    flex items-center justify-between ">
          <Link
            to={'/destinasi'}
            className={cn(
              buttonVariants({ variant: 'link', size: 'lg' }),
              'flex has-[>svg]:px-0 text-sm bg-blend-difference   text-primary  w-fit py-2 md:flex items-center gap-2 px-0 group transition-colors',
            )}
          >
            <ArrowLeft className="size-5 group-hover:-translate-x-1  group-hover:transform transition-all ease-out duration-300" />
            <span className="   ">Kembali</span>
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
      {destination.coverImage && (
        <div className="relative overflow-hidden md:h-[17em] h-[12em] w-full">
          <MediaItem
            className="w-full h-full"
            webViewLink={destination.coverImage}
          />

          {/* Mobile: bottom fade only */}
          <div className="md:hidden pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background via-background/50 to-transparent" />

          {/* Tablet/Desktop: all sides fade */}
          <div className="hidden md:block pointer-events-none absolute inset-0">
            {/* Top */}
            <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-background via-background/60 to-transparent" />
            {/* Bottom */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background via-background/60 to-transparent" />
            {/* Left */}
            <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-background via-background/60 to-transparent" />
            {/* Right */}
            <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-background via-background/60 to-transparent" />
          </div>
        </div>
      )}
      <div className="space-y-2  ">
        {/* Tombol Kembali */}

        {/* Header Section */}
        <section className="min-h-lvh space-y-6">
          <section className=" h-full sm:px-10 pt-2.5   w-full md:flex   md:justify-between  md:gap-10 gap-4   lg:gap-25   container content-center    sm:pt-0 px-6    relative  space-y-6">
            {/* Judul & Deskripsi Singkat */}
            <div className=" space-y-10">
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
            {/* {isMobile ? (
              imagesGallery.length > 0 && (
                <Carousel
                  className="overflow-hidden"
                  opts={{
                    align: 'start',
                    breakpoints: {
                      '(max-width: 768px)': {
                        dragFree: true,
                      },
                    },
                  }}
                >
                  <CarouselContent className="mx-6 md:mx-2.5 relative cursor-grab">
                    {imagesGallery.map((cat, i) => {
                      return (
                        <CarouselItem
                          key={cat}
                          className={cn('w-fit', i > 0 ? 'pl-2' : 'pl-0')}
                        >
                          <MediaItem
                            className="rounded-xl md:h-[30em] h-[10em] relative overflow-hidden   w-60"
                            webViewLink={cat}
                          />
                        </CarouselItem>
                      )
                    })}
                  </CarouselContent>
                </Carousel>
              )
            ) : (
             
            )} */}
          </section>
        </section>
      </div>
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
                <Skeleton className="h-[45dvh] w-full rounded-xl" />
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
              <Skeleton className="md:h-[27em] h-[45dvh] w-full rounded-xl" />
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

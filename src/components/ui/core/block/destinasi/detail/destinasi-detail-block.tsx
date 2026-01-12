'use client'

import { Link } from '@tanstack/react-router'

import {
  Button,
  buttonVariants,
} from '@/components/ui/fragments/shadcn-ui/button'

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/fragments/shadcn-ui/avatar'
import { ArrowLeft, ThumbsUp, Star, MapPin, Calendar } from 'lucide-react'

import { cn } from '@/lib/utils'

import MediaItem from '@/components/ui/fragments/custom-ui/media/media-item'
import type { DestinasiDetailDestination } from '@/lib/query-options'

// ==================================================
// MAIN COMPONENT
// ==================================================
type DestinasiDetailBlockProps = {
  destination: DestinasiDetailDestination
}

export default function DestinasiDetailBlock({
  destination,
}: DestinasiDetailBlockProps) {
  // Format date helper
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date))
  }

  return (
    <>
      <div className="container py-7 px-5 space-y-7">
        {/* Tombol Kembali */}
        <nav className="z-50 top-0 relative bg-background/95 backdrop-blur flex items-center justify-between">
          <Link
            to={'/destinasi'}
            className={cn(
              buttonVariants({ variant: 'link' }),
              'flex has-[>svg]:px-0 text-sm w-fit py-2 md:flex items-center gap-2 px-0 group transition-colors',
            )}
          >
            <ArrowLeft className="size-5 group-hover:-translate-x-1 group-hover:transform transition-all ease-out duration-300" />
            <span>Kembali</span>
          </Link>
        </nav>

        {/* Header Section */}
        <section className="min-h-lvh space-y-6">
          <div className="max-w-xl h-full content-center space-y-6">
            <div className="md:flex-row gap-8 items-center">
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
            </div>

            {/* Judul & Deskripsi Singkat */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-5xl font-bold">
                {destination.name}
              </h1>
              <div className="my-6 h-1 w-36 bg-primary rounded-full"></div>

              {/* Stats badges */}
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary">
                  <ThumbsUp className="size-3.5" />
                  {destination.totalVote} votes
                </span>
                {destination.averageRating > 0 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600">
                    <Star className="size-3.5 fill-current" />
                    {destination.averageRating} ({destination.totalReview}{' '}
                    ulasan)
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground">
                  <Calendar className="size-3.5" />
                  {formatDate(destination.createdAt)}
                </span>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl">
                {destination.description}
              </p>

              {/* Tombol Voting */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button>
                  <ThumbsUp className="size-4" />
                  Vote Sekarang
                </Button>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {destination.coverImage && (
            <div className="outline-2 p-2 rounded-2xl">
              <MediaItem
                className="rounded-2xl md:min-h-[30em] min-h-[20em] relative overflow-hidden h-full w-full"
                webViewLink={destination.coverImage}
              />
            </div>
          )}

          {/* Gallery Images */}
          {/* {destination.images && destination.images.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Galeri</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {destination.images.map((image, index) => (
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
          {destination.reviews && destination.reviews.length > 0 && (
            <div className="space-y-4 pt-8">
              <h2 className="text-xl font-semibold">
                Ulasan ({destination.totalReview})
              </h2>
              <div className="space-y-4">
                {destination.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 rounded-xl border bg-card space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarImage
                            src={review.user.image ?? undefined}
                            alt={review.user.name}
                          />
                          <AvatarFallback>
                            {review.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {review.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'size-4',
                              i < review.rating
                                ? 'fill-current'
                                : 'fill-none stroke-current opacity-30',
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    {review.title && (
                      <p className="font-medium">{review.title}</p>
                    )}
                    {review.content && (
                      <p className="text-sm text-muted-foreground">
                        {review.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  )
}

'use client'

import { Link } from '@tanstack/react-router'
import { Star, MessageCircle } from 'lucide-react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/fragments/shadcn-ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card'
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format'
import type { DestinasiDetailDestination } from '@/lib/query-options'

// ============================================
// TYPES
// ============================================

interface ReviewsSectionProps {
  destinationId: number
  destinationSlug: string
  reviews?: DestinasiDetailDestination['reviews']
  totalReview: number
}

// ============================================
// SINGLE REVIEW CARD
// ============================================

interface ReviewCardProps {
  review: NonNullable<DestinasiDetailDestination['reviews']>[number]
  isLast: boolean
}

function ReviewCard({ review, isLast }: ReviewCardProps) {
  return (
    <Card
    gradient={false}
      className={cn(
        'rounded-xl border-b bg-background p-0 shadow-none border-0 space-y-3',
      )}
    >
      <CardContent className="flex gap-4 p-0 items-start w-full justify-between">
        <Avatar className="size-8">
          <AvatarImage
            src={review.user.image ?? undefined}
            alt={review.user.name}
          />
          <AvatarFallback>
            {review.user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div
          className={cn(
            'pb-5 flex flex-col gap-2 flex-1',
            !isLast && 'border-b',
          )}
        >
          <CardHeader className="px-0 flex justify-between w-full items-center">
            <CardTitle className="flex flex-col gap-1">
              <h4 className="text-xs text-foreground font-semibold">
                {review.user.name}
              </h4>
              <span className="text-[10px] text-muted-foreground font-normal">
                {formatDate(review.createdAt)}
              </span>
            </CardTitle>
            <div className="flex items-center gap-0.5 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'size-2.5',
                    i < review.rating
                      ? 'fill-amber-400 stroke-amber-400'
                      : 'fill-muted stroke-muted-foreground/30',
                  )}
                />
              ))}
            </div>
          </CardHeader>
          {review.title && (
            <h5 className="text-sm font-medium">{review.title}</h5>
          )}
          <CardDescription className="pr-3.5">
            <p className="text-xs text-muted-foreground line-clamp-3">
              {review.content || 'Tidak ada komentar.'}
            </p>
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// EMPTY STATE
// ============================================

function EmptyReviews() {
  return (
    <div className="py-8 text-center">
      <MessageCircle className="size-10 mx-auto mb-3 text-muted-foreground/50" />
      <p className="text-sm text-muted-foreground">
        Belum ada review untuk destinasi ini.
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        Jadilah yang pertama memberikan review!
      </p>
    </div>
  )
}

// ============================================
// LOADING STATE
// ============================================

function ReviewsSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4 pb-5 border-b last:border-0">
          <Skeleton className="size-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// MAIN REVIEWS SECTION COMPONENT
// ============================================

function ReviewsSection({ reviews, totalReview }: ReviewsSectionProps) {
  const displayReviews = reviews?.slice(0, 4) ?? []
  const hasMoreReviews = totalReview > 4
  if (displayReviews.length > 0)
    return (
      <section className="max-w-md h-full">
        <main>
          <header className="mb-4 border-b flex justify-between w-full pb-2">
            <h4 className=" flex items-center gap-3 font-semibold tracking-tight">
              <span>Reviews ({totalReview})</span>
              <MessageCircle className="sr-only fill-primary-foreground text-primary" />
            </h4>
          </header>

          <div className="border-b space-y-5">
            {displayReviews.map((review, i) => (
              <ReviewCard
                key={review.id}
                review={review}
                isLast={i === displayReviews.length - 1}
              />
            ))}
          </div>

          {hasMoreReviews && (
            <footer className="border-b">
              <Link
                to="/"
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'px-0 py-0 w-full rounded-none text-xs',
                )}
              >
                Lihat semua {totalReview} review
              </Link>
            </footer>
          )}
        </main>
      </section>
    )
}

export { ReviewsSection, ReviewsSkeleton, ReviewCard, EmptyReviews }

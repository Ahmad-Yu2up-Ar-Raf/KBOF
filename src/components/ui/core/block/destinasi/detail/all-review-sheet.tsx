// =============================================================================
// ALL REVIEWS SHEET - Destination Reviews
// =============================================================================
// Responsive sheet/drawer showing all reviews for a destination
// Supports pagination and filtering
// =============================================================================

'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Star, MessageCircle, ChevronDown, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/fragments/shadcn-ui/sheet'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/fragments/shadcn-ui/drawer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/fragments/shadcn-ui/select'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/fragments/shadcn-ui/avatar'

import { useIsMobile } from '@/hooks/use-mobile'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import {
  getReviewsQueryOptions,
  type ReviewWithUser,
  type ReviewFilters,
} from '@/lib/query-options'

// =============================================================================
// TYPES
// =============================================================================

export type AllReviewsSheetProps = {
  destinationId: number
  destinationName: string
  totalReviews: number
  initialData?: ReviewWithUser[]
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

// =============================================================================
// REVIEW CARD COMPONENT
// =============================================================================

function ReviewCard({ review }: { review: ReviewWithUser }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-4 border-b pb-5 last:border-0"
    >
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage
          src={review.user.image ?? undefined}
          alt={review.user.name}
        />
        <AvatarFallback>
          {review.user.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold">{review.user.name}</h4>
            <p className="text-xs text-muted-foreground">
              {formatDate(review.createdAt)}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-3.5 w-3.5',
                  i < review.rating
                    ? 'fill-amber-400 stroke-amber-400'
                    : 'fill-muted stroke-muted-foreground/30',
                )}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        {review.title && (
          <h5 className="text-sm font-medium">{review.title}</h5>
        )}

        {/* Content */}
        {review.content && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {review.content}
          </p>
        )}

        {/* Visit Date */}
        {review.visitDate && (
          <p className="text-xs text-muted-foreground">
            Dikunjungi: {formatDate(review.visitDate)}
          </p>
        )}
      </div>
    </motion.div>
  )
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

function ReviewsSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4 border-b pb-5">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
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

// =============================================================================
// EMPTY STATE
// =============================================================================

function EmptyReviews() {
  return (
    <div className="py-12 text-center">
      <MessageCircle className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
      <p className="text-sm font-medium">Belum ada review</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Jadilah yang pertama memberikan review untuk destinasi ini!
      </p>
    </div>
  )
}

// =============================================================================
// MAIN CONTENT COMPONENT
// =============================================================================

function AllReviewsContent({
  destinationId,
  destinationName,
  totalReviews,
}: Pick<
  AllReviewsSheetProps,
  'destinationId' | 'destinationName' | 'totalReviews'
>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<ReviewFilters['sort']>('newest')

  const filters: ReviewFilters = {
    destinationId,
    page: currentPage,
    perPage: 20,
    sort: sortBy,
  }

  const { data, isLoading, isError, error } = useQuery(
    getReviewsQueryOptions(filters),
  )

  if (isLoading) {
    return <ReviewsSkeleton />
  }

  if (isError) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-destructive">
          {error?.message || 'Gagal memuat review'}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Coba Lagi
        </Button>
      </div>
    )
  }

  if (!data || data.data.length === 0) {
    return <EmptyReviews />
  }

  const { data: reviews, pagination } = data

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between gap-4 border-b pb-3">
        <div className="text-sm text-muted-foreground">
          Menampilkan {reviews.length} dari {pagination.total} review
        </div>

        <Select
          value={sortBy}
          onValueChange={(v) => setSortBy(v as ReviewFilters['sort'])}
        >
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Terbaru</SelectItem>
            <SelectItem value="oldest">Terlama</SelectItem>
            <SelectItem value="highest">Rating Tertinggi</SelectItem>
            <SelectItem value="lowest">Rating Terendah</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <AnimatePresence mode="wait">
        <div className="space-y-5">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </AnimatePresence>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Sebelumnya
          </Button>

          <div className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {pagination.totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasNextPage}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Berikutnya
          </Button>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function AllReviewsSheet({
  destinationId,
  destinationName,
  totalReviews,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AllReviewsSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isMobile = useIsMobile()

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = controlledOnOpenChange || setInternalOpen

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="w-full">
      Lihat semua {totalReviews} review
      <ChevronDown className="ml-2 h-4 w-4" />
    </Button>
  )

  // Mobile: Drawer
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger || defaultTrigger}</DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-left border-b">
            <DrawerTitle>Review {destinationName}</DrawerTitle>
            <DrawerDescription>
              {totalReviews} ulasan dari pengunjung
            </DrawerDescription>
          </DrawerHeader>

          <div className="overflow-y-auto p-4">
            <AllReviewsContent
              destinationId={destinationId}
              destinationName={destinationName}
              totalReviews={totalReviews}
            />
          </div>

          <div className="border-t p-4">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Tutup
              </Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  // Desktop: Sheet
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger || defaultTrigger}</SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader className="border-b pb-4">
          <SheetTitle>Review {destinationName}</SheetTitle>
          <SheetDescription>
            {totalReviews} ulasan dari pengunjung
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <AllReviewsContent
            destinationId={destinationId}
            destinationName={destinationName}
            totalReviews={totalReviews}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

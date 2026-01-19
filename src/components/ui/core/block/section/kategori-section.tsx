// =============================================================================
// KATEGORI SECTION - Category Carousel Section for Homepage
// =============================================================================
// Displays all destination categories in a swipeable carousel
// Each card links to /destinasi with the category filter pre-applied
// =============================================================================

'use client'

import Autoplay from 'embla-carousel-autoplay'

import KategoriCard, {
  KategoriCardSkeleton,
} from '@/components/ui/fragments/custom-ui/card/kategori-card'
import HeadingSection from '@/components/ui/fragments/custom-ui/typography/heading-section'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/fragments/shadcn-ui/carousel'
import { getAllCategoriesWithImages } from '@/lib/utils/category-images'
import { cn } from '@/lib/utils'

// ============================================
// COMPONENT
// ============================================

export default function KategoriSection() {
  const categories = getAllCategoriesWithImages()

  return (
    <section className="container px-0 sm:px-5 py-10 lg:py-0 space-y-8">
      {/* Section Header */}
      <HeadingSection
        className=" px-5 md:px-0 "
        title="Kategori Wisata"
        description="Jelajahi berbagai kategori wisata yang sesuai dengan minat Anda."
        href="/destinasi"
      />

      {/* Carousel */}
      <div className="relative">
        <Carousel
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
          ]}
          opts={{
            align: 'start',
            // loop: true,
            skipSnaps: false,
            breakpoints: {
              '(max-width: 768px)': {
                dragFree: true,
              },
            },
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {categories.map((category) => (
              <CarouselItem
                key={category.value}
                className={cn(
                  'pl-2  ',
                  'basis-[70%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4',
                )}
              >
                <KategoriCard category={category} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Buttons - Hidden on mobile */}
          <CarouselPrevious className="hidden md:flex -left-4 lg:-left-6" />
          <CarouselNext className="hidden md:flex -right-4 lg:-right-6" />
        </Carousel>
      </div>
    </section>
  )
}

// ============================================
// SKELETON
// ============================================

export function KategoriSectionSkeleton() {
  return (
    <section className="container px-5 py-10 space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 bg-muted rounded animate-pulse" />
          <div className="h-4 w-72 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-8 w-24 bg-muted rounded animate-pulse" />
      </div>

      {/* Carousel Skeleton */}
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 basis-[70%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            <KategoriCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  )
}

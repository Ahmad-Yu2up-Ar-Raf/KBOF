'use client'

import { useState } from 'react'

import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRight, ChevronRight } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/fragments/shadcn-ui/carousel'
import { cn } from '@/lib/utils'

import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton'

import { getFeaturedDestinationsQueryOptions } from '@/lib/query-options'

import DestinasiCard from '@/components/ui/fragments/custom-ui/card/destinasi-card'
import HeadingSection from '@/components/ui/fragments/custom-ui/typography/heading-section'

type DestinationSectionProps = {
  title?: string
  label?: string
  href?: string
  linkLabel?: string
  limit?: number
}

function DestinationSection({
  linkLabel = 'Lihat Semua',
  title = 'Destinasi Populer',
  href = '/destinasi',
  limit = 8,
  ...props
}: DestinationSectionProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const { data: destinations } = useSuspenseQuery(
    getFeaturedDestinationsQueryOptions(limit),
  )

  return (
    <section className="container px-0 sm:px-5   space-y-8 overflow-x-hidden lg:overflow-x-visible">
      <HeadingSection
        className=" px-5 md:px-0 "
        href={href}
        title={title}
        description="Jelajahi berbagai destinasi menarik."
      />

      <Carousel
        className=" lg:mb-0"
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        opts={{
          // loop: true,
          align: 'start',
          breakpoints: {
            '(max-width: 768px)': {
              dragFree: true,
            },
          },
        }}
      >
        <CarouselContent className="mx-2 relative cursor-grab overflow-y-visible 2xl:mr-[max(0rem,calc(50vw-700px))]">
          {destinations.map((destination, i: number) => (
            <CarouselItem
              key={destination.id}
              className={cn('w-fit shrink-0', 'pl-0')}
            >
              <DestinasiCard
                destination={destination}
                index={i}
                hovered={hovered}
                setHovered={setHovered}
                totalItems={destinations.length}
                variant="horizontal"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-4 lg:-left-6" />
        <CarouselNext className="hidden md:flex -right-4 lg:-right-6" />
      </Carousel>
      <footer className="md:hidden flex justify-center">
        <Link
          to="/artikel"
          className={cn(
            buttonVariants({ variant: 'link', size: 'lg' }),
            'flex items-center gap-2   ',
          )}
        >
          Lihat Semua Destinasi
          <ArrowRight className="size-4" />
        </Link>
      </footer>
    </section>
  )
}

// Skeleton for Suspense fallback
export function DestinationSectionSkeleton() {
  return (
    <section className="container overflow-x-hidden lg:overflow-x-visible space-y-10">
      <header className="px-4 flex-row flex justify-between items-end">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-8 w-24" />
      </header>

      <div className="mx-4 flex gap-3 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="w-70 sm:w-80 h-95 shrink-0 rounded-2xl border overflow-hidden"
          >
            <Skeleton className="h-50 w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-4 pt-4">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default DestinationSection

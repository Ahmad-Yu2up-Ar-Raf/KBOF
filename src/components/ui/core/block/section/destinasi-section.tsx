'use client'

import { useState } from 'react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/fragments/shadcn-ui/carousel'
import { cn } from '@/lib/utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import { Link } from '@tanstack/react-router'
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton'
import { ArrowRight, ChevronRight } from 'lucide-react'

import { getFeaturedDestinationsQueryOptions } from '@/lib/query-options'

import DestinasiCard from '@/components/ui/fragments/custom-ui/card/destinasi-card'
import Autoplay from 'embla-carousel-autoplay'

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
    <section className="container px-5   space-y-8 overflow-x-hidden lg:overflow-x-visible">
      <header className=" flex-row  px-3  w-full  flex justify-between items-end">
        <div className="">
          <h1 className="pr-3 text-2xl md:text-3xl lg:text-4xl lg:items-center flex-col gap-1 lg:gap-1 flex lg:flex-row font-bold">
            {title}
            {props.label && (
              <Badge className="ml-3 bg-primary text-primary-foreground font-bold rounded-xl dark:text-white scale-110 -rotate-2 lg:-rotate-6 text-lg md:text-xl">
                {props.label}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground text-base">
            Lihat berbagai destinasi menarik
          </p>
        </div>
        {href && (
          <Link
            to="/destinasi"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'hidden md:flex items-center gap-2  ',
            )}
          >
            Lihat Semua
            <ArrowRight className="size-4" />
          </Link>
        )}
      </header>

      <Carousel
        className=""
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        opts={{
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
        {/* <CarouselPrevious />
        <CarouselNext /> */}
      </Carousel>
      <footer className="md:hidden flex justify-center">
        <Link
          to="/artikel"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'lg' }),
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

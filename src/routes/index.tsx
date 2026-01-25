import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { queryClient } from '@/components/provider/Provider'
import {
  getFeaturedArticlesQueryOptions,
  getFeaturedDestinationsQueryOptions,
} from '@/lib/query-options'
import HeroSection from '@/components/ui/core/block/section/hero-section'
import ArtikelSection, {
  ArtikelSectionSkeleton,
} from '@/components/ui/core/block/section/artikel-section'
import DestinationSection, {
  DestinationSectionSkeleton,
} from '@/components/ui/core/block/section/destinasi-section'
import KagetoriSection from '@/components/ui/core/block/section/kategori-section'
import About from '@/components/ui/core/block/section/tentang-section'
import CTASection from '@/components/ui/core/block/section/cta-section'
import { SiteHeader } from '@/components/ui/core/layout/nav/site-header'

export const Route = createFileRoute('/')({
  // Prefetch data for hero section, artikel section, and destination section on server
  loader: async () => {
    // Parallel prefetch for better performance
    await Promise.all([
      queryClient.ensureQueryData(getFeaturedDestinationsQueryOptions(8)),
      queryClient.ensureQueryData(getFeaturedArticlesQueryOptions(4)),
      queryClient.ensureQueryData(getFeaturedDestinationsQueryOptions(8)),
    ])
  },
  component: App,
})

function App() {
  return (
    <>
      <SiteHeader />
      <HeroSection />
      <About />
      <Suspense fallback={<DestinationSectionSkeleton />}>
        <DestinationSection />
      </Suspense>
      <KagetoriSection />
      <Suspense fallback={<ArtikelSectionSkeleton />}>
        <ArtikelSection />
      </Suspense>
      <CTASection />
    </>
  )
}

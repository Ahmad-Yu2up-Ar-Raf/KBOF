import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { queryClient } from '@/components/provider/Provider'
import {
  getLeaderboardTopQueryOptions,
  getFeaturedArticlesQueryOptions,
} from '@/lib/query-options'
import HeroSection from '@/components/ui/core/block/section/hero-section'
import ArtikelSection, {
  ArtikelSectionSkeleton,
} from '@/components/ui/core/block/section/artikel-section'
import DestinationSection from '@/components/ui/core/block/section/destinasi-section'

export const Route = createFileRoute('/')({
  // Prefetch data for hero section and artikel section on server
  loader: async () => {
    // Parallel prefetch for better performance
    await Promise.all([
      queryClient.ensureQueryData(getLeaderboardTopQueryOptions(4)),
      queryClient.ensureQueryData(getFeaturedArticlesQueryOptions(4)),
    ])
  },
  component: App,
})

function App() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<ArtikelSectionSkeleton />}>
        <ArtikelSection />
      </Suspense>
      <DestinationSection/>
    </>
  )
}

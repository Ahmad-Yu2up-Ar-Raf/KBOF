import HeroSection from '@/components/ui/core/block/hero-section'
import { createFileRoute } from '@tanstack/react-router'
import { queryClient } from '@/components/provider/Provider'
import { getLeaderboardTopQueryOptions } from '@/lib/query-options'

export const Route = createFileRoute('/')({
  // Prefetch top destinations for hero section
  loader: async () => {
    await queryClient.ensureQueryData(getLeaderboardTopQueryOptions(4))
  },
  component: App,
})

function App() {
  return (
    <>
      <HeroSection />
    </>
  )
}

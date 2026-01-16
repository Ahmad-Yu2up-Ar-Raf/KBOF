// =============================================================================
// LEADERBOARD HEADER - Leaderboard
// =============================================================================
// Header section with navigation, trophy animation, and title
// =============================================================================

import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useLottie } from 'lottie-react'

import trophyAnimation from '@/assets/animations/Winner Trophy Emoji.json'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'

// =============================================================================
// COMPONENT
// =============================================================================

export function LeaderboardHeader() {
  const { View: TrophyAnimation } = useLottie(
    {
      animationData: trophyAnimation,
      loop: true,
      autoplay: true,
    },
    { width: 170, height: 170 },
  )

  return (
    <>
      {/* Navigation */}

      {/* Header */}
      <header className="text-center space-y-2 md:space-y-4 pb-4 md:pb-5 border-b">
        <div className="flex justify-center">{TrophyAnimation}</div>
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight">
          Leaderboard Destinasi
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto px-2">
          Destinasi dengan dukungan terbanyak dari komunitas. Vote destinasi
          favoritmu untuk membantu mereka naik peringkat!
        </p>
      </header>
    </>
  )
}

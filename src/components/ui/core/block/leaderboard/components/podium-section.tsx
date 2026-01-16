// =============================================================================
// PODIUM SECTION - Leaderboard
// =============================================================================
// Top 3 destinations display section
// =============================================================================

import type { LeaderboardEntry } from '@/lib/query-options'

import { PodiumCard } from './podium-card'

// =============================================================================
// TYPES
// =============================================================================

export type PodiumSectionProps = {
  podium: LeaderboardEntry[]
  hoveredPodium: number | null
  setHoveredPodium: React.Dispatch<React.SetStateAction<number | null>>
}

// =============================================================================
// COMPONENT
// =============================================================================

export function PodiumSection({ podium, hoveredPodium, setHoveredPodium }: PodiumSectionProps) {
  if (podium.length === 0) return null

  return (
    <section className="relative py-4 md:py-8">
      <div className="flex items-end justify-center gap-3 md:gap-4 md:hover:gap-16 transition-all duration-300">
        {/* 2nd Place */}
        {podium[1] && (
          <div className="order-1 -mr-8 hover:mr-4 md:translate-y-4 -rotate-5 z-1 hover:scale-105 transition-all duration-300">
            <PodiumCard
              entry={podium[1]}
              position={2}
              size="large"
              index={1}
              hovered={hoveredPodium}
              setHovered={setHoveredPodium}
            />
          </div>
        )}

        {/* 1st Place - Larger and higher */}
        {podium[0] && (
          <div className="order-2 -translate-y-4 z-10 hover:mx-4 hover:scale-105 transition-all duration-300">
            <PodiumCard
              entry={podium[0]}
              position={1}
              size="larger"
              index={0}
              hovered={hoveredPodium}
              setHovered={setHoveredPodium}
            />
          </div>
        )}

        {/* 3rd Place */}
        {podium[2] && (
          <div className="order-3 -ml-8 hover:ml-4 md:translate-y-7 hover:translate-y-4 rotate-5 z-1 hover:scale-105 transition-all duration-300">
            <PodiumCard
              entry={podium[2]}
              position={3}
              size="large"
              index={2}
              hovered={hoveredPodium}
              setHovered={setHoveredPodium}
            />
          </div>
        )}
      </div>
    </section>
  )
}

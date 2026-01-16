// =============================================================================
// LEVEL SELECT SCREEN - Quiz Game
// =============================================================================
// Screen for selecting game difficulty level
// =============================================================================

import { motion } from 'framer-motion'

import type { Level } from '@/lib/game/types'
import { ANIMATION_DURATION } from '@/lib/game/constants'
import { GameHeader, GameContent, LevelSelect } from '@/components/game'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { ArrowLeft } from 'lucide-react'

// =============================================================================
// TYPES
// =============================================================================

export type LevelSelectScreenProps = {
  onSelect: (level: Level) => void
  onBack: () => void
}

// =============================================================================
// COMPONENT
// =============================================================================

export function LevelSelectScreen({
  onSelect,
  onBack,
}: LevelSelectScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full w-full"
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: ANIMATION_DURATION.normal }}
    >
      <GameHeader
        title="Pilih Level"
        className=' md:mb-10'
        subtitle="Ketuk salah satu kartu level untuk memulai permainan"
        leftAction={onBack}
      />

      <GameContent>
        <LevelSelect onSelect={onSelect} />

        {/* <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>💡 Tips: Mulai dari level Mudah untuk mengenal jenis pertanyaan</p>
        </div> */}
      </GameContent>
    </motion.div>
  )
}

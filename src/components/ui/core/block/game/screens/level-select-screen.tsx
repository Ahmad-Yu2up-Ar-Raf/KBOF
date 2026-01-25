// =============================================================================
// LEVEL SELECT SCREEN - Quiz Game
// =============================================================================
// Screen for selecting game difficulty level
// =============================================================================

import { motion } from 'framer-motion'

import type { Level } from '@/lib/game/types'
import { ANIMATION_DURATION } from '@/lib/game/constants'
import {
  GameContent,
  GameHeader,
  LevelSelect,
} from '@/components/ui/core/block/game/components'

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
      className="h-full gap-0 md:pb-0 pb-5 flex flex-col md:gap-8 w-full"
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: ANIMATION_DURATION.normal }}
    >
      <GameHeader
        title="Pilih Level Permainan"
        className=" pt-10  sticky bg-transparent  [&_nav]:left-0 md:mb-5 mb-10  "
        Emoji="🎯"
        variant="default"
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

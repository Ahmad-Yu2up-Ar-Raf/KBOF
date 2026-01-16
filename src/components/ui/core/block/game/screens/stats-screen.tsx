// =============================================================================
// STATS SCREEN - Quiz Game
// =============================================================================
// Game results screen with score breakdown and actions
// =============================================================================

import { motion } from 'framer-motion'

import type { Level, QuestionResult } from '@/lib/game/types'
import { ANIMATION_DURATION } from '@/lib/game/constants'
import { GameHeader, GameContent, StatsPanel } from '@/components/game'
import { useConfettiEffect } from '../../leaderboard/hooks'

// =============================================================================
// TYPES
// =============================================================================

export type StatsScreenProps = {
  results: QuestionResult[]
  level: Level
  isNewHighScore: boolean
  onPlayAgain: () => void
  onChangeLevel: () => void
  onBackToMenu: () => void
}

// =============================================================================
// COMPONENT
// =============================================================================

export function StatsScreen({
  results,
  level,
  isNewHighScore,
  onPlayAgain,
  onChangeLevel,
  onBackToMenu,
}: StatsScreenProps) {
  useConfettiEffect()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: ANIMATION_DURATION.normal }}
    >
      <GameHeader
        leftAction={onBackToMenu}
        Emoji="🏆"
        title="Permainan Selesai!"
        subtitle="Lihat hasil permainanmu"
      />

      <GameContent>
        <StatsPanel
          results={results}
          level={level}
          isNewHighScore={isNewHighScore}
          onPlayAgain={onPlayAgain}
          onChangeLevel={onChangeLevel}
          onBackToMenu={onBackToMenu}
        />
      </GameContent>
    </motion.div>
  )
}

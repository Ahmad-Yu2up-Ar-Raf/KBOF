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
import {
  Confetti,
  ConfettiRef,
} from '@/components/ui/fragments/custom-ui/animate-ui/confetti'
import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'
import { Home, Share, Share2 } from 'lucide-react'

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
  const confettiRef = useRef<ConfettiRef>(null)
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: ANIMATION_DURATION.normal }}
      >
        <GameHeader
          leftAction={onBackToMenu}
          Emoji={results.length > 0 ? '🎉' : '🏆'}
          title="Permainan Selesai!"
          className=" mb-6"
          rightAction={
            <Link
              to="/"
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'flex items-center gap-2 transition-all duration-300',
              )}
            >
              <Share2 className="size-4" />
              <span className="sr-only ">Jeda</span>
            </Link>
          }
          // subtitle="Lihat hasil permainanmu"
          variant="column"
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
      <Confetti
        ref={confettiRef}
        className="absolute top-0 left-0 z-0 size-full"
        // onMouseEnter={() => {
        //   confettiRef.current?.fire({})
        // }}
      />
    </>
  )
}

// =============================================================================
// GAME BLOCK - Main Quiz Game Component
// =============================================================================
// Orchestrates game flow between different screens
// =============================================================================

import * as React from 'react'
import { AnimatePresence } from 'framer-motion'

import { SiteHeader } from '../../layout/nav/site-header'
import {
  LevelSelectScreen,
  MenuScreen,
  PlayingScreen,
  StatsScreen,
} from './screens'
import type { GameScreen, Level } from '@/lib/game/types'
import type { calculateGameStats } from '@/lib/game/utils'
import { useQuizEngine } from '@/hooks/game/use-quiz-engine'
import { GameShell } from '@/components/ui/core/block/game/components'

// =============================================================================
// COMPONENT
// =============================================================================

export default function GameBlock() {
  // Screen state management
  const [screen, setScreen] = React.useState<GameScreen>('menu')
  const [selectedLevel, setSelectedLevel] = React.useState<Level | null>(null)
  const [isNewHighScore, setIsNewHighScore] = React.useState(false)

  // Game end handler
  const handleGameEnd = React.useCallback(
    (_stats: ReturnType<typeof calculateGameStats>, isNewHigh: boolean) => {
      setIsNewHighScore(isNewHigh)
      setScreen('stats')
    },
    [],
  )

  // Quiz engine hook
  const quizEngine = useQuizEngine({ onGameEnd: handleGameEnd })

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const handleStartGame = (level: Level) => {
    setSelectedLevel(level)
    quizEngine.startGame(level)
    setScreen('playing')
  }

  const handlePlayAgain = () => {
    if (selectedLevel) {
      quizEngine.startGame(selectedLevel)
      setScreen('playing')
    }
  }

  const handleChangeLevel = () => {
    quizEngine.resetGame()
    setScreen('menu')
  }

  const handleBackToMenu = () => {
    quizEngine.resetGame()
    setSelectedLevel(null)
    setScreen('menu')
  }

  // ==========================================================================
  // KEYBOARD SHORTCUTS
  // ==========================================================================

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && screen === 'playing') {
        quizEngine.pauseGame()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screen, quizEngine])

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <>
      {screen === 'menu' && <SiteHeader />}

      <GameShell>
        {screen === 'menu' && (
          <MenuScreen
            key="menu"
            onPlay={() => setScreen('level-select')}
            onShowHighScores={() => {}}
          />
        )}

        {screen === 'level-select' && (
          <LevelSelectScreen
            key="level-select"
            onSelect={handleStartGame}
            onBack={() => setScreen('menu')}
          />
        )}

        {screen === 'playing' && quizEngine.currentQuestion && (
          <PlayingScreen
            key="playing"
            quizEngine={quizEngine}
            onExitToLevelSelect={handleChangeLevel}
          />
        )}

        {screen === 'stats' && selectedLevel && (
          <StatsScreen
            key="stats"
            results={quizEngine.getResults()}
            level={selectedLevel}
            isNewHighScore={isNewHighScore}
            onPlayAgain={handlePlayAgain}
            onChangeLevel={handleChangeLevel}
            onBackToMenu={handleBackToMenu}
          />
        )}
      </GameShell>
    </>
  )
}

// =============================================================================
// PLAYING SCREEN - Quiz Game
// =============================================================================
// Active game screen with question display and controls
// =============================================================================

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Pause, Play } from 'lucide-react'

import type { useQuizEngine } from '@/hooks/game/use-quiz-engine'
import { ANIMATION_DURATION } from '@/lib/game/constants'
import { cn } from '@/lib/utils'
import { GameContent, GameHeader, QuestionCard } from '@/components/game'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'

import { PauseOverlay } from './pause-overlay'
import { ExitConfirmationDialog } from './exit-confirmation-dialog'

// =============================================================================
// TYPES
// =============================================================================

export type PlayingScreenProps = {
  quizEngine: ReturnType<typeof useQuizEngine>
  onExitToLevelSelect: () => void
}

// =============================================================================
// COMPONENT
// =============================================================================

export function PlayingScreen({
  quizEngine,
  onExitToLevelSelect,
}: PlayingScreenProps) {
  const [showExitDialog, setShowExitDialog] = React.useState(false)

  const {
    state,
    currentQuestion,
    level,
    config,
    submitAnswer,
    nextQuestion,
    useHint,
    pauseGame,
    resumeGame,
  } = quizEngine

  if (!currentQuestion) return null

  const isLastQuestion = state.currentIndex >= state.questions.length - 1

  // Handle exit button click - show confirmation
  const handleExitClick = () => {
    // Pause the game when showing exit dialog
    if (!state.isPaused) {
      pauseGame()
    }
    setShowExitDialog(true)
  }

  // Handle exit confirmation
  const handleExitConfirm = () => {
    setShowExitDialog(false)
    onExitToLevelSelect()
  }

  // Handle exit dialog close (cancel)
  const handleExitDialogClose = (open: boolean) => {
    setShowExitDialog(open)
    // Resume game if dialog is closed
    if (!open && state.isPaused) {
      resumeGame()
    }
  }

  // Handle pause/resume toggle
  const handlePauseToggle = () => {
    if (state.isPaused) {
      resumeGame()
    } else {
      pauseGame()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: ANIMATION_DURATION.normal }}
    >
      <GameHeader
        Emoji={config.emoji}
        title={config.displayName}
        // subtitle={`Soal ${state.currentIndex + 1} dari ${state.questions.length}`}
        leftAction={handleExitClick}
        rightAction={
          <Button
            onClick={handlePauseToggle}
            variant="outline"
            size="sm"
            className={cn(
              'flex items-center gap-2 transition-all duration-300',
              state.isPaused
                ? 'border-primary text-primary hover:bg-primary/10'
                : 'border-border',
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {state.isPaused ? (
                <motion.div
                  key="play"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <Play className="size-4 fill-current" />
                  <span className="sr-only md:not-sr-only">Lanjut</span>
                </motion.div>
              ) : (
                <motion.div
                  key="pause"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -180 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <Pause className="size-4" />
                  <span className="sr-only md:not-sr-only">Jeda</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        }
      />

      <GameContent>
        <QuestionCard
          question={currentQuestion}
          level={level}
          timeRemaining={state.timeRemaining}
          questionNumber={state.currentIndex + 1}
          totalQuestions={state.questions.length}
          selectedIndex={state.selectedIndex}
          showFeedback={state.showFeedback}
          feedback={state.feedback}
          usedHint={state.usedHint}
          isPaused={state.isPaused}
          isLastQuestion={isLastQuestion}
          onSubmitAnswer={submitAnswer}
          onNextQuestion={nextQuestion}
          onUseHint={useHint}
        />

        {/* Pause overlay */}
        <AnimatePresence>
          {state.isPaused && !showExitDialog && (
            <PauseOverlay onResume={resumeGame} />
          )}
        </AnimatePresence>

        {/* Exit confirmation dialog */}
        <ExitConfirmationDialog
          open={showExitDialog}
          onOpenChange={handleExitDialogClose}
          onConfirm={handleExitConfirm}
          currentQuestion={state.currentIndex + 1}
          totalQuestions={state.questions.length}
        />
      </GameContent>
    </motion.div>
  )
}

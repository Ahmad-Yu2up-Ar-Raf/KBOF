// =============================================================================
// PLAYING SCREEN - Quiz Game
// =============================================================================
// Active game screen with question display and controls
// =============================================================================

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Pause, Play } from 'lucide-react'

import { PauseOverlay } from './pause-overlay'
import { ExitConfirmationDialog } from './exit-confirmation-dialog'
import type { useQuizEngine } from '@/hooks/game/use-quiz-engine'
import { ANIMATION_DURATION } from '@/lib/game/constants'
import { cn } from '@/lib/utils'
import { GameContent, GameHeader, QuestionCard } from '@/components/game'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'

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
  const playSound = '/assets/audio/quiz-audio.mp3'
  const bgAudioRef = React.useRef<HTMLAudioElement | null>(null)

  // Create background audio on mount
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (!bgAudioRef.current) {
      const a = new Audio(playSound)
      a.loop = true
      a.preload = 'auto'
      a.volume = 0.69
      bgAudioRef.current = a
    }

    // play if not paused
    const tryPlay = async () => {
      try {
        if (!state.isPaused) {
          await bgAudioRef.current?.play()
        }
      } catch (e) {
        // ignore autoplay policy errors
      }
    }

    void tryPlay()

    return () => {
      // stop and cleanup on unmount
      try {
        bgAudioRef.current?.pause()
        if (bgAudioRef.current) bgAudioRef.current.currentTime = 0
      } catch (e) {}
      bgAudioRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Pause/resume background audio when game is paused/resumed
  React.useEffect(() => {
    const a = bgAudioRef.current
    if (!a) return
    if (state.isPaused) {
      try {
        a.pause()
      } catch {}
    } else {
      try {
        void a.play().catch(() => {})
      } catch {}
    }
  }, [state.isPaused])
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
        variant="column"
        // Emoji={config.emoji}
        className="md:mb-0"
        title={`${state.timeRemaining}`}
        titleClassName={'flex text-xs'}
        // subtitle={`Soal ${state.currentIndex + 1} dari ${state.questions.length}`}
        leftAction={handleExitClick}
        rightAction={
          <Button
            onClick={handlePauseToggle}
            variant="ghost"
            size="sm"
            className={cn(
              'flex items-center gap-2 transition-all duration-300',
              state.isPaused
                ? 'border-primary text-primary hover:bg-primary/10'
                : 'border-border',
            )}
          >
            {state.isPaused ? (
              <>
                <Play className="size-4 fill-current" />
                <span className="sr-only  ">Lanjut</span>
              </>
            ) : (
              <>
                <Pause className="size-4" />
                <span className="sr-only ">Jeda</span>
              </>
            )}
          </Button>
        }
      />

      <GameContent className="  space-y-5">
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

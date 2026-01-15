// FILE: src/components/game/question-card.tsx — Question display component

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Question, Level } from '@/lib/game/types'
import { ANIMATION_DURATION, KEYBOARD_SHORTCUTS, LEVEL_CONFIGS } from '@/lib/game/constants'
import { Card, CardContent, CardHeader } from '@/components/ui/fragments/shadcn-ui/card'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import { FragmentReveal } from './image-fragment'
import { TimerDisplay } from './timer-display'

type QuestionCardProps = {
  question: Question
  level: Level
  timeRemaining: number
  selectedIndex: number | null
  showFeedback: boolean
  feedback: { isCorrect: boolean; message: string; funFact?: string } | null
  usedHint: boolean
  isPaused: boolean
  onSelectAnswer: (index: number) => void
  onSubmit: () => void
  onUseHint: () => void
  questionNumber: number
  totalQuestions: number
}

export function QuestionCard({
  question,
  level,
  timeRemaining,
  selectedIndex,
  showFeedback,
  feedback,
  usedHint,
  isPaused,
  onSelectAnswer,
  onSubmit,
  onUseHint,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const config = LEVEL_CONFIGS[level]
  const showFullImage = config.imageDisplay === 'full' || showFeedback

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showFeedback || isPaused) return

      const key = e.key.toLowerCase()

      // Number keys for answer selection
      if (key >= '1' && key <= '4') {
        const index = parseInt(key) - 1
        if (index < question.choices.length) {
          onSelectAnswer(index)
        }
      }

      // Enter to submit
      if (key === 'enter' && selectedIndex !== null) {
        onSubmit()
      }

      // H for hint
      if (key === KEYBOARD_SHORTCUTS.hint && config.hintsEnabled && !usedHint) {
        onUseHint()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showFeedback, isPaused, selectedIndex, question.choices.length, config.hintsEnabled, usedHint, onSelectAnswer, onSubmit, onUseHint])

  return (
    <Card className="overflow-hidden">
      {/* Header with progress and timer */}
      <CardHeader className="border-b bg-muted/30 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              Soal {questionNumber}/{totalQuestions}
            </Badge>
            <Badge variant="secondary">{question.province}</Badge>
          </div>
          <TimerDisplay timeRemaining={timeRemaining} totalTime={config.defaultTimeLimitSec} isPaused={isPaused} className="w-40" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Image section */}
        <FragmentReveal
          src={question.fullImageUrl}
          alt={question.destinationName}
          fragments={question.fragmentConfigs}
          isRevealed={showFullImage}
          className="mx-auto max-w-2xl"
        />

        {/* Question prompt */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION_DURATION.normal, delay: 0.2 }}
        >
          <h2 className="text-center text-xl font-semibold md:text-2xl">{question.prompt}</h2>
        </motion.div>

        {/* Hint section */}
        {config.hintsEnabled && question.hint && (
          <div className="mx-auto max-w-lg text-center">
            {usedHint ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
              >
                💡 {question.hint}
              </motion.div>
            ) : (
              <Button variant="ghost" size="sm" onClick={onUseHint} disabled={showFeedback} className="text-muted-foreground">
                💡 Lihat petunjuk {config.hintPenalty > 0 && `(-${config.hintPenalty} poin)`}
              </Button>
            )}
          </div>
        )}

        {/* Answer choices */}
        <div className="mx-auto grid max-w-2xl gap-3 sm:grid-cols-2">
          {question.choices.map((choice, index) => (
            <AnswerButton
              key={`${question.id}-${index}`}
              choice={choice}
              index={index}
              isSelected={selectedIndex === index}
              isCorrect={index === question.correctIndex}
              showFeedback={showFeedback}
              disabled={showFeedback || isPaused}
              onClick={() => onSelectAnswer(index)}
            />
          ))}
        </div>

        {/* Submit button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={onSubmit}
            disabled={selectedIndex === null || showFeedback || isPaused}
            className="min-w-40"
          >
            {showFeedback ? 'Menunggu...' : 'Jawab'}
          </Button>
        </div>

        {/* Feedback overlay */}
        <AnimatePresence>
          {showFeedback && feedback && (
            <FeedbackDisplay isCorrect={feedback.isCorrect} message={feedback.message} funFact={feedback.funFact} />
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

type AnswerButtonProps = {
  choice: string
  index: number
  isSelected: boolean
  isCorrect: boolean
  showFeedback: boolean
  disabled: boolean
  onClick: () => void
}

function AnswerButton({ choice, index, isSelected, isCorrect, showFeedback, disabled, onClick }: AnswerButtonProps) {
  const getVariant = () => {
    if (showFeedback) {
      if (isCorrect) return 'correct'
      if (isSelected && !isCorrect) return 'incorrect'
    }
    if (isSelected) return 'selected'
    return 'default'
  }

  const variant = getVariant()

  const variantStyles = {
    default: 'border-border hover:border-primary/50 hover:bg-muted/50',
    selected: 'border-primary bg-primary/10',
    correct: 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    incorrect: 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300',
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: ANIMATION_DURATION.normal,
        delay: index * ANIMATION_DURATION.stagger + 0.3,
      }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all',
        variantStyles[variant],
        disabled && !showFeedback && 'cursor-not-allowed opacity-50'
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">{index + 1}</span>
      <span className="font-medium">{choice}</span>
      {showFeedback && isCorrect && <span className="ml-auto">✓</span>}
      {showFeedback && isSelected && !isCorrect && <span className="ml-auto">✗</span>}
    </motion.button>
  )
}

type FeedbackDisplayProps = {
  isCorrect: boolean
  message: string
  funFact?: string
}

function FeedbackDisplay({ isCorrect, message, funFact }: FeedbackDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: ANIMATION_DURATION.normal }}
      className={cn(
        'rounded-lg p-4 text-center',
        isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        className="mb-2 text-4xl"
      >
        {isCorrect ? '🎉' : '😔'}
      </motion.div>
      <p className={cn('font-semibold', isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300')}>
        {message}
      </p>
      {funFact && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-sm text-muted-foreground"
        >
          💡 {funFact}
        </motion.p>
      )}
    </motion.div>
  )
}

// FILE: src/components/game/question-card.tsx — Question display component

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, X } from 'lucide-react'
import { Badge } from '../ui/fragments/shadcn-ui/badge'
import { FragmentReveal } from './image-fragment'
import { TimerDisplay } from './timer-display'
import type { Level, Question } from '@/lib/game/types'
import { cn } from '@/lib/utils'
import {
  ANIMATION_DURATION,
  KEYBOARD_SHORTCUTS,
  LEVEL_CONFIGS,
} from '@/lib/game/constants'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from '@/components/ui/fragments/shadcn-ui/card'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/fragments/shadcn-ui/radio-group'
import { Label } from '@/components/ui/fragments/shadcn-ui/label'

type QuestionCardProps = {
  question: Question
  level: Level
  timeRemaining: number
  questionNumber: number
  totalQuestions: number
  selectedIndex: number | null
  showFeedback: boolean
  feedback: { isCorrect: boolean; message: string; funFact?: string } | null
  usedHint: boolean
  isPaused: boolean
  isLastQuestion: boolean
  onSubmitAnswer: (index: number) => void
  onNextQuestion: () => void
  onUseHint: () => void
}

export function QuestionCard({
  question,
  level,
  timeRemaining,
  questionNumber,
  totalQuestions,
  selectedIndex,
  showFeedback,
  feedback,
  usedHint,
  isPaused,
  isLastQuestion,
  onSubmitAnswer,
  onNextQuestion,
  onUseHint,
}: QuestionCardProps) {
  const config = LEVEL_CONFIGS[level]
  const showFullImage = config.imageDisplay === 'full' || showFeedback

  // Handle answer selection - directly submits the answer
  const handleSelectAnswer = React.useCallback(
    (index: number) => {
      if (showFeedback || isPaused) return
      onSubmitAnswer(index)
    },
    [showFeedback, isPaused, onSubmitAnswer],
  )
  // Audio management: preload two Audio objects (correct / incorrect)
  // Note: existing file in public is named `corect.mp3` (typo), keep compatibility
  const correctSoundUrl = '/assets/audio/corect.mp3'
  const incorrectSoundUrl = '/assets/audio/incorrect.mp3'
  const audioRef = React.useRef<{
    correct: HTMLAudioElement
    incorrect: HTMLAudioElement
  } | null>(null)

  // Create & preload audio elements once on mount
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (!audioRef.current) {
      const correct = new Audio(correctSoundUrl)
      const incorrect = new Audio(incorrectSoundUrl)
      // preload and sensible defaults
      correct.preload = 'auto'
      incorrect.preload = 'auto'
      correct.volume = 0.8
      incorrect.volume = 0.8
      audioRef.current = { correct, incorrect }
    }

    return () => {
      if (audioRef.current) {
        try {
          audioRef.current.correct.pause()
          audioRef.current.incorrect.pause()
        } catch {}
        audioRef.current = null
      }
    }
  }, [])
  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return

      const key = e.key.toLowerCase()

      // Number keys for answer selection (auto-submit)
      if (!showFeedback && key >= '1' && key <= '4') {
        const index = parseInt(key) - 1
        if (index < question.choices.length) {
          handleSelectAnswer(index)
        }
      }

      // Enter/Space to go to next question when showing feedback
      if (showFeedback && (key === 'enter' || key === ' ')) {
        e.preventDefault()
        onNextQuestion()
      }

      // H for hint
      if (key === KEYBOARD_SHORTCUTS.hint && config.hintsEnabled && !usedHint) {
        onUseHint()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    showFeedback,
    isPaused,
    question.choices.length,
    config.hintsEnabled,
    usedHint,
    handleSelectAnswer,
    onNextQuestion,
    onUseHint,
  ])
  // Play feedback sound when `showFeedback` becomes true
  React.useEffect(() => {
    if (!showFeedback || !feedback) return
    const a = audioRef.current
    if (!a) return
    const player = feedback.isCorrect ? a.correct : a.incorrect
    try {
      player.currentTime = 0
      void player.play().catch(() => {
        // fallback: if selected player fails, try the other one
        try {
          const other = feedback.isCorrect ? a.incorrect : a.correct
          other.currentTime = 0
          void other.play()
        } catch (e) {}
      })
    } catch (e) {
      // ignore synchronous errors
    }
  }, [showFeedback, feedback])

  return (
    <>
      <TimerDisplay
        timeRemaining={timeRemaining}
        totalTime={config.defaultTimeLimitSec}
        isPaused={isPaused}
        className="w-full"
      />
      <Card
        gradient={false}
        className="   max-w-lg  content-start   m-auto gap-4  p-0 bg-transparent border-0  shadow-none"
      >
        {/* Header with progress and timer */}
        <CardHeader className="   content-start h-full bg-transparent min-h-[20svh] overflow-hidden md:h-[15em]  gap-0 pb-0  rounded-4xl p-0">
          <FragmentReveal
            src={question.fullImageUrl}
            alt={question.destinationName}
            fragments={question.fragmentConfigs}
            isRevealed={showFullImage}
            className="mx-auto  "
          />
        </CardHeader>

        <CardContent
          className={cn(
            '  bg-transparent  border-0 space-y-4 shadow-none p-0',
            // showFeedback && feedback ? '  ' : ' space-y-8   ',
          )}
        >
          {/* Image section */}

          {/* Question prompt */}
          <motion.div
            className=" space-y-2  border-b-2 pb-5    "
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: ANIMATION_DURATION.normal, delay: 0.2 }}
          >
            <div className="flex items-center   gap-3">
              <Badge variant="outline" className="text-xs">
                Soal {questionNumber}/{totalQuestions}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {question.province}
              </Badge>
            </div>
            <h2 className="    md:leading-7 text-lg leading-6     font-semibold  md:text-2xl">
              {question.prompt}
            </h2>
          </motion.div>

          {/* Answer choices with RadioGroup */}
          <CardAction className="  space-y-3 w-full">
            <AnswerRadioGroup
              questionId={question.id}
              choices={question.choices}
              selectedIndex={selectedIndex}
              correctIndex={question.correctIndex}
              showFeedback={showFeedback}
              disabled={showFeedback || isPaused}
              onSelect={handleSelectAnswer}
            />

            {/* Next Question button - only shows after feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: ANIMATION_DURATION.normal,
                    delay: 0.3,
                  }}
                  className="flex md:justify-end w-full   justify-center pt-2"
                >
                  <Button
                    size="lg"
                    onClick={onNextQuestion}
                    className="w-full    md:w-fit  md:px-8 gap-2"
                  >
                    {isLastQuestion ? 'Lihat Hasil' : 'Soal Berikutnya'}
                    <ArrowRight className="size-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardAction>

          {/* Feedback overlay */}
        </CardContent>
      </Card>
    </>
  )
}

// =============================================================================
// ANSWER RADIO GROUP
// =============================================================================

type AnswerRadioGroupProps = {
  questionId: string
  choices: Array<string>
  selectedIndex: number | null
  correctIndex: number
  showFeedback: boolean
  disabled: boolean
  onSelect: (index: number) => void
}

function AnswerRadioGroup({
  questionId,
  choices,
  selectedIndex,
  correctIndex,
  showFeedback,
  disabled,
  onSelect,
}: AnswerRadioGroupProps) {
  const handleValueChange = (value: string) => {
    if (disabled) return
    const index = parseInt(value, 10)
    if (!isNaN(index)) {
      onSelect(index)
    }
  }

  // const [play, setPlay] = React.useState(false)

  return (
    <>
      <RadioGroup
        key={questionId}
        value={selectedIndex !== null ? String(selectedIndex) : undefined}
        onValueChange={handleValueChange}
        disabled={disabled}
        className="mx-auto grid w-full md:gap-1.5 gap-3 sm:grid-cols-2"
      >
        {choices.map((choice, index) => {
          const isSelected = selectedIndex === index
          const isCorrect = index === correctIndex

          // Determine visual state
          const getState = () => {
            if (showFeedback) {
              if (isCorrect) return 'correct'
              if (isSelected && !isCorrect) return 'incorrect'
            }
            if (isSelected) return 'selected'
            return 'default'
          }

          const state = getState()

          return (
            <>
              <motion.div
                key={`${questionId}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: ANIMATION_DURATION.normal,
                  delay: index * ANIMATION_DURATION.stagger + 0.3,
                }}
              >
                <Label
                  htmlFor={`answer-${questionId}-${index}`}
                  className={cn(
                    'flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 md:py-2.5 md:px-4 transition-all duration-200',
                    // Default state
                    state === 'default' &&
                      'border-border bg-background hover:border-primary/50 hover:bg-muted/50',
                    // Selected state
                    state === 'selected' &&
                      'border-primary bg-primary/10 ring-2 ring-primary/20',
                    // Correct answer feedback
                    state === 'correct' &&
                      'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
                    // Incorrect answer feedback
                    state === 'incorrect' &&
                      'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300',
                    // Disabled state
                    disabled &&
                      !showFeedback &&
                      'cursor-not-allowed opacity-50',
                  )}
                >
                  <RadioGroupItem
                    id={`answer-${questionId}-${index}`}
                    value={String(index)}
                    disabled={disabled}
                    className={cn(
                      'shrink-0 transition-all',
                      state === 'selected' && 'border-primary text-primary',
                      state === 'correct' &&
                        'border-emerald-500 text-emerald-500',
                      state === 'incorrect' && 'border-red-500 text-red-500',
                    )}
                  />
                  <span className="flex-1 font-medium leading-snug md:line-clamp-1">
                    {choice}
                  </span>

                  {/* Feedback icons */}
                  {showFeedback && isCorrect && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 25,
                      }}
                    >
                      <Check className="size-5 text-emerald-500" />
                    </motion.div>
                  )}
                  {showFeedback && isSelected && !isCorrect && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 25,
                      }}
                    >
                      <X className="size-5 text-red-500" />
                    </motion.div>
                  )}
                </Label>
              </motion.div>
            </>
          )
        })}
      </RadioGroup>
    </>
  )
}

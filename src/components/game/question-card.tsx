// FILE: src/components/game/question-card.tsx — Question display component

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Question, Level } from '@/lib/game/types'
import {
  ANIMATION_DURATION,
  KEYBOARD_SHORTCUTS,
  LEVEL_CONFIGS,
} from '@/lib/game/constants'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/fragments/shadcn-ui/card'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/fragments/shadcn-ui/radio-group'
import { Label } from '@/components/ui/fragments/shadcn-ui/label'
import { FragmentReveal } from './image-fragment'
import { Badge } from '../ui/fragments/shadcn-ui/badge'
import { TimerDisplay } from './timer-display'

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

  return (
    <Card className=" max-w-md   content-start  m-auto gap-4  p-0 bg-background border-0  shadow-none">
      {/* Header with progress and timer */}
      <CardHeader className=" content-start h-full bg-background min-h-[20svh] overflow-hidden md:h-[15em]  gap-0 pb-0  p-0">
        <TimerDisplay
          timeRemaining={timeRemaining}
          totalTime={config.defaultTimeLimitSec}
          isPaused={isPaused}
          className="w-full"
        />
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
          '  bg-background  border-0  shadow-none p-0',
          showFeedback && feedback ? ' space-y-4 ' : ' space-y-8   ',
        )}
      >
        {/* Image section */}

        {/* Question prompt */}
        <motion.div
          className=" space-y-2  border-b-2 pb-5  max-w-md  "
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
          <h2 className="    md:leading-8 text-lg leading-6     font-semibold  md:text-2xl">
            {question.prompt}
          </h2>
        </motion.div>
        <AnimatePresence>
          {showFeedback && feedback && (
            <FeedbackDisplay
              isCorrect={feedback.isCorrect}
              message={feedback.message}
              funFact={feedback.funFact}
            />
          )}
        </AnimatePresence>

        {/* Answer choices with RadioGroup */}
        <div className="  space-y-3 w-full">
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
                transition={{ duration: ANIMATION_DURATION.normal, delay: 0.3 }}
                className="flex   justify-center pt-2"
              >
                <Button
                  size="lg"
                  onClick={onNextQuestion}
                  className="w-full     md:px-8 gap-2"
                >
                  {isLastQuestion ? 'Lihat Hasil' : 'Soal Berikutnya'}
                  <ArrowRight className="size-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Feedback overlay */}
      </CardContent>
    </Card>
  )
}

// =============================================================================
// ANSWER RADIO GROUP
// =============================================================================

type AnswerRadioGroupProps = {
  questionId: string
  choices: string[]
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

  return (
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
                disabled && !showFeedback && 'cursor-not-allowed opacity-50',
              )}
            >
              <RadioGroupItem
                id={`answer-${questionId}-${index}`}
                value={String(index)}
                disabled={disabled}
                className={cn(
                  'shrink-0 transition-all',
                  state === 'selected' && 'border-primary text-primary',
                  state === 'correct' && 'border-emerald-500 text-emerald-500',
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
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <Check className="size-5 text-emerald-500" />
                </motion.div>
              )}
              {showFeedback && isSelected && !isCorrect && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <X className="size-5 text-red-500" />
                </motion.div>
              )}
            </Label>
          </motion.div>
        )
      })}
    </RadioGroup>
  )
}

// =============================================================================
// FEEDBACK DISPLAY
// =============================================================================

type FeedbackDisplayProps = {
  isCorrect: boolean
  message: string
  funFact?: string
}

function FeedbackDisplay({
  isCorrect,
  message: _message,
  funFact,
}: FeedbackDisplayProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: ANIMATION_DURATION.normal }}
        className={cn(
          'font-medium rounded-2xl max-w-md   border py-2 px-3 ',
          isCorrect
            ? 'text-emerald-700 dark:text-emerald-300'
            : 'text-red-700 dark:text-red-300',

          isCorrect
            ? 'bg-emerald-50 dark:bg-emerald-900/20'
            : 'bg-red-50 dark:bg-red-900/20',
        )}
      >
        <div className=" flex  gap-2  items-start   ">
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="  text-sm   "
          >
            {isCorrect ? '🎉' : '😔'}
          </motion.p>{' '}
          <p className="leading-3">
            <span className="text-xs  md:text-sm  ">{_message}</span>
          </p>
        </div>
        {funFact && (
          <div className=" flex  gap-2  items-center   ">
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="  text-sm   "
            >
              💡
            </motion.p>{' '}
            <p className="leading-2">
              <span className="text-xs  md:text-sm">FuntFact : {funFact}</span>
            </p>
          </div>
        )}
      </motion.div>
    </>
  )
}

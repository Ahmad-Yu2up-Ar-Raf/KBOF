// FILE: src/lib/game/constants.ts — Game configuration constants

import type { Level, LevelConfig } from './types'

/**
 * Cookie configuration
 */
export const COOKIE_CONFIG = {
  name: 'suasana_quiz_highscore',
  maxAge: 60 * 60 * 24 * 365, // 1 year in seconds
} as const

/**
 * Timer visual thresholds (in seconds)
 */
export const TIMER_THRESHOLDS = {
  warning: 5,
  critical: 3,
} as const

/**
 * Feedback timing
 */
export const FEEDBACK_DELAY_MS = 1200

/**
 * Time bonus configuration
 */
export const TIME_BONUS = {
  threshold: 0.5, // 50% of time remaining
  multiplier: 1.25, // 25% bonus
} as const

/**
 * Animation durations (in seconds for framer-motion)
 */
export const ANIMATION_DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  stagger: 0.05,
} as const

/**
 * Level configurations
 */
export const LEVEL_CONFIGS: Record<Level, LevelConfig> = {
  easy: {
    id: 'easy',
    displayName: 'Mudah',
    emoji: '🌱',
    description:
      'Gambar penuh dengan petunjuk. Cocok untuk pemula!',
    questionsPerGame: 5,
    defaultTimeLimitSec: 20,
    basePointsPerQuestion: 10,
    hintsEnabled: true,
    hintPenalty: 0,
    imageDisplay: 'full',
    color: 'emerald',
    difficulty: 1,
  },
  medium: {
    id: 'medium',
    displayName: 'Sedang',
    emoji: '🌿',
    description: 'Gambar terpotong dengan beberapa fragmen. Tantang dirimu!',
    questionsPerGame: 5,
    defaultTimeLimitSec: 25,
    basePointsPerQuestion: 20,
    hintsEnabled: true,
    hintPenalty: 5,
    imageDisplay: 'fragments',
    fragmentCount: 3,
    fragmentSizeRange: { min: 25, max: 40 },
    color: 'amber',
    difficulty: 2,
  },
  hard: {
    id: 'hard',
    displayName: 'Sulit',
    emoji: '🔥',
    description: 'Satu fragmen kecil saja  yang sulit. Untuk sang ahli! ',
    questionsPerGame: 5,
    defaultTimeLimitSec: 30,
    basePointsPerQuestion: 30,
    hintsEnabled: false,
    hintPenalty: 0,
    imageDisplay: 'fragment',
    fragmentCount: 1,
    fragmentSizeRange: { min: 15, max: 25 },
    color: 'red',
    difficulty: 3,
  },
} as const

/**
 * Keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  answer1: '1',
  answer2: '2',
  answer3: '3',
  answer4: '4',
  submit: 'Enter',
  hint: 'h',
  pause: 'Escape',
} as const

/**
 * Game result messages based on accuracy
 */
export const RESULT_MESSAGES: {
  min: number
  message: string
  emoji: string
}[] = [
  {
    min: 100,
    message: 'Luar Biasa! Kamu ahli destinasi Indonesia!',
    emoji: '🏆',
  },
  {
    min: 80,
    message: 'Hebat! Pengetahuanmu tentang Indonesia sangat baik!',
    emoji: '🌟',
  },
  {
    min: 60,
    message: 'Bagus! Terus eksplorasi keindahan Indonesia!',
    emoji: '✨',
  },
  {
    min: 40,
    message: 'Lumayan! Masih banyak yang bisa dipelajari.',
    emoji: '📚',
  },
  {
    min: 0,
    message: 'Jangan menyerah! Coba lagi untuk hasil lebih baik.',
    emoji: '💪',
  },
]

/**
 * Get result message based on accuracy percentage
 */
export function getResultMessage(accuracy: number): {
  message: string
  emoji: string
} {
  const result = RESULT_MESSAGES.find((r) => accuracy >= r.min)
  return result || RESULT_MESSAGES[RESULT_MESSAGES.length - 1]
}

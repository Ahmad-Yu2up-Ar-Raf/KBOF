// FILE: src/lib/game/types.ts — TypeScript type definitions for Quiz Game
// All types are strict - no `any` usage

/**
 * Game difficulty levels
 */
export type Level = 'easy' | 'medium' | 'hard'

/**
 * Configuration for image fragment display (used in medium/hard levels)
 */
export type FragmentConfig = {
  id: string
  xPerc: number // X position as percentage (0-100)
  yPerc: number // Y position as percentage (0-100)
  wPerc: number // Width as percentage (0-100)
  hPerc: number // Height as percentage (0-100)
}

/**
 * Question categories for Indonesia destinations
 */
export type QuestionCategory =
  | 'wisata-alam'
  | 'wisata-budaya'
  | 'wisata-sejarah'
  | 'kuliner-tradisional'
  | 'situs-sejarah'
  | 'kesenian-daerah'

/**
 * Single quiz question structure
 */
export type Question = {
  id: string
  level: Level
  destinationId: string
  destinationName: string
  province: string
  category: QuestionCategory
  prompt: string
  fullImageUrl: string
  choices: Array<string>
  correctIndex: number
  hint?: string
  fragmentConfigs?: Array<FragmentConfig>
  timeLimitSec?: number
  funFact?: string
  description?: string
  imageCredit?: string
  tags?: Array<string>
}

/**
 * Result of answering a single question
 */
export type QuestionResult = {
  questionId: string
  selectedIndex: number | null
  correctIndex: number
  earnedPoints: number
  timeLeftSec: number
  wasTimeout: boolean
  usedHint: boolean
}

/**
 * Complete game result after finishing all questions
 */
export type GameResult = {
  totalScore: number
  maxPossibleScore: number
  correctCount: number
  totalQuestions: number
  accuracy: number
  averageTimePerQuestion: number
  level: Level
  timestamp: string
  questionResults: Array<QuestionResult>
}

/**
 * High score record stored in cookies
 */
export type HighScoreRecord = {
  score: number
  level: Level
  correct: number
  total: number
  accuracy: number
  timestamp: string
  gameId: string
}

/**
 * Level configuration with all game mechanics
 */
export type LevelConfig = {
  id: Level
  displayName: string
  emoji: string
  description: string
  questionsPerGame: number
  defaultTimeLimitSec: number
  basePointsPerQuestion: number
  hintsEnabled: boolean
  hintPenalty: number
  imageDisplay: 'full' | 'fragments' | 'fragment'
  fragmentCount?: number
  fragmentSizeRange?: { min: number; max: number }
  color: string
  difficulty: number
}

/**
 * Game screen states
 */
export type GameScreen =
  | 'menu'
  | 'level-select'
  | 'loading'
  | 'playing'
  | 'stats'

/**
 * Quiz engine state managed by useReducer
 */
export type QuizState = {
  questions: Array<Question>
  currentIndex: number
  results: Array<QuestionResult>
  timeRemaining: number
  isAnswering: boolean
  showFeedback: boolean
  feedback: { isCorrect: boolean; message: string; funFact?: string } | null
  selectedIndex: number | null
  usedHint: boolean
  isPaused: boolean
}

/**
 * Quiz engine actions
 */
export type QuizAction =
  | { type: 'START'; questions: Array<Question>; timeLimit: number }
  | { type: 'SELECT_ANSWER'; index: number }
  | { type: 'SUBMIT_ANSWER' }
  | { type: 'TIMEOUT' }
  | { type: 'NEXT_QUESTION'; timeLimit: number }
  | { type: 'TICK' }
  | {
      type: 'SHOW_FEEDBACK'
      isCorrect: boolean
      message: string
      funFact?: string
    }
  | { type: 'HIDE_FEEDBACK' }
  | { type: 'USE_HINT' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET' }

/**
 * Timer visual state
 */
export type TimerState = 'normal' | 'warning' | 'critical'

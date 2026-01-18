// FILE: src/lib/game/utils.ts — Utility functions for Quiz Game

import { COOKIE_CONFIG, LEVEL_CONFIGS, TIME_BONUS } from './constants'
import type {
  FragmentConfig,
  HighScoreRecord,
  Level,
  Question,
  QuestionResult,
} from './types'

/**
 * Fisher-Yates shuffle algorithm for arrays
 */
export function shuffleArray<T>(array: Array<T>): Array<T> {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Pick random questions for a game session
 */
export function pickQuestions(
  allQuestions: Array<Question>,
  level: Level,
  count: number,
): Array<Question> {
  const levelQuestions = allQuestions.filter((q) => q.level === level)
  const shuffled = shuffleArray(levelQuestions)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

/**
 * Shuffle choices while tracking the new correct index
 */
export function shuffleChoices(
  choices: Array<string>,
  correctIndex: number,
): { choices: Array<string>; correctIndex: number } {
  const correctAnswer = choices[correctIndex]
  const shuffled = shuffleArray(choices)
  const newCorrectIndex = shuffled.indexOf(correctAnswer)
  return { choices: shuffled, correctIndex: newCorrectIndex }
}

/**
 * Calculate points for a question
 */
export function calculatePoints(
  basePoints: number,
  timeRemaining: number,
  totalTime: number,
  isCorrect: boolean,
  usedHint: boolean,
  hintPenalty: number,
): number {
  if (!isCorrect) return 0

  let points = basePoints

  // Time bonus if > 50% time remaining
  const timePercentage = timeRemaining / totalTime
  if (timePercentage > TIME_BONUS.threshold) {
    points = Math.floor(points * TIME_BONUS.multiplier)
  }

  // Hint penalty
  if (usedHint) {
    points = Math.max(0, points - hintPenalty)
  }

  return points
}

/**
 * Format time in MM:SS or just SS format
 */
export function formatTime(seconds: number): string {
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  return `${seconds}s`
}

/**
 * Generate a unique game ID
 */
export function generateGameId(): string {
  return `game_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Generate random fragment configurations for a question
 */
export function generateFragmentConfigs(
  count: number,
  sizeRange: { min: number; max: number },
): Array<FragmentConfig> {
  const fragments: Array<FragmentConfig> = []
  const usedAreas: Array<{ x: number; y: number; w: number; h: number }> = []

  for (let i = 0; i < count; i++) {
    let attempts = 0
    const maxAttempts = 50

    while (attempts < maxAttempts) {
      const w = Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min
      const h = Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min
      const x = Math.random() * (100 - w)
      const y = Math.random() * (100 - h)

      // Check for overlaps (simple approach)
      const hasOverlap = usedAreas.some((area) => {
        return !(
          x + w < area.x ||
          x > area.x + area.w ||
          y + h < area.y ||
          y > area.y + area.h
        )
      })

      if (!hasOverlap) {
        const fragment: FragmentConfig = {
          id: `frag_${i}`,
          xPerc: Math.round(x * 100) / 100,
          yPerc: Math.round(y * 100) / 100,
          wPerc: Math.round(w * 100) / 100,
          hPerc: Math.round(h * 100) / 100,
        }
        fragments.push(fragment)
        usedAreas.push({ x, y, w, h })
        break
      }

      attempts++
    }
  }

  return fragments
}

// ============================================================================
// Cookie Helpers
// ============================================================================

/**
 * Get high scores from cookies
 */
export function getHighScores(): Array<HighScoreRecord> {
  if (typeof document === 'undefined') return []

  try {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${COOKIE_CONFIG.name}=`))
      ?.split('=')[1]

    if (!cookieValue) return []

    const decoded = decodeURIComponent(cookieValue)
    const parsed = JSON.parse(decoded) as unknown

    if (!Array.isArray(parsed)) return []

    return parsed as Array<HighScoreRecord>
  } catch {
    return []
  }
}

/**
 * Get high score for a specific level
 */
export function getHighScoreForLevel(level: Level): HighScoreRecord | null {
  const scores = getHighScores()
  const levelScores = scores.filter((s) => s.level === level)

  if (levelScores.length === 0) return null

  return levelScores.reduce((best, current) =>
    current.score > best.score ? current : best,
  )
}

/**
 * Save a new high score to cookies
 */
export function saveHighScore(record: HighScoreRecord): void {
  if (typeof document === 'undefined') return

  try {
    const existing = getHighScores()
    const updated = [...existing, record]

    // Keep only top 3 scores per level
    const grouped: Record<Level, Array<HighScoreRecord>> = {
      easy: [],
      medium: [],
      hard: [],
    }

    updated.forEach((score) => {
      grouped[score.level].push(score)
    })

    const trimmed: Array<HighScoreRecord> = []
    for (const level of Object.keys(grouped) as Array<Level>) {
      const sorted = grouped[level].sort((a, b) => b.score - a.score)
      trimmed.push(...sorted.slice(0, 3))
    }

    const encoded = encodeURIComponent(JSON.stringify(trimmed))
    document.cookie = `${COOKIE_CONFIG.name}=${encoded}; max-age=${COOKIE_CONFIG.maxAge}; path=/; SameSite=Lax`
  } catch {
    console.error('Failed to save high score')
  }
}

/**
 * Check if score is a new high score for the level
 */
export function isNewHighScore(score: number, level: Level): boolean {
  const current = getHighScoreForLevel(level)
  return !current || score > current.score
}

/**
 * Clear all high scores (for testing)
 */
export function clearHighScores(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${COOKIE_CONFIG.name}=; max-age=0; path=/`
}

// ============================================================================
// Game Result Helpers
// ============================================================================

/**
 * Calculate game statistics from results
 */
export function calculateGameStats(
  results: Array<QuestionResult>,
  level: Level,
) {
  const config = LEVEL_CONFIGS[level]
  const totalQuestions = results.length
  const correctCount = results.filter(
    (r) => r.selectedIndex === r.correctIndex && !r.wasTimeout,
  ).length
  const totalScore = results.reduce((sum, r) => sum + r.earnedPoints, 0)
  const maxPossibleScore =
    totalQuestions *
    Math.floor(config.basePointsPerQuestion * TIME_BONUS.multiplier)
  const accuracy =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  const totalTimeSpent = results.reduce((sum, r) => {
    const timeLimit = config.defaultTimeLimitSec
    return sum + (timeLimit - r.timeLeftSec)
  }, 0)
  const averageTimePerQuestion =
    totalQuestions > 0 ? Math.round(totalTimeSpent / totalQuestions) : 0

  return {
    totalScore,
    maxPossibleScore,
    correctCount,
    totalQuestions,
    accuracy,
    averageTimePerQuestion,
  }
}

// ============================================================================
// CSS Fragment Helpers
// ============================================================================

/**
 * Generate CSS clip-path for fragment display
 */
export function generateClipPath(config: FragmentConfig): string {
  const { xPerc, yPerc, wPerc, hPerc } = config
  const x1 = xPerc
  const y1 = yPerc
  const x2 = xPerc + wPerc
  const y2 = yPerc + hPerc

  return `polygon(${x1}% ${y1}%, ${x2}% ${y1}%, ${x2}% ${y2}%, ${x1}% ${y2}%)`
}

/**
 * Generate CSS for fragment mask (multiple fragments)
 */
export function generateFragmentMask(configs: Array<FragmentConfig>): string {
  const gradients = configs.map((config) => {
    const { xPerc, yPerc, wPerc, hPerc } = config
    return `linear-gradient(black, black) ${xPerc}% ${yPerc}% / ${wPerc}% ${hPerc}% no-repeat`
  })

  return gradients.join(', ')
}

// FILE: src/hooks/game/use-quiz-engine.ts — Core game logic with useReducer

import { useReducer, useCallback, useEffect, useRef } from 'react'
import type {
  QuizState,
  QuizAction,
  QuestionResult,
  Level,
} from '@/lib/game/types'
import {
  calculatePoints,
  shuffleChoices,
  pickQuestions,
  generateGameId,
  saveHighScore,
  isNewHighScore,
  calculateGameStats,
} from '@/lib/game/utils'
import { LEVEL_CONFIGS } from '@/lib/game/constants'
import { QUIZ_QUESTIONS } from '@/lib/game/questions'

const initialState: QuizState = {
  questions: [],
  currentIndex: 0,
  results: [],
  timeRemaining: 0,
  isAnswering: false,
  showFeedback: false,
  feedback: null,
  selectedIndex: null,
  usedHint: false,
  isPaused: false,
}

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START':
      return {
        ...initialState,
        questions: action.questions,
        timeRemaining: action.timeLimit,
        isAnswering: true,
      }

    case 'SELECT_ANSWER':
      if (state.showFeedback || !state.isAnswering) return state
      return {
        ...state,
        selectedIndex: action.index,
      }

    case 'SUBMIT_ANSWER': {
      if (state.showFeedback || !state.isAnswering) return state
      return {
        ...state,
        isAnswering: false,
      }
    }

    case 'TIMEOUT':
      if (!state.isAnswering) return state
      return {
        ...state,
        isAnswering: false,
        selectedIndex: null,
      }

    case 'SHOW_FEEDBACK':
      return {
        ...state,
        showFeedback: true,
        feedback: {
          isCorrect: action.isCorrect,
          message: action.message,
          funFact: action.funFact,
        },
      }

    case 'HIDE_FEEDBACK':
      return {
        ...state,
        showFeedback: false,
        feedback: null,
      }

    case 'NEXT_QUESTION':
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        timeRemaining: action.timeLimit,
        isAnswering: true,
        showFeedback: false,
        feedback: null,
        selectedIndex: null,
        usedHint: false,
      }

    case 'TICK':
      if (!state.isAnswering || state.isPaused) return state
      return {
        ...state,
        timeRemaining: Math.max(0, state.timeRemaining - 1),
      }

    case 'USE_HINT':
      return {
        ...state,
        usedHint: true,
      }

    case 'PAUSE':
      return {
        ...state,
        isPaused: true,
      }

    case 'RESUME':
      return {
        ...state,
        isPaused: false,
      }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

type UseQuizEngineProps = {
  onGameEnd?: (
    stats: ReturnType<typeof calculateGameStats>,
    isNewHigh: boolean,
  ) => void
}

export function useQuizEngine({ onGameEnd }: UseQuizEngineProps = {}) {
  const [state, dispatch] = useReducer(quizReducer, initialState)
  const levelRef = useRef<Level>('easy')
  const resultsRef = useRef<QuestionResult[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const gameIdRef = useRef<string>('')

  const config = LEVEL_CONFIGS[levelRef.current]
  const currentQuestion = state.questions[state.currentIndex]
  const isGameOver =
    state.currentIndex >= state.questions.length &&
    state.questions.length > 0 &&
    !state.isAnswering
  const progress =
    state.questions.length > 0
      ? ((state.currentIndex + 1) / state.questions.length) * 100
      : 0

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Timer tick
  useEffect(() => {
    if (state.isAnswering && !state.isPaused) {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK' })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [state.isAnswering, state.isPaused])

  // Handle timeout
  useEffect(() => {
    if (state.timeRemaining === 0 && state.isAnswering) {
      handleTimeout()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.timeRemaining, state.isAnswering])

  const startGame = useCallback((level: Level) => {
    levelRef.current = level
    resultsRef.current = []
    gameIdRef.current = generateGameId()

    const levelConfig = LEVEL_CONFIGS[level]
    const questions = pickQuestions(
      QUIZ_QUESTIONS,
      level,
      levelConfig.questionsPerGame,
    )

    // Shuffle choices for each question
    const shuffledQuestions = questions.map((q) => {
      const { choices, correctIndex } = shuffleChoices(
        q.choices,
        q.correctIndex,
      )
      return { ...q, choices, correctIndex }
    })

    dispatch({
      type: 'START',
      questions: shuffledQuestions,
      timeLimit: levelConfig.defaultTimeLimitSec,
    })
  }, [])

  // Submit answer - accepts index directly to avoid stale closure issues
  const submitAnswer = useCallback(
    (answerIndex: number) => {
      if (!currentQuestion || state.showFeedback) return

      // First select the answer (for visual feedback)
      dispatch({ type: 'SELECT_ANSWER', index: answerIndex })
      dispatch({ type: 'SUBMIT_ANSWER' })

      const isCorrect = answerIndex === currentQuestion.correctIndex
      const levelConfig = LEVEL_CONFIGS[levelRef.current]
      const points = calculatePoints(
        levelConfig.basePointsPerQuestion,
        state.timeRemaining,
        levelConfig.defaultTimeLimitSec,
        isCorrect,
        state.usedHint,
        levelConfig.hintPenalty,
      )

      const result: QuestionResult = {
        questionId: currentQuestion.id,
        selectedIndex: answerIndex,
        correctIndex: currentQuestion.correctIndex,
        earnedPoints: points,
        timeLeftSec: state.timeRemaining,
        wasTimeout: false,
        usedHint: state.usedHint,
      }

      resultsRef.current = [...resultsRef.current, result]

      const message = isCorrect
        ? 'Benar! 🎉'
        : `Salah! Jawaban yang benar: ${currentQuestion.choices[currentQuestion.correctIndex]}`

      dispatch({
        type: 'SHOW_FEEDBACK',
        isCorrect,
        message,
        funFact: isCorrect ? currentQuestion.funFact : undefined,
      })

      // No auto-advance - user will click "Next" button
    },
    [state.timeRemaining, state.usedHint, state.showFeedback, currentQuestion],
  )

  const handleTimeout = useCallback(() => {
    if (!currentQuestion) return

    dispatch({ type: 'TIMEOUT' })

    const result: QuestionResult = {
      questionId: currentQuestion.id,
      selectedIndex: null,
      correctIndex: currentQuestion.correctIndex,
      earnedPoints: 0,
      timeLeftSec: 0,
      wasTimeout: true,
      usedHint: state.usedHint,
    }

    resultsRef.current = [...resultsRef.current, result]

    dispatch({
      type: 'SHOW_FEEDBACK',
      isCorrect: false,
      message: `Waktu habis! Jawaban yang benar: ${currentQuestion.choices[currentQuestion.correctIndex]}`,
    })

    // No auto-advance - user will click "Next" button
  }, [currentQuestion, state.usedHint])

  const advanceToNext = useCallback(() => {
    dispatch({ type: 'HIDE_FEEDBACK' })

    const levelConfig = LEVEL_CONFIGS[levelRef.current]
    const nextIndex = state.currentIndex + 1

    if (nextIndex >= state.questions.length) {
      // Game over - save high score
      const stats = calculateGameStats(resultsRef.current, levelRef.current)
      const isNewHigh = isNewHighScore(stats.totalScore, levelRef.current)

      if (isNewHigh || stats.totalScore > 0) {
        saveHighScore({
          score: stats.totalScore,
          level: levelRef.current,
          correct: stats.correctCount,
          total: stats.totalQuestions,
          accuracy: stats.accuracy,
          timestamp: new Date().toISOString(),
          gameId: gameIdRef.current,
        })
      }

      onGameEnd?.(stats, isNewHigh)
    } else {
      dispatch({
        type: 'NEXT_QUESTION',
        timeLimit: levelConfig.defaultTimeLimitSec,
      })
    }
  }, [state.currentIndex, state.questions.length, onGameEnd])

  const useHint = useCallback(() => {
    dispatch({ type: 'USE_HINT' })
  }, [])

  const pauseGame = useCallback(() => {
    dispatch({ type: 'PAUSE' })
  }, [])

  const resumeGame = useCallback(() => {
    dispatch({ type: 'RESUME' })
  }, [])

  const resetGame = useCallback(() => {
    resultsRef.current = []
    dispatch({ type: 'RESET' })
  }, [])

  const getResults = useCallback(() => resultsRef.current, [])

  const getGameStats = useCallback(() => {
    return calculateGameStats(resultsRef.current, levelRef.current)
  }, [])

  return {
    state,
    config,
    currentQuestion,
    isGameOver,
    progress,
    level: levelRef.current,
    startGame,
    submitAnswer,
    nextQuestion: advanceToNext,
    useHint,
    pauseGame,
    resumeGame,
    resetGame,
    getResults,
    getGameStats,
  }
}

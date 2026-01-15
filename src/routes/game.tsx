// FILE: src/routes/game/index.tsx — Main Quiz Game route

import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import type { Level, GameScreen, QuestionResult } from '@/lib/game/types'
import { ANIMATION_DURATION } from '@/lib/game/constants'
import { calculateGameStats } from '@/lib/game/utils'
import { useQuizEngine } from '@/hooks/game/use-quiz-engine'
import {
  GameShell,
  GameHeader,
  GameContent,
  LevelSelect,
  QuestionCard,
  StatsPanel,
  HighScoreDisplay,
} from '@/components/game'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'

export const Route = createFileRoute('/game')({
  component: GamePage,
  head: () => ({
    meta: [
      {
        title: 'Quiz Game | Suasana',
      },
      {
        name: 'description',
        content:
          'Uji pengetahuanmu tentang destinasi wisata Indonesia dengan quiz interaktif!',
      },
    ],
  }),
})

function GamePage() {
  const [screen, setScreen] = React.useState<GameScreen>('menu')
  const [selectedLevel, setSelectedLevel] = React.useState<Level | null>(null)
  const [isNewHighScore, setIsNewHighScore] = React.useState(false)

  const handleGameEnd = React.useCallback(
    (_stats: ReturnType<typeof calculateGameStats>, isNewHigh: boolean) => {
      setIsNewHighScore(isNewHigh)
      setScreen('stats')
    },
    [],
  )

  const quizEngine = useQuizEngine({ onGameEnd: handleGameEnd })

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
    setScreen('level-select')
  }

  const handleBackToMenu = () => {
    quizEngine.resetGame()
    setSelectedLevel(null)
    setScreen('menu')
  }

  // Keyboard shortcut for pause
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && screen === 'playing') {
        quizEngine.pauseGame()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screen, quizEngine])

  return (
    <GameShell>
      <AnimatePresence mode="wait">
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
          <PlayingScreen key="playing" quizEngine={quizEngine} />
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
      </AnimatePresence>
    </GameShell>
  )
}

// ============================================================================
// Screen Components
// ============================================================================

type MenuScreenProps = {
  onPlay: () => void
  onShowHighScores: () => void
}

function MenuScreen({ onPlay }: MenuScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: ANIMATION_DURATION.normal }}
    >
      <GameHeader
        title="🎮 Quiz Destinasi Indonesia"
        subtitle="Uji pengetahuanmu tentang keindahan Nusantara"
        leftAction={
          <Link to="/">
            <Button variant="ghost" size="icon">
              ←
            </Button>
          </Link>
        }
      />

      <GameContent className="space-y-8">
        {/* Hero card */}
        <Card className="overflow-hidden">
          <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-8xl"
            >
              🏝️
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-2xl font-bold md:text-3xl"
            >
              Seberapa baik kamu mengenal Indonesia?
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-2 text-muted-foreground"
            >
              Tebak destinasi wisata dari gambar dan petunjuk yang diberikan
            </motion.p>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <FeatureItem
                emoji="📸"
                title="Gambar Destinasi"
                description="Tebak dari gambar utuh atau fragmen"
              />
              <FeatureItem
                emoji="⏱️"
                title="Tantangan Waktu"
                description="Jawab sebelum waktu habis"
              />
              <FeatureItem
                emoji="🏆"
                title="Skor Tertinggi"
                description="Raih skor terbaik di setiap level"
              />
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
              <Button
                size="lg"
                onClick={onPlay}
                className="min-w-48 text-lg"
              >
                🎯 Mulai Bermain
              </Button>
              <p className="text-sm text-muted-foreground">
                Pilih level kesulitan di halaman berikutnya
              </p>
            </div>
          </CardContent>
        </Card>

        {/* High scores section */}
        <HighScoreDisplay />

        {/* How to play */}
        <HowToPlay />
      </GameContent>
    </motion.div>
  )
}

type FeatureItemProps = {
  emoji: string
  title: string
  description: string
}

function FeatureItem({ emoji, title, description }: FeatureItemProps) {
  return (
    <div className="text-center">
      <span className="text-3xl">{emoji}</span>
      <h3 className="mt-2 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function HowToPlay() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">📖 Cara Bermain</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StepItem
            step={1}
            title="Pilih Level"
            description="Mudah, Sedang, atau Sulit"
          />
          <StepItem
            step={2}
            title="Lihat Gambar"
            description="Gambar penuh atau fragmen"
          />
          <StepItem
            step={3}
            title="Pilih Jawaban"
            description="Gunakan mouse atau keyboard (1-4)"
          />
          <StepItem
            step={4}
            title="Raih Skor"
            description="Jawab cepat untuk bonus poin!"
          />
        </div>

        <div className="mt-6 rounded-lg bg-muted/50 p-4">
          <h4 className="font-semibold">⌨️ Pintasan Keyboard</h4>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <div>
              <kbd className="rounded bg-background px-2 py-1">1-4</kbd> Pilih
              jawaban
            </div>
            <div>
              <kbd className="rounded bg-background px-2 py-1">Enter</kbd> Kirim
              jawaban
            </div>
            <div>
              <kbd className="rounded bg-background px-2 py-1">H</kbd> Lihat
              petunjuk
            </div>
            <div>
              <kbd className="rounded bg-background px-2 py-1">Esc</kbd> Jeda
              permainan
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

type StepItemProps = {
  step: number
  title: string
  description: string
}

function StepItem({ step, title, description }: StepItemProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {step}
      </span>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </div>
  )
}

type LevelSelectScreenProps = {
  onSelect: (level: Level) => void
  onBack: () => void
}

function LevelSelectScreen({ onSelect, onBack }: LevelSelectScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: ANIMATION_DURATION.normal }}
    >
      <GameHeader
        title="Pilih Level"
        subtitle="Sesuaikan dengan kemampuanmu"
        leftAction={
          <Button variant="ghost" size="icon" onClick={onBack}>
            ←
          </Button>
        }
      />

      <GameContent>
        <LevelSelect onSelect={onSelect} />

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>💡 Tips: Mulai dari level Mudah untuk mengenal jenis pertanyaan</p>
        </div>
      </GameContent>
    </motion.div>
  )
}

type PlayingScreenProps = {
  quizEngine: ReturnType<typeof useQuizEngine>
}

function PlayingScreen({ quizEngine }: PlayingScreenProps) {
  const {
    state,
    config,
    currentQuestion,
    level,
    selectAnswer,
    submitAnswer,
    useHint,
    pauseGame,
    resumeGame,
  } = quizEngine

  if (!currentQuestion) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: ANIMATION_DURATION.normal }}
    >
      <GameHeader
        title={`${config.emoji} ${config.displayName}`}
        subtitle={`Soal ${state.currentIndex + 1} dari ${state.questions.length}`}
        leftAction={
          <Button variant="ghost" size="sm" onClick={pauseGame}>
            ⏸️
          </Button>
        }
        rightAction={
          <Badge variant="outline">
            {config.basePointsPerQuestion} poin/soal
          </Badge>
        }
      />

      <GameContent>
        <QuestionCard
          question={currentQuestion}
          level={level}
          timeRemaining={state.timeRemaining}
          selectedIndex={state.selectedIndex}
          showFeedback={state.showFeedback}
          feedback={state.feedback}
          usedHint={state.usedHint}
          isPaused={state.isPaused}
          onSelectAnswer={selectAnswer}
          onSubmit={submitAnswer}
          onUseHint={useHint}
          questionNumber={state.currentIndex + 1}
          totalQuestions={state.questions.length}
        />

        {/* Pause overlay */}
        <AnimatePresence>
          {state.isPaused && <PauseOverlay onResume={resumeGame} />}
        </AnimatePresence>
      </GameContent>
    </motion.div>
  )
}

type PauseOverlayProps = {
  onResume: () => void
}

function PauseOverlay({ onResume }: PauseOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="text-center"
      >
        <div className="text-6xl">⏸️</div>
        <h2 className="mt-4 text-2xl font-bold">Permainan Dijeda</h2>
        <p className="mt-2 text-muted-foreground">
          Tekan tombol di bawah untuk melanjutkan
        </p>
        <Button size="lg" className="mt-6" onClick={onResume}>
          ▶️ Lanjutkan
        </Button>
      </motion.div>
    </motion.div>
  )
}

type StatsScreenProps = {
  results: QuestionResult[]
  level: Level
  isNewHighScore: boolean
  onPlayAgain: () => void
  onChangeLevel: () => void
  onBackToMenu: () => void
}

function StatsScreen({
  results,
  level,
  isNewHighScore,
  onPlayAgain,
  onChangeLevel,
  onBackToMenu,
}: StatsScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: ANIMATION_DURATION.normal }}
    >
      <GameHeader
        title="🎉 Permainan Selesai!"
        subtitle="Lihat hasil permainanmu"
      />

      <GameContent>
        <StatsPanel
          results={results}
          level={level}
          isNewHighScore={isNewHighScore}
          onPlayAgain={onPlayAgain}
          onChangeLevel={onChangeLevel}
          onBackToMenu={onBackToMenu}
        />
      </GameContent>
    </motion.div>
  )
}

// FILE: src/components/game/stats-panel.tsx — Game results display component

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Level, QuestionResult } from '@/lib/game/types'
import { LEVEL_CONFIGS, getResultMessage } from '@/lib/game/constants'
import { calculateGameStats } from '@/lib/game/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import { Progress } from '@/components/ui/fragments/shadcn-ui/progress'

type StatsPanelProps = {
  results: QuestionResult[]
  level: Level
  isNewHighScore?: boolean
  onPlayAgain: () => void
  onChangeLevel: () => void
  onBackToMenu: () => void
}

export function StatsPanel({
  results,
  level,
  isNewHighScore,
  onPlayAgain,
  onChangeLevel,
  onBackToMenu,
}: StatsPanelProps) {
  const stats = calculateGameStats(results, level)
  const config = LEVEL_CONFIGS[level]
  // const { message, emoji } = getResultMessage(stats.accuracy)

  return (
    <div className="space-y-6">
      {/* Main result card */}
      <Card className="  max-w-md  content-start  m-auto gap-4  p-0 bg-background border-0  shadow-none  ">
        {/* <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pb-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="mx-auto mb-4 text-6xl"
          >
            {emoji}
          </motion.div>
          <CardTitle className="text-2xl md:text-3xl">{message}</CardTitle>
          <CardDescription>Level: {config.displayName}</CardDescription>

          {isNewHighScore && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-2"
            >
              <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                🏆 Skor Tertinggi Baru!
              </Badge>
            </motion.div>
          )}
        </CardHeader> */}

        <CardContent
          className={cn(
            '  bg-background  border-0 space-y-4 shadow-none p-0',
            // showFeedback && feedback ? '  ' : ' space-y-8   ',
          )}
        >
          {/* Score highlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 text-center"
          >
            <div className="text-5xl font-bold tabular-nums text-primary md:text-6xl">
              {stats.totalScore}
            </div>
            <div className="text-muted-foreground">
              dari {stats.maxPossibleScore} poin maksimal
            </div>
          </motion.div>

          {/* Stats grid */}
          <div className="grid   grid-cols-2">
            <StatItem
              label="Jawaban Benar"
              value={`${stats.correctCount}/${stats.totalQuestions}`}
              delay={0.3}
            />
            <StatItem
              label="Akurasi"
              value={`${stats.accuracy}%`}
              delay={0.4}
            />
            <StatItem
              label="Rata-rata Waktu"
              value={`${stats.averageTimePerQuestion}s/soal`}
              delay={0.5}
            />
            <StatItem
              label="Total Poin"
              value={`${stats.totalScore}`}
              delay={0.6}
            />
          </div>

          {/* Accuracy progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6"
          >
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Akurasi</span>
              <span className="font-medium">{stats.accuracy}%</span>
            </div>
            <Progress value={stats.accuracy} className="h-3" />
          </motion.div>
        </CardContent>
      </Card>

      {/* Question breakdown */}
      {/* <QuestionBreakdown results={results} level={level} /> */}

      {/* Action buttons */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap justify-center gap-3"
      >
        <Button size="lg" onClick={onPlayAgain}>
          🔄 Main Lagi
        </Button>
        <Button size="lg" variant="outline" onClick={onChangeLevel}>
          📊 Ganti Level
        </Button>
        <Button size="lg" variant="ghost" onClick={onBackToMenu}>
          🏠 Menu Utama
        </Button>
      </motion.div> */}
    </div>
  )
}

type StatItemProps = {
  label: string
  value: string
  delay: number
}

function StatItem({ label, value, delay }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="rounded-lg bg-muted/50 p-4 text-left"
    >
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  )
}

type QuestionBreakdownProps = {
  results: QuestionResult[]
  level: Level
}

function QuestionBreakdown({ results, level }: QuestionBreakdownProps) {
  const config = LEVEL_CONFIGS[level]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Rincian Jawaban</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {results.map((result, index) => {
            const isCorrect =
              result.selectedIndex === result.correctIndex && !result.wasTimeout
            const hasTimeBonus =
              result.timeLeftSec > config.defaultTimeLimitSec * 0.5

            return (
              <motion.div
                key={result.questionId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'flex items-center justify-between rounded-lg p-3',
                  isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-900/10'
                    : 'bg-red-50 dark:bg-red-900/10',
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'text-xl',
                      isCorrect ? 'text-emerald-500' : 'text-red-500',
                    )}
                  >
                    {isCorrect ? '✓' : result.wasTimeout ? '⏱️' : '✗'}
                  </span>
                  <span className="font-medium">Soal {index + 1}</span>
                  {result.usedHint && (
                    <Badge variant="outline">💡 Pakai petunjuk</Badge>
                  )}
                  {hasTimeBonus && isCorrect && (
                    <Badge variant="secondary">⚡ Bonus waktu</Badge>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-bold tabular-nums">
                    {result.earnedPoints}
                  </span>
                  <span className="text-muted-foreground"> poin</span>
                  {!result.wasTimeout && (
                    <div className="text-xs text-muted-foreground">
                      Sisa {result.timeLeftSec}s
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

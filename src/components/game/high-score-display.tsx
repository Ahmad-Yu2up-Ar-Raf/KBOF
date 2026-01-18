// FILE: src/components/game/high-score-display.tsx — High score leaderboard component

import * as React from 'react'
import { motion } from 'framer-motion'
import type { HighScoreRecord, Level } from '@/lib/game/types'
import { cn } from '@/lib/utils'
import { LEVEL_CONFIGS } from '@/lib/game/constants'
import { getHighScores } from '@/lib/game/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/fragments/shadcn-ui/tabs'

type HighScoreDisplayProps = {
  className?: string
}

export function HighScoreDisplay({ className }: HighScoreDisplayProps) {
  const [scores, setScores] = React.useState<Array<HighScoreRecord>>([])
  const [activeLevel, setActiveLevel] = React.useState<Level>('easy')

  React.useEffect(() => {
    setScores(getHighScores())
  }, [])

  const getScoresForLevel = (level: Level) => {
    return scores
      .filter((s) => s.level === level)
      .sort((a, b) => b.score - a.score)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏆 Skor Tertinggi
        </CardTitle>
        <CardDescription>Raih skor tertinggi di setiap level!</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeLevel}
          onValueChange={(v) => setActiveLevel(v as Level)}
        >
          <TabsList className="grid w-full grid-cols-3">
            {Object.values(LEVEL_CONFIGS).map((config) => (
              <TabsTrigger key={config.id} value={config.id} className="gap-1">
                <span>{config.emoji}</span>
                <span className="hidden sm:inline">{config.displayName}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(LEVEL_CONFIGS).map((level) => {
            const levelScores = getScoresForLevel(level as Level)
            const config = LEVEL_CONFIGS[level as Level]

            return (
              <TabsContent key={level} value={level} className="mt-4">
                {levelScores.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <span className="text-4xl">🎮</span>
                    <p className="mt-2">
                      Belum ada skor untuk level {config.displayName}
                    </p>
                    <p className="text-sm">
                      Mainkan untuk menjadi yang pertama!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {levelScores.map((score, index) => (
                      <ScoreRow
                        key={score.gameId}
                        score={score}
                        rank={index + 1}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
    </Card>
  )
}

type ScoreRowProps = {
  score: HighScoreRecord
  rank: number
}

function ScoreRow({ score, rank }: ScoreRowProps) {
  const rankEmojis: Record<number, string> = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
  }

  const formattedDate = new Date(score.timestamp).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.1 }}
      className={cn(
        'flex items-center justify-between rounded-lg p-3',
        rank === 1 && 'bg-amber-50 dark:bg-amber-900/10',
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{rankEmojis[rank] || `#${rank}`}</span>
        <div>
          <div className="font-bold tabular-nums">{score.score} poin</div>
          <div className="text-xs text-muted-foreground">
            {score.correct}/{score.total} benar • {score.accuracy}%
          </div>
        </div>
      </div>
      <div className="text-right text-sm text-muted-foreground">
        {formattedDate}
      </div>
    </motion.div>
  )
}

type CompactHighScoreProps = {
  level: Level
  className?: string
}

export function CompactHighScore({ level, className }: CompactHighScoreProps) {
  const [highScore, setHighScore] = React.useState<HighScoreRecord | null>(null)

  React.useEffect(() => {
    const scores = getHighScores()
    const levelScores = scores.filter((s) => s.level === level)
    if (levelScores.length > 0) {
      setHighScore(levelScores.sort((a, b) => b.score - a.score)[0])
    }
  }, [level])

  if (!highScore) {
    return (
      <Badge variant="outline" className={className}>
        🎮 Belum ada skor
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className={className}>
      🏆 Skor Tertinggi: {highScore.score}
    </Badge>
  )
}

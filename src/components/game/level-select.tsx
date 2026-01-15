// FILE: src/components/game/level-select.tsx — Level selection component

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LEVEL_CONFIGS, ANIMATION_DURATION } from '@/lib/game/constants'
import type { Level, LevelConfig } from '@/lib/game/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/fragments/shadcn-ui/card'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'

type LevelSelectProps = {
  onSelect: (level: Level) => void
  disabled?: boolean
}

export function LevelSelect({ onSelect, disabled }: LevelSelectProps) {
  const levels = Object.values(LEVEL_CONFIGS)

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {levels.map((config, index) => (
        <LevelCard
          key={config.id}
          config={config}
          onSelect={() => onSelect(config.id)}
          disabled={disabled}
          index={index}
        />
      ))}
    </div>
  )
}

type LevelCardProps = {
  config: LevelConfig
  onSelect: () => void
  disabled?: boolean
  index: number
}

function LevelCard({ config, onSelect, disabled, index }: LevelCardProps) {
  const colorVariants: Record<string, string> = {
    emerald: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10',
    amber: 'hover:border-amber-500/50 hover:shadow-amber-500/10',
    red: 'hover:border-red-500/50 hover:shadow-red-500/10',
  }

  const badgeVariants: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    red: 'bg-red-500/10 text-red-600 border-red-500/30',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: ANIMATION_DURATION.normal,
        delay: index * ANIMATION_DURATION.stagger,
      }}
    >
      <Card
        className={cn(
          'cursor-pointer transition-all duration-300 hover:shadow-lg',
          colorVariants[config.color],
          disabled && 'pointer-events-none opacity-50'
        )}
        onClick={onSelect}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect()
          }
        }}
        aria-disabled={disabled}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <span className="text-4xl">{config.emoji}</span>
            <Badge variant="outline" className={badgeVariants[config.color]}>
              {config.basePointsPerQuestion} poin/soal
            </Badge>
          </div>
          <CardTitle className="text-xl">{config.displayName}</CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>⏱️ Waktu</span>
              <span className="font-medium">{config.defaultTimeLimitSec}s/soal</span>
            </div>
            <div className="flex items-center justify-between">
              <span>📝 Soal</span>
              <span className="font-medium">{config.questionsPerGame} pertanyaan</span>
            </div>
            <div className="flex items-center justify-between">
              <span>💡 Petunjuk</span>
              <span className="font-medium">{config.hintsEnabled ? 'Tersedia' : 'Tidak ada'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export { LevelCard }

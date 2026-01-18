// FILE: src/components/game/level-select.tsx — Level selection component

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LEVEL_CONFIGS, ANIMATION_DURATION } from '@/lib/game/constants'
import type { Level, LevelConfig } from '@/lib/game/types'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import { useState } from 'react'
import { Button } from '../ui/fragments/shadcn-ui/button'
import { Play } from 'lucide-react'

type LevelSelectProps = {
  onSelect: (level: Level) => void
  disabled?: boolean
}

export function LevelSelect({ onSelect, disabled }: LevelSelectProps) {
  const levels = Object.values(LEVEL_CONFIGS)
  const [hovered, setHovered] = useState<number | null>(null)
  return (
    <div className="grid gap-3  sm:grid-cols-3">
      {levels.map((config, index) => (
        <LevelCard
          hovered={hovered}
          setHovered={setHovered}
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
  setHovered: React.Dispatch<React.SetStateAction<number | null>>

  hovered: number | null
}

function LevelCard({
  config,
  onSelect,
  disabled,
  index,
  hovered,
  setHovered,
}: LevelCardProps) {
  const colorVariants: Record<string, string> = {
    emerald: 'border-emerald-500/50 hover:shadow-emerald-500/10',
    amber: 'border-amber-500/50 hover:shadow-amber-500/10',
    red: 'border-red-500/50 hover:shadow-red-500/10',
  }

  const badgeVariants: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    red: 'bg-red-500/10 text-red-600 border-red-500/30',
  }

  return (
    <motion.div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        'transform transition-all  cursor-pointer duration-300 hover:scale-105 hover:rotate-1 ',

        hovered !== null && hovered !== index && 'lg:blur-sm   lg:scale-[0.98]',
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: ANIMATION_DURATION.normal,
        delay: index * ANIMATION_DURATION.stagger,
      }}
    >
      <Card
        onClick={onSelect}
        className={cn(
          ' transition-all rounded-2xl bg-background duration-300  ounded-none   hover:shadow-lg',
          colorVariants[config.color],
          // index === 0 &&
          //   '  md:rounded-tr-none rounded-tl-2xl md:rounded-bl-2xl ',
          // index === 2 &&
          //   ' md:rounded-tr-2xl  rounded-bl-2xl md:rounded-bl-none rounded-br-2xl ',
          disabled && 'pointer-events-none  opacity-50',
        )}
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
        <CardHeader className="pb-3 gap-0">
          <div className="flex mb-2 items-center justify-between">
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
            <div className="flex border-b pb-2 items-center justify-between">
              <span>⏱️ Waktu</span>
              <span className="font-medium">
                {config.defaultTimeLimitSec}s/soal
              </span>
            </div>
            <div className="flex border-b  pb-2 items-center justify-between">
              <span>📝 Soal</span>
              <span className="font-medium">
                {config.questionsPerGame} pertanyaan
              </span>
            </div>
            <div className="flex border-b pb-2  items-center justify-between">
              <span>💡 Petunjuk</span>
              <span className="font-medium">
                {config.hintsEnabled ? 'Tersedia' : 'Tidak ada'}
              </span>
            </div>
          </div>
          {/* <CardAction className=" flex  sr-only justify-end w-fitt">
            <Button
           
              size={'icon'}
              className="mt-4  cursor-pointer  "
              disabled={disabled}
            >
              <Play className=" size-4.5 fill-primary-foreground   text-primary    sm:size-6" />
            </Button>
          </CardAction> */}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export { LevelCard }

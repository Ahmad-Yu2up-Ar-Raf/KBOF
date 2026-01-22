// FILE: src/components/game/timer-display.tsx — Timer component with visual states

import { AnimatePresence, motion } from 'framer-motion'
import type { TimerState } from '@/lib/game/types'
import { cn } from '@/lib/utils'
import { ANIMATION_DURATION, TIMER_THRESHOLDS } from '@/lib/game/constants'
import { formatTime } from '@/lib/game/utils'

type TimerDisplayProps = {
  timeRemaining: number
  totalTime: number
  isPaused?: boolean
  className?: string
}

export function TimerDisplay({
  timeRemaining,
  totalTime,
  isPaused,
  className,
}: TimerDisplayProps) {
  const percentage = (timeRemaining / totalTime) * 100
  const timerState = getTimerState(timeRemaining)

  const stateStyles: Record<TimerState, string> = {
    normal: 'text-foreground',
    warning: 'text-amber-500',
    critical: 'text-red-500',
  }

  const progressStyles: Record<TimerState, string> = {
    normal: 'bg-primary',
    warning: 'bg-amber-500',
    critical: 'bg-red-500',
  }

  return (
    <div className={cn('space-y-2 sticky top-0', className)}>
      <div className="h-0.5 w-full overflow-hidden   bg-muted">
        <motion.div
          className={cn(
            'h-full transition-colors duration-300',
            progressStyles[timerState],
          )}
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'linear' }}
        />
      </div>

      {/* Pause indicator */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center sr-only text-sm font-medium text-muted-foreground"
        >
          ⏸️ Dijeda
        </motion.div>
      )}
    </div>
  )
}

function getTimerState(timeRemaining: number): TimerState {
  if (timeRemaining <= TIMER_THRESHOLDS.critical) return 'critical'
  if (timeRemaining <= TIMER_THRESHOLDS.warning) return 'warning'
  return 'normal'
}

type CompactTimerProps = {
  timeRemaining: number
  className?: string
}

export function CompactTimer({ timeRemaining, className }: CompactTimerProps) {
  const timerState = getTimerState(timeRemaining)

  const stateStyles: Record<TimerState, string> = {
    normal: 'bg-muted text-muted-foreground',
    warning: 'bg-amber-500/10 text-amber-600',
    critical: 'bg-red-500/10 text-red-600 animate-pulse',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
        stateStyles[timerState],
        className,
      )}
    >
      ⏱️ {formatTime(timeRemaining)}
    </span>
  )
}

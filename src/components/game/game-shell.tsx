// FILE: src/components/game/game-shell.tsx — Layout wrapper for Quiz Game

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ANIMATION_DURATION } from '@/lib/game/constants'

type GameShellProps = {
  children: React.ReactNode
  className?: string
}

export function GameShell({ children, className }: GameShellProps) {
  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-background via-muted/30 to-background', className)}>
      <div className="container mx-auto max-w-4xl px-4 py-8">{children}</div>
    </div>
  )
}

type GameHeaderProps = {
  title: string
  subtitle?: string
  leftAction?: React.ReactNode
  rightAction?: React.ReactNode
}

export function GameHeader({ title, subtitle, leftAction, rightAction }: GameHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATION.normal }}
      className="mb-8 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        {leftAction}
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {rightAction}
    </motion.header>
  )
}

type GameContentProps = {
  children: React.ReactNode
  className?: string
}

export function GameContent({ children, className }: GameContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATION.normal, delay: 0.1 }}
      className={cn('space-y-6', className)}
    >
      {children}
    </motion.div>
  )
}

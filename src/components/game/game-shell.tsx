// FILE: src/components/game/game-shell.tsx — Layout wrapper for Quiz Game

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ANIMATION_DURATION } from '@/lib/game/constants'
import { Button } from '../ui/fragments/shadcn-ui/button'
import { ArrowLeft } from 'lucide-react'

type GameShellProps = {
  children: React.ReactNode
  className?: string
}

export function GameShell({ children, className }: GameShellProps) {
  return (
    <div
      className={cn(
        'container md:content-center pt-0 md:pb-0 pb-8 md:pt-0 relative mi-h-lvh overflow-y-auto overflow-x-hidden flex flex-col px-5',
        className,
      )}
    >
      {children}
    </div>
  )
}

type GameHeaderProps = {
  title: string
  subtitle?: string
  leftAction?: React.ReactNode | (() => void)
  rightAction?: React.ReactNode
  Emoji?: string
  className?: string
}

export function GameHeader({
  title,
  subtitle,
  leftAction,
  rightAction,
  Emoji = '🎯',
  className,
}: GameHeaderProps) {
  // Determine if leftAction is a function or ReactNode
  const isLeftActionFunction = typeof leftAction === 'function'

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATION.normal }}
      className={cn(
        'z-40 top-0 mx-auto bg-background items-center justify-center border-b sticky flex text-center w-full px-0 py-4   md:border-0  ',
        className,
      )}
    >
      {/* Left Action - Absolute positioned */}
      <nav className="z-50 absolute left-0 top-1/2 -translate-y-1/2 bg-background/95 backdrop-blur">
        {isLeftActionFunction ? (
          <Button
            onClick={leftAction}
            variant="ghost"
            size="icon"
            className="flex w-fit py-2 text-base items-center gap-2 group transition-colors"
          >
            <ArrowLeft className="size-4 md:size-5 group-hover:-translate-x-1 group-hover:transform transition-all ease-out duration-300" />
            <span className="sr-only">Kembali</span>
          </Button>
        ) : (
          leftAction
        )}
      </nav>

      {/* Center - Title and Subtitle */}
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center text-xl md:text-2xl justify-center gap-2 md:gap-3">
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {Emoji}
          </motion.span>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-bold tracking-tight md:text-3xl"
          >
            {title}
          </motion.h1>
        </div>
        {subtitle && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className=" text-sm lg:text-base text-muted-foreground"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Right Action - Absolute positioned */}
      <div className="z-50 absolute right-0 top-1/2 -translate-y-1/2 bg-background/95 backdrop-blur">
        {rightAction}
      </div>
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
      className={cn(
        'space-y-6 flex-1 w-full relative content-center pt-6 md:pt-10',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

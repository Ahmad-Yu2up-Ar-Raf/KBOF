// FILE: src/components/game/game-shell.tsx — Layout wrapper for Quiz Game

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ANIMATION_DURATION } from '@/lib/game/constants'
import { Button } from '../ui/fragments/shadcn-ui/button'
import { ArrowLeft } from 'lucide-react'
import { AnimatedGridPattern } from '../ui/fragments/shadcn-ui/animated-grid-pattern'
type GameShellProps = {
  children: React.ReactNode
  className?: string
}

export function GameShell({ children, className }: GameShellProps) {
  return (
    <>
      <div
        className={cn(
          'container    z-50 pt-0 md:pb-0    relative min-h-lvh overflow-y-auto overflow-x-hidden flex flex-col px-5',
          className,
        )}
      >
        {children}
      </div>
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          'mask-[radial-gradient(500px_circle_at_center,white,transparent)]',
          'inset-x-0 inset-y-[-30%] z-40   top-0 h-full skew-y-12',
        )}
      />
    </>
  )
}

type GameHeaderProps = {
  title: string
  subtitle?: string
  leftAction?: React.ReactNode | (() => void)
  rightAction?: React.ReactNode
  Emoji?: string
  titleClassName?: string
  variant?: 'default' | 'column'
  className?: string
}

export function GameHeader({
  title,
  subtitle,
  titleClassName,
  leftAction,
  rightAction,
  Emoji,
  variant = 'default',
  className,
}: GameHeaderProps) {
  // Determine if leftAction is a function or ReactNode
  const isLeftActionFunction = typeof leftAction === 'function'
  const isColumn = variant === 'column'
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATION.normal }}
      className={cn(
        'z-40 top-0 mx-auto bg-transparent md:mb-3 items-center justify-center border-b  pt-0  flex text-center w-full px-10   h-full   relative    ',
        className,
        isColumn ? ' pb-3' : 'border-b pb-6 mb-10',
      )}
    >
      {/* Left Action - Absolute positioned */}
      {leftAction && (
        <nav className="z-50 absolute left-0 top-10 -translate-y-1/2 bg-background/95 backdrop-blur">
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
      )}
      {variant === 'column' ? (
        <div
          className={cn(
            'flex pt-6 gap-2 flex-col max-w-xs m-auto items-center justify-center',
          )}
        >
          <div
            className={cn(
              'flex flex-row items-center text-2xl    justify-center gap-2 md:gap-3',
              titleClassName,
            )}
          >
            {Emoji && (
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl  "
              >
                {Emoji}
              </motion.span>
            )}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-bold tracking-tight  text-xl"
            >
              {title}
            </motion.h1>
          </div>
          {subtitle && (
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className=" text-sm  lg:text-lg  md:text-base text-muted-foreground"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      ) : (
        <div
          className={cn(
            'flex   pt-10 gap-1 flex-col max-w-xs m-auto items-center justify-center',
          )}
        >
          <div
            className={cn(
              'flex flex-col items-center text-2xl   justify-center gap-2 md:gap-3',
              titleClassName,
            )}
          >
            {Emoji && (
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl "
              >
                {Emoji}
              </motion.span>
            )}
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
              className="   lg:text-lg  text-base text-muted-foreground"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}
      {/* Center - Title and Subtitle */}

      {/* Right Action - Absolute positioned */}
      <div className="z-50 absolute  right-0 top-10 -translate-y-1/2 bg-background/95 backdrop-blur">
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
        'space-y-4 flex-1 w-full h-full  relative content-center    ',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

'use client'

import React, { useRef } from 'react'
import {
  motion,
  MotionProps,
  useInView,
  UseInViewOptions,
  Variants,
} from 'motion/react'
import { useIsMobile } from '@/hooks/use-mobile'

type MarginType = UseInViewOptions['margin']

interface BlurFadeProps extends MotionProps {
  children: React.ReactNode
  className?: string
  variant?: {
    hidden: { y?: number; x?: number; opacity?: number; filter?: string }
    visible: { y?: number; x?: number; opacity?: number; filter?: string }
  }
  duration?: number
  delay?: number
  offset?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  inView?: boolean
  inViewMargin?: MarginType
  blur?: string
  show?: boolean
  isPreload?: boolean
  initial?: 'hidden' | ''
}

export function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  offset = 6,
  initial = 'hidden',
  direction = 'down',
  inView = false,
  inViewMargin = '-50px',
  blur = '6px',
  isPreload = false,
  show = true,
  ...props
}: BlurFadeProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin })
  const isMobile = useIsMobile()
  const defaultVariants: Variants = {
    hidden: {
      [direction === 'left' || direction === 'right' ? 'x' : 'y']:
        direction === 'right' || direction === 'down' ? -offset : offset,
      opacity: 0,
      filter: `blur(${blur})`,
    },
    visible: {
      [direction === 'left' || direction === 'right' ? 'x' : 'y']: 0,
      opacity: 1,
      filter: `blur(0px)`,
    },
  }

  const combinedVariants = variant || defaultVariants

  // FIX: Kalau inView = true, tunggu sampai element masuk viewport
  // Kalau inView = false, langsung animate
  const shouldAnimate = show && (!inView || inViewResult)

  // CRITICAL FIX: Render element selalu, tapi control animationnya
  if (isMobile && !isPreload) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={shouldAnimate ? 'visible' : 'hidden'}
      variants={combinedVariants}
      transition={{
        delay: 0.04 + delay,
        duration,
        ease: 'easeOut' as const,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// FILE: src/components/game/image-fragment.tsx — Fragment display component for quiz images

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { FragmentConfig } from '@/lib/game/types'
import { ANIMATION_DURATION } from '@/lib/game/constants'
import { generateFragmentMask } from '@/lib/game/utils'
import { Image } from '@unpic/react'

type ImageFragmentProps = {
  src: string
  alt: string
  fragments?: FragmentConfig[]
  showFull?: boolean
  className?: string
}

export function ImageFragment({
  src,
  alt,
  fragments,
  showFull = false,
  className,
}: ImageFragmentProps) {
  // Full image display (easy level or reveal on answer)
  if (showFull || !fragments || fragments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: ANIMATION_DURATION.normal }}
        className={cn(
          'relative aspect-video overflow-hidden rounded-lg',
          className,
        )}
      >
        <Image
          width={800}
          height={400}
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          loading="eager"
        />
      </motion.div>
    )
  }

  // Fragment display (medium/hard level)
  const maskStyle = generateFragmentMask(fragments)

  return (
    <div
      className={cn(
        'relative aspect-video overflow-hidden rounded-lg bg-muted',
        className,
      )}
    >
      {/* Background pattern to indicate hidden areas */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            hsl(var(--muted)) 10px,
            hsl(var(--muted)) 20px
          )`,
          opacity: 0.5,
        }}
      />

      {/* Masked image showing only fragments */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: ANIMATION_DURATION.slow }}
        className="absolute inset-0"
        style={{
          mask: maskStyle,
          WebkitMask: maskStyle,
        }}
      >
        <Image
          width={800}
          height={400}
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* Fragment indicators */}
      {fragments.map((fragment, index) => (
        <motion.div
          key={fragment.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: ANIMATION_DURATION.normal,
            delay: index * 0.15,
          }}
          className="pointer-events-none absolute"
          style={{
            left: `${fragment.xPerc}%`,
            top: `${fragment.yPerc}%`,
            width: `${fragment.wPerc}%`,
            height: `${fragment.hPerc}%`,
          }}
        >
          <div className="h-full w-full rounded border-2 border-dashed border-primary/50 shadow-lg" />
        </motion.div>
      ))}

      {/* Fragment count badge */}
      <div className="absolute bottom-2 right-2 rounded-full bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
        {fragments.length} fragmen
      </div>
    </div>
  )
}

type FragmentRevealProps = {
  src: string
  alt: string
  fragments?: FragmentConfig[]
  isRevealed: boolean
  className?: string
}

export function FragmentReveal({
  src,
  alt,
  fragments,
  isRevealed,
  className,
}: FragmentRevealProps) {
  return (
    <div className={cn('relative w-full min-h-[20lvh] ', className)}>
      <ImageFragment
        src={src}
        alt={alt}
        fragments={isRevealed ? undefined : fragments}
        showFull={isRevealed}
      />

      {/* Reveal overlay animation */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: ANIMATION_DURATION.slow }}
          className="pointer-events-none absolute inset-0 bg-background"
        />
      )}
    </div>
  )
}

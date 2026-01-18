// components/ui/animated-roadmap.tsx
'use client'

import * as React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Image } from '@unpic/react'
import { cn } from '@/lib/utils' // Assuming you have a `cn` utility from shadcn

// Define the type for a single milestone
export interface Milestone {
  id: number
  name: string
  status: 'complete' | 'in-progress' | 'pending'
  position: {
    top?: string
    left?: string
    right?: string
    bottom?: string
  }
}

// Define the props for the AnimatedRoadmap component
interface AnimatedRoadmapProps extends React.HTMLAttributes<HTMLDivElement> {
  milestones: Array<Milestone>
  mapImageSrc: string // Add a prop for the map background image
}

// Sub-component for a single milestone marker
const MilestoneMarker = ({ milestone }: { milestone: Milestone }) => {
  const statusClasses = {
    complete: 'bg-green-500 border-green-700',
    'in-progress': 'bg-blue-500 border-blue-700 animate-pulse',
    pending: 'bg-muted border-border',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: milestone.id * 0.3, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.8 }}
      className="absolute flex items-center gap-1"
      style={milestone.position}
    >
      <div className="relative flex size-6 items-center justify-center">
        <div
          className={cn(
            'absolute md:size-2.5 size-2 rounded-full border-2',
            statusClasses[milestone.status],
          )}
        />
        <div className="absolute h-full w-full animate-ping  duration-300  ease-out transition-all  rounded-full bg-primary/10" />
      </div>
      <div className="rounded-full border bg-card px-2.5 md:px-4 md:py-1 py-0.5  md:text-sm text-[10px] sm:text-xs font-medium text-card-foreground shadow-sm">
        {milestone.name}
      </div>
    </motion.div>
  )
}

// Main AnimatedRoadmap component
const AnimatedRoadmap = React.forwardRef<HTMLDivElement, AnimatedRoadmapProps>(
  ({ className, milestones, mapImageSrc, ...props }, ref) => {
    const targetRef = React.useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
      target: targetRef,
      offset: ['start end', 'end start'],
    })

    // Animate the path drawing based on scroll progress
    const pathLength = useTransform(scrollYProgress, [0.15, 0.7], [0, 1])

    return (
      <div
        ref={targetRef}
        className={cn('relative w-full   mx-auto py-32 ', className)}
        {...props}
      >
        {/* Background map image */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.2 }}
          className="absolute inset-0 top-10"
        >
          <Image
            width={900}
            height={700}
            src={mapImageSrc}
            alt="Product roadmap map"
            className="h-full w-full object-contain"
          />
        </motion.div>

        {/* SVG path for animation */}
        <div className="relative w-full min-h-10 md:min-h-12">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 400"
            preserveAspectRatio="none"
            className="absolute top-0 left-0"
          >
            <motion.path
              d="M 50 350 Q 200 50 400 200 T 750 100"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeDasharray="10 5"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>

          {/* Render each milestone */}
          {milestones.map((milestone) => (
            <MilestoneMarker key={milestone.id} milestone={milestone} />
          ))}
        </div>
      </div>
    )
  },
)

AnimatedRoadmap.displayName = 'AnimatedRoadmap'

export { AnimatedRoadmap }

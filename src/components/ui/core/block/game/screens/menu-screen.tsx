// =============================================================================
// MENU SCREEN - Quiz Game
// =============================================================================
// Main menu screen with game intro, features, and how to play guide
// =============================================================================

import { motion } from 'framer-motion'
import {  Play } from 'lucide-react'
import { HowToPlaySheet } from '../how-to-play-sheet'
 
import { AnimatedRoadmap } from './map-hero'
import type { Milestone } from './map-hero'
import { ANIMATION_DURATION } from '@/lib/game/constants'
import { GameContent,   } from '@/components/game'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
 
// =============================================================================
// TYPES
// =============================================================================

export type MenuScreenProps = {
  onPlay: () => void
  onShowHighScores?: () => void
}

// =============================================================================
// COMPONENT
// =============================================================================

export function MenuScreen({ onPlay }: MenuScreenProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: ANIMATION_DURATION.normal }}
      >
        <GameContent className="space-y-8">
          <HeroCard onPlay={onPlay} />
        </GameContent>
      </motion.div>
    </>
  )
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

type HeroCardProps = {
  onPlay: () => void
}

function HeroCard({ onPlay }: HeroCardProps) {
  const milestonesData: Array<Milestone> = [
    {
      id: 1,
      name: 'Jawa',
      status: 'complete',
      position: { top: '130%', left: '10%' },
    },
    {
      id: 2,
      name: 'Sulawesi',
      status: 'complete',
      position: { bottom: '60%', left: '21%' },
    },
    {
      id: 3,
      name: 'Bali',
      status: 'in-progress',
      position: { top: '100%', left: '70%' },
    },
    {
      id: 4,
      name: 'Papua',
      status: 'in-progress',
      position: { bottom: '110%', left: '73%' },
    },
  ]

  return (
    <section className="flex md:px-2   md:min-h-lvh  md:pt-0 content-center     flex-col  justify-center items-center w-full max-w-2xl m-auto z-50 pointer-events-auto   md:gap-4">
      <AnimatedRoadmap
        milestones={milestonesData}
        mapImageSrc="/assets/images/map.png"
        aria-label="An animated roadmap showing project milestones from kick-off to launch."
      />
      <main className="  w space-y-8    flex flex-col justify-center items-center ">
        <header className=" md:space-y-5  space-y-3">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className=" text-4xl sm:text-5xl  leading-9   text-center w-full justify-center items-center flex-col flex primary-foreground space-pre sm:leading-12  capitalize md:leading-14  font-bold tracking-tighter"
          >
            Seberapa baik kamu mengenal Indonesia?
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg lg:text-xl  leading-7  lg:leading-relaxed text-balance text-muted-foreground   text-center"
          >
            Tebak destinasi wisata dari gambar dan petunjuk yang diberikan!
            <span className="hidden md:inline">
              {' '}
              🎯 Uji pengetahuanmu dan raih skor tertinggi!
            </span>
          </motion.p>
        </header>
        <div className="flex w-full flex-col md:flex-row justify-center md:space-x-4  md:space-y-0 space-y-2.5 items-center  ">
          <Button
            onClick={onPlay}
            size={'lg'}
            variant={'custom'}
            className={' rounded-full'}
          >
            Mulai Game
            <Play className=" size-4.5 fill-primary-foreground   text-primary    sm:size-6" />
          </Button>
          <HowToPlaySheet handleStartGame={onPlay} />
        </div>
      </main>
    </section>
  )
}

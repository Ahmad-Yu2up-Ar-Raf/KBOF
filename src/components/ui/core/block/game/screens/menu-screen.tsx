// =============================================================================
// MENU SCREEN - Quiz Game
// =============================================================================
// Main menu screen with game intro, features, and how to play guide
// =============================================================================

import { motion } from 'framer-motion'
import { Gamepad2, Info, Play } from 'lucide-react'
import { HowToPlaySheet } from '../how-to-play-sheet'
import { SiteHeader } from '../../../layout/nav/site-header'
import { AnimatedRoadmap } from './map-hero'
import type { Milestone } from './map-hero'
import { ANIMATION_DURATION } from '@/lib/game/constants'
import { GameContent, GameHeader, HighScoreDisplay } from '@/components/game'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card'
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
        {/* <GameHeader
        title="🎮 Quiz Destinasi Indonesia"
        subtitle="Uji pengetahuanmu tentang keindahan Nusantara"
        leftAction={
          <Link to="/">
            <Button variant="ghost" size="icon">
              ←
            </Button>
          </Link>
        }
      /> */}

        <GameContent className="space-y-8">
          {/* Hero card */}
          <HeroCard onPlay={onPlay} />

          {/* High scores section */}
          {/* <HighScoreDisplay /> */}

          {/* How to play */}
          {/* <HowToPlay /> */}
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
    <section className="flex md:px-2  pt-6 md:pt-0 content-center min-h-dvh   flex-col md:justify-center items-center w-full max-w-2xl m-auto z-50 pointer-events-auto   md:gap-4">
      <AnimatedRoadmap
        milestones={milestonesData}
        mapImageSrc="/assets/images/map.webp"
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

type FeatureItemProps = {
  emoji: string
  title: string
  description: string
}

function FeatureItem({ emoji, title, description }: FeatureItemProps) {
  return (
    <div className="text-center">
      <span className="text-3xl">{emoji}</span>
      <h3 className="mt-2 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function HowToPlay() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">📖 Cara Bermain</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StepItem
            step={1}
            title="Pilih Level"
            description="Mudah, Sedang, atau Sulit"
          />
          <StepItem
            step={2}
            title="Lihat Gambar"
            description="Gambar penuh atau fragmen"
          />
          <StepItem
            step={3}
            title="Pilih Jawaban"
            description="Gunakan mouse atau keyboard (1-4)"
          />
          <StepItem
            step={4}
            title="Raih Skor"
            description="Jawab cepat untuk bonus poin!"
          />
        </div>

        <KeyboardShortcuts />
      </CardContent>
    </Card>
  )
}

type StepItemProps = {
  step: number
  title: string
  description: string
}

function StepItem({ step, title, description }: StepItemProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {step}
      </span>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </div>
  )
}

function KeyboardShortcuts() {
  const shortcuts = [
    { key: '1-4', label: 'Pilih jawaban' },
    { key: 'Enter', label: 'Kirim jawaban' },
    { key: 'H', label: 'Lihat petunjuk' },
    { key: 'Esc', label: 'Jeda permainan' },
  ]

  return (
    <div className="mt-6 rounded-lg bg-muted/50 p-4">
      <h4 className="font-semibold">⌨️ Pintasan Keyboard</h4>
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        {shortcuts.map(({ key, label }) => (
          <div key={key}>
            <kbd className="rounded bg-background px-2 py-1">{key}</kbd> {label}
          </div>
        ))}
      </div>
    </div>
  )
}

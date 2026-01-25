// FILE: src/components/game/stats-panel.tsx — Game results display component

import { motion } from 'framer-motion'
import { useLottie } from 'lottie-react'
import {
  ArrowLeft,
  Gamepad2,
  HomeIcon,
  RotateCcw,
  SectionIcon,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { Level, QuestionResult } from '@/lib/game/types'
import { cn } from '@/lib/utils'
import { LEVEL_CONFIGS, getResultMessage } from '@/lib/game/constants'
import { calculateGameStats } from '@/lib/game/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card'
import {
  Button,
  buttonVariants,
} from '@/components/ui/fragments/shadcn-ui/button'

import { Progress } from '@/components/ui/fragments/shadcn-ui/progress'

import animationData from '@/assets/animations/Cute Boy Running.json'
import { useIsMobile } from '@/hooks/use-mobile'

type StatsPanelProps = {
  results: Array<QuestionResult>
  level: Level
  isNewHighScore?: boolean
  onPlayAgain: () => void
  onChangeLevel: () => void
  onBackToMenu: () => void
}

export function StatsPanel({
  results,
  level,
  isNewHighScore,
  onPlayAgain,
  onChangeLevel,
  onBackToMenu,
}: StatsPanelProps) {
  const stats = calculateGameStats(results, level)
  const config = LEVEL_CONFIGS[level]
  const { message, emoji } = getResultMessage(stats.accuracy)
  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }
  const isMobile = useIsMobile()
  const style = {
    width: isMobile ? 150 : 200,
    height: isMobile ? 220 : 300,
    margin: 'auto',
  }
  const { View } = useLottie(lottieOptions, style)

  return (
    <section className="space-y-6     relative   max-w-md m-auto ">
      <header className="  w-full md:min-h-80 px-3 min-h-62 relative justify-end   flex  flex-col">
        <div className="  relative   -mb-24  ml-2 size-full text-center z-30   ">
          {View}
        </div>
        <div className=" mt-20   z-20">
          <p>Level: {config.displayName}</p>
          <h3 className="text-2xl font-semibold md:text-3xl">{message}</h3>
        </div>
      </header>
      <main className=" flex w-full justify-start h-fit flex-col gap-8">
        <Card className=" w-full mb-20  relative    pb-0  content-start  m-auto gap-4  px-0 bg-background   shadow-none  ">
          <span className=" absolute  -right-6 rotate-9  -top-10  text-7xl">
            {emoji}
          </span>
          <CardHeader className=" gap-0  ">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-0     space-y-2 "
            >
              <div className="text-4xl font-bold md:text-6xl">
                {stats.totalScore}{' '}
                <span className=" text-primary text-xl ">Point</span>
              </div>
              <div className="text-muted-foreground text-sm">
                Dari {stats.maxPossibleScore} poin maksimal
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 px-0 border-t"
            >
              <div className="mb-2 flex justify-between text-sm">
                <span className=" ">Akurasi</span>
                <span className="font-medium">{stats.accuracy}%</span>
              </div>
              <Progress value={stats.accuracy} className="h-2" />
            </motion.div>
          </CardHeader>

          <CardContent
            className={cn(
              '     space-y-4 shadow-none px-0',
              // showFeedback && feedback ? '  ' : ' space-y-8   ',
            )}
          >
            {/* Score highlight */}

            {/* Stats grid */}
            <div className="grid  w-full rounded-2xl  grid-cols-2">
              <StatItem
                className="border-r"
                label="Jawaban Benar"
                value={`${stats.correctCount}/${stats.totalQuestions}`}
                delay={0.3}
              />
              <StatItem
                label="Akurasi"
                value={`${stats.accuracy}%`}
                delay={0.4}
              />
              <StatItem
                className="border-r"
                label="Rata-rata Waktu"
                value={`${stats.averageTimePerQuestion}s/soal`}
                delay={0.5}
              />
              <StatItem
                label="Total Poin"
                value={`${stats.totalScore}`}
                delay={0.6}
              />
            </div>

            {/* Accuracy progress bar */}
          </CardContent>
        </Card>

        {/* Question breakdown */}
        <QuestionBreakdown results={results} level={level} />

        {/* Action buttons */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="    flex flex-col  md:grid-cols-2 md:grid gap-3 w-full   relative z-999999   justify-center "
        >

            <Button size="lg" className=" w-full px-0   " onClick={onPlayAgain}>
              <RotateCcw /> Main Lagi
            </Button>
            <Button
              className=" px-0 bg-foreground w-full "
              size="lg"
              onClick={onChangeLevel}
            >
              <Gamepad2 /> Menu Utama
            </Button>
      
          {!isMobile && (
            <Link
              to="/"
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'lg' }),
                '    md:col-span-2   ',
              )}
            >
              <ArrowLeft /> Kembali Ke Beranda
            </Link>
          )}
          {/* <Button size="lg" variant="ghost" onClick={onBackToMenu}>
           Menu Utama
        </Button> */}
        </motion.footer>
      </main>
    </section>
  )
}

type StatItemProps = {
  label: string
  value: string
  delay: number
  className?: string
}

function StatItem({ label, value, delay, className }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={cn(' p-0   border-t  rounded-none', className)}
    >
      <div className=" relative   p-5">
        {/* <CheckIcon className="size-5 text-green-500" /> */}
        <div className="">
          <CardTitle className="text-lg font-bold">{value}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {label}
          </CardDescription>
        </div>
        <span className="  absolute top-2 right-2 text-xl">🎯</span>
      </div>
    </motion.div>
  )
}

type QuestionBreakdownProps = {
  results: Array<QuestionResult>
  level: Level
}

function QuestionBreakdown({ results, level }: QuestionBreakdownProps) {
  const config = LEVEL_CONFIGS[level]

  return (
    <Card className="  w-full pb-0 overflow-hidden     content-start  m-auto gap-4  px-0 bg-background    shadow-none   ">
      <CardHeader className=" text-left w-full  pt-0  px-4  ">
        <CardTitle className="  text-2xl font-bold ">
          Rincian <span className=" text-primary">Soal</span>
        </CardTitle>
        <CardDescription className="  text-muted-foreground text-sm">
          Berikut adalah rincian hasil jawabanmu.
        </CardDescription>
      </CardHeader>
      <CardContent
        className={cn(
          '   p-0   space-y-4 shadow-none px-0',
          // showFeedback && feedback ? '  ' : ' space-y-8   ',
        )}
      >
        <div className="">
          {results.map((result, index) => {
            const isCorrect =
              result.selectedIndex === result.correctIndex && !result.wasTimeout

            return (
              <motion.div
                key={result.questionId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'flex border items-center justify-between py-2  px-4',
                  // isCorrect
                  //   ? 'bg-emerald-50 dark:bg-emerald-900/10'
                  //   : 'bg-red-50 dark:bg-red-900/10',
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'text-xl',
                      isCorrect ? 'text-emerald-500' : 'text-red-500',
                    )}
                  >
                    {isCorrect ? '✓' : result.wasTimeout ? '⏱️' : '✗'}
                  </span>
                  <span className="font-medium">Soal {index + 1}</span>
                  {/* {result.usedHint && (
                    <Badge variant="outline">💡 Pakai petunjuk</Badge>
                  )}
                  {hasTimeBonus && isCorrect && (
                    <Badge variant="secondary">⚡ Bonus waktu</Badge>
                  )} */}
                </div>
                <div className="text-right">
                  <span className="font-bold tabular-nums">
                    {result.earnedPoints}
                  </span>
                  <span className="text-muted-foreground">+</span>
                  {!result.wasTimeout && (
                    <div className="text-xs text-muted-foreground">
                      Sisa {result.timeLeftSec}s
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

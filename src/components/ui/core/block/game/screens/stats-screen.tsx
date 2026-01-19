// =============================================================================
// STATS SCREEN - Quiz Game
// =============================================================================
// Game results screen with score breakdown and actions
// =============================================================================

import { motion } from 'framer-motion'

import { useId, useRef, useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Check, Copy, Home, Share, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { useConfettiEffect } from '../../leaderboard/hooks'
import type { Level, QuestionResult } from '@/lib/game/types'
import type { ConfettiRef } from '@/components/ui/fragments/custom-ui/animate-ui/confetti'
import { ANIMATION_DURATION } from '@/lib/game/constants'
import { GameContent, GameHeader, StatsPanel } from '@/components/game'
import { Confetti } from '@/components/ui/fragments/custom-ui/animate-ui/confetti'
import { cn } from '@/lib/utils'
import {
  Button,
  buttonVariants,
} from '@/components/ui/fragments/shadcn-ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/fragments/shadcn-ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/fragments/shadcn-ui/tooltip'
import { Input } from '@/components/ui/fragments/shadcn-ui/input'
import { Icons } from '@/components/icons/brand-icons'
import { useIsMobile } from '@/hooks/use-mobile'

// =============================================================================
// TYPES
// =============================================================================

export type StatsScreenProps = {
  results: Array<QuestionResult>
  level: Level
  isNewHighScore: boolean
  onPlayAgain: () => void
  onChangeLevel: () => void
  onBackToMenu: () => void
}

// =============================================================================
// COMPONENT
// =============================================================================

export function StatsScreen({
  results,
  level,
  isNewHighScore,
  onPlayAgain,
  onChangeLevel,
  onBackToMenu,
}: StatsScreenProps) {
  const confettiRef = useRef<ConfettiRef>(null)
  const winAudio = '/assets/audio/result.mp3'
  const resultAudioRef = useRef<HTMLAudioElement | null>(null)

  // Play result audio on mount (stop background audio by relying on PlayingScreen cleanup)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!resultAudioRef.current) {
      const a = new Audio(winAudio)
      a.preload = 'auto'
      a.volume = 0.9
      resultAudioRef.current = a
    }

    const tryPlay = async () => {
      try {
        await resultAudioRef.current?.play()
      } catch (e) {
        // ignore autoplay policy errors
      }
    }

    void tryPlay()

    return () => {
      try {
        resultAudioRef.current?.pause()
        if (resultAudioRef.current) resultAudioRef.current.currentTime = 0
      } catch {}
      resultAudioRef.current = null
    }
  }, [])

  return (
    <>
      <audio id="audio_tag_win" src={winAudio} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: ANIMATION_DURATION.normal }}
      >
        <GameHeader
          leftAction={onBackToMenu}
          Emoji={results.length > 0 ? '🎉' : '🏆'}
          title="Permainan Selesai!"
          className=" border-b  mb-6"
          rightAction={<ShareComponent />}
          // subtitle="Lihat hasil permainanmu"
          variant="column"
        />

        <GameContent>
          <StatsPanel
            results={results}
            level={level}
            isNewHighScore={isNewHighScore}
            onPlayAgain={onPlayAgain}
            onChangeLevel={onChangeLevel}
            onBackToMenu={onBackToMenu}
          />
        </GameContent>
      </motion.div>
      <Confetti
        ref={confettiRef}
        className="absolute top-0 left-0 z-0 size-full"
      />
    </>
  )
}
function ShareComponent() {
  const id = useId()
  const [copied, setCopied] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()
  const handleCopy = () => {
    navigator.clipboard.writeText('https://suasana.vercel.app/game')
    setCopied(true)
    toast.success('Link disalin ke clipboard!')
    setTimeout(() => setCopied(false), 1500)
  }

  if (isMobile)
    return (
      <Button
        onClick={handleCopy}
        variant={'ghost'}
        size={'sm'}
        className={cn('flex items-center gap-2 transition-all duration-300')}
      >
        <div
          className={cn(
            'transition-all',
            copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
          )}
        >
          <Check
            className="stroke-emerald-500"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>
        <div
          className={cn(
            'absolute transition-all',
            copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100',
          )}
        >
          <Share2 size={16} strokeWidth={2} aria-hidden="true" />
        </div>
        <span className="sr-only ">Share</span>
      </Button>
    )
  return (
    <div className="flex flex-col gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'ghost'}
            size={'sm'}
            className={cn(
              'flex items-center gap-2 transition-all duration-300',
            )}
          >
            <Share2 className="size-4" />
            <span className="sr-only ">Share</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <div className="flex flex-col gap-3 text-center">
            <div className="text-sm font-medium">
              🎮 Ayo tantang yang lain !
            </div>
            <div className="flex flex-wrap sr-only justify-center gap-2">
              {/* <Button size="icon" variant="outline" aria-label="Embed">
                <RiCodeFill size={16} strokeWidth={2} aria-hidden="true" />
              </Button> */}
              <Button
                size="icon"
                variant="outline"
                aria-label="Share on Github"
              >
                <Icons.gitHub
                  className={' size-4 stroke-2'}
                  aria-hidden="true"
                />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className=" flex justify-center p-0  content-center items-center overflow-visible"
                aria-label="Share on whatsapp"
              >
                <div className=" size-full p-2">
                  <Icons.whatsapp
                    className={' size-full  m-auto  stroke-2'}
                    aria-hidden="true"
                  />
                </div>
              </Button>
              <Button
                size="icon"
                variant="outline"
                aria-label="Share on Twitter"
              >
                <Icons.gitHub
                  className={' size-4 stroke-2'}
                  aria-hidden="true"
                />
              </Button>
              {/* <Button
                size="icon"
                variant="outline"
                aria-label="Share on Facebook"
              >
                <RiFacebookFill size={16} strokeWidth={2} aria-hidden="true" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                aria-label="Share via email"
              >
                <RiMailLine size={16} strokeWidth={2} aria-hidden="true" />
              </Button> */}
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  ref={inputRef}
                  id={id}
                  className=""
                  type="text"
                  defaultValue={'https://suasana.vercel.app/game'}
                  aria-label="Share link"
                  readOnly
                />
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={'ghost'}
                        onClick={handleCopy}
                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed"
                        aria-label={copied ? 'Copied' : 'Copy to clipboard'}
                        disabled={copied}
                      >
                        <div
                          className={cn(
                            'transition-all',
                            copied
                              ? 'scale-100 opacity-100'
                              : 'scale-0 opacity-0',
                          )}
                        >
                          <Check
                            className="stroke-emerald-500"
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        </div>
                        <div
                          className={cn(
                            'absolute transition-all',
                            copied
                              ? 'scale-0 opacity-0'
                              : 'scale-100 opacity-100',
                          )}
                        >
                          <Copy size={16} strokeWidth={2} aria-hidden="true" />
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="px-2 py-1 text-xs">
                      Copy to clipboard
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// =============================================================================
// HOW TO PLAY SHEET - Quiz Game
// =============================================================================
// Responsive sheet/drawer showing game instructions
// Mobile: Full-height drawer | Desktop: Centered sheet
// =============================================================================

'use client'

import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Gamepad2,
  Clock,
  Star,
  Image as ImageIcon,
  Keyboard,
  Trophy,
  Info,
  Play,
} from 'lucide-react'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/fragments/shadcn-ui/sheet'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/fragments/shadcn-ui/drawer'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/fragments/shadcn-ui/separator'

// =============================================================================
// TYPES
// =============================================================================

export type HowToPlaySheetProps = {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  handleStartGame: () => void
}

type GameStep = {
  number: number
  icon: React.ElementType
  title: string
  description: string
  badge?: string
}

// =============================================================================
// DATA
// =============================================================================

const gameSteps: GameStep[] = [
  {
    number: 1,
    icon: Gamepad2,
    title: 'Pilih Level Kesulitan',
    description:
      'Pilih antara Mudah, Sedang, atau Sulit. Setiap level memiliki tantangan berbeda!',
    badge: '🌱 Mudah | ⚡️ Sedang | 🔥 Sulit',
  },
  {
    number: 2,
    icon: ImageIcon,
    title: 'Perhatikan Gambar',
    description:
      'Mudah: gambar penuh. Sedang: 2-3 potongan. Sulit: hanya 1 potongan kecil!',
  },
  {
    number: 3,
    icon: Clock,
    title: 'Jawab Sebelum Waktu Habis',
    description:
      'Setiap soal punya timer. Jawab cepat untuk bonus poin! Waktu habis = 0 poin.',
  },
  {
    number: 4,
    icon: Keyboard,
    title: 'Gunakan Keyboard (Opsional)',
    description:
      'Tekan 1-4 untuk pilih jawaban, Enter untuk kirim, H untuk hint.',
  },
  {
    number: 5,
    icon: Star,
    title: 'Kumpulkan Poin',
    description:
      'Jawaban benar + cepat = bonus poin! Raih skor tertinggi dan pecahkan rekor!',
  },
  {
    number: 6,
    icon: Trophy,
    title: 'Lihat Statistik',
    description:
      'Setelah selesai, lihat hasil, akurasi, dan jawaban yang benar/salah.',
  },
]

const keyboardShortcuts = [
  { key: '1-4', label: 'Pilih jawaban' },
  { key: 'Enter', label: 'Kirim jawaban' },
  { key: 'H', label: 'Lihat petunjuk' },
  { key: 'Esc', label: 'Jeda permainan' },
]

// =============================================================================
// CONTENT COMPONENT
// =============================================================================

function HowToPlayContent({ onStartGame }: { onStartGame: () => void }) {
  return (
    <div className="space-y-2">
      {/* Steps */}
      <div className=" ">
        {gameSteps.map((step, index) => {
          const isLastStep = index === gameSteps.length - 1

          return (
            <Card
              gradient={false}
              key={step.number}
              className="overflow-hidden flex py-0   bg-background  shadow-none  border-none"
            >
              <CardContent className=" px-0 pb-0 flex gap-6 py-0 items-start w-full ">
                <div className="relative h-full flex flex-col items-center">
                  <div className="flex relative z-20 h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <step.icon className="h-5 w-5" />
                  </div>
                  {!isLastStep && (
                    <div
                      className={cn(
                        'absolute bg-muted  top-5 h-[999999dvh] w-0.5',
                        // lineClassName,
                      )}
                    />
                  )}
                </div>

                <div className=" mb-10">
                  <CardHeader className=" p-0     space-y-0 ">
                    <CardTitle className="text-base">
                      {step.number}. {step.title}
                    </CardTitle>
                    {step.badge && (
                      <Badge variant="secondary" className=" text-xs">
                        {step.badge}
                      </Badge>
                    )}
                  </CardHeader>

                  <CardDescription>{step.description}</CardDescription>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Scoring Info */}
      <Card className="bg-transparent">
        <CardHeader className=" ">
          <CardTitle className="text-sm flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Sistem Poin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex border-b pb-3 justify-between">
            <span className="text-muted-foreground">🌱 Mudah:</span>
            <span className="font-medium">10 poin</span>
          </div>
          <div className="flex border-b pb-2 justify-between">
            <span className="text-muted-foreground">⚡️ Sedang:</span>
            <span className="font-medium">20 poin</span>
          </div>
          <div className="flex border-b pb-2 justify-between">
            <span className="text-muted-foreground">🔥 Sulit:</span>
            <span className="font-medium">30 poin</span>
          </div>
          {/* <div className="mt-3 rounded-xl bg-background p-2 text-xs">
            💡 <strong>Bonus:</strong> Jawab dengan sisa waktu &gt;50% = +25%
            poin!
          </div> */}
        </CardContent>
      </Card>

      {/* Start Button */}
      {/* <Button onClick={onStartGame} className="w-full" size="lg">
        <Gamepad2 className="mr-2 h-5 w-5" />
        Mulai Bermain Sekarang!
      </Button> */}
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function HowToPlaySheet({
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  handleStartGame,
}: HowToPlaySheetProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isMobile = useIsMobile()

  // Use controlled or internal state
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = controlledOnOpenChange || setInternalOpen

  const defaultTrigger = (
    <Button
      size={'lg'}
      variant={'customForeground'}
      className={' rounded-full'}
    >
      Cara Bermain
      <Info className=" size-4.5 sm:size-6 fill-primary-foreground   text-primary" />
    </Button>
  )

  // Mobile: Drawer
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger || defaultTrigger}</DrawerTrigger>
        <DrawerContent className="flex flex-col max-h-[85svh]">
          <DrawerHeader className="text-left sm:px-6 space-y-1 bg-background p-4 border-b">
            <DrawerTitle className="text-xl font-bold">
              📖 Cara Bermain Quiz Destinasi
            </DrawerTitle>
            <DrawerDescription>
              Ikuti langkah-langkah berikut untuk memulai permainan
            </DrawerDescription>
          </DrawerHeader>

          <div className="overflow-y-auto py-10  px-6 pb-4">
            <HowToPlayContent onStartGame={handleStartGame} />
          </div>
          <DrawerFooter className="gap-3 px-3 py-4 w-full flex-row justify-end flex border-t sm:space-x-0">
            <Button className=" w-full" size={'lg'} onClick={handleStartGame}>
              Mulai Sekarang <Play className=" fill-background" />
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  // Desktop: Sheet
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger || defaultTrigger}</SheetTrigger>
      <SheetContent className="flex flex-col gap-6 overflow-y-auto">
        <SheetHeader className="text-left sm:px-6 space-y-1 bg-background z-30 sticky top-0 p-4 border-b">
          <SheetTitle className="text-lg">
            📖 Cara Bermain Quiz Destinasi
          </SheetTitle>
          <SheetDescription className=" ">
            Ikuti langkah-langkah berikut untuk memulai permainan
          </SheetDescription>
        </SheetHeader>

        <div className="  py-5 px-8">
          <HowToPlayContent onStartGame={handleStartGame} />
        </div>

        <SheetFooter className="gap-3 px-3 py-4 w-full flex-row justify-end flex border-t sm:space-x-0">
          {/* <SheetClose asChild>
            <Button type="button" variant="outline">
              Batal
            </Button>
          </SheetClose> */}
          <Button className=" w-full" size={'lg'} onClick={handleStartGame}>
            Mulai Sekarang <Play className=" fill-background" />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

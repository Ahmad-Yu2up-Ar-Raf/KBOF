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

// =============================================================================
// TYPES
// =============================================================================

export type HowToPlaySheetProps = {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
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
    badge: '🌱 Mudah | 🌿 Sedang | 🔥 Sulit',
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
    <div className="space-y-6">
      {/* Steps */}
      <div className="space-y-4">
        {gameSteps.map((step) => (
          <Card key={step.number} className="overflow-hidden">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <step.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base">
                  {step.number}. {step.title}
                </CardTitle>
                {step.badge && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {step.badge}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pl-14 pt-0">
              <CardDescription>{step.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Keyboard Shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">⌨️ Pintasan Keyboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {keyboardShortcuts.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <kbd className="rounded bg-muted px-2 py-1 text-xs font-mono">
                  {key}
                </kbd>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scoring Info */}
      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Sistem Poin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mudah:</span>
            <span className="font-medium">10 poin</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sedang:</span>
            <span className="font-medium">20 poin</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sulit:</span>
            <span className="font-medium">30 poin</span>
          </div>
          <div className="mt-3 rounded-md bg-background p-2 text-xs">
            💡 <strong>Bonus:</strong> Jawab dengan sisa waktu &gt;50% = +25%
            poin!
          </div>
        </CardContent>
      </Card>

      {/* Start Button */}
      <Button onClick={onStartGame} className="w-full" size="lg">
        <Gamepad2 className="mr-2 h-5 w-5" />
        Mulai Bermain Sekarang!
      </Button>
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
}: HowToPlaySheetProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isMobile = useIsMobile()
  const navigate = useNavigate()

  // Use controlled or internal state
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = controlledOnOpenChange || setInternalOpen

  const handleStartGame = () => {
    setOpen(false)
    navigate({ to: '/game' }) // Navigate to game route
  }

  const defaultTrigger = (
    <Button
      size={'lg'}
      className={
        '  md:has-[>svg]:px-15 w-full md:w-fit    font-semibold   has-[>svg]:px-8 rounded-full   md:text-xl  md:gap-6 md:py-7    py-6  bg-foreground '
      }
    >
      Cara Main
      <Info className=" size-4.5 sm:size-6 fill-primary-foreground   text-primary" />
    </Button>
  )

  // Mobile: Drawer
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger || defaultTrigger}</DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>📖 Cara Bermain Quiz Destinasi</DrawerTitle>
            <DrawerDescription>
              Ikuti langkah-langkah berikut untuk memulai permainan
            </DrawerDescription>
          </DrawerHeader>

          <div className="overflow-y-auto px-4 pb-4">
            <HowToPlayContent onStartGame={handleStartGame} />
          </div>

          <DrawerFooter className="border-t pt-4">
            <DrawerClose asChild>
              <Button variant="outline">Tutup</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  // Desktop: Sheet
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger || defaultTrigger}</SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>📖 Cara Bermain Quiz Destinasi</SheetTitle>
          <SheetDescription>
            Ikuti langkah-langkah berikut untuk memulai permainan
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <HowToPlayContent onStartGame={handleStartGame} />
        </div>

        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button variant="outline">Tutup</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

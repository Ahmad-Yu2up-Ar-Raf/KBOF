// FILE: src/routes/game/index.tsx — Main Quiz Game route

import { createFileRoute } from '@tanstack/react-router'
import GameBlock from '@/components/ui/core/block/game/game-block'

export const Route = createFileRoute('/game')({
  component: GameBlock,
  head: () => ({
    meta: [
      {
        title: 'Quiz Game | Suasana',
      },
      {
        name: 'description',
        content:
          'Uji pengetahuanmu tentang destinasi wisata Indonesia dengan quiz interaktif!',
      },
    ],
  }),
})

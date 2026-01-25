// src/routes/(auth)/auth.tsx
import { createFileRoute } from '@tanstack/react-router'
import MagicLink from '@/components/ui/core/feature/auth/magic-link'
import { guestMiddleware } from '@/lib/middleware'

export const Route = createFileRoute('/auth/')({
  component: RouteComponent,
  server: {
    middleware: [guestMiddleware],
  },
})

function RouteComponent() {
  return <MagicLink />
}

import { NotFoundPage } from '@/components/ui/core/block/not-found-block-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$')({
  component: NotFoundPage,
})

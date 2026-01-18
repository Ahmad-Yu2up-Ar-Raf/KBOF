import { createFileRoute } from '@tanstack/react-router'
import { NotFoundPage } from '@/components/ui/core/block/not-found-block-page'

export const Route = createFileRoute('/$')({
  component: NotFoundPage,
})

// =============================================================================
// DESTINASI LOAD MORE - Infinite Scroll Trigger
// =============================================================================

import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'
 
import { forwardRef } from 'react'

// ============================================
// TYPES
// ============================================

interface DestinasiLoadMoreProps {
  isFetchingNextPage: boolean
  hasNextPage: boolean
  hasData: boolean
}

// ============================================
// COMPONENT
// ============================================

export const DestinasiLoadMore = forwardRef<
  HTMLDivElement,
  DestinasiLoadMoreProps
>(({ isFetchingNextPage, hasNextPage, hasData }, ref) => {
  return (
    <div ref={ref} className="flex justify-center py-8">
      {isFetchingNextPage && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Spinner className="h-5 w-5  " />
          <span>Memuat lebih banyak...</span>
        </div>
      )}
      {!hasNextPage && hasData && (
        <p className="text-muted-foreground sr-only text-sm">
          Kamu sudah melihat semua destinasi 🎉
        </p>
      )}
    </div>
  )
})

DestinasiLoadMore.displayName = 'DestinasiLoadMore'

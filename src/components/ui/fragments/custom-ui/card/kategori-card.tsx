// =============================================================================
// KATEGORI CARD - Category Link Card Component
// =============================================================================
// Displays a category card with background image that links to destinasi page
// with category filter pre-applied
// =============================================================================

import { Link } from '@tanstack/react-router'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/fragments/shadcn-ui/card'
import { cn } from '@/lib/utils'
import type { CategoryData } from '@/lib/utils/category-images'

// ============================================
// TYPES
// ============================================

interface KategoriCardProps {
  category: CategoryData
  className?: string
}

// ============================================
// COMPONENT
// ============================================

export default function KategoriCard({
  category,
  className,
}: KategoriCardProps) {
  return (
    <Card
      style={{
        backgroundImage: `url(${category.image})`,
      }}
      className={cn(
        'group cursor-pointer bg-cover bg-center bg-no-repeat',
        'rounded-xl overflow-hidden bg-background p-0 shadow-none border-0',
        'relative min-h-48 w-full transition-all duration-300',
        'hover:shadow-lg hover:scale-[1.02]',
        className,
      )}
    >
      <Link
        to="/destinasi"
        search={{ categories: [category.value] }}
        className="block w-full h-full"
      >
        {/* Gradient Overlay */}
        <div
          className={cn(
            'pointer-events-none z-10 absolute inset-0',
            'bg-linear-to-t from-black/80 via-black/40 to-transparent',
            'group-hover:from-black/90 group-hover:via-black/50 transition-all duration-300',
          )}
        />

        {/* Content */}
        <CardHeader className="absolute gap-0    bottom-0 left-0 right-0 z-20 p-4 text-white">
          <CardDescription className="text-white/70      line-clamp-1">
            {category.description}
          </CardDescription>
          <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-white transition-colors">
            {category.label}
          </CardTitle>
        </CardHeader>

        {/* Hover Effect Border */}
        <div
          className={cn(
            'absolute inset-0 z-30 rounded-xl border-2 border-transparent',
            'group-hover:border-white/30 transition-all duration-300',
          )}
        />
      </Link>
    </Card>
  )
}

// ============================================
// SKELETON
// ============================================

export function KategoriCardSkeleton() {
  return (
    <div className="relative min-h-48 w-full rounded-xl bg-muted animate-pulse">
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <div className="h-3 w-3/4 bg-muted-foreground/20 rounded" />
        <div className="h-5 w-1/2 bg-muted-foreground/20 rounded" />
      </div>
    </div>
  )
}

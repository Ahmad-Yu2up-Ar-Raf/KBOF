'use client'

import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ArrowRight, Newspaper } from 'lucide-react'

import ArticleCard, {
  ArticleCardSkeleton,
} from '@/components/ui/fragments/custom-ui/card/article-card'
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'
import { getFeaturedArticlesQueryOptions } from '@/lib/query-options'
import { cn } from '@/lib/utils'

export default function ArtikelSection() {
  const [hovered, setHovered] = useState<number | null>(null)

  // Use suspenseQuery - data is prefetched in route loader
  const { data: articles } = useSuspenseQuery(
    getFeaturedArticlesQueryOptions(4),
  )

  // Don't render section if no articles
  if (!articles || articles.length === 0) {
    return null
  }

  return (
    <section className="container px-5 py-10 space-y-8">
      {/* Section Header */}
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Newspaper className="size-6 md:size-7 sr-only" />
            Artikel Terbaru
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Cerita dan inspirasi dari seluruh Nusantara
          </p>
        </div>
        <Link
          to="/artikel"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'hidden md:flex items-center gap-2  ',
          )}
        >
          Lihat Semua
          <ArrowRight className="size-4" />
        </Link>
      </header>

      {/* Articles Grid */}
      <main className="grid grid-cols-1 md:grid-cols-2 w-full rounded-3xl overflow-hidden border border-secondary">
        {articles.map((article, index) => (
          <ArticleCard
            key={article.id}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
            article={article}
            totalItems={articles.length}
            columns={3}
          />
        ))}
      </main>

      {/* Mobile CTA */}
      <footer className="md:hidden flex justify-center">
        <Link
          to="/artikel"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'flex items-center gap-2 rounded-full',
          )}
        >
          Lihat Semua Artikel
          <ArrowRight className="size-4" />
        </Link>
      </footer>
    </section>
  )
}

export function ArtikelSectionSkeleton() {
  return (
    <section className="container px-5 py-10 space-y-8">
      {/* Header Skeleton */}
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse" />
        </div>
        <div className="hidden md:block h-9 w-28 bg-muted rounded-full animate-pulse" />
      </header>

      {/* Grid Skeleton */}
      <main className="grid grid-cols-1 md:grid-cols-2 w-full rounded-3xl overflow-hidden border border-secondary">
        {Array.from({ length: 4 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </main>
    </section>
  )
}

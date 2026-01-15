'use client'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'

import ArticleCard, {
  ArticleCardSkeleton,
} from '@/components/ui/fragments/custom-ui/card/article-card'
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'
import { getRecommendedArticlesQueryOptions } from '@/lib/query-options'
import { cn } from '@/lib/utils'

interface RecommendedArticlesProps {
  currentSlug: string
}

export default function RecommendedArticles({
  currentSlug,
}: RecommendedArticlesProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  const { data: recommendations, isLoading } = useQuery(
    getRecommendedArticlesQueryOptions(currentSlug, 4),
  )

  // Don't render if no recommendations
  if (!isLoading && (!recommendations || recommendations.length === 0)) {
    return null
  }

  return (
    <section className="  mx-auto   space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Rekomendasi Artikel
          </h2>
          <p className="text-muted-foreground">
            Artikel lainnya yang mungkin Anda suka
          </p>
        </div>
        <Link
          to="/artikel"
          className={cn(
            buttonVariants({ variant: 'link', size: 'sm' }),
            'hidden md:flex items-center gap-2',
          )}
        >
          Lihat Semua
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 w-full">
        {isLoading ? (
          // Loading skeleton
          <>
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
          </>
        ) : (
          // Render articles
          recommendations?.map((article, index) => (
            <ArticleCard
              key={article.id}
              index={index}
              hovered={hovered}
              setHovered={setHovered}
              article={article}
              totalItems={recommendations.length}
              columns={2}
            />
          ))
        )}
      </div>

      {/* Mobile view all link */}
      <div className="md:hidden flex justify-center">
        <Link
          to="/artikel"
          className={cn(
            buttonVariants({ variant: 'link', size: 'sm' }),
            'flex items-center gap-2',
          )}
        >
          Lihat Semua Artikel
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}

'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'
import { parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs'
import { Loader2 } from 'lucide-react'

import type { PublicArticle } from '@/lib/server/article/article-public-queries'

import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton'

import ArticleCard, {
  ArticleCardSkeleton,
} from '@/components/ui/fragments/custom-ui/card/article-card'
import { getArticleInfiniteQueryOptions } from '@/lib/query-options'
import { useInfiniteScrollContext } from '@/components/provider/infinite-scroll-context'

// Sort options for articles
const sortOptions = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
  { value: 'title', label: 'A-Z' },
] as const

export default function ArticleBlock() {
  // Local UI state
  const [hovered, setHovered] = useState<number | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  // URL State with nuqs - clean URLs (no default values in URL)
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault(''),
  )

  const [sortBy, setSortBy] = useQueryState(
    'sortBy',
    parseAsStringLiteral(sortOptions.map((o) => o.value)).withDefault('newest'),
  )

  // Build filters for query
  const filters = {
    limit: 12,
    search,
    sortBy,
  }

  // Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery(getArticleInfiniteQueryOptions(filters))

  // Register infinite scroll state with context (for footer visibility)
  const { registerInfiniteScroll, unregisterInfiniteScroll } =
    useInfiniteScrollContext()

  useEffect(() => {
    // Register this page as having infinite scroll
    registerInfiniteScroll(hasNextPage, isLoading || isFetchingNextPage)

    // Cleanup on unmount
    return () => {
      unregisterInfiniteScroll()
    }
  }, [
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    registerInfiniteScroll,
    unregisterInfiniteScroll,
  ])

  // Flatten all pages into single array
  const articles = data?.pages.flatMap((page) => page.data) ?? []
  const totalCount = data?.pages[0]?.totalCount ?? 0

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { threshold: 0.1, rootMargin: '100px' },
    )

    const el = loadMoreRef.current
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleResetFilter = useCallback(() => {
    void setSearch(null)
    void setSortBy(null)
  }, [setSearch, setSortBy])

  const hasActiveFilters = sortBy !== 'newest' || search !== ''

  if (isLoading) {
    return <ArticleBlockSkeleton />
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 py-20">
        <div className="text-6xl mb-4">😵</div>
        <p className="text-gray-500 text-lg">
          Terjadi kesalahan saat memuat data
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Coba Lagi
        </Button>
      </div>
    )
  }

  return (
    <section className="py-1 w-full container md:py-2 sm:px-8 px-1.5 flex-1">
      <div className="space-y-5">
        {/* Sort Options */}
        <div className="flex items-center gap-2  mt-1 px-1.5 sm:px-0  overflow-x-auto">
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={sortBy === option.value ? 'default' : 'outline'}
              onClick={() => void setSortBy(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Info & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 ">
          <p className="text-sm text-muted-foreground">
            Menampilkan{' '}
            <span className="font-semibold text-foreground">
              {articles.length}
            </span>{' '}
            dari{' '}
            <span className="font-semibold text-foreground">{totalCount}</span>{' '}
            artikel
            {search && (
              <span className="ml-1">
                untuk "
                <span className="font-semibold text-foreground">{search}</span>"
              </span>
            )}
          </p>
          {hasActiveFilters && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetFilter}
              className="text-primary rounded-2xl"
            >
              Reset Semua
            </Button>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-full">
          {articles.length > 0 ? (
            articles.map((article: PublicArticle, i: number) => (
              <ArticleCard
                key={article.id}
                index={i}
                hovered={hovered}
                setHovered={setHovered}
                article={article}
                // onClick={handleCardClick}
                totalItems={articles.length}
                columns={2}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center min-h-100 animate-fadeIn">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-lg text-center mb-2">
                {search
                  ? `Tidak ada artikel yang cocok dengan "${search}"`
                  : 'Belum ada artikel tersedia'}
              </p>
              <p className="text-gray-400 text-sm">
                {search
                  ? 'Coba kata kunci lain'
                  : 'Artikel akan segera tersedia'}
              </p>
            </div>
          )}
        </div>

        {/* Infinite Scroll Trigger & Loading */}
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Memuat lebih banyak...</span>
            </div>
          )}
          {/* {!hasNextPage && articles.length > 0 && (
            <p className="text-muted-foreground text-sm">
              Kamu sudah melihat semua artikel 🎉
            </p>
          )} */}
        </div>
      </div>
    </section>
  )
}

export function ArticleBlockSkeleton() {
  return (
    <>
      <section className="py-1 w-full container md:py-2 sm:px-8 px-1.5 flex-1">
        <div className="space-y-5">
          {/* Sort Options Skeleton */}
          <div className="flex items-center gap-2  px-2 sm:px-0  overflow-x-auto">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-xl" />
            ))}
          </div>

          {/* Current Filter Info */}
          <div className="flex items-center px-5">
            <Skeleton className="h-4 w-34 rounded-xl" />
          </div>

          {/* Grid */}
          <div className="grid  rounded-2xl overflow-hidden px-2 grid-cols-1 md:grid-cols-2   w-full auto-rows-fr">
            {Array.from({ length: 6 }, (_, index) => (
              <ArticleCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

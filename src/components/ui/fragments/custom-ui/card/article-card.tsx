import React from 'react'
import { Calendar } from 'lucide-react'

import { Link } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '../../shadcn-ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../shadcn-ui/card'
import { Skeleton } from '../../shadcn-ui/skeleton'

import type { PublicArticle } from '@/lib/server/article/article-public-queries'

import MediaItem from '@/components/ui/fragments/custom-ui/media/media-item'
import { cn } from '@/lib/utils'
import { batasiHuruf } from '@/hooks/use-word'

interface ArticleCardProps {
  article: PublicArticle
  className?: string
  index: number
  hovered: number | null
  setHovered: React.Dispatch<React.SetStateAction<number | null>>

  totalItems?: number
  columns?: number
}

function ArticleCard({
  article,
  className,

  index,
  hovered,
  setHovered,
  totalItems = 0,
  columns = 2,
}: ArticleCardProps) {
  // Author info
  const author = article.author
  const authorName = batasiHuruf(author.name || 'Unknown', 12)

  // Format date
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null

  // Calculate corner rounding classes
  const isFirstRow = index < columns
  const totalRows = Math.ceil(totalItems / columns)
  const currentRow = Math.floor(index / columns) + 1
  const isLastRow = currentRow === totalRows
  const isFirstCol = index % columns === 0
  const isLastCol = (index + 1) % columns === 0 || index === totalItems - 1

  // Corner classes for grid corners only
  const cornerClasses = cn(
    isFirstRow &&
      isFirstCol &&
      ' rounded-t-3xl md:rounded-t-none md:rounded-tl-3xl',
    isFirstRow && isLastCol && 'md:rounded-tr-3xl',
    isLastRow && isFirstCol && 'md:rounded-bl-3xl',
    isLastRow &&
      isLastCol &&
      'rounded-b-3xl md:rounded-b-none md:rounded-br-3xl',
  )

  return (
    <Card
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        'relative group cursor-pointer  w-full bg-background shadow-none border-secondary rounded-none',
        'transform transition-all duration-300 hover:scale-102',
        'mx-auto cursor-target content-center w-full p-0',
        'overflow-hidden hover:shadow-none flex flex-col h-full',
        'cursor-target',
        cornerClasses,
        hovered !== null && hovered !== index && 'lg:blur-sm lg:scale-[0.98]',
        className,
      )}
      style={{ willChange: 'transform' }}
      // onClick={() => onClick?.(article)}
    >
      <CardContent className={cn(' p-0', cornerClasses)}>
        <Link
          to={'/artikel/$artikelId'}
          className=" content-center  justify-center gap-0 flex flex-row flex-1 relative mx-auto   w-full h-full overflow-hidden "
          params={{ artikelId: article.slug }}
        >
          <div className="flex-1 flex flex-col gap-4 justify-between py-6 px-5 ">
            {/* Header */}
            <CardHeader className="p-0 w-full gap-2.5">
              {/* Published Date Badge */}
              {publishedDate && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="size-3" />
                  <span>{publishedDate}</span>
                </div>
              )}

              <CardTitle className="text-xl w-full leading-6 font-bold tracking-tighter md:leading-6 line-clamp-2">
                {article.title}
              </CardTitle>

              <CardDescription className="text-muted-foreground text-sm line-clamp-2">
                {article.excerpt}
              </CardDescription>
            </CardHeader>

            {/* Author Info */}
            <div className="w-full">
              <div className="flex gap-3 items-center text-xs">
                <Avatar className="size-8">
                  {author.image && (
                    <AvatarImage src={author.image} alt={author.name || ''} />
                  )}
                  <AvatarFallback>
                    {(author.name || 'U').charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium truncate">{authorName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {article.coverImage && (
            <div className="flex-1 relative min-h-45 md:min-h-50 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-background via-background/30 to-transparent z-10" />
              <MediaItem
                webViewLink={article.coverImage}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
          )}
        </Link>
        {/* Text Content - 50% width */}
      </CardContent>
    </Card>
  )
}

export default ArticleCard

export function ArticleCardSkeleton() {
  return (
    <Card
      className={cn(
        'relative p-0 group w-full shadow-none border-secondary rounded-none',
        'overflow-hidden flex  bg-background rounded-t-2xl flex-row h-full',
      )}
    >
      <CardContent className="flex-1 flex flex-col gap-4 justify-between p-6">
        {/* Header Section */}
        <CardHeader className="p-0 w-full gap-2.5">
          {/* Date Skeleton */}
          <Skeleton className="h-4 w-24 rounded" />

          {/* Title Skeleton - 2 lines */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>

          {/* Excerpt Skeleton - 2 lines */}
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        </CardHeader>

        {/* Author Info Section */}
        <div className="flex gap-3 items-center">
          <Skeleton className="size-8 rounded-full shrink-0" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>

      {/* Image Skeleton - 50% width */}
      <div className="flex-1 relative min-h-40 md:min-h-45">
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      </div>
    </Card>
  )
}

import React from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Calendar, User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '../../shadcn-ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../shadcn-ui/card'
import { buttonVariants } from '../../shadcn-ui/button'
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
  onClick?: (article: PublicArticle) => void
}

function ArticleCard({
  article,
  className,
  onClick,
  index,
  hovered,
  setHovered,
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

  return (
    <Card
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        'relative group cursor-target w-full m-auto md:px-4 md:py-4 shadow-none border rounded-2xl',
        'transform transition-all duration-300 hover:scale-105 hover:rotate-1',
        'mx-auto cursor-target content-center w-full p-3 border border-black/5 shadow-sm rounded-[30px]',
        'overflow-hidden hover:shadow-2xl flex flex-col h-full',
        'cursor-target',
        hovered !== null && hovered !== index && 'lg:blur-sm lg:scale-[0.98]',
        className,
      )}
      style={{ willChange: 'transform' }}
      onClick={() => onClick?.(article)}
    >
      <CardContent className="rounded-[30px] content-center justify-between gap-5 flex flex-col flex-1 relative mx-auto p-6 w-full border border-black/5 bg-neutral-800/5 h-full overflow-hidden shadow-sm md:items-start">
        {/* Header */}
        <CardHeader className="p-0 w-full max-w-[15em] gap-2.5">
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

          <CardDescription className="text-muted-foreground text-xs line-clamp-2">
            {article.excerpt}
          </CardDescription>
        </CardHeader>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="h-45 w-full rounded-xl overflow-hidden">
            <MediaItem
              webViewLink={article.coverImage}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        )}

        {/* Author Info */}
        <div className="space-y-4 w-full">
          <div className="gap-20 flex w-full justify-between">
            <div className="flex gap-3 w-full items-start justify-between text-xs">
              <Avatar>
                {author.image && (
                  <AvatarImage src={author.image} alt={author.name || ''} />
                )}
                <AvatarFallback>
                  {(author.name || 'U').charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium truncate flex items-center gap-1">
                  {authorName}
                </p>
                <p className="text-muted-foreground text-xs truncate">
                  Penulis
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <CardFooter className="flex mt-0 [.border-t]:pt-4 w-full border-t pt- py-1 items-center justify-between px-0">
          <Link
            to={'/artikel/$artikelId'}
            params={{ artikelId: article.slug }}
            className={cn(
              buttonVariants({ variant: 'default', size: 'sm' }),
              'hover:opacity-90 transition-transform w-full hover:scale-105 text-xs',
            )}
          >
            Baca Selengkapnya <ArrowRight className="ml-2 w-3 h-3 md:w-4 md:h-4" />
          </Link>
        </CardFooter>
      </CardContent>
    </Card>
  )
}

export default ArticleCard

export function ArticleCardSkeleton() {
  return (
    <Card
      className={cn(
        'relative group w-full m-auto md:px-4 md:py-4 shadow-none border rounded-2xl',
        'mx-auto content-center w-full p-3 border border-black/5 shadow-sm rounded-[30px]',
        'overflow-hidden flex flex-col h-full',
      )}
    >
      <CardContent className="rounded-[30px] content-center justify-center gap-5 flex flex-col flex-1 relative mx-auto p-6 w-full border border-black/5 bg-neutral-800/5 h-full overflow-hidden shadow-sm md:items-start">
        {/* Header Section */}
        <CardHeader className="p-0 w-full max-w-[15em] gap-2.5">
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

        {/* Image Skeleton */}
        <Skeleton className="h-45 w-full rounded-xl" />

        {/* Author Info Section */}
        <div className="space-y-4 w-full">
          <div className="gap-20 flex w-full justify-between">
            {/* Author Info - Left */}
            <div className="flex gap-3 w-full items-start justify-between text-xs">
              {/* Avatar Skeleton */}
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />

              {/* Name & Role */}
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <CardFooter className="flex mt-0 [.border-t]:pt-4 w-full border-t pt- py-1 items-center justify-between px-0">
          <Skeleton className="h-9 w-full rounded-xl" />
        </CardFooter>
      </CardContent>
    </Card>
  )
}

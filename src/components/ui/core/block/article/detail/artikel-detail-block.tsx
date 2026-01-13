'use client'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Calendar } from 'lucide-react'

import type { Article } from '@/db/schema'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/fragments/shadcn-ui/avatar'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'
import MediaItem from '@/components/ui/fragments/custom-ui/media/media-item'
import { cn } from '@/lib/utils'

interface ArticleDetailProps {
  article: Article & {
    author: {
      id: string
      name: string
      image: string | null
      email: string
    }
  }
}

export default function ArtikelDetailBlock({ article }: ArticleDetailProps) {
  // Format date
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  const author = article.author

  return (
    <div className="container py-12 px-5 md:px-10 lg:px-15 xl:px-20 space-y-7">
      {/* Navigation */}
      <nav className="flex items-center gap-2">
        <Link
          to="/artikel"
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'gap-2 text-muted-foreground hover:text-foreground',
          )}
        >
          <ArrowLeft className="size-4" />
          Kembali
        </Link>
      </nav>

      {/* Article Content */}
      <article className="min-h-lvh space-y-8">
        {/* Header Section */}
        <header className="max-w-3xl space-y-6">
          {/* Author Info */}
          <div className="flex items-center gap-3">
            <Avatar className="size-10 md:size-12">
              {author.image && (
                <AvatarImage src={author.image} alt={author.name} />
              )}
              <AvatarFallback>{(author.name || 'U').charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium flex items-center gap-1">
                {author.name}
              </p>
              {publishedDate && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3" />
                  Artikel dibuat pada {publishedDate}
                </p>
              )}
            </div>
          </div>

          {/* Editorial Badge */}
          <Badge
            variant="outline"
            className="w-fit text-xs font-medium px-3 py-1 rounded-full bg-primary/5 text-primary border-primary/25"
          >
            Suara Lokal*
          </Badge>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            {article.title}
          </h1>

          {/* Divider */}
          <div className="h-1 w-36 bg-primary rounded-full" />

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {article.excerpt}
            </p>
          )}
        </header>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="outline-2 p-2 rounded-2xl">
            <div className="rounded-2xl md:min-h-[30em] min-h-[20em] w-full overflow-hidden">
              <MediaItem
                webViewLink={article.coverImage}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        {article.content && (
          <div
            className="prose prose-lg max-w-3xl mx-auto dark:prose-invert prose-headings:tracking-tight prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}

        {/* Footer */}
        <footer className="max-w-3xl mx-auto pt-8 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                {author.image && (
                  <AvatarImage src={author.image} alt={author.name} />
                )}
                <AvatarFallback>
                  {(author.name || 'U').charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">Ditulis oleh</p>
                <p className="text-muted-foreground">{author.name}</p>
              </div>
            </div>
            <Link
              to="/artikel"
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              Lihat Artikel Lainnya
            </Link>
          </div>
        </footer>
      </article>
    </div>
  )
}

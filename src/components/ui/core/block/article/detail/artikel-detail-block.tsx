'use client'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Calendar } from 'lucide-react'

import RecommendedArticles from './recommended-articles'
import type { Article } from '@/db/schema'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/fragments/shadcn-ui/avatar'
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
    <div className="container py-3 px-5 space-y-7">

      {/* Article Content */}
      <article className="min-h-lvh space-y-8">
        {/* Header Section */}
        <header className="max-w-3xl mx-auto space-y-6">
          {/* Navigation */}
          <nav className="relative w-full">
            <div className="px-0 relative w-full container flex items-center justify-between ">
              <Link
                to={'/artikel'}
                className={cn(
                  buttonVariants({ variant: 'link', size: 'lg' }),
                  'flex has-[>svg]:px-0 text-sm  text-primary w-fit py-2 md:flex items-center gap-2 px-0 group transition-colors',
                )}
              >
                <ArrowLeft className="size-5 group-hover:-translate-x-1  group-hover:transform transition-all ease-out duration-300" />
                <span className="text-primary">Kembali</span>
              </Link>
            </div>
          </nav>

          <div className="space-y-1">
            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-lg text-muted-foreground leading-none">
                {article.excerpt}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="h-1 w-36 bg-primary rounded-full" />

          {/* Author Info */}
          <div className="flex items-center gap-3">
            <Avatar className="size-7">
              {author.image && (
                <AvatarImage src={author.image} alt={author.name} />
              )}
              <AvatarFallback>{(author.name || 'U').charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex items-center flex-row gap-5">
              <p className="font-medium flex items-center gap-1">
                {author.name}
              </p>
              {publishedDate && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3" />
                  {publishedDate}
                </p>
              )}
            </div>
          </div>

          {/* Cover Image */}
          {article.coverImage && (
            <div className="relative rounded-2xl">
              <div className="rounded-2xl h-fit w-full overflow-hidden">
                <MediaItem
                  webViewLink={article.coverImage}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/15 to-background rounded-2xl pointer-events-none" />
            </div>
          )}
        </header>


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
          </div>
        </footer>
        {/* Recommended Articles Section */}
        <RecommendedArticles currentSlug={article.slug} />
      </article>
    </div>
  )
}

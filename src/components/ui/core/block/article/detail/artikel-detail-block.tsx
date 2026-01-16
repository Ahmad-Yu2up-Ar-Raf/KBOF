'use client'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import RecommendedArticles from './recommended-articles'
import type { Article } from '@/db/schema'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/fragments/shadcn-ui/avatar'

import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format'
import { useMemo } from 'react'

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

/**
 * Format plain text into readable paragraphs
 * Handles various newline formats and creates proper spacing
 */
function formatArticleContent(content: string): string {
  if (!content) return ''

  // Split by double newlines (paragraph breaks)
  let paragraphs = content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)

  // If no double newlines, try single newlines
  if (paragraphs.length === 1) {
    paragraphs = content
      .split(/\n/)
      .map((p) => p.trim())
      .filter(Boolean)
  }

  // Wrap each paragraph in <p> tags with proper spacing
  const formatted = paragraphs
    .map((paragraph, index) => {
      // Check if paragraph is a heading (starts with #)
      if (paragraph.startsWith('# ')) {
        return `<h2 class="text-3xl font-bold mt-8 mb-4">${paragraph.substring(2)}</h2>`
      }
      if (paragraph.startsWith('## ')) {
        return `<h3 class="text-2xl font-semibold mt-6 mb-3">${paragraph.substring(3)}</h3>`
      }
      if (paragraph.startsWith('### ')) {
        return `<h4 class="text-xl font-semibold mt-4 mb-2">${paragraph.substring(4)}</h4>`
      }

      // Check if it's a list item
      if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
        return `<li class="ml-6 mb-2">${paragraph.substring(2)}</li>`
      }

      // Regular paragraph - first paragraph gets drop cap, rest are normal
      if (index === 0) {
        return `<p class="mb-6 first-letter:text-5xl first-letter:font-bold first-letter:mr-2 first-letter:float-left leading-relaxed">${paragraph}</p>`
      }
      return `<p class="mb-6 leading-relaxed">${paragraph}</p>`
    })
    .join('\n')

  return formatted
}

export default function ArtikelDetailBlock({ article }: ArticleDetailProps) {
  const author = article.author

  // Memoize formatted content for performance
  const formattedContent = useMemo(() => {
    if (!article.content) return ''

    // If content already contains HTML tags, return as is
    if (article.content.includes('<p>') || article.content.includes('<div>')) {
      return article.content
    }

    // Otherwise, format plain text
    return formatArticleContent(article.content)
  }, [article.content])

  return (
    <article className="space-y-7 py-6 sm:pt-5 container px-6">
      {/* Header Section */}
      <header className="space-y-4 lg:space-y-6">
        <div className="space-y-4 max-w-xl">
          {/* Author & Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                {author.image && (
                  <AvatarImage src={author.image} alt={author.name} />
                )}
                <AvatarFallback>
                  {(author.name || 'U').charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{author.name}</p>
                <p className="text-muted-foreground">
                  {formatDate(article.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-lg lg:text-xl text-muted-foreground">
                {article.excerpt}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="h-1 w-full max-w-xs bg-primary rounded-full" />

      <div className="border-b-2 pb-10 mb-10 space-y-5">
        {/* Cover Image */}
        {article.coverImage && (
          <section
            style={{
              backgroundImage: `url(${article.coverImage})`,
            }}
            className={cn(
              'relative min-h-67 md:min-h-90 rounded-t-2xl bg-fixed bg-no-repeat bg-center bg-cover flex items-center justify-center overflow-hidden hero-parallax',
            )}
          >
            <div className="absolute inset-0 bg-linear-to-b from-background/10 via-background/50 to-background" />
          </section>
        )}

        {/* Article Content - Formatted with proper spacing and typography */}
        {formattedContent && (
          <div
            className="
              article-content
              max-w-3xl 
              mx-auto
              mt-8
              text-foreground
              
              /* Typography styles */
              [&_p]:text-lg 
              [&_p]:lg:text-xl 
              [&_p]:leading-relaxed
              [&_p]:lg:leading-loose
              [&_p]:mb-6
              [&_p]:text-justify
              
              /* First paragraph special styling - drop cap */
              [&_p:first-of-type]:first-letter:text-5xl
              [&_p:first-of-type]:first-letter:font-bold
              [&_p:first-of-type]:first-letter:mr-3
              [&_p:first-of-type]:first-letter:float-left
              [&_p:first-of-type]:first-letter:text-primary
              
              /* Headings */
              [&_h2]:text-3xl
              [&_h2]:md:text-4xl
              [&_h2]:font-bold
              [&_h2]:mt-12
              [&_h2]:mb-6
              [&_h2]:text-foreground
              
              [&_h3]:text-2xl
              [&_h3]:md:text-3xl
              [&_h3]:font-semibold
              [&_h3]:mt-10
              [&_h3]:mb-4
              
              [&_h4]:text-xl
              [&_h4]:md:text-2xl
              [&_h4]:font-semibold
              [&_h4]:mt-8
              [&_h4]:mb-3
              
              /* Lists */
              [&_ul]:list-disc
              [&_ul]:ml-8
              [&_ul]:mb-6
              [&_ul]:space-y-2
              
              [&_ol]:list-decimal
              [&_ol]:ml-8
              [&_ol]:mb-6
              [&_ol]:space-y-2
              
              [&_li]:text-lg
              [&_li]:leading-relaxed
              
              /* Links */
              [&_a]:text-primary
              [&_a]:underline
              [&_a]:underline-offset-4
              [&_a]:hover:text-primary/80
              [&_a]:transition-colors
              
              /* Quotes */
              [&_blockquote]:border-l-4
              [&_blockquote]:border-primary
              [&_blockquote]:pl-6
              [&_blockquote]:italic
              [&_blockquote]:my-8
              [&_blockquote]:text-muted-foreground
              
              /* Code */
              [&_code]:bg-muted
              [&_code]:px-2
              [&_code]:py-1
              [&_code]:rounded
              [&_code]:text-sm
              [&_code]:font-mono
              
              /* Images in content */
              [&_img]:rounded-lg
              [&_img]:my-8
              [&_img]:shadow-lg
              [&_img]:w-full
              
              /* Strong/Bold */
              [&_strong]:font-semibold
              [&_strong]:text-foreground
              
              /* Emphasis */
              [&_em]:italic
            "
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        )}
      </div>

      {/* Recommended Articles Section */}
      <RecommendedArticles currentSlug={article.slug} />
    </article>
  )
}

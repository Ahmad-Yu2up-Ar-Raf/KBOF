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
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'

import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format'

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

  const author = article.author

  return (
    <article className="space-y-7   py-6 sm:pt-5     container  px-6 ">
      {/* Header Section */}
      <header className=" space-y-4 lg:space-y-6 ">
        {/* Navigation */}

        <nav className="z-50 top-0 bg-background/95 backdrop-blur flex items-center justify-between">
          <Link
            to="/artikel"
            className={cn(
              buttonVariants({ variant: 'link' }),
              'flex has-[>svg]:px-0 w-fit py-2 md:flex text-base items-center gap-2 px-0 group transition-colors',
            )}
          >
            <ArrowLeft className="size-5 group-hover:-translate-x-1 group-hover:transform transition-all ease-out duration-300" />
            <span>Kembali</span>
          </Link>
        </nav>
        <div className="space-y-4">
          {/* Title */}
          <div className="flex items-center justify-between ">
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
          <div className=" space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight ">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-lg lg:text-xl   text-muted-foreground  ">
                {article.excerpt}
              </p>
            )}
          </div>
        </div>
      </header>
      <div className="h-1  w-full max-w-xs bg-primary rounded-full" />
      <div className=" border-b pb-10 mb-20   space-y-5">
        {/* Divider */}

        {/* Author Info */}

        {/* Cover Image */}
        {article.coverImage && (
          <section
            style={{
              backgroundImage: `url(${article.coverImage})`,
            }}
            className={cn(
              'relative min-h-67 md:min-h-90 rounded-t-2xl  bg-fixed bg-no-repeat bg-center  bg-cover  flex items-center justify-center overflow-hidden hero-parallax  ',
            )}
          >
            {/* <nav className="z-50 absolute  top-3  w-full    ">
              <div className=" relative  w-full   max-w-5xl   px-5 container    flex items-center justify-between ">
                <Link
                  to={'/destinasi'}
                  className={cn(
                    buttonVariants({ variant: 'link', size: 'lg' }),
                    'flex has-[>svg]:px-0 text-sm  text-background w-fit py-2 md:flex items-center gap-2 px-0 group transition-colors',
                  )}
                >
                  <ArrowLeft className="size-5 group-hover:-translate-x-1  group-hover:transform transition-all ease-out duration-300" />
                  <span className=" sr-only ">Kembali</span>
                </Link>
                <Link
                  to={'/destinasi'}
                  className={cn(
                    buttonVariants({ variant: 'link', size: 'lg' }),
                    'flex has-[>svg]:px-0 text-sm  text-background w-fit py-2 md:flex items-center gap-2 px-0 group transition-colors',
                  )}
                >
                  <MoreVertical className="size-5 group-hover:-translate-x-1  group-hover:transform transition-all ease-out duration-300" />
                  <span className=" sr-only ">Kembali</span>
                </Link>
              </div>
            </nav> */}
            <div className="absolute inset-0 bg-linear-to-b from-background/10 via-background/50 to-background     " />
          </section>
        )}
        {article.content && (
          <p
            className="prose mt-6 prose-lg  mx-auto dark:prose-invert prose-headings:tracking-tight tracking-wide text-lg   lg:text-xl lg:leading-8 leading-7 prose-a:text-primary prose-a:underline prose-a:underline-offset-4"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}
      </div>

      {/* Article Content */}
      {/* Footer */}

      {/* Recommended Articles Section */}
      <RecommendedArticles currentSlug={article.slug} />
    </article>
  )
}

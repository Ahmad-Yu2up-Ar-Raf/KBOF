import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'
import type { ArrowRight, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'

type componentProps = {
  title: string
  description: string
  href?: string
  Icon?: LucideIcon
  className?: string
}

export default function HeadingSection({
  title,
  description,
  Icon,
  className,
  href,
}: componentProps) {
  // Split title into words, color last word
  const words = title.trim().split(' ')
  const lastWord = words.pop()
  const firstWords = words.join(' ')
  return (
    <header
      className={cn(
        'flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0',
        className,
      )}
    >
      <div className="space-y-1 max-w-full">
        <h2 className="text-3xl md:text-3xl font-bold tracking-tight flex flex-wrap items-center gap-0 leading-tight max-w-2xl line-clamp-2">
          {/* {Icon && <Icon className="size-6 md:size-7" />} */}
          {firstWords && <span>{firstWords}&nbsp;</span>}
          <span className="text-primary">{lastWord}</span>
        </h2>
        <p className="text-muted-foreground  md:text-lg text-base max-w-xl md:max-w-2x line-clamp-1 md:line-clamp-2">
          {description}
        </p>
      </div>
      {href && (
        <Link
          to={href}
          className={cn(
            buttonVariants({ variant: 'link', size: 'sm' }),
            'hidden md:flex items-center gap-2',
          )}
        >
          Lihat Semua
          <ArrowRightIcon className="size-4" />
        </Link>
      )}
    </header>
  )
}

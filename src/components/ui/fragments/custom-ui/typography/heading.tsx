import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Heading({
  title,
  description,
  Icon,
  children,
  className,
}: {
  title: string
  description?: string
  Icon?: LucideIcon
  children?: React.ReactNode
  className?: string
}) {
  return (
    <header
      className={cn(
        ' flex   text-left  mb-7  gap-5 content-center items-center ',
        className,
      )}
    >
      {Icon && (
        <Icon className=" bg-primary  hidden md:flex text-primary-foreground content-center p-2 t rounded-xl size-10" />
      )}
      <div className=" max-w-md  w-full items-center content-center md:gap-2 ">
        <h1 className=" text-accent-foreground  m-auto w-full text-3xl font-bold   gap-5 tracking-tighter ">
          {title}
        </h1>
        <p className="text-muted-foreground lg:text-base ">{description}</p>
      </div>
      {children}
    </header>
  )
}

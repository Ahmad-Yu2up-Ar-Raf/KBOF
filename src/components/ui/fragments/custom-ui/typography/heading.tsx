import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

export default function Heading({
  title,
  description,
  Icon,
  className,
}: {
  title: string
  description?: string
  Icon?: LucideIcon
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
      <div className="  m-auto w-full items-center content-center md:gap-2 ">
        <h1 className="  m-auto w-full text-3xl font-bold   gap-5 tracking-tighter ">
          {title}
        </h1>
        <p className="text-muted-foreground ">{description}</p>
      </div>
    </header>
  )
}

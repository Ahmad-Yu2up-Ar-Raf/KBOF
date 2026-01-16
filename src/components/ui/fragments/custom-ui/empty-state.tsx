import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '../shadcn-ui/button'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icons?: LucideIcon[]
  action?:
    | {
        label: string
        onClick: () => void
      }
    | React.ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icons = [],
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'bg-background   h-full border-border hover:border-border/80 text-center',
        'border-2 border-dashed rounded-xl  h-full content-center p-14 w-full  m-auto',
        'group hover:bg-muted/50 transition duration-500 hover:duration-200',
        className,
      )}
    >
      <div className="flex justify-center isolate">
        {icons.length === 3 ? (
          <>
            <div className="bg-background lg:size-15 size-12 grid place-items-center rounded-xl relative left-2.5 top-1.5 -rotate-6 shadow-lg ring-1 ring-border group-hover:-translate-x-5 group-hover:-rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
              {React.createElement(icons[0], {
                className: 'size-6 text-muted-foreground',
              })}
            </div>
            <div className="bg-background lg:size-15 size-12 grid place-items-center rounded-xl relative z-10 shadow-lg ring-1 ring-border group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
              {React.createElement(icons[1], {
                className: 'size-6 text-muted-foreground',
              })}
            </div>
            <div className="bg-background lg:size-15 size-12 grid place-items-center rounded-xl relative right-2.5 top-1.5 rotate-6 shadow-lg ring-1 ring-border group-hover:translate-x-5 group-hover:rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
              {React.createElement(icons[2], {
                className: 'size-6 text-muted-foreground',
              })}
            </div>
          </>
        ) : (
          <div className="bg-background size-12 grid place-items-center rounded-xl shadow-lg ring-1 ring-border group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
            {icons[0] &&
              React.createElement(icons[0], {
                className: 'size-6 text-muted-foreground',
              })}
          </div>
        )}
      </div>
      <h2 className="text-foreground font-medium mt-6 text-sm lg:text-xl">
        {title}
      </h2>
      <p className="text-xs  md:text-sm text-muted-foreground mt-1 lg:text-base whitespace-pre-line">
        {description}
      </p>
      {action &&
        (React.isValidElement(action) ? (
          action
        ) : (
          <Button
            size={'sm'}
            onClick={(action as { label: string; onClick: () => void }).onClick}
            variant="outline"
            className={cn(
              'mt-4',
              'shadow-sm  text-xs cursor-pointer active:shadow-none',
            )}
          >
            {(action as { label: string; onClick: () => void }).label}
          </Button>
        ))}
    </div>
  )
}

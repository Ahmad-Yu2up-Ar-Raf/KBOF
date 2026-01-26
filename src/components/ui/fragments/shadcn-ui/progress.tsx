import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@/lib/utils'

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const pct = Math.max(0, Math.min(100, value || 0))

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn('relative w-full', className)}
      {...props}
    >
      <div className="h-1 w-full bg-transparent overflow-hidden">
        <div
          data-slot="progress-indicator"
          className="bg-primary h-1 origin-left transform transition-transform duration-200 ease-out"
          style={{ transform: `scaleX(${pct / 100})` }}
        />
      </div>
    </ProgressPrimitive.Root>
  )
}

export { Progress }

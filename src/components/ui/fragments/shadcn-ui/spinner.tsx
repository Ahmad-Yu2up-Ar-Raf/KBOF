import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <Loader2
      role="status"
      aria-label="Loading"
      className={cn('size-4 text-primary animate-spin', className)}
      {...props}
    />
  )
}

export { Spinner }

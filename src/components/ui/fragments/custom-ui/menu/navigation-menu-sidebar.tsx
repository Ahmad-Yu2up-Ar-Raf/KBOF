'use client'

import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'

type ButtonAnimationProps = ComponentPropsWithoutRef<typeof Button>

const ButtonAnimation = forwardRef<HTMLButtonElement, ButtonAnimationProps>(
  (props, ref) => {
    return (
      <Button ref={ref} variant="ghost" size="icon" {...props}>
        <svg
          className="pointer-events-none"
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 12L20 12"
            className="origin-center -translate-y-1.75 transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
          />
          <path
            d="M4 12H20"
            className="origin-center transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
          />
          <path
            d="M4 12H20"
            className="origin-center translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
          />
        </svg>
      </Button>
    )
  },
)
ButtonAnimation.displayName = 'ButtonAnimation'

export { ButtonAnimation }

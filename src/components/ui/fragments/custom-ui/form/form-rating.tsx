'use client'

import * as React from 'react'
import { Star } from 'lucide-react'
import { useStore } from '@tanstack/react-store'
import { FormBase } from './form-base'
import type { FormControlProps } from './form-base'
import { cn } from '@/lib/utils'
import { useFieldContext } from '@/hooks/form/use-form'

// ============================================
// INTERACTIVE STAR RATING COMPONENT
// ============================================

interface StarRatingInputProps {
  value: number
  onChange: (value: number) => void
  max?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  isInvalid?: boolean
}

const sizeMap = {
  sm: 'size-5',
  md: 'size-7',
  lg: 'size-9',
  xl: 'size-11',
}

const gapMap = {
  sm: 'gap-1',
  md: 'gap-1.5',
  lg: 'gap-2',
  xl: 'gap-2.5',
}

function StarRatingInput({
  value,
  onChange,
  max = 5,
  size = 'lg',
  disabled = false,
  isInvalid = false,
}: StarRatingInputProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)

  const handleMouseEnter = (index: number) => {
    if (!disabled) {
      setHoverValue(index)
    }
  }

  const handleMouseLeave = () => {
    setHoverValue(null)
  }

  const handleClick = (index: number) => {
    if (!disabled) {
      onChange(index)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (disabled) return

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onChange(index)
    } else if (e.key === 'ArrowRight' && value < max) {
      e.preventDefault()
      onChange(value + 1)
    } else if (e.key === 'ArrowLeft' && value > 1) {
      e.preventDefault()
      onChange(value - 1)
    }
  }

  return (
    <div
      className={cn(
        'flex items-center',
        gapMap[size],
        disabled && 'opacity-50 cursor-not-allowed',
      )}
      role="radiogroup"
      aria-label="Rating"
    >
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1
        const filled = (hoverValue !== null ? hoverValue : value) >= starValue

        return (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={value === starValue}
            aria-label={`${starValue} bintang`}
            disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            className={cn(
              'relative transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl',
              !disabled && 'cursor-pointer hover:scale-110 active:scale-95',
              disabled && 'cursor-not-allowed',
            )}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starValue)}
            onKeyDown={(e) => handleKeyDown(e, starValue)}
          >
            <Star
              className={cn(
                sizeMap[size],
                'transition-all duration-200',
                filled
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                  : 'fill-transparent text-muted-foreground/40 hover:text-muted-foreground/60',
                isInvalid && !filled && 'text-destructive/40',
              )}
            />
            {/* Glow effect on hover/active */}
            {filled && (
              <span
                className={cn(
                  'absolute inset-0 rounded-full bg-amber-400/20 blur-md -z-10 animate-pulse',
                  sizeMap[size],
                )}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

// ============================================
// FORM RATING COMPONENT (Integrated with TanStack Form)
// ============================================

interface FormRatingProps extends Omit<FormControlProps, 'type'> {
  max?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function FormRating({
  max = 5,
  size = 'lg',
  ...props
}: FormRatingProps) {
  const field = useFieldContext<number>()
  const isSubmitting = useStore(
    field.form.baseStore,
    (state) => state.isSubmitting,
  )
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FormBase {...props}>
      <div className="flex flex-col gap-3">
        <StarRatingInput
          value={field.state.value ?? 0}
          onChange={(value) => {
            field.handleChange(value)
            field.handleBlur()
          }}
          max={max}
          size={size}
          disabled={isSubmitting}
          isInvalid={isInvalid}
        />
        {/* Rating label */}
        <div className="flex items-center gap-2">
          {field.state.value > 0 && (
            <span className="text-sm font-medium text-muted-foreground">
              {getRatingLabel(field.state.value)}
            </span>
          )}
        </div>
      </div>
    </FormBase>
  )
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getRatingLabel(rating: number): string {
  switch (rating) {
    case 1:
      return 'Sangat Buruk 😞'
    case 2:
      return 'Buruk 😕'
    case 3:
      return 'Cukup 😐'
    case 4:
      return 'Bagus 😊'
    case 5:
      return 'Sangat Bagus 🤩'
    default:
      return ''
  }
}

// Export the standalone star rating for use outside forms
export { StarRatingInput }

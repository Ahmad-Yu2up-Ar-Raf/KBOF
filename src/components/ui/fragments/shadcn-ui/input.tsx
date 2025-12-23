'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, X } from 'lucide-react'
import { Button } from './button'

const inputVariants = cva(
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-xl border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',

  {
    variants: {
      variant: {
        default: 'border-border',
        destructive: 'border-destructive focus-visible:ring-destructive',
        ghost:
          'border-transparent bg-accent focus-visible:bg-input focus-visible:border-border',
      },
      size: {
        default: 'h-9 px-3 py-2',
        sm: 'h-8 px-2 py-1 text-xs',
        lg: 'h-10 px-4 py-2',
        xl: 'h-12 px-6 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: boolean
  clearable?: boolean
  onClear?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      type = 'text',
      leftIcon,
      rightIcon,
      error,
      clearable,
      onClear,
      value,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(
      props.defaultValue || '',
    )

    // Create internal ref if no ref is provided
    const internalRef = React.useRef<HTMLInputElement>(null)
    const inputRef = ref || internalRef

    const inputVariant = error ? 'destructive' : variant
    const isPassword = type === 'password'
    const actualType = isPassword && showPassword ? 'text' : type

    // Determine if this is a controlled component
    const isControlled = value !== undefined
    const inputValue = isControlled ? value : internalValue
    const showClearButton =
      clearable && inputValue && String(inputValue).length > 0

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value)
      }
      props.onChange?.(e)
    }

    const handleClear = () => {
      // Get reference to the input element
      const inputElement =
        typeof inputRef === 'function' ? null : inputRef?.current

      if (inputElement) {
        // Set the input's value directly
        inputElement.value = ''

        // Create a proper synthetic event
        const event = new Event('input', { bubbles: true })
        Object.defineProperty(event, 'target', {
          writable: false,
          value: inputElement,
        })

        // Dispatch the event to trigger onChange handlers
        inputElement.dispatchEvent(event)
      }

      // Update internal state for uncontrolled components
      if (!isControlled) {
        setInternalValue('')
      }

      // Call the onClear callback
      onClear?.()

      // Create synthetic React event for onChange
      if (props.onChange) {
        const syntheticEvent = {
          target: { value: '' },
          currentTarget: { value: '' },
          preventDefault: () => {},
          stopPropagation: () => {},
        } as React.ChangeEvent<HTMLInputElement>

        props.onChange(syntheticEvent)
      }
    }

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0 z-10">
            {leftIcon}
          </div>
        )}

        <input
          type={actualType}
          className={cn(
            inputVariants({ variant: inputVariant, size, className }),
            leftIcon && 'pl-10',
            (rightIcon || isPassword || showClearButton) && 'pr-10',
          )}
          ref={inputRef}
          {...(isControlled
            ? { value: inputValue }
            : { defaultValue: props.defaultValue })}
          onChange={handleInputChange}
          {...(({ defaultValue, ...rest }) => rest)(props)}
        />

        {/* Right side icons container */}
        {(rightIcon || isPassword || showClearButton) && (
          <div className="absolute right-0.5 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
            {/* Custom right icon */}
            {rightIcon && (
              <div className="text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0">
                {rightIcon}
              </div>
            )}

            {/* Clear button */}
            {showClearButton && (
              <Button
                type="button"
                variant={'ghost'}
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground transition-colors [&_svg]:size-4 [&_svg]:shrink-0"
                tabIndex={-1}
              >
                <X />
              </Button>
            )}

            {/* Password visibility toggle */}
            {isPassword && (
              <Button
                disabled={props.disabled}
                variant={'ghost'}
                type="button"
                onClick={togglePasswordVisibility}
                className="text-muted-foreground hover:text-foreground transition-colors [&_svg]:size-4 [&_svg]:shrink-0"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            )}
          </div>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input, inputVariants }

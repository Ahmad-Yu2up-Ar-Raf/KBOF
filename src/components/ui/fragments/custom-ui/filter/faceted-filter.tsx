'use client'

import * as React from 'react'
import { PlusCircle, XCircle } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { Checkbox } from '@/components/ui/fragments/shadcn-ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/fragments/shadcn-ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/fragments/shadcn-ui/popover'
import { Separator } from '@/components/ui/fragments/shadcn-ui/separator'

// ============================================
// TYPES
// ============================================

export interface FilterOption {
  label: string
  value: string
  count?: number
  icon?: React.FC<React.SVGProps<SVGSVGElement>>
}

export interface FacetedFilterProps {
  /** Filter title/label displayed on button */
  title: string
  /** Available options to select from */
  options: Array<FilterOption>
  /** Currently selected values */
  value: Array<string>
  /** Callback when selection changes */
  onChange: (values: Array<string>) => void
  /** Allow multiple selection (default: true) */
  multiple?: boolean
  /** Placeholder text for search input */
  placeholder?: string
  /** Custom class name for the trigger button */
  className?: string
  /** Align popover content */
  align?: 'start' | 'center' | 'end'
  /** Width of popover content */
  popoverWidth?: string
}

// ============================================
// FACETED FILTER COMPONENT
// ============================================

export function FacetedFilter({
  title,
  options,
  value,
  onChange,
  multiple = true,
  placeholder,
  className,
  align = 'start',
  popoverWidth = 'w-[12.5rem]',
}: FacetedFilterProps) {
  const [open, setOpen] = React.useState(false)
  const selectedValues = React.useMemo(() => new Set(value), [value])
  const isMobile = useIsMobile()
  const onItemSelect = React.useCallback(
    (option: FilterOption, isSelected: boolean) => {
      if (multiple) {
        const newSelectedValues = new Set(selectedValues)
        if (isSelected) {
          newSelectedValues.delete(option.value)
        } else {
          newSelectedValues.add(option.value)
        }
        const filterValues = Array.from(newSelectedValues)
        onChange(filterValues)
      } else {
        // Single select mode - toggle or select new
        onChange(isSelected ? [] : [option.value])
        setOpen(false)
      }
    },
    [multiple, selectedValues, onChange],
  )

  const onReset = React.useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation()
      onChange([])
    },
    [onChange],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={isMobile ? 'sm' : 'default'}
          className={cn('border-dashed text-xs  sm:text-base ', className)}
        >
          {selectedValues.size > 0 ? (
            <div
              role="button"
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              onClick={onReset}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onReset()
                }
              }}
              className="rounded-xl opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <XCircle className="size-3 sm:size-4" />
            </div>
          ) : (
            <PlusCircle className="size-3 sm:size-4" />
          )}
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator
                orientation="vertical"
                className="mx-0.5 data-[orientation=vertical]:h-4"
              />
              <Badge
                variant="secondary"
                className="rounded-xl px-1 text-primary font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden items-center gap-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-xl px-1 text-primary font-normal"
                  >
                    {selectedValues.size} dipilih
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-xl text-primary px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn(popoverWidth, 'p-0')} align={align}>
        <Command>
          <CommandInput placeholder={placeholder ?? `Cari ${title}...`} />
          <CommandList className="max-h-full">
            <CommandEmpty>Tidak ditemukan.</CommandEmpty>
            <CommandGroup className="max-h-75 overflow-y-auto overflow-x-hidden">
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => onItemSelect(option, isSelected)}
                  >
                    <Checkbox checked={isSelected} />
                    {option.icon && (
                      <option.icon className="text-accent-foreground" />
                    )}
                    <span className="truncate">{option.label}</span>
                    {option.count !== undefined && (
                      <span className="ml-auto font-mono text-xs">
                        {option.count}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onReset()}
                    className="justify-center text-center"
                  >
                    Hapus filter
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default FacetedFilter

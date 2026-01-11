'use client'

import { useFieldContext } from '@/hooks/form/use-form'
import { FormBase, FormControlProps } from './form-base'
import { useState } from 'react'
import { useStore } from '@tanstack/react-store'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/fragments/shadcn-ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/fragments/shadcn-ui/command'
import { Button } from '../../shadcn-ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ComboboxOption {
  value: string
  label: string
}

interface FormComboboxProps extends FormControlProps {
  options: readonly ComboboxOption[]
  searchPlaceholder?: string
  emptyMessage?: string
}

export function FormCombobox({
  options,
  searchPlaceholder = 'Cari...',
  emptyMessage = 'Tidak ditemukan.',
  ...props
}: FormComboboxProps) {
  const field = useFieldContext<string>()
  const [open, setOpen] = useState(false)

  const isSubmitting = useStore(
    field.form.baseStore,
    (state) => state.isSubmitting,
  )
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  // Get selected label
  const selectedOption = options.find((opt) => opt.value === field.state.value)

  return (
    <FormBase {...props}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={field.name}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={isInvalid}
            disabled={isSubmitting}
            onBlur={field.handleBlur}
            className={cn(
              'w-full justify-between font-normal',
              !field.state.value && 'text-muted-foreground',
              isInvalid && 'border-destructive focus:ring-destructive',
            )}
          >
            {selectedOption?.label ?? props.placeholder ?? `Pilih ${props.label}...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-y-auto">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      field.handleChange(option.value)
                      setOpen(false)
                    }}
                    className="flex cursor-pointer items-center justify-between"
                  >
                    <span>{option.label}</span>
                    <Check
                      className={cn(
                        'h-4 w-4',
                        field.state.value === option.value
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormBase>
  )
}

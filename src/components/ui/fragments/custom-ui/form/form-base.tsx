import { useEffect, useRef } from 'react'
import type { InputProps } from '../../shadcn-ui/input'
import type { ReactNode } from 'react'
import { useFieldContext } from '@/hooks/form/use-form'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/fragments/shadcn-ui/field'

export type FormControlProps = {
  label: string
  description?: string
  type?: InputProps['type']
  placeholder?: string
}

type FormBaseProps = FormControlProps & {
  children: ReactNode
  horizontal?: boolean
  controlFirst?: boolean
}

export function FormBase({
  children,
  label,
  description,
  controlFirst,
  horizontal,
}: FormBaseProps) {
  const field = useFieldContext()
  const fieldRef = useRef<HTMLDivElement>(null)

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const hasErrors = field.state.meta.errors.length > 0

  // Auto-scroll to first error field only
  useEffect(() => {
    if (isInvalid && hasErrors) {
      // Access form state through field.form
      const formState = field.form.state
      const fieldErrors = formState.fieldMeta

      // Find the first field with errors (based on field order in form)
      const fieldNames = Object.keys(fieldErrors)
      const firstErrorField = fieldNames.find((name) => {
        const meta = fieldErrors[name]
        return meta?.isTouched && meta?.errors && meta.errors.length > 0
      })

      // Only scroll if this is the first error field
      if (firstErrorField === field.name) {
        const timer = setTimeout(() => {
          fieldRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
          // Focus the first focusable element within the field
          const focusable = fieldRef.current?.querySelector<HTMLElement>(
            'input, textarea, button, select, [tabindex]:not([tabindex="-1"])',
          )
          focusable?.focus()
        }, 100)

        return () => clearTimeout(timer)
      }
    }
  }, [isInvalid, hasErrors, field.name, field.form.state])

  const labelElement = (
    <>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
    </>
  )
  const captionElem = isInvalid ? (
    <FieldError errors={field.state.meta.errors} />
  ) : (
    !isInvalid &&
    description && <FieldDescription>{description}</FieldDescription>
  )

  return (
    <Field
      ref={fieldRef}
      data-invalid={isInvalid}
      orientation={horizontal ? 'horizontal' : undefined}
    >
      {controlFirst ? (
        <>
          {children}
          <FieldContent>
            {labelElement}
            {captionElem}
          </FieldContent>
        </>
      ) : (
        <>
          <FieldContent>{labelElement}</FieldContent>
          {children}

          {captionElem}
        </>
      )}
    </Field>
  )
}

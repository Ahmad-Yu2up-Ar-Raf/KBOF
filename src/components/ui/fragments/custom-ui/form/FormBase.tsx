import { ReactNode } from 'react'
import { useFieldContext } from '@/hooks/use-form'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/fragments/shadcn-ui/field'
import { InputProps } from '../../shadcn-ui/input'

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
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
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

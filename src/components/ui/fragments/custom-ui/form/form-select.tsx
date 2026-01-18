import { useStore } from '@tanstack/react-store'
import { FormBase } from './form-base'
import type { FormControlProps } from './form-base'
import type { ReactNode } from 'react'
import { useFieldContext } from '@/hooks/form/use-form'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/fragments/shadcn-ui/select'

export function FormSelect({
  children,
  ...props
}: FormControlProps & { children: ReactNode }) {
  const field = useFieldContext<string>()
  // ✅ Akses form melalui field.form (bukan useFormContext)
  const isSubmitting = useStore(
    field.form.baseStore,
    (state) => state.isSubmitting,
  )
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FormBase {...props}>
      <Select
        onValueChange={(e) => field.handleChange(e)}
        value={field.state.value}
        disabled={isSubmitting}
      >
        <SelectTrigger
          aria-invalid={isInvalid}
          id={field.name}
          onBlur={field.handleBlur}
        >
          <SelectValue placeholder={props.placeholder || props.label} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </FormBase>
  )
}

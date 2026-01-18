import { useStore } from '@tanstack/react-store'
import { FormBase } from './form-base'
import type { FormControlProps } from './form-base'
import { Textarea } from '@/components/ui/fragments/shadcn-ui/textarea'
import { useFieldContext } from '@/hooks/form/use-form'

export function FormTextarea(props: FormControlProps) {
  const field = useFieldContext<string>()
  // ✅ Akses form melalui field.form (bukan useFormContext)
  const isSubmitting = useStore(
    field.form.baseStore,
    (state) => state.isSubmitting,
  )
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FormBase {...props}>
      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        disabled={isSubmitting}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        placeholder={props.placeholder || field.name}
      />
    </FormBase>
  )
}

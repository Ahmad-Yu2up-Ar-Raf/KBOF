import { useStore } from '@tanstack/react-store'
import { FormBase } from './form-base'
import type { FormControlProps } from './form-base'
import { useFieldContext } from '@/hooks/form/use-form'
import { Checkbox } from '@/components/ui/fragments/shadcn-ui/checkbox'

export function FormCheckbox(props: FormControlProps) {
  const field = useFieldContext<boolean>()
  // ✅ Akses form melalui field.form (bukan useFormContext)
  const isSubmitting = useStore(
    field.form.baseStore,
    (state) => state.isSubmitting,
  )
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FormBase {...props} controlFirst horizontal>
      <Checkbox
        id={field.name}
        name={field.name}
        checked={field.state.value}
        onBlur={field.handleBlur}
        disabled={isSubmitting}
        onCheckedChange={(e) => field.handleChange(e === true)}
        aria-invalid={isInvalid}
      />
    </FormBase>
  )
}

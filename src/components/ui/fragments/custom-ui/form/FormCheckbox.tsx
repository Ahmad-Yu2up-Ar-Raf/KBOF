import { useFieldContext } from '@/hooks/use-form'
import { FormBase, FormControlProps } from './FormBase'
import { Checkbox } from '@/components/ui/fragments/shadcn-ui/checkbox'
import { useStore } from '@tanstack/react-store'

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

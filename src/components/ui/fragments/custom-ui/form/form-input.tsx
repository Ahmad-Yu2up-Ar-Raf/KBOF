import { useStore } from '@tanstack/react-store'
import { FormBase } from './form-base'
import type { FormControlProps } from './form-base'
import { Input } from '@/components/ui/fragments/shadcn-ui/input'
import { useFieldContext } from '@/hooks/form/use-form'

export function FormInput(props: FormControlProps & { showLabel?: boolean }) {
  const field = useFieldContext<string | number>()
  // ✅ Akses form melalui field.form (bukan useFormContext)
  const isSubmitting = useStore(
    field.form.baseStore,
    (state) => state.isSubmitting,
  )
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Jika type number, convert ke number
    if (props.type === 'number') {
      const numValue = value === '' ? undefined : Number(value)
      field.handleChange(numValue as string | number)
    } else {
      field.handleChange(value)
    }
  }

  return (
    <FormBase showLabel={props.showLabel} {...props}>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value ?? ''}
        onBlur={field.handleBlur}
        disabled={isSubmitting}
        onChange={handleChange}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? `${field.name}-error` : undefined}
        placeholder={props.placeholder || field.name}
        type={props.type}
      />
    </FormBase>
  )
}

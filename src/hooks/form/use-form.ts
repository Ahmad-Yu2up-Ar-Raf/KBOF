import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { FormInput } from '@/components/ui/fragments/custom-ui/form/FormInput'
import { FormTextarea } from '@/components/ui/fragments/custom-ui/form/FormTextarea'
import { FormSelect } from '@/components/ui/fragments/custom-ui/form/FormSelect'
import { FormCheckbox } from '@/components/ui/fragments/custom-ui/form/FormCheckbox'

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

const { useAppForm } = createFormHook({
  fieldComponents: {
    Input: FormInput,
    Textarea: FormTextarea,
    Select: FormSelect,
    Checkbox: FormCheckbox,
  },
  formComponents: {},
  fieldContext,
  formContext,
})

export { useAppForm, useFieldContext, useFormContext }

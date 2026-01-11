import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { FormInput } from '@/components/ui/fragments/custom-ui/form/form-input'
import { FormTextarea } from '@/components/ui/fragments/custom-ui/form/form-textarea'
import { FormSelect } from '@/components/ui/fragments/custom-ui/form/form-select'
import { FormCheckbox } from '@/components/ui/fragments/custom-ui/form/form-checkbox'
import { FormCombobox } from '@/components/ui/fragments/custom-ui/form/form-combobox'
import {
  FormFileUpload,
  FormMultiFileUpload,
} from '@/components/ui/fragments/custom-ui/form/form-file-upload'

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

const { useAppForm } = createFormHook({
  fieldComponents: {
    Input: FormInput,
    Textarea: FormTextarea,
    Select: FormSelect,
    Combobox: FormCombobox,
    Checkbox: FormCheckbox,
    FileUpload: FormFileUpload,
    MultiFileUpload: FormMultiFileUpload,
  },
  formComponents: {},
  fieldContext,
  formContext,
})

export { useAppForm, useFieldContext, useFormContext }

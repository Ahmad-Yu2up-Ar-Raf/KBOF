// src/hooks/form/use-form.ts
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { FormInput } from '@/components/ui/fragments/custom-ui/form/form-input'
import { FormTextarea } from '@/components/ui/fragments/custom-ui/form/form-textarea'
import { FormSelect } from '@/components/ui/fragments/custom-ui/form/form-select'
import { FormCheckbox } from '@/components/ui/fragments/custom-ui/form/form-checkbox'
import { FormCombobox } from '@/components/ui/fragments/custom-ui/form/form-combobox'
import { FormRating } from '@/components/ui/fragments/custom-ui/form/form-rating'
import {
  FormFileUpload,
  FormMultiFileUpload,
} from '@/components/ui/fragments/custom-ui/form/form-file-upload'
import { FormImagesUpload } from '@/components/ui/fragments/custom-ui/form/form-image-upload'
import { FormAvatarUpload } from '@/components/ui/fragments/custom-ui/form/form-avatar-upload' // ✅ NEW

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

const { useAppForm } = createFormHook({
  fieldComponents: {
    Input: FormInput,
    Textarea: FormTextarea,
    Select: FormSelect,
    Combobox: FormCombobox,
    Checkbox: FormCheckbox,
    Rating: FormRating,
    FileUpload: FormFileUpload,
    MultiFileUpload: FormMultiFileUpload,
    ImagesUpload: FormImagesUpload,
    AvatarUpload: FormAvatarUpload, // ✅ NEW
  },
  formComponents: {},
  fieldContext,
  formContext,
})

export { useAppForm, useFieldContext, useFormContext }

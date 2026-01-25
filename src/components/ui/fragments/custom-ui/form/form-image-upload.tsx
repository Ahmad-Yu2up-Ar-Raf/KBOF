'use client'

import * as React from 'react'
import { useEffect } from 'react'
import { FormBase } from './form-base'
import type { FormControlProps } from './form-base'
import { useFieldContext } from '@/hooks/form/use-form'
import ImagesUpload from '@/components/ui/fragments/custom-ui/form/form-images-upload'

/**
 * Props accepted by the form wrapper. The underlying `ImagesUpload` component
 * will receive `initialFiles` (derived from `value`) and will emit the
 * current files via `onChange` which we forward to the form field.
 */
interface FormImagesUploadProps extends FormControlProps {
  maxFiles?: number
  maxSizeMB?: number
  accept?: string
}

export function FormImagesUpload({
  maxFiles = 10,
  maxSizeMB = 5,
  ...props
}: FormImagesUploadProps) {
  const field = useFieldContext<Array<string | File> | string | undefined>()

  // Normalize the value to an array for initialFiles
  const initialValues: Array<string | File> = React.useMemo(() => {
    const val = field.state.value
    if (!val) return []
    if (Array.isArray(val)) return val
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
    return []
  }, [field.state.value])

  // Handler called by inner component when files change
  const handleChange = React.useCallback(
    (items: Array<string | File>) => {
      field.handleChange(items)
    },
    [field],
  )

  // Ensure when the field value changes externally we keep sync (no-op here,
  // but effect included for clarity / future enhancements)
  useEffect(() => {
    // noop - placeholder to show we intentionally keep controlled behavior
  }, [field.state.value])

  return (
    <FormBase {...props}>
      <ImagesUpload
        // `ImagesUpload` expects initial files + callbacks; map our values
        // into the shape it understands via the `initialFiles` prop and
        // observe its internal files state through the `onChange` prop.
        // The component accepts `maxFiles`, `maxSizeMB` and `accept`.
        // We forward the current form value as initialFiles and update the
        // form via `handleChange`.
        // NOTE: ImagesUpload will return an array of File | string values
        // in the onChange callback (pending files are File, existing urls are string).

        initialFiles={initialValues}
        onChange={handleChange}
        maxFiles={maxFiles}
        maxSizeMB={maxSizeMB}
        accept={undefined}
      />
    </FormBase>
  )
}

export default FormImagesUpload

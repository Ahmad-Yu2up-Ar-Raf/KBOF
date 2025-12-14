import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Form Wrapper Props
 * 
 * Generic over TForm to preserve full type information
 * from TanStack Form instance
 */
interface FormWrapperProps<TForm extends { handleSubmit: () => void }>
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit" | "children"> {
  form: TForm
  isPending?: boolean
  children: ReactNode
}

/**
 * Generic Form Wrapper Component
 * 
 * Usage:
 * ```tsx
 * <FormWrapper form={form} isPending={isPending}>
 *   {children}
 * </FormWrapper>
 * ```
 * 
 * Features:
 * - Auto-handles form submission
 * - Prevents default behavior
 * - Disables all fields when pending
 * - Full type safety with generic constraint
 */
export function FormWrapper<TForm extends { handleSubmit: () => void }>({
  form,
  isPending = false,
  children,
  className,
  ...props
}: FormWrapperProps<TForm>) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className={cn("space-y-4", className)}
      {...props}
    >
      <fieldset disabled={isPending} className="space-y-6">
        {children}
      </fieldset>
    </form>
  )
}
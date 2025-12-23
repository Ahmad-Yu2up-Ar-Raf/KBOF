import { FieldGroup } from '@/components/ui/fragments/shadcn-ui/field'
import { SelectItem } from '@/components/ui/fragments/shadcn-ui/select'
import { mess } from '@/db/schema'
import { CreateMessFormReturn } from '@/hooks/actions/app/use-mess-form'

interface MessFormProps {
  form: CreateMessFormReturn

  children?: React.ReactNode
}

function MessForm({ form, children }: MessFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      id="signin-form"
      className="flex overflow-y-scroll pt-6 md:pt-0 md:overflow-y-visible flex-col gap-4 px-0"
    >
      <main className="space-y-6 mb-6">
        <FieldGroup className="    border-b pb-8 pt-2 px-4 sm:px-7">
          <form.AppField name="name">
            {(field) => (
              <field.Input
                label="Name"
                placeholder="name"
                description="Your mess name."
              />
            )}
          </form.AppField>

          <form.AppField name="capacityRoom">
            {(field) => (
              <field.Input
                label="Capacity Room"
                placeholder="Capacity Room"
                type="number"
                description="Capacity Room of the mess."
              />
            )}
          </form.AppField>
        </FieldGroup>
        <FieldGroup className="    px-4 sm:px-7">
          <header>
            <h1 className="text-lg font-semibold">Optional Fields</h1>
            <p className="text-sm text-muted-foreground">
              These are columns that do not need any value
            </p>
          </header>

          <form.AppField name="capacityEmploye">
            {(field) => (
              <field.Input
                label="Capacity Employe"
                placeholder="Capacity Employe"
                type="number"
              />
            )}
          </form.AppField>

          <form.AppField name="location">
            {(field) => (
              <field.Textarea label="Mess located" placeholder="Mess located" />
            )}
          </form.AppField>

          <form.AppField name="deskripcion">
            {(field) => (
              <field.Textarea
                label="Mess deskripcion"
                placeholder="Mess deskripcion"
              />
            )}
          </form.AppField>

          <form.AppField name="status">
            {(field) => (
              <field.Select label="Status">
                {mess.status.enumValues.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>

          <form.AppField name="type">
            {(field) => (
              <field.Select label="Type">
                {mess.type.enumValues.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>
        </FieldGroup>
      </main>

      {/* Submit Button - Optional */}
      {children}
    </form>
  )
}

export default MessForm

import { FieldGroup } from '@/components/ui/fragments/shadcn-ui/field'
import { CreateArticleFormReturn } from '@/hooks/form/use-article-form'

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draf' },
  { value: 'published', label: 'Dipublikasikan' },
  { value: 'archived', label: 'Diarsipkan' },
]

interface ArticleFormProps {
  form: CreateArticleFormReturn
  children?: React.ReactNode
}

function ArticleForm({ form, children }: ArticleFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      id="article-form"
      className="flex overflow-y-scroll pt-6 md:pt-0 md:overflow-y-visible flex-col gap-4 px-0"
    >
      <main className="space-y-6 mb-6">
        {/* Basic Info */}
        <FieldGroup className="border-b pb-8 pt-2 px-4 sm:px-7">
          <form.AppField name="title">
            {(field) => (
              <field.Input
                label="Judul Artikel"
                placeholder="Contoh: Keindahan Alam Nusantara"
                description="Judul artikel yang menarik."
              />
            )}
          </form.AppField>

          <form.AppField name="excerpt">
            {(field) => (
              <field.Textarea
                label="Ringkasan"
                placeholder="Tulis ringkasan singkat artikel..."
                description="Ringkasan akan ditampilkan di halaman daftar artikel."
              />
            )}
          </form.AppField>

          <form.AppField name="status">
            {(field) => (
              <field.Combobox
                label="Status"
                description="Status publikasi artikel"
                options={STATUS_OPTIONS}
                searchPlaceholder="Pilih status..."
                emptyMessage="Status tidak ditemukan."
              />
            )}
          </form.AppField>
        </FieldGroup>

        {/* Content */}
        <FieldGroup className="px-4 border-b sm:px-7 pb-8 pt-2">
          <header>
            <h1 className="text-lg font-semibold">Konten Artikel</h1>
            <p className="text-sm text-muted-foreground">
              Tulis konten artikel secara lengkap
            </p>
          </header>

          <form.AppField name="content">
            {(field) => (
              <field.Textarea
                label="Konten"
                placeholder="Tulis konten artikel Anda..."
              />
            )}
          </form.AppField>
        </FieldGroup>

        {/* Media */}
        <FieldGroup className="px-4 sm:px-7 pb-4 pt-2">
          <header>
            <h1 className="text-lg font-semibold">Media</h1>
            <p className="text-sm text-muted-foreground">
              Tambahkan gambar cover untuk artikel
            </p>
          </header>

          <form.AppField name="coverImage">
            {(field) => (
              <field.FileUpload
                label="Gambar Cover"
                description="Gambar utama yang ditampilkan di artikel"
              />
            )}
          </form.AppField>
        </FieldGroup>
      </main>

      {children}
    </form>
  )
}

export default ArticleForm

import { FieldGroup } from '@/components/ui/fragments/shadcn-ui/field'
import { CreateDestinationFormReturn } from '@/hooks/form/use-destination-form'
import {
  PROVINSI_OPTIONS,
  TYPE_OPTIONS,
  STATUS_OPTIONS,
  CATEGORY_OPTIONS,
} from '@/lib/utils/destination-utils'

interface DestinationFormProps {
  // CreateDestinationFormReturn works for both create & update forms
  form: CreateDestinationFormReturn
  children?: React.ReactNode
}

function DestinationForm({ form, children }: DestinationFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      id="destination-form"
      className="flex overflow-y-scroll pt-6 md:pt-0 md:overflow-y-visible flex-col gap-4 px-0"
    >
      <main className="space-y-6 mb-6">
        {/* Required Fields */}
        <FieldGroup className="border-b pb-8 pt-2 px-4 sm:px-7">
          <form.AppField name="name">
            {(field) => (
              <field.Input
                label="Nama Destinasi"
                placeholder="Candi Borobudur"
                description="Nama destinasi wisata atau budaya."
              />
            )}
          </form.AppField>

          <form.AppField name="type">
            {(field) => (
              <field.Combobox
                label="Tipe Destinasi"
                description="Pilih jenis destinasi"
                options={TYPE_OPTIONS}
                searchPlaceholder="Cari tipe..."
                emptyMessage="Tipe tidak ditemukan."
              />
            )}
          </form.AppField>

          <form.AppField name="category">
            {(field) => (
              <field.Combobox
                label="Kategori"
                description="Pilih kategori destinasi"
                options={CATEGORY_OPTIONS}
                searchPlaceholder="Cari kategori..."
                emptyMessage="Kategori tidak ditemukan."
              />
            )}
          </form.AppField>

          <form.AppField name="provinsi">
            {(field) => (
              <field.Combobox
                label="Provinsi"
                description="Lokasi provinsi destinasi"
                options={PROVINSI_OPTIONS}
                searchPlaceholder="Cari provinsi..."
                emptyMessage="Provinsi tidak ditemukan."
              />
            )}
          </form.AppField>
        </FieldGroup>

        {/* Optional Fields */}
        <FieldGroup className="px-4 border-b sm:px-7  pb-8 pt-2">
          <header>
            <h1 className="text-lg font-semibold">Detail Tambahan</h1>
            <p className="text-sm text-muted-foreground">
              Informasi opsional untuk melengkapi data destinasi
            </p>
          </header>

          <form.AppField name="description">
            {(field) => (
              <field.Textarea
                label="Deskripsi"
                placeholder="Ceritakan tentang destinasi ini..."
              />
            )}
          </form.AppField>

          <form.AppField name="kabupatenKota">
            {(field) => (
              <field.Input label="Kabupaten/Kota" placeholder="Magelang" />
            )}
          </form.AppField>

          <form.AppField name="alamat">
            {(field) => (
              <field.Textarea
                label="Alamat Lengkap"
                placeholder="Alamat detail lokasi destinasi"
              />
            )}
          </form.AppField>

          <form.AppField name="status">
            {(field) => (
              <field.Combobox
                label="Status Publikasi"
                options={STATUS_OPTIONS}
                searchPlaceholder="Cari status..."
                emptyMessage="Status tidak ditemukan."
              />
            )}
          </form.AppField>
        </FieldGroup>

        {/* Image Upload Section */}
        <FieldGroup className="px-4 sm:px-7">
          <header>
            <h1 className="text-lg font-semibold">Lampiran Destinasi</h1>
            <p className="text-sm text-muted-foreground">
              Upload gambar cover dan galeri foto destinasi
            </p>
          </header>

          <form.AppField name="coverImage">
            {(field) => (
              <field.FileUpload
                label="Cover Image"
                description="Gambar utama yang akan ditampilkan (Rasio 16:9 disarankan)"
                folder="destinations/cover"
                aspectRatio="16/9"
              />
            )}
          </form.AppField>

          <form.AppField name="images">
            {(field) => (
              <field.MultiFileUpload
                label="Galeri Foto"
                description="Foto-foto tambahan destinasi (Maksimal 10 foto)"
                folder="destinations/gallery"
                maxFiles={10}
                aspectRatio="4/3"
              />
            )}
          </form.AppField>
        </FieldGroup>
      </main>

      {/* Submit Button - Optional */}
      {children}
    </form>
  )
}

export default DestinationForm

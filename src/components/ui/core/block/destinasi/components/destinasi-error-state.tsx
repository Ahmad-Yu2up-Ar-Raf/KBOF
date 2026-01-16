// =============================================================================
// DESTINASI ERROR STATE
// =============================================================================

import { Button } from '@/components/ui/fragments/shadcn-ui/button'

// ============================================
// COMPONENT
// ============================================

export function DestinasiErrorState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-100 py-20">
      <div className="text-6xl mb-4">😵</div>
      <p className="text-gray-500 text-lg">
        Terjadi kesalahan saat memuat data
      </p>
      <Button
        variant="outline"
        onClick={() => window.location.reload()}
        className="mt-4"
      >
        Coba Lagi
      </Button>
    </div>
  )
}

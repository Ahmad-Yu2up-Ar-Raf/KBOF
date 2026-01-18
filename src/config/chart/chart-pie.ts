import type { ChartConfig } from '@/components/ui/fragments/shadcn-ui/chart'

export const chartConfig = {
  count: {
    label: 'Status Count',
  },

  // ==========================================
  // AGAMA ENUM
  // ==========================================
  islam: {
    label: 'Islam',
    color: 'var(--chart-1)',
  },
  kristen: {
    label: 'Kristen',
    color: 'var(--chart-2)',
  },
  katolik: {
    label: 'Katolik',
    color: 'var(--chart-3)',
  },
  hindu: {
    label: 'Hindu',
    color: 'var(--chart-4)',
  },
  buddha: {
    label: 'Buddha',
    color: 'var(--chart-5)',
  },
  konghucu: {
    label: 'Konghucu',
    color: 'var(--chart-1)',
  },

  // ==========================================
  // JENIS KELAMIN ENUM
  // ==========================================
  laki_laki: {
    label: 'Laki-Laki',
    color: 'var(--chart-1)',
  },
  perempuan: {
    label: 'Perempuan',
    color: 'var(--chart-2)',
  },

  // ==========================================
  // ROLE ENUM
  // ==========================================
  super_admin: {
    label: 'Super Admin',
    color: 'var(--chart-1)',
  },
  admin: {
    label: 'Admin',
    color: 'var(--chart-2)',
  },
  kepala_kurikulum: {
    label: 'Kepala Kurikulum',
    color: 'var(--chart-3)',
  },
  guru: {
    label: 'Guru',
    color: 'var(--chart-4)',
  },
  operator: {
    label: 'Operator',
    color: 'var(--chart-5)',
  },
  siswa: {
    label: 'Siswa',
    color: 'var(--chart-1)',
  },

  // ==========================================
  // SEMESTER ENUM
  // ==========================================
  ganjil: {
    label: 'Semester Ganjil',
    color: 'var(--chart-1)',
  },
  genap: {
    label: 'Semester Genap',
    color: 'var(--chart-2)',
  },

  // ==========================================
  // STATUS ENUM (Global)
  // ==========================================
  aktif: {
    label: 'Aktif',
    color: 'var(--chart-1)',
  },
  nonaktif: {
    label: 'Non-Aktif',
    color: 'var(--chart-5)',
  },

  // ==========================================
  // STATUS SISWA ENUM
  // ==========================================
  // aktif sudah ada di atas (Status global)
  lulus: {
    label: 'Lulus',
    color: 'var(--chart-2)',
  },

  keluar: {
    label: 'Keluar',
    color: 'var(--chart-4)',
  },

  // ==========================================
  // STATUS KELAS ENUM
  // ==========================================
  // aktif, lulus, keluar sudah ada di atas
  naik_kelas: {
    label: 'Naik Kelas',
    color: 'var(--chart-2)',
  },
  tinggal_kelas: {
    label: 'Tinggal Kelas',
    color: 'var(--chart-3)',
  },

  // ==========================================
  // TINGKAT ENUM
  // ==========================================
  X: {
    label: 'Kelas X',
    color: 'var(--chart-1)',
  },
  XI: {
    label: 'Kelas XI',
    color: 'var(--chart-2)',
  },
  XII: {
    label: 'Kelas XII',
    color: 'var(--chart-3)',
  },

  // ==========================================
  // LEGACY/OTHER STATUS (kept for backward compatibility)
  // ==========================================
  fashion: {
    label: 'Fashion',
    color: 'var(--chart-2)',
  },
  food: {
    label: 'Food',
    color: 'var(--chart-3)',
  },
  books: {
    label: 'Books',
    color: 'var(--chart-4)',
  },
  home: {
    label: 'Home',
    color: 'var(--chart-5)',
  },
  beauty: {
    label: 'Beauty',
    color: 'var(--chart-2)',
  },
  sports: {
    label: 'Sports',
    color: 'var(--chart-3)',
  },
  toys: {
    label: 'Toys',
    color: 'var(--chart-4)',
  },
  health: {
    label: 'Health',
    color: 'var(--chart-5)',
  },
  accessories: {
    label: 'Accessories',
    color: 'var(--chart-1)',
  },
  pending: {
    label: 'Pending',
    color: 'var(--chart-3)',
  },
  paid: {
    label: 'Paid',
    color: 'var(--chart-1)',
  },
  unpaid: {
    label: 'Unpaid',
    color: 'var(--chart-5)',
  },
  processing: {
    label: 'Processing',
    color: 'var(--chart-2)',
  },
  shipped: {
    label: 'Shipped',
    color: 'var(--chart-4)',
  },
  approved: {
    label: 'Approved',
    color: 'var(--chart-4)',
  },
  delivered: {
    label: 'Delivered',
    color: 'var(--chart-1)',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'var(--chart-5)',
  },
  refunded: {
    label: 'Refunded',
    color: 'var(--chart-2)',
  },
  available: {
    label: 'Available',
    color: 'var(--chart-1)',
  },
  not_available: {
    label: 'Not Available',
    color: 'var(--chart-5)',
  },
  coming_soon: {
    label: 'Coming Soon',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

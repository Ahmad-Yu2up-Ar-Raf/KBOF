export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {},
) {
  if (!date) return ''

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts,
    }).format(new Date(date))
  } catch (_err) {
    return ''
  }
}

export function formatCurrency(
  amount: number | undefined | null,
  currency: string = 'IDR',
  locale: string = 'id-ID',
) {
  if (amount === undefined || amount === null) return 'Rp 0'

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch (_err) {
    return `Rp ${amount.toLocaleString('id-ID')}`
  }
}

/**
 * Formats a slug-like string into a human-readable label
 * e.g., "wisata-alam" -> "Wisata Alam"
 */
export function formatLabel(slug: string | undefined | null): string {
  if (!slug) return ''

  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

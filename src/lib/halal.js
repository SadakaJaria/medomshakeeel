// ثوابت الكون الحلال — التسميات والألوان حسب CLAUDE.md

export const SHARIAH_STATUSES = {
  compliant: {
    label: 'متوافقة',
    badgeClass:
      'border-shariah-compliant/40 bg-shariah-compliant/10 text-shariah-compliant',
  },
  non_compliant: {
    label: 'غير متوافقة',
    badgeClass:
      'border-shariah-non-compliant/40 bg-shariah-non-compliant/10 text-shariah-non-compliant',
  },
  questionable: {
    label: 'مشكوك فيها',
    badgeClass:
      'border-shariah-questionable/40 bg-shariah-questionable/10 text-shariah-questionable',
  },
  not_screened: {
    label: 'غير مفحوصة',
    badgeClass:
      'border-shariah-not-screened/40 bg-shariah-not-screened/10 text-shariah-not-screened',
  },
}

export const SHARIAH_SOURCES = {
  halalterminal: 'Halal Terminal',
  musaffa: 'Musaffa',
  halalscreener: 'HalalScreener',
  manual: 'يدوي',
}

export const SECURITY_TYPES = {
  stock: 'سهم',
  fund: 'صندوق',
  sukuk: 'صكوك',
  etf: 'ETF',
  commodity: 'سلعة',
  currency: 'عملة',
}

export const MARKETS = {
  US: 'أمريكي',
  BIST: 'تركي',
  GCC: 'خليجي',
  GLOBAL: 'عالمي',
}

/** ورقة مالية فارغة كقالب لنموذج الإضافة */
export function emptySecurity() {
  return {
    symbol: '',
    exchange: '',
    tvSymbol: '',
    type: 'stock',
    market: 'US',
    shariah: {
      status: 'not_screened',
      source: 'manual',
      purificationRatio: 0,
      lastChecked: '',
    },
    tags: [],
    notes: '',
  }
}

/** هل تغيّرت الورقة من متوافقة إلى غير متوافقة؟ (تنبيه بصري) */
export function turnedNonCompliant(security) {
  return (
    security.shariah.previousStatus === 'compliant' &&
    security.shariah.status === 'non_compliant'
  )
}

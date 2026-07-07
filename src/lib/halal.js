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
    details: {},
  }
}

// حقول تفصيلية للإدخال اليدوي حسب النوع — للأدوات التي لا تغطيها APIs جيداً
// (صكوك، صناديق إسلامية). كل حقل: [مفتاح، تسمية، نوع الإدخال].
export const INSTRUMENT_FIELDS = {
  sukuk: [
    ['issuer', 'الجهة المُصدِرة', 'text'],
    ['couponRate', 'نسبة الكوبون %', 'number'],
    ['maturityDate', 'تاريخ الاستحقاق', 'date'],
    ['faceValue', 'القيمة الاسمية', 'number'],
    ['currency', 'العملة', 'text'],
    ['structure', 'هيكل الصك (إجارة/مضاربة…)', 'text'],
  ],
  fund: [
    ['manager', 'مدير الصندوق', 'text'],
    ['nav', 'صافي قيمة الأصول (NAV)', 'number'],
    ['currency', 'العملة', 'text'],
    ['expenseRatio', 'نسبة المصاريف %', 'number'],
  ],
}

/** هل النوع يحتاج إدخالاً يدوياً منظماً (صكوك/صندوق)؟ */
export function hasInstrumentDetails(type) {
  return type === 'sukuk' || type === 'fund'
}

/** هل تغيّرت الورقة من متوافقة إلى غير متوافقة؟ (تنبيه بصري) */
export function turnedNonCompliant(security) {
  return (
    security.shariah.previousStatus === 'compliant' &&
    security.shariah.status === 'non_compliant'
  )
}

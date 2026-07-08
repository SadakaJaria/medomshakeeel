// Adapter لـ Halal Terminal API — https://api.halalterminal.com
// المصادقة: X-API-Key (مفتاح مجاني بالتسجيل بالإيميل).
// ملاحظة: توثيق الـ API محجوب من بيئة التطوير السحابية، فمسار الفرز الفردي
// مكتوب على النمط REST المعلن — إذا اختلف بالتوثيق الفعلي عدّل SCREEN_PATH فقط.

const BASE = 'https://api.halalterminal.com'
const API_KEY = import.meta.env.VITE_HALALTERMINAL_API_KEY

// الفرز الفردي — النمط المعلن /api/screen/{symbol}
const SCREEN_PATH = (symbol) => `/api/screen/${encodeURIComponent(symbol)}`
// تصفّح قاعدة الأسهم المتوافقة حسب القطاع — /api/database/search
const DATABASE_SEARCH_PATH = '/api/database/search'

export const hasScreeningKey = Boolean(API_KEY)

async function get(path) {
  if (!API_KEY) throw new Error('missing-key')
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'X-API-Key': API_KEY },
  })
  if (!res.ok) throw new Error(`halalterminal-${res.status}`)
  return res.json()
}

// تطبيع قيم الحالة المحتملة إلى حالاتنا الأربع
const STATUS_MAP = {
  compliant: 'compliant',
  halal: 'compliant',
  pass: 'compliant',
  non_compliant: 'non_compliant',
  'non-compliant': 'non_compliant',
  noncompliant: 'non_compliant',
  not_halal: 'non_compliant',
  haram: 'non_compliant',
  fail: 'non_compliant',
  questionable: 'questionable',
  doubtful: 'questionable',
  mixed: 'questionable',
  under_review: 'questionable',
}

function normalizeStatus(raw) {
  if (!raw) return 'not_screened'
  const key = String(raw).trim().toLowerCase().replace(/\s+/g, '_')
  return STATUS_MAP[key] ?? 'not_screened'
}

function pickFirst(obj, keys) {
  for (const key of keys) {
    const value = key
      .split('.')
      .reduce((o, part) => (o == null ? undefined : o[part]), obj)
    if (value !== undefined && value !== null) return value
  }
  return undefined
}

/**
 * البيانات الخام للفرز — النسب المالية ونتائج المنهجيات كما يرجعها المزود،
 * بلا تطبيع. تُستخدم في برومبت تحليل AI (ميزة النسب الشفافة).
 */
export async function screenSymbolDetailed(symbol) {
  const data = await get(SCREEN_PATH(symbol))
  return data?.data ?? data
}

/**
 * فرز رمز واحد — يرجع كائن shariah بمخطط المشروع.
 * الحقول تُلتقط بمرونة لأن أسماءها قد تختلف قليلاً عن التوثيق.
 */
export async function screenSymbol(symbol) {
  const data = await get(SCREEN_PATH(symbol))
  const payload = data?.data ?? data

  const rawStatus = pickFirst(payload, [
    'compliance',
    'complianceStatus',
    'status',
    'shariahStatus',
    'screening.status',
  ])
  const rawRatio = pickFirst(payload, [
    'purificationRatio',
    'purification.ratio',
    'purification_percentage',
    'purificationPercent',
  ])

  let purificationRatio = Number(rawRatio ?? 0)
  if (!Number.isFinite(purificationRatio)) purificationRatio = 0
  // بعض المزودين يرجعونها نسبة مئوية (2.5) بدل كسر (0.025)
  if (purificationRatio > 1) purificationRatio = purificationRatio / 100

  return {
    status: normalizeStatus(rawStatus),
    source: 'halalterminal',
    purificationRatio,
    lastChecked: new Date().toISOString().slice(0, 10),
  }
}

// خريطة بورصة → سوق المشروع
const EXCHANGE_MARKET = {
  NASDAQ: 'US', NYSE: 'US', AMEX: 'US', BATS: 'US',
  BIST: 'BIST',
  TADAWUL: 'GCC', DFM: 'GCC', ADX: 'GCC', QE: 'GCC', BOURSAKUWAIT: 'GCC', BHB: 'GCC', MSM: 'GCC',
}

function inferMarket(exchange) {
  return EXCHANGE_MARKET[String(exchange || '').toUpperCase()] ?? 'GLOBAL'
}

/** تطبيع عنصر من /api/database/search إلى ورقة كون حلال (أو null إن نقص الرمز) */
function mapToSecurity(item) {
  const symbol = String(
    pickFirst(item, ['symbol', 'ticker', 'Symbol']) ?? '',
  ).toUpperCase().trim()
  if (!symbol) return null

  const exchange = String(
    pickFirst(item, ['exchange', 'exchangeShortName', 'mic', 'exchangeCode']) ?? '',
  ).toUpperCase().trim()

  const tvSymbol = exchange ? `${exchange}:${symbol}` : symbol
  const rawStatus = pickFirst(item, [
    'compliance', 'complianceStatus', 'status', 'shariahStatus',
  ])
  let ratio = Number(
    pickFirst(item, ['purificationRatio', 'purification_percentage', 'purificationPercent']) ?? 0,
  )
  if (!Number.isFinite(ratio)) ratio = 0
  if (ratio > 1) ratio = ratio / 100

  const name = pickFirst(item, ['companyName', 'name', 'company'])
  const sector = pickFirst(item, ['sector', 'industry'])

  return {
    symbol,
    exchange,
    tvSymbol,
    type: 'stock',
    market: inferMarket(exchange),
    shariah: {
      status: normalizeStatus(rawStatus),
      source: 'halalterminal',
      purificationRatio: ratio,
      lastChecked: new Date().toISOString().slice(0, 10),
    },
    tags: sector ? [String(sector).toLowerCase()] : [],
    notes: name ? String(name) : '',
    details: {},
  }
}

/**
 * تصفّح قاعدة الأسهم المتوافقة — يرجع مصفوفة أوراق كون حلال مفحوصة جاهزة.
 * sector اختياري؛ limit يحدّ العدد. الحقول تُلتقط بمرونة (الشكل قد يختلف).
 */
export async function searchCompliant({ sector = '', limit = 50 } = {}) {
  const params = new URLSearchParams()
  if (sector) params.set('sector', sector)
  params.set('limit', String(limit))
  const data = await get(`${DATABASE_SEARCH_PATH}?${params}`)
  const list = data?.data ?? data?.results ?? data?.stocks ?? data
  if (!Array.isArray(list)) return []
  return list.map(mapToSecurity).filter(Boolean)
}

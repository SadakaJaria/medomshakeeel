// عميل Finnhub — أخبار السوق وأخبار الأوراق
// المفتاح من .env فقط (VITE_FINNHUB_API_KEY) — لا مفاتيح في الكود أبداً.

const BASE = 'https://finnhub.io/api/v1'
const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY

export const hasFinnhubKey = Boolean(API_KEY)

// كاش بسيط في sessionStorage — free tier = 60 نداء/دقيقة،
// والأخبار لا تحتاج تحديثاً أسرع من كل 10 دقائق.
const CACHE_TTL_MS = 10 * 60 * 1000

function cacheGet(cacheKey) {
  try {
    const raw = sessionStorage.getItem(cacheKey)
    if (!raw) return null
    const { t, data } = JSON.parse(raw)
    if (Date.now() - t > CACHE_TTL_MS) return null
    return data
  } catch {
    return null
  }
}

function cacheSet(cacheKey, data) {
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify({ t: Date.now(), data }))
  } catch {
    // التخزين ممتلئ أو معطّل — نتجاهل، الكاش تحسين فقط
  }
}

async function get(path, params = {}) {
  if (!API_KEY) throw new Error('missing-key')

  const query = new URLSearchParams({ ...params, token: API_KEY })
  const cacheKey = `finnhub:${path}?${new URLSearchParams(params)}`

  const cached = cacheGet(cacheKey)
  if (cached) return cached

  const res = await fetch(`${BASE}${path}?${query}`)
  if (!res.ok) throw new Error(`finnhub-${res.status}`)
  const data = await res.json()
  cacheSet(cacheKey, data)
  return data
}

/** أهم أخبار السوق العامة */
export async function getMarketNews(limit = 8) {
  const items = await get('/news', { category: 'general' })
  return (Array.isArray(items) ? items : []).slice(0, limit)
}

/** سعر لحظي — للسياق في تحليل AI (التغطية خارج US محدودة) */
export async function getQuote(symbol) {
  const q = await get('/quote', { symbol })
  // Finnhub يرجع أصفاراً للرموز غير المدعومة
  if (!q || !q.c) return null
  return {
    current: q.c,
    change: q.d,
    percentChange: q.dp,
    high: q.h,
    low: q.l,
    open: q.o,
    prevClose: q.pc,
  }
}

/**
 * أخبار ورقة محددة — آخر `days` يوم.
 * Finnhub يستخدم الرمز المجرد (AAPL) — التغطية خارج السوق الأمريكي ضعيفة،
 * فالنتيجة الفارغة متوقعة لأوراق BIST/الخليج.
 */
export async function getCompanyNews(symbol, { days = 14, limit = 8 } = {}) {
  const to = new Date()
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000)
  const fmt = (d) => d.toISOString().slice(0, 10)
  const items = await get('/company-news', {
    symbol,
    from: fmt(from),
    to: fmt(to),
  })
  return (Array.isArray(items) ? items : []).slice(0, limit)
}

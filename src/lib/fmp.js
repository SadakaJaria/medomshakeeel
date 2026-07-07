// عميل FMP — قوائم مالية ونسب لإثراء تحليل AI.
// المفتاح من .env (VITE_FMP_API_KEY). free tier: 800 نداء/يوم — نكاش بسخاء.

const BASE = 'https://financialmodelingprep.com/api/v3'
const API_KEY = import.meta.env.VITE_FMP_API_KEY

export const hasFmpKey = Boolean(API_KEY)

const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // القوائم المالية تتغير فصلياً

function cacheGet(key) {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const { t, data } = JSON.parse(raw)
    return Date.now() - t > CACHE_TTL_MS ? null : data
  } catch {
    return null
  }
}

function cacheSet(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), data }))
  } catch {
    // تحسين فقط
  }
}

async function get(path) {
  if (!API_KEY) throw new Error('missing-key')
  const sep = path.includes('?') ? '&' : '?'
  const res = await fetch(`${BASE}${path}${sep}apikey=${API_KEY}`)
  if (!res.ok) throw new Error(`fmp-${res.status}`)
  return res.json()
}

/**
 * يجمع لمحة مالية مركّزة لسهم: التعريف + النسب TTM + آخر قائمة دخل.
 * يرجع كائناً منظّماً (أو null إن فشل) — التغطية خارج US محدودة.
 */
export async function getFinancials(symbol) {
  const key = `fmp:fin:${symbol}`
  const cached = cacheGet(key)
  if (cached) return cached

  const [profileArr, ratiosArr, incomeArr] = await Promise.all([
    get(`/profile/${symbol}`).catch(() => []),
    get(`/ratios-ttm/${symbol}`).catch(() => []),
    get(`/income-statement/${symbol}?limit=1`).catch(() => []),
  ])

  const profile = profileArr?.[0]
  const ratios = ratiosArr?.[0]
  const income = incomeArr?.[0]
  if (!profile && !ratios && !income) return null

  const result = {
    profile: profile && {
      companyName: profile.companyName,
      sector: profile.sector,
      industry: profile.industry,
      marketCap: profile.mktCap,
      currency: profile.currency,
    },
    ratiosTTM: ratios && {
      peRatio: ratios.peRatioTTM,
      debtToEquity: ratios.debtEquityRatioTTM,
      currentRatio: ratios.currentRatioTTM,
      returnOnEquity: ratios.returnOnEquityTTM,
      grossProfitMargin: ratios.grossProfitMarginTTM,
      netProfitMargin: ratios.netProfitMarginTTM,
      dividendYield: ratios.dividendYielTTM ?? ratios.dividendYieldTTM,
    },
    latestIncome: income && {
      period: income.date,
      revenue: income.revenue,
      grossProfit: income.grossProfit,
      netIncome: income.netIncome,
      eps: income.eps,
    },
  }
  cacheSet(key, result)
  return result
}

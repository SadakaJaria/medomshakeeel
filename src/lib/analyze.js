// تحليل AI — يجمع السياق (سعر، أخبار، نسب الفرز الخام) ويرسله لـ /api/analyze.
// المفتاح لا يمر من هنا أبداً — النداء لـ Claude يتم server-side.

import { getQuote, getCompanyNews, hasFinnhubKey } from './finnhub'
import { screenSymbolDetailed, hasScreeningKey } from './screening'
import { getFinancials, hasFmpKey } from './fmp'

/** يجمع كل سياق ورقة متاح بالتوازي (كل جزء اختياري ويفشل بصمت) */
async function gatherContext(security) {
  const bareSymbol = security.symbol ?? security.tvSymbol.split(':').pop()
  const [quote, news, screening, financials] = await Promise.all([
    hasFinnhubKey ? getQuote(bareSymbol).catch(() => null) : null,
    hasFinnhubKey
      ? getCompanyNews(bareSymbol, { limit: 5 })
          .then((items) =>
            items.map(({ headline, source, datetime }) => ({
              headline,
              source,
              date: datetime
                ? new Date(datetime * 1000).toISOString().slice(0, 10)
                : undefined,
            })),
          )
          .catch(() => null)
      : null,
    hasScreeningKey ? screenSymbolDetailed(bareSymbol).catch(() => null) : null,
    hasFmpKey ? getFinancials(bareSymbol).catch(() => null) : null,
  ])
  return { security, quote, news, screening, financials }
}

const CACHE_TTL_MS = 60 * 60 * 1000 // التحليل مكلف — كاش ساعة

function cacheKey(tvSymbol) {
  return `analyze:${tvSymbol}`
}

function readCache(tvSymbol) {
  try {
    const raw = sessionStorage.getItem(cacheKey(tvSymbol))
    if (!raw) return null
    const { t, analysis, model } = JSON.parse(raw)
    if (Date.now() - t > CACHE_TTL_MS) return null
    return { analysis, model, cached: true }
  } catch {
    return null
  }
}

function writeCache(tvSymbol, analysis, model) {
  try {
    sessionStorage.setItem(
      cacheKey(tvSymbol),
      JSON.stringify({ t: Date.now(), analysis, model }),
    )
  } catch {
    // الكاش تحسين فقط
  }
}

/**
 * يحلّل ورقة مالية: يجمع السياق المتاح (كل جزء اختياري ويفشل بصمت)
 * ثم يستدعي الخادم. force=true يتجاوز الكاش.
 */
export async function analyzeSecurity(security, { force = false } = {}) {
  if (!force) {
    const cached = readCache(security.tvSymbol)
    if (cached) return cached
  }

  const context = await gatherContext(security)

  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(context),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message ?? `فشل التحليل (${res.status})`)
  }

  writeCache(security.tvSymbol, data.analysis, data.model)
  return { analysis: data.analysis, model: data.model, cached: false }
}

/**
 * مقارنة ورقتين ماليتين عبر AI — يجمع سياق كلٍّ منهما ويرسل mode=compare.
 * كاش بمفتاح مركّب من الرمزين.
 */
export async function compareSecurities(securityA, securityB, { force = false } = {}) {
  const pairKey = [securityA.tvSymbol, securityB.tvSymbol].sort().join('__')
  if (!force) {
    const cached = readCache(pairKey)
    if (cached) return cached
  }

  const [contextA, contextB] = await Promise.all([
    gatherContext(securityA),
    gatherContext(securityB),
  ])

  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'compare', items: [contextA, contextB] }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message ?? `فشلت المقارنة (${res.status})`)
  }

  writeCache(pairKey, data.analysis, data.model)
  return { analysis: data.analysis, model: data.model, cached: false }
}

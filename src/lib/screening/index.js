// طبقة الفرز الشرعي — محايدة تجاه المزود.
// المزود الحالي: Halal Terminal (قرار 2026-07). للتبديل: بدّل الاستيراد أدناه.

import { screenSymbol, hasScreeningKey } from './halalterminal'

export { hasScreeningKey }

/** الأنواع القابلة للفرز الآلي — السلع والعملات تُقيَّم يدوياً */
const SCREENABLE_TYPES = new Set(['stock', 'etf', 'fund'])

/** الحالة الشرعية شبه ثابتة — ما فُحص خلال هذه المدة يُتخطى */
const MAX_AGE_DAYS = 30

function isFresh(security) {
  const last = security.shariah.lastChecked
  if (!last) return false
  const ageMs = Date.now() - new Date(last).getTime()
  return ageMs < MAX_AGE_DAYS * 24 * 60 * 60 * 1000
}

/**
 * تحديث الفرز لمجموعة أوراق — تسلسلي مع مهلة قصيرة احتراماً للحصص.
 * force: أعد فحص حتى الحديثة.
 * onProgress(done, total): لتحديث الواجهة.
 * يرجع: { updated: [{tvSymbol, security}], skipped: [tvSymbol], failed: [{tvSymbol, error}] }
 */
export async function refreshScreening(securities, { force = false, onProgress } = {}) {
  const updated = []
  const skipped = []
  const failed = []

  const targets = securities.filter((s) => {
    if (!SCREENABLE_TYPES.has(s.type)) {
      skipped.push(s.tvSymbol)
      return false
    }
    if (!force && isFresh(s)) {
      skipped.push(s.tvSymbol)
      return false
    }
    return true
  })

  let done = 0
  for (const security of targets) {
    try {
      const shariah = await screenSymbol(security.symbol)
      updated.push({
        tvSymbol: security.tvSymbol,
        security: { ...security, shariah },
      })
    } catch (err) {
      failed.push({ tvSymbol: security.tvSymbol, error: err.message })
    }
    done += 1
    onProgress?.(done, targets.length)
    if (done < targets.length) {
      await new Promise((resolve) => setTimeout(resolve, 400))
    }
  }

  return { updated, skipped, failed }
}

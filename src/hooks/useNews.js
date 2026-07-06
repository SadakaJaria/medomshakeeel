/* oxlint-disable react-hooks/exhaustive-deps -- الـ deps يحددها المستدعي كمصفوفة */
import { useEffect, useState } from 'react'

/**
 * جلب أخبار مع حالات تحميل/خطأ.
 * fetcher: دالة async ترجع مصفوفة أخبار Finnhub.
 * deps: يعاد الجلب عند تغيّرها (مثل رمز الورقة).
 */
export function useNews(fetcher, deps) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetcher()
      .then((data) => {
        if (!cancelled) setItems(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? 'unknown')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    }, deps)

  return { items, loading, error }
}

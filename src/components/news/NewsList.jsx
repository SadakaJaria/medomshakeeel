import { hasFinnhubKey } from '../../lib/finnhub'

const relativeFmt = new Intl.RelativeTimeFormat('ar', { numeric: 'auto' })

/** "منذ ساعتين" بدل التاريخ الكامل — datetime من Finnhub بالثواني */
function timeAgo(unixSeconds) {
  const diffSec = unixSeconds - Math.floor(Date.now() / 1000)
  const abs = Math.abs(diffSec)
  if (abs < 3600) return relativeFmt.format(Math.round(diffSec / 60), 'minute')
  if (abs < 86400) return relativeFmt.format(Math.round(diffSec / 3600), 'hour')
  return relativeFmt.format(Math.round(diffSec / 86400), 'day')
}

/** قائمة أخبار — تُستخدم للداشبورد (سوق) وصفحة الورقة (شركة) */
function NewsList({ items, loading, error, emptyMessage }) {
  if (!hasFinnhubKey) {
    return (
      <p className="text-xs text-terminal-muted">
        أضف <span className="ltr-nums">VITE_FINNHUB_API_KEY</span> في ملف{' '}
        <span className="ltr-nums">.env</span> لتفعيل الأخبار (مفتاح مجاني من
        finnhub.io).
      </p>
    )
  }

  if (loading) {
    return <p className="text-xs text-terminal-muted">جارِ جلب الأخبار…</p>
  }

  if (error) {
    return (
      <p className="text-xs text-shariah-non-compliant">
        تعذّر جلب الأخبار — تحقق من المفتاح والاتصال.
      </p>
    )
  }

  if (items.length === 0) {
    return (
      <p className="text-xs text-terminal-muted">
        {emptyMessage ?? 'لا أخبار متاحة حالياً.'}
      </p>
    )
  }

  return (
    <ul className="divide-y divide-terminal-border/50">
      {items.map((item) => (
        <li key={item.id ?? item.url} className="py-2 first:pt-0 last:pb-0">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <p
              dir="auto"
              className="text-sm leading-snug transition-colors group-hover:text-market-up"
            >
              {item.headline}
            </p>
            <p className="mt-0.5 text-xs text-terminal-muted">
              <span dir="auto">{item.source}</span>
              {item.datetime ? ` · ${timeAgo(item.datetime)}` : ''}
            </p>
          </a>
        </li>
      ))}
    </ul>
  )
}

export default NewsList

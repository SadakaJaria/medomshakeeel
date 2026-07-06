import { SHARIAH_STATUSES, turnedNonCompliant } from '../../lib/halal'

/**
 * شارة الحالة الشرعية الملونة.
 * تعرض ⚠ إذا انقلبت الورقة من متوافقة إلى غير متوافقة.
 */
function ShariahBadge({ security }) {
  const status = SHARIAH_STATUSES[security.shariah.status]
    ? security.shariah.status
    : 'not_screened'
  const { label, badgeClass } = SHARIAH_STATUSES[status]
  const alert = turnedNonCompliant(security)

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium ${badgeClass}`}
      title={alert ? 'تنبيه: كانت متوافقة وأصبحت غير متوافقة' : undefined}
    >
      {alert && <span aria-hidden>⚠</span>}
      {label}
    </span>
  )
}

export default ShariahBadge

import { SHARIAH_SOURCES, turnedNonCompliant } from '../../lib/halal'
import ShariahBadge from './ShariahBadge'

/** بطاقة الحالة الشرعية الكاملة في صفحة الورقة المالية */
function ShariahCard({ security }) {
  const { shariah } = security
  const alert = turnedNonCompliant(security)

  return (
    <div className="rounded border border-terminal-border bg-terminal-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">الحالة الشرعية</h2>
        <ShariahBadge security={security} />
      </div>

      {alert && (
        <p className="mb-3 rounded border border-shariah-non-compliant/40 bg-shariah-non-compliant/10 p-2 text-xs text-shariah-non-compliant">
          ⚠ هذه الورقة كانت متوافقة وأصبحت غير متوافقة — راجع وضعها قبل أي
          قرار.
        </p>
      )}

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-terminal-muted">مصدر الفحص</dt>
          <dd>{SHARIAH_SOURCES[shariah.source] ?? shariah.source}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-terminal-muted">نسبة التطهير</dt>
          <dd className="ltr-nums">
            {((shariah.purificationRatio ?? 0) * 100).toFixed(2)}%
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-terminal-muted">آخر فحص</dt>
          <dd>
            {shariah.lastChecked ? (
              <span className="ltr-nums">
                {shariah.lastChecked.slice(0, 10)}
              </span>
            ) : (
              'لم تُفحص بعد'
            )}
          </dd>
        </div>
      </dl>

      {security.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {security.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-terminal-bg px-2 py-0.5 text-xs text-terminal-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {security.notes && (
        <p className="mt-3 border-t border-terminal-border/50 pt-3 text-xs text-terminal-muted">
          {security.notes}
        </p>
      )}
    </div>
  )
}

export default ShariahCard

import { INSTRUMENT_FIELDS, SECURITY_TYPES, hasInstrumentDetails } from '../../lib/halal'

/** بطاقة التفاصيل اليدوية للصكوك والصناديق في صفحة الورقة */
function InstrumentDetailsCard({ security }) {
  if (!hasInstrumentDetails(security.type)) return null

  const fields = INSTRUMENT_FIELDS[security.type]
  const details = security.details ?? {}
  const filled = fields.filter(([field]) => {
    const v = details[field]
    return v !== undefined && v !== null && String(v).trim() !== ''
  })

  return (
    <div className="rounded border border-terminal-border bg-terminal-surface p-4">
      <h2 className="mb-3 text-sm font-semibold">
        تفاصيل {SECURITY_TYPES[security.type] ?? security.type}
      </h2>

      {filled.length === 0 ? (
        <p className="text-xs text-terminal-muted">
          لا تفاصيل مُدخلة — أضفها من شاشة الكون الحلال.
        </p>
      ) : (
        <dl className="space-y-2 text-sm">
          {filled.map(([field, label, inputType]) => (
            <div key={field} className="flex justify-between gap-2">
              <dt className="text-terminal-muted">{label}</dt>
              <dd className={inputType === 'number' || inputType === 'date' ? 'ltr-nums' : ''}>
                {String(details[field])}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}

export default InstrumentDetailsCard

import { useState } from 'react'
import {
  SHARIAH_STATUSES,
  SHARIAH_SOURCES,
  SECURITY_TYPES,
  MARKETS,
  INSTRUMENT_FIELDS,
  hasInstrumentDetails,
  emptySecurity,
} from '../../lib/halal'

const inputClass =
  'w-full rounded border border-terminal-border bg-terminal-bg px-2 py-1.5 text-sm focus:border-terminal-muted focus:outline-none'
const labelClass = 'mb-1 block text-xs text-terminal-muted'

/**
 * نموذج إضافة/تعديل ورقة مالية.
 * initial=null → إضافة جديدة، وإلا تعديل الورقة الممرّرة.
 */
function SecurityForm({ initial, existingSymbols, onSubmit, onCancel }) {
  const isEdit = initial != null
  const [form, setForm] = useState(initial ?? emptySecurity())
  const [error, setError] = useState('')

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))
  const setShariah = (field, value) =>
    setForm((f) => ({ ...f, shariah: { ...f.shariah, [field]: value } }))
  const setDetail = (field, value) =>
    setForm((f) => ({ ...f, details: { ...f.details, [field]: value } }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const symbol = form.symbol.trim().toUpperCase()
    const exchange = form.exchange.trim().toUpperCase()
    if (!symbol || !exchange) {
      setError('الرمز والبورصة مطلوبان')
      return
    }
    const tvSymbol = `${exchange}:${symbol}`
    if (!isEdit && existingSymbols.includes(tvSymbol)) {
      setError(`الورقة ${tvSymbol} موجودة مسبقاً`)
      return
    }
    onSubmit({
      ...form,
      symbol,
      exchange,
      tvSymbol,
      tags:
        typeof form.tags === 'string'
          ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : form.tags,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded border border-terminal-border bg-terminal-surface p-4"
    >
      <h3 className="font-semibold">
        {isEdit ? `تعديل ${form.tvSymbol}` : 'إضافة ورقة مالية'}
      </h3>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className={labelClass} htmlFor="symbol">الرمز *</label>
          <input
            id="symbol"
            className={`${inputClass} ltr-nums`}
            value={form.symbol}
            onChange={(e) => set('symbol', e.target.value)}
            placeholder="AAPL"
            disabled={isEdit}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="exchange">البورصة *</label>
          <input
            id="exchange"
            className={`${inputClass} ltr-nums`}
            value={form.exchange}
            onChange={(e) => set('exchange', e.target.value)}
            placeholder="NASDAQ / BIST / TADAWUL"
            disabled={isEdit}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="type">النوع</label>
          <select
            id="type"
            className={inputClass}
            value={form.type}
            onChange={(e) => set('type', e.target.value)}
          >
            {Object.entries(SECURITY_TYPES).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="market">السوق</label>
          <select
            id="market"
            className={inputClass}
            value={form.market}
            onChange={(e) => set('market', e.target.value)}
          >
            {Object.entries(MARKETS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="status">الحالة الشرعية</label>
          <select
            id="status"
            className={inputClass}
            value={form.shariah.status}
            onChange={(e) => setShariah('status', e.target.value)}
          >
            {Object.entries(SHARIAH_STATUSES).map(([value, { label }]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="source">مصدر الفحص</label>
          <select
            id="source"
            className={inputClass}
            value={form.shariah.source}
            onChange={(e) => setShariah('source', e.target.value)}
          >
            {Object.entries(SHARIAH_SOURCES).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="ratio">
            نسبة التطهير (0 – 1)
          </label>
          <input
            id="ratio"
            type="number"
            min="0"
            max="1"
            step="0.001"
            className={`${inputClass} ltr-nums`}
            value={form.shariah.purificationRatio}
            onChange={(e) =>
              setShariah('purificationRatio', Number(e.target.value))
            }
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="lastChecked">تاريخ الفحص</label>
          <input
            id="lastChecked"
            type="date"
            className={`${inputClass} ltr-nums`}
            value={form.shariah.lastChecked?.slice(0, 10) ?? ''}
            onChange={(e) => setShariah('lastChecked', e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="tags">
            وسوم (مفصولة بفاصلة)
          </label>
          <input
            id="tags"
            className={inputClass}
            value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags}
            onChange={(e) => set('tags', e.target.value)}
            placeholder="tech, dividend"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="notes">ملاحظات</label>
          <input
            id="notes"
            className={inputClass}
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
          />
        </div>
      </div>

      {hasInstrumentDetails(form.type) && (
        <fieldset className="rounded border border-terminal-border/50 bg-terminal-bg p-3">
          <legend className="px-1 text-xs text-terminal-muted">
            تفاصيل {SECURITY_TYPES[form.type]} (إدخال يدوي)
          </legend>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INSTRUMENT_FIELDS[form.type].map(([field, label, inputType]) => (
              <div key={field}>
                <label className={labelClass} htmlFor={`d-${field}`}>{label}</label>
                <input
                  id={`d-${field}`}
                  type={inputType}
                  className={`${inputClass} ${inputType === 'number' || inputType === 'date' ? 'ltr-nums' : ''}`}
                  value={form.details?.[field] ?? ''}
                  onChange={(e) => setDetail(field, e.target.value)}
                />
              </div>
            ))}
          </div>
        </fieldset>
      )}

      {error && (
        <p className="text-sm text-shariah-non-compliant">{error}</p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-market-up/15 px-4 py-1.5 text-sm font-semibold text-market-up transition-colors hover:bg-market-up/25"
        >
          {isEdit ? 'حفظ التعديلات' : 'إضافة'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-terminal-border px-4 py-1.5 text-sm text-terminal-muted transition-colors hover:text-terminal-text"
        >
          إلغاء
        </button>
      </div>
    </form>
  )
}

export default SecurityForm

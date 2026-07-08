import { useState } from 'react'
import { searchCompliant, hasScreeningKey } from '../../lib/screening'

// قطاعات GICS الشائعة — القيمة تُرسل كـ sector للـ API
const SECTORS = [
  ['', 'كل القطاعات'],
  ['Technology', 'التقنية'],
  ['Healthcare', 'الصحة'],
  ['Energy', 'الطاقة'],
  ['Industrials', 'الصناعة'],
  ['Consumer Cyclical', 'الاستهلاكي الدوري'],
  ['Consumer Defensive', 'الاستهلاكي الدفاعي'],
  ['Basic Materials', 'المواد الأساسية'],
  ['Communication Services', 'الاتصالات'],
  ['Real Estate', 'العقارات'],
  ['Utilities', 'المرافق'],
]

const ctl =
  'rounded border border-terminal-border bg-terminal-bg px-2 py-1.5 text-sm focus:outline-none'

/**
 * استيراد كون مفحوص جاهز من Halal Terminal (قاعدة الأسهم المتوافقة).
 * onImport(securities) يستلم الأوراق المطبّعة ليدمجها السياق (يتخطى المكرر).
 */
function ImportUniverse({ onImport, existingSymbols }) {
  const [open, setOpen] = useState(false)
  const [sector, setSector] = useState('')
  const [limit, setLimit] = useState('50')
  const [state, setState] = useState({ status: 'idle' })

  const run = async () => {
    setState({ status: 'loading' })
    try {
      const found = await searchCompliant({ sector, limit: Number(limit) || 50 })
      const fresh = found.filter((s) => !existingSymbols.includes(s.tvSymbol))
      onImport(fresh)
      setState({
        status: 'done',
        summary: `وُجد ${found.length} · أُضيف ${fresh.length} · مكرر ${found.length - fresh.length}`,
      })
    } catch (err) {
      setState({ status: 'error', message: err.message })
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={!hasScreeningKey}
        title={
          hasScreeningKey
            ? 'استيراد أسهم متوافقة مفحوصة من قاعدة Halal Terminal'
            : 'أضف VITE_HALALTERMINAL_API_KEY في .env للتفعيل'
        }
        className="rounded border border-terminal-border px-3 py-1.5 text-sm text-terminal-muted transition-colors hover:text-terminal-text disabled:cursor-not-allowed disabled:opacity-50"
      >
        استيراد كون جاهز
      </button>
    )
  }

  return (
    <div className="w-full rounded border border-terminal-border bg-terminal-surface p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">استيراد كون مفحوص (Halal Terminal)</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-terminal-muted hover:text-terminal-text"
        >
          إغلاق
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <label className="text-xs text-terminal-muted">
          القطاع
          <select
            className={`${ctl} mt-1 block`}
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          >
            {SECTORS.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <label className="text-xs text-terminal-muted">
          الحد الأقصى
          <input
            type="number"
            min="1"
            max="500"
            className={`${ctl} ltr-nums mt-1 block w-24`}
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
        </label>
        <button
          type="button"
          onClick={run}
          disabled={state.status === 'loading'}
          className="rounded bg-market-up/15 px-3 py-1.5 text-sm font-semibold text-market-up transition-colors hover:bg-market-up/25 disabled:opacity-50"
        >
          {state.status === 'loading' ? 'جارِ الاستيراد…' : 'استورد'}
        </button>
        {state.status === 'done' && (
          <span className="text-xs text-terminal-muted">{state.summary}</span>
        )}
        {state.status === 'error' && (
          <span className="text-xs text-shariah-non-compliant">{state.message}</span>
        )}
      </div>

      <p className="mt-2 text-xs text-terminal-muted">
        يجلب أسهماً متوافقة مفحوصة مسبقاً ويدمجها (يتخطى المكرر). راجع الحالات بعد
        الاستيراد — البيانات من Halal Terminal.
      </p>
    </div>
  )
}

export default ImportUniverse

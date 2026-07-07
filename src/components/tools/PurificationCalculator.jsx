import { useState } from 'react'
import { useHalalUniverse } from '../../context/HalalUniverseContext'
import { calcPurification, fmtMoney } from '../../lib/zakat'

const inputClass =
  'w-full rounded border border-terminal-border bg-terminal-bg px-2 py-1.5 text-sm ltr-nums focus:border-terminal-muted focus:outline-none'
const labelClass = 'mb-1 block text-xs text-terminal-muted'

/**
 * حاسبة تطهير الأرباح — اختيار ورقة من الكون الحلال يملأ نسبة التطهير
 * تلقائياً من بيانات الفرز، مع إمكانية التعديل اليدوي.
 */
function PurificationCalculator() {
  const { universe } = useHalalUniverse()
  const [selected, setSelected] = useState('')
  const [dividends, setDividends] = useState('')
  const [ratioInput, setRatioInput] = useState('')

  const handleSelect = (tvSymbol) => {
    setSelected(tvSymbol)
    const security = universe.find((s) => s.tvSymbol === tvSymbol)
    if (security) {
      // النسبة تُعرض كنسبة مئوية للإدخال الأسهل
      setRatioInput(
        String(((security.shariah.purificationRatio ?? 0) * 100).toFixed(2)),
      )
    }
  }

  const num = (v) => (v === '' ? 0 : Number(v) || 0)
  const result = calcPurification({
    dividends: num(dividends),
    purificationRatio: num(ratioInput) / 100,
  })

  return (
    <div className="rounded border border-terminal-border bg-terminal-surface p-4">
      <h2 className="mb-3 font-semibold">حاسبة تطهير الأرباح</h2>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="pu-security">
            الورقة (اختياري — يملأ النسبة)
          </label>
          <select
            id="pu-security"
            className="w-full rounded border border-terminal-border bg-terminal-bg px-2 py-1.5 text-sm focus:outline-none"
            value={selected}
            onChange={(e) => handleSelect(e.target.value)}
          >
            <option value="">— يدوي —</option>
            {universe.map((s) => (
              <option key={s.tvSymbol} value={s.tvSymbol}>
                {s.tvSymbol}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="pu-dividends">
            التوزيعات المستلمة
          </label>
          <input
            id="pu-dividends"
            type="number"
            min="0"
            className={inputClass}
            value={dividends}
            onChange={(e) => setDividends(e.target.value)}
            placeholder="0"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="pu-ratio">
            نسبة التطهير %
          </label>
          <input
            id="pu-ratio"
            type="number"
            min="0"
            max="100"
            step="0.01"
            className={inputClass}
            value={ratioInput}
            onChange={(e) => setRatioInput(e.target.value)}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="mt-4 space-y-1 rounded border border-terminal-border/50 bg-terminal-bg p-3 text-sm">
        <p className="flex justify-between font-semibold">
          <span>مبلغ التطهير (يُتصدَّق به)</span>
          <span data-testid="purification-amount" className="ltr-nums text-shariah-questionable">
            {fmtMoney(result.amount)}
          </span>
        </p>
        <p className="flex justify-between text-terminal-muted">
          <span>الصافي الطيب</span>
          <span className="ltr-nums">{fmtMoney(result.clean)}</span>
        </p>
      </div>

      <p className="mt-3 text-xs text-terminal-muted">
        المنهجية: التوزيعات × نسبة الدخل غير المتوافق. حدّث نسب الفحص من شاشة
        الكون الحلال حتى تكون النسبة هنا حديثة.
      </p>
    </div>
  )
}

export default PurificationCalculator

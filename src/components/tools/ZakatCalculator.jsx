import { useEffect, useState } from 'react'
import { calcZakat, fmtMoney, NISAB_GOLD_GRAMS, ZAKAT_RATES } from '../../lib/zakat'

const STORAGE_KEY = 'zakat-inputs'

const inputClass =
  'w-full rounded border border-terminal-border bg-terminal-bg px-2 py-1.5 text-sm ltr-nums focus:border-terminal-muted focus:outline-none'
const labelClass = 'mb-1 block text-xs text-terminal-muted'

const DEFAULTS = {
  cash: '',
  stocks: '',
  metals: '',
  other: '',
  debts: '',
  goldPricePerGram: '',
  yearType: 'hijri',
}

function loadInputs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

const FIELDS = [
  ['cash', 'نقد وودائع'],
  ['stocks', 'أسهم للمتاجرة (قيمة سوقية)'],
  ['metals', 'ذهب وفضة (قيمة)'],
  ['other', 'أصول زكوية أخرى'],
  ['debts', 'ديون مستحقة عليك (تُخصم)'],
]

function ZakatCalculator() {
  const [inputs, setInputs] = useState(loadInputs)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs))
  }, [inputs])

  const set = (field, value) => setInputs((prev) => ({ ...prev, [field]: value }))
  const num = (v) => (v === '' ? 0 : Number(v) || 0)

  const result = calcZakat({
    cash: num(inputs.cash),
    stocks: num(inputs.stocks),
    metals: num(inputs.metals),
    other: num(inputs.other),
    debts: num(inputs.debts),
    goldPricePerGram: num(inputs.goldPricePerGram),
    yearType: inputs.yearType,
  })

  return (
    <div className="rounded border border-terminal-border bg-terminal-surface p-4">
      <h2 className="mb-3 font-semibold">حاسبة الزكاة</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {FIELDS.map(([field, label]) => (
          <div key={field}>
            <label className={labelClass} htmlFor={`zk-${field}`}>{label}</label>
            <input
              id={`zk-${field}`}
              type="number"
              min="0"
              className={inputClass}
              value={inputs[field]}
              onChange={(e) => set(field, e.target.value)}
              placeholder="0"
            />
          </div>
        ))}
        <div>
          <label className={labelClass} htmlFor="zk-gold">
            سعر جرام الذهب (بعملتك)
          </label>
          <input
            id="zk-gold"
            type="number"
            min="0"
            className={inputClass}
            value={inputs.goldPricePerGram}
            onChange={(e) => set('goldPricePerGram', e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="zk-year">نوع السنة</label>
          <select
            id="zk-year"
            className="w-full rounded border border-terminal-border bg-terminal-bg px-2 py-1.5 text-sm focus:outline-none"
            value={inputs.yearType}
            onChange={(e) => set('yearType', e.target.value)}
          >
            {Object.entries(ZAKAT_RATES).map(([value, { label }]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 space-y-1 rounded border border-terminal-border/50 bg-terminal-bg p-3 text-sm">
        <p className="flex justify-between text-terminal-muted">
          <span>النصاب ({NISAB_GOLD_GRAMS} جرام ذهب)</span>
          <span className="ltr-nums">{fmtMoney(result.nisab)}</span>
        </p>
        <p className="flex justify-between text-terminal-muted">
          <span>صافي الأصول الزكوية</span>
          <span className="ltr-nums">{fmtMoney(result.netAssets)}</span>
        </p>
        <p className="flex justify-between font-semibold">
          <span>الزكاة الواجبة</span>
          <span
            data-testid="zakat-amount"
            className={`ltr-nums ${result.isDue ? 'text-market-up' : 'text-terminal-muted'}`}
          >
            {result.isDue ? fmtMoney(result.amount) : 'دون النصاب'}
          </span>
        </p>
      </div>

      <p className="mt-3 text-xs text-terminal-muted">
        حساب تقريبي للتنظيم الشخصي — تحقق من التفاصيل الفقهية (حولان الحول،
        نية المتاجرة…) مع جهة موثوقة.
      </p>
    </div>
  )
}

export default ZakatCalculator

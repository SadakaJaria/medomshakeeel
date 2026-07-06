import { useRef, useState } from 'react'
import { useHalalUniverse } from '../context/HalalUniverseContext'
import { SHARIAH_STATUSES, SECURITY_TYPES, MARKETS } from '../lib/halal'
import ShariahBadge from '../components/halal/ShariahBadge'
import SecurityForm from '../components/halal/SecurityForm'

const filterClass =
  'rounded border border-terminal-border bg-terminal-surface px-2 py-1.5 text-sm focus:outline-none'

function HalalUniverse() {
  const {
    universe,
    addSecurity,
    updateSecurity,
    removeSecurity,
    toggleWatchlist,
    replaceUniverse,
  } = useHalalUniverse()

  const [search, setSearch] = useState('')
  const [marketFilter, setMarketFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [formMode, setFormMode] = useState(null) // null | 'add' | security
  const importRef = useRef(null)

  const filtered = universe.filter((s) => {
    const q = search.trim().toLowerCase()
    if (
      q &&
      !s.symbol.toLowerCase().includes(q) &&
      !s.tvSymbol.toLowerCase().includes(q) &&
      !s.notes.toLowerCase().includes(q) &&
      !s.tags.some((t) => t.toLowerCase().includes(q))
    )
      return false
    if (marketFilter && s.market !== marketFilter) return false
    if (typeFilter && s.type !== typeFilter) return false
    if (statusFilter && s.shariah.status !== statusFilter) return false
    return true
  })

  const handleSubmit = (security) => {
    if (formMode === 'add') addSecurity(security)
    else updateSecurity(formMode.tvSymbol, security)
    setFormMode(null)
  }

  const handleDelete = (s) => {
    if (window.confirm(`حذف ${s.tvSymbol} من الكون الحلال؟`)) {
      removeSecurity(s.tvSymbol)
    }
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(universe, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'halal-universe.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        if (!Array.isArray(parsed)) throw new Error('ليست مصفوفة')
        if (window.confirm(`استبدال القائمة الحالية بـ ${parsed.length} ورقة؟`)) {
          replaceUniverse(parsed)
        }
      } catch {
        window.alert('ملف JSON غير صالح')
      }
      e.target.value = ''
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-semibold">الكون الحلال</h1>
        <span className="text-sm text-terminal-muted">
          {universe.length} ورقة
        </span>
        <div className="ms-auto flex gap-2">
          <button
            type="button"
            onClick={() => setFormMode('add')}
            className="rounded bg-market-up/15 px-3 py-1.5 text-sm font-semibold text-market-up transition-colors hover:bg-market-up/25"
          >
            + إضافة ورقة
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="rounded border border-terminal-border px-3 py-1.5 text-sm text-terminal-muted transition-colors hover:text-terminal-text"
          >
            تصدير JSON
          </button>
          <button
            type="button"
            onClick={() => importRef.current?.click()}
            className="rounded border border-terminal-border px-3 py-1.5 text-sm text-terminal-muted transition-colors hover:text-terminal-text"
          >
            استيراد
          </button>
          <input
            ref={importRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </div>

      {formMode && (
        <SecurityForm
          initial={formMode === 'add' ? null : formMode}
          existingSymbols={universe.map((s) => s.tvSymbol)}
          onSubmit={handleSubmit}
          onCancel={() => setFormMode(null)}
        />
      )}

      <div className="flex flex-wrap gap-2">
        <input
          className={`${filterClass} min-w-48 flex-1`}
          placeholder="بحث بالرمز، الوسوم، الملاحظات…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={filterClass}
          value={marketFilter}
          onChange={(e) => setMarketFilter(e.target.value)}
        >
          <option value="">كل الأسواق</option>
          {Object.entries(MARKETS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select
          className={filterClass}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">كل الأنواع</option>
          {Object.entries(SECURITY_TYPES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select
          className={filterClass}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">كل الحالات</option>
          {Object.entries(SHARIAH_STATUSES).map(([value, { label }]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded border border-terminal-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-terminal-border bg-terminal-surface text-start text-xs text-terminal-muted">
              <th className="px-3 py-2 text-start">الرمز</th>
              <th className="px-3 py-2 text-start">السوق</th>
              <th className="px-3 py-2 text-start">النوع</th>
              <th className="px-3 py-2 text-start">الحالة الشرعية</th>
              <th className="px-3 py-2 text-start">آخر فحص</th>
              <th className="px-3 py-2 text-start">ملاحظات</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-6 text-center text-terminal-muted"
                >
                  لا توجد أوراق مطابقة
                </td>
              </tr>
            )}
            {filtered.map((s) => (
              <tr
                key={s.tvSymbol}
                className="border-b border-terminal-border/50 transition-colors last:border-0 hover:bg-terminal-surface"
              >
                <td className="px-3 py-2">
                  <span className="ltr-nums font-medium">{s.tvSymbol}</span>
                </td>
                <td className="px-3 py-2 text-terminal-muted">
                  {MARKETS[s.market] ?? s.market}
                </td>
                <td className="px-3 py-2 text-terminal-muted">
                  {SECURITY_TYPES[s.type] ?? s.type}
                </td>
                <td className="px-3 py-2">
                  <ShariahBadge security={s} />
                </td>
                <td className="px-3 py-2 text-terminal-muted">
                  {s.shariah.lastChecked ? (
                    <span className="ltr-nums text-xs">
                      {s.shariah.lastChecked.slice(0, 10)}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="max-w-48 truncate px-3 py-2 text-terminal-muted">
                  {s.notes || '—'}
                </td>
                <td className="px-3 py-2 text-end">
                  <button
                    type="button"
                    onClick={() => toggleWatchlist(s.tvSymbol)}
                    title={s.watchlist ? 'إزالة من المتابعة' : 'إضافة للمتابعة'}
                    className={`me-2 transition-colors ${
                      s.watchlist
                        ? 'text-shariah-questionable'
                        : 'text-terminal-muted hover:text-shariah-questionable'
                    }`}
                  >
                    {s.watchlist ? '★' : '☆'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormMode(s)}
                    className="me-2 text-xs text-terminal-muted transition-colors hover:text-terminal-text"
                  >
                    تعديل
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(s)}
                    className="text-xs text-terminal-muted transition-colors hover:text-shariah-non-compliant"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HalalUniverse

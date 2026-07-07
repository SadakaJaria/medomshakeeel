import { Link, useNavigate, useParams } from 'react-router-dom'
import { useHalalUniverse } from '../context/HalalUniverseContext'
import { MARKETS, SECURITY_TYPES } from '../lib/halal'
import AdvancedChart from '../components/tradingview/AdvancedChart'
import SymbolInfo from '../components/tradingview/SymbolInfo'
import ShariahCard from '../components/halal/ShariahCard'
import NewsList from '../components/news/NewsList'
import AnalyzeCard from '../components/analysis/AnalyzeCard'
import { getCompanyNews } from '../lib/finnhub'
import { useNews } from '../hooks/useNews'

/** أخبار الورقة — الرمز المجرد (AAPL) كما يتوقعه Finnhub */
function SecurityNews({ symbol }) {
  const news = useNews(() => getCompanyNews(symbol), [symbol])
  return (
    <NewsList
      {...news}
      emptyMessage="لا أخبار لهذه الورقة — تغطية Finnhub خارج السوق الأمريكي محدودة."
    />
  )
}

function SecurityPage() {
  const { tvSymbol: rawParam } = useParams()
  const tvSymbol = rawParam ? decodeURIComponent(rawParam) : null
  const navigate = useNavigate()
  const { universe, toggleWatchlist } = useHalalUniverse()

  const security = tvSymbol
    ? universe.find((s) => s.tvSymbol === tvSymbol)
    : null

  // بدون رمز: اختيار ورقة من الكون الحلال
  if (!tvSymbol) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">الورقة المالية</h1>
        <div className="rounded border border-terminal-border bg-terminal-surface p-4 text-sm">
          <label htmlFor="picker" className="mb-2 block text-terminal-muted">
            اختر ورقة من الكون الحلال:
          </label>
          <select
            id="picker"
            className="w-full max-w-sm rounded border border-terminal-border bg-terminal-bg px-2 py-1.5 focus:outline-none"
            defaultValue=""
            onChange={(e) =>
              e.target.value &&
              navigate(`/security/${encodeURIComponent(e.target.value)}`)
            }
          >
            <option value="" disabled>
              — اختر —
            </option>
            {universe.map((s) => (
              <option key={s.tvSymbol} value={s.tvSymbol}>
                {s.tvSymbol}
                {s.notes ? ` — ${s.notes}` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="ltr-nums text-xl font-semibold">{tvSymbol}</h1>
        {security ? (
          <>
            <span className="text-sm text-terminal-muted">
              {SECURITY_TYPES[security.type] ?? security.type} ·{' '}
              {MARKETS[security.market] ?? security.market}
              {security.notes ? ` · ${security.notes}` : ''}
            </span>
            <button
              type="button"
              onClick={() => toggleWatchlist(security.tvSymbol)}
              title={
                security.watchlist ? 'إزالة من المتابعة' : 'إضافة للمتابعة'
              }
              className={`text-lg transition-colors ${
                security.watchlist
                  ? 'text-shariah-questionable'
                  : 'text-terminal-muted hover:text-shariah-questionable'
              }`}
            >
              {security.watchlist ? '★' : '☆'}
            </button>
          </>
        ) : (
          <span className="rounded border border-shariah-questionable/40 bg-shariah-questionable/10 px-2 py-0.5 text-xs text-shariah-questionable">
            غير موجودة في الكون الحلال —{' '}
            <Link to="/universe" className="underline">
              أضفها من شاشة الإدارة
            </Link>
          </span>
        )}
      </div>

      <SymbolInfo tvSymbol={tvSymbol} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AdvancedChart tvSymbol={tvSymbol} />
        </div>

        <div className="space-y-4">
          {security && <ShariahCard security={security} />}

          <AnalyzeCard
            security={
              security ?? {
                tvSymbol,
                symbol: tvSymbol.split(':').pop(),
                shariah: { status: 'not_screened', source: 'manual' },
              }
            }
          />

          <div className="rounded border border-terminal-border bg-terminal-surface p-4">
            <h2 className="mb-2 text-sm font-semibold">أخبار الورقة</h2>
            <SecurityNews symbol={tvSymbol.split(':').pop()} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecurityPage

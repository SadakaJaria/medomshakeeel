import { Link } from 'react-router-dom'
import { useHalalUniverse } from '../context/HalalUniverseContext'
import { MARKETS } from '../lib/halal'
import WatchlistCard from '../components/halal/WatchlistCard'

function Watchlist() {
  const { universe, toggleWatchlist } = useHalalUniverse()
  const watched = universe.filter((s) => s.watchlist)

  // تقسيم حسب السوق مع الحفاظ على ترتيب MARKETS
  const groups = Object.keys(MARKETS)
    .map((market) => ({
      market,
      items: watched.filter((s) => s.market === market),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">قوائم المتابعة</h1>
        <span className="text-sm text-terminal-muted">
          {watched.length} ورقة
        </span>
      </div>

      {watched.length === 0 && (
        <div className="rounded border border-terminal-border bg-terminal-surface p-6 text-center text-sm text-terminal-muted">
          <p>ما في أوراق بالمتابعة بعد.</p>
          <p className="mt-2">
            روح على{' '}
            <Link to="/universe" className="text-market-up hover:underline">
              الكون الحلال
            </Link>{' '}
            واضغط ☆ عند أي ورقة لإضافتها.
          </p>
        </div>
      )}

      {groups.map(({ market, items }) => (
        <section key={market}>
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-terminal-muted">
            {MARKETS[market]}
            <span className="ltr-nums text-xs">({items.length})</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((s) => (
              <WatchlistCard
                key={s.tvSymbol}
                security={s}
                onRemove={() => toggleWatchlist(s.tvSymbol)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default Watchlist

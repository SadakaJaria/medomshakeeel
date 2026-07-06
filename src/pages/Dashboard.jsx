import { Link } from 'react-router-dom'
import TickerTape from '../components/tradingview/TickerTape'
import MarketOverview from '../components/tradingview/MarketOverview'
import { useHalalUniverse } from '../context/HalalUniverseContext'
import { SHARIAH_STATUSES } from '../lib/halal'
import { getMarketNews } from '../lib/finnhub'
import { useNews } from '../hooks/useNews'
import NewsList from '../components/news/NewsList'

function Dashboard() {
  const { universe } = useHalalUniverse()
  const news = useNews(() => getMarketNews(8), [])
  const counts = universe.reduce((acc, s) => {
    const status = SHARIAH_STATUSES[s.shariah.status]
      ? s.shariah.status
      : 'not_screened'
    acc[status] = (acc[status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-4">
      <TickerTape />

      <div className="grid gap-4 lg:grid-cols-2">
        <section>
          <h2 className="mb-2 text-sm font-semibold text-terminal-muted">
            نظرة عامة على الأسواق
          </h2>
          <MarketOverview />
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="mb-2 text-sm font-semibold text-terminal-muted">
              أهم الأخبار
            </h2>
            <div className="rounded border border-terminal-border bg-terminal-surface p-4">
              <NewsList {...news} />
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold text-terminal-muted">
              الكون الحلال
            </h2>
            <Link
              to="/universe"
              className="block rounded border border-terminal-border bg-terminal-surface p-4 transition-colors hover:border-terminal-muted"
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <span>
                  <span className="ltr-nums font-semibold">
                    {universe.length}
                  </span>{' '}
                  ورقة معتمدة
                </span>
                {Object.entries(SHARIAH_STATUSES).map(([status, { label }]) =>
                  counts[status] ? (
                    <span key={status} className="text-terminal-muted">
                      {label}:{' '}
                      <span className="ltr-nums">{counts[status]}</span>
                    </span>
                  ) : null,
                )}
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard

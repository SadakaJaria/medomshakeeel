import TickerTape from '../components/tradingview/TickerTape'
import MarketOverview from '../components/tradingview/MarketOverview'

function Dashboard() {
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
            <div className="rounded border border-terminal-border bg-terminal-surface p-4 text-sm text-terminal-muted">
              أخبار السوق اليومية — تُربط مع Finnhub في بند لاحق.
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold text-terminal-muted">
              الكون الحلال
            </h2>
            <div className="rounded border border-terminal-border bg-terminal-surface p-4 text-sm text-terminal-muted">
              ملخص حالة الأوراق المعتمدة — يُبنى بعد بنية halal-universe.
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard

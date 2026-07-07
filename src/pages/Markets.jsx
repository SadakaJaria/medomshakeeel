import SectorHeatmap from '../components/tradingview/SectorHeatmap'
import EconomicCalendar from '../components/tradingview/EconomicCalendar'

function Markets() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">الأسواق</h1>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-terminal-muted">
          خريطة قطاعات S&P 500
        </h2>
        <SectorHeatmap />
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-terminal-muted">
          التقويم الاقتصادي (أمريكا، تركيا، الخليج، أوروبا)
        </h2>
        <EconomicCalendar />
      </section>
    </div>
  )
}

export default Markets

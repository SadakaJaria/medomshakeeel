import { useTheme } from '../../context/ThemeContext'
import TradingViewEmbed from './TradingViewEmbed'

/** التقويم الاقتصادي — أحداث الأسواق التي نتابعها */
function EconomicCalendar() {
  const { theme } = useTheme()

  return (
    <div className="h-[500px] overflow-hidden rounded border border-terminal-border bg-terminal-surface">
      <TradingViewEmbed
        widget="events"
        config={{
          colorTheme: theme,
          isTransparent: true,
          locale: 'ar_AE',
          countryFilter: 'us,tr,sa,ae,qa,kw,eu',
          importanceFilter: '-1,0,1',
          width: '100%',
          height: '100%',
        }}
        className="h-full [&>div]:h-full"
      />
    </div>
  )
}

export default EconomicCalendar

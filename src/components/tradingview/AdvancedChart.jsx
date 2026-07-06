import { useTheme } from '../../context/ThemeContext'
import TradingViewEmbed from './TradingViewEmbed'

/** الشارت المتقدم — قلب صفحة الورقة المالية */
function AdvancedChart({ tvSymbol }) {
  const { theme } = useTheme()

  return (
    <div className="h-[500px] overflow-hidden rounded border border-terminal-border bg-terminal-surface lg:h-[600px]">
      <TradingViewEmbed
        widget="advanced-chart"
        config={{
          autosize: true,
          symbol: tvSymbol,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme,
          style: '1',
          locale: 'ar_AE',
          enable_publishing: false,
          allow_symbol_change: false,
          withdateranges: true,
          hide_side_toolbar: false,
          calendar: false,
          support_host: 'https://www.tradingview.com',
        }}
        className="h-full [&>div]:h-full"
      />
    </div>
  )
}

export default AdvancedChart

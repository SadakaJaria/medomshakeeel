import { useTheme } from '../../context/ThemeContext'
import TradingViewEmbed from './TradingViewEmbed'

/** خريطة حرارية لقطاعات S&P 500 — حجم المربع = القيمة السوقية، اللون = التغيّر */
function SectorHeatmap() {
  const { theme } = useTheme()

  return (
    <div className="h-[500px] overflow-hidden rounded border border-terminal-border bg-terminal-surface">
      <TradingViewEmbed
        widget="stock-heatmap"
        config={{
          exchanges: [],
          dataSource: 'SPX500',
          grouping: 'sector',
          blockSize: 'market_cap_basic',
          blockColor: 'change',
          locale: 'ar_AE',
          symbolUrl: '',
          colorTheme: theme,
          hasTopBar: false,
          isDataSetEnabled: false,
          isZoomEnabled: true,
          hasSymbolTooltip: true,
          isMonoSize: false,
          width: '100%',
          height: '100%',
        }}
        className="h-full [&>div]:h-full"
      />
    </div>
  )
}

export default SectorHeatmap

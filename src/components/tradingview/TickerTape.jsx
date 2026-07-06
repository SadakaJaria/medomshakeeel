import { useTheme } from '../../context/ThemeContext'
import TradingViewEmbed from './TradingViewEmbed'

// شريط أسعار متحرك: أمريكي + BIST + خليجي + ذهب وعملات
const symbols = [
  { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
  { proName: 'FOREXCOM:NSXUSD', title: 'Nasdaq 100' },
  { proName: 'BIST:XU100', title: 'BIST 100' },
  { proName: 'TADAWUL:TASI', title: 'TASI' },
  { proName: 'OANDA:XAUUSD', title: 'الذهب' },
  { proName: 'FX_IDC:USDTRY', title: 'USD/TRY' },
  { proName: 'FX_IDC:USDSAR', title: 'USD/SAR' },
  { proName: 'FX:EURUSD', title: 'EUR/USD' },
]

function TickerTape() {
  const { theme } = useTheme()

  return (
    <TradingViewEmbed
      widget="ticker-tape"
      config={{
        symbols,
        showSymbolLogo: true,
        colorTheme: theme,
        isTransparent: true,
        displayMode: 'adaptive',
        locale: 'ar_AE',
      }}
      className="min-h-11 overflow-hidden rounded border border-terminal-border bg-terminal-surface"
    />
  )
}

export default TickerTape

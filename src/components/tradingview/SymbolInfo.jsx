import { useTheme } from '../../context/ThemeContext'
import TradingViewEmbed from './TradingViewEmbed'

/** شريط معلومات الرمز: السعر، التغيّر، أعلى/أدنى… */
function SymbolInfo({ tvSymbol }) {
  const { theme } = useTheme()

  return (
    <TradingViewEmbed
      widget="symbol-info"
      config={{
        symbol: tvSymbol,
        colorTheme: theme,
        isTransparent: true,
        locale: 'ar_AE',
        width: '100%',
      }}
      className="min-h-20 overflow-hidden rounded border border-terminal-border bg-terminal-surface"
    />
  )
}

export default SymbolInfo

import { useTheme } from '../../context/ThemeContext'
import TradingViewEmbed from './TradingViewEmbed'

/** سعر + تغيّر لرمز واحد — يُستخدم في بطاقات الـ Watchlist */
function SingleQuote({ tvSymbol }) {
  const { theme } = useTheme()

  return (
    <TradingViewEmbed
      widget="single-quote"
      config={{
        symbol: tvSymbol,
        colorTheme: theme,
        isTransparent: true,
        locale: 'ar_AE',
        width: '100%',
      }}
      className="min-h-24"
    />
  )
}

export default SingleQuote

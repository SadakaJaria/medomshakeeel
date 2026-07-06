import { useTheme } from '../../context/ThemeContext'
import TradingViewEmbed from './TradingViewEmbed'

// نظرة عامة: مؤشرات + عملات + ذهب وسلع — بتبويبات
const tabs = [
  {
    title: 'المؤشرات',
    symbols: [
      { s: 'FOREXCOM:SPXUSD', d: 'S&P 500' },
      { s: 'FOREXCOM:NSXUSD', d: 'Nasdaq 100' },
      { s: 'FOREXCOM:DJI', d: 'Dow Jones' },
      { s: 'BIST:XU100', d: 'BIST 100' },
      { s: 'TADAWUL:TASI', d: 'تداول السعودية' },
      { s: 'DFM:DFMGI', d: 'سوق دبي' },
    ],
  },
  {
    title: 'العملات',
    symbols: [
      { s: 'FX_IDC:USDTRY', d: 'دولار / ليرة تركية' },
      { s: 'FX_IDC:USDSAR', d: 'دولار / ريال سعودي' },
      { s: 'FX:EURUSD', d: 'يورو / دولار' },
      { s: 'FX:GBPUSD', d: 'جنيه / دولار' },
      { s: 'FX_IDC:EURTRY', d: 'يورو / ليرة تركية' },
    ],
  },
  {
    title: 'الذهب والسلع',
    symbols: [
      { s: 'OANDA:XAUUSD', d: 'الذهب' },
      { s: 'OANDA:XAGUSD', d: 'الفضة' },
      { s: 'TVC:USOIL', d: 'النفط الخام' },
      { s: 'TVC:UKOIL', d: 'برنت' },
    ],
  },
]

function MarketOverview() {
  const { theme } = useTheme()

  return (
    <TradingViewEmbed
      widget="market-overview"
      config={{
        colorTheme: theme,
        dateRange: '12M',
        showChart: true,
        locale: 'ar_AE',
        isTransparent: true,
        showSymbolLogo: true,
        showFloatingTooltip: true,
        width: '100%',
        height: 450,
        tabs,
      }}
      className="min-h-[450px] overflow-hidden rounded border border-terminal-border bg-terminal-surface"
    />
  )
}

export default MarketOverview

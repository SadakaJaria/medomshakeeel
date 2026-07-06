import { useParams } from 'react-router-dom'

function SecurityPage() {
  const { tvSymbol } = useParams()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">
        الورقة المالية
        {tvSymbol && (
          <span className="ltr-nums ms-2 text-terminal-muted">
            {decodeURIComponent(tvSymbol)}
          </span>
        )}
      </h1>
      <div className="rounded border border-terminal-border bg-terminal-surface p-4 text-sm text-terminal-muted">
        شارت TradingView متقدم + بطاقة الحالة الشرعية + الأخبار + تحليل AI —
        تُبنى في البند القادم.
      </div>
    </div>
  )
}

export default SecurityPage

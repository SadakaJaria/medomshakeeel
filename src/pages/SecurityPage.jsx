function SecurityPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">الورقة المالية</h1>
      <div className="rounded border border-terminal-border bg-terminal-surface p-4 text-sm text-terminal-muted">
        شارت TradingView متقدم + بطاقة الحالة الشرعية + الأخبار + تحليل AI —
        لاحقاً ستستقبل الصفحة رمز الورقة عبر المسار (مثل{' '}
        <span className="ltr-nums">/security/NASDAQ:AAPL</span>).
      </div>
    </div>
  )
}

export default SecurityPage

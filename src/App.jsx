function App() {
  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text">
      <header className="border-b border-terminal-border bg-terminal-surface px-4 py-3">
        <h1 className="text-lg font-semibold">ميداس الحلال</h1>
        <p className="text-sm text-terminal-muted">
          تيرمينال أسواق مالية شخصي — متوافق مع الشريعة
        </p>
      </header>
      <main className="p-4">
        <div className="rounded border border-terminal-border bg-terminal-surface p-4">
          <p className="text-terminal-muted">
            تم تجهيز المشروع: Vite + React + Tailwind + PWA + RTL.
          </p>
          <p className="mt-2 text-sm">
            مثال أرقام مالية:{' '}
            <span className="ltr-nums text-market-up">AAPL +1.24%</span>{' '}
            <span className="ltr-nums text-market-down">TSLA -0.87%</span>
          </p>
        </div>
      </main>
    </div>
  )
}

export default App

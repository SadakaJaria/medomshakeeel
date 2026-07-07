import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useHalalUniverse } from '../context/HalalUniverseContext'
import { compareSecurities } from '../lib/analyze'
import AnalysisText from '../components/analysis/AnalysisText'

const selectClass =
  'w-full rounded border border-terminal-border bg-terminal-bg px-2 py-1.5 text-sm focus:outline-none'

function Compare() {
  const { universe } = useHalalUniverse()
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [state, setState] = useState({ status: 'idle' })

  const run = async (force) => {
    const secA = universe.find((s) => s.tvSymbol === a)
    const secB = universe.find((s) => s.tvSymbol === b)
    if (!secA || !secB || a === b) {
      setState({ status: 'error', message: 'اختر ورقتين مختلفتين' })
      return
    }
    setState({ status: 'loading' })
    try {
      const result = await compareSecurities(secA, secB, { force })
      setState({ status: 'done', ...result })
    } catch (err) {
      setState({ status: 'error', message: err.message })
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">مقارنة الأوراق</h1>

      {universe.length < 2 ? (
        <div className="rounded border border-terminal-border bg-terminal-surface p-6 text-center text-sm text-terminal-muted">
          تحتاج ورقتين على الأقل في{' '}
          <Link to="/universe" className="text-market-up hover:underline">
            الكون الحلال
          </Link>{' '}
          للمقارنة.
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-terminal-muted" htmlFor="cmp-a">
                الورقة الأولى
              </label>
              <select id="cmp-a" className={selectClass} value={a} onChange={(e) => setA(e.target.value)}>
                <option value="">— اختر —</option>
                {universe.map((s) => (
                  <option key={s.tvSymbol} value={s.tvSymbol}>{s.tvSymbol}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-terminal-muted" htmlFor="cmp-b">
                الورقة الثانية
              </label>
              <select id="cmp-b" className={selectClass} value={b} onChange={(e) => setB(e.target.value)}>
                <option value="">— اختر —</option>
                {universe.map((s) => (
                  <option key={s.tvSymbol} value={s.tvSymbol}>{s.tvSymbol}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => run(false)}
              disabled={state.status === 'loading'}
              className="rounded bg-market-up/15 px-4 py-2 text-sm font-semibold text-market-up transition-colors hover:bg-market-up/25 disabled:opacity-50"
            >
              قارِن
            </button>
            {state.status === 'done' && (
              <button
                type="button"
                onClick={() => run(true)}
                className="text-xs text-terminal-muted transition-colors hover:text-terminal-text"
              >
                ↻ إعادة المقارنة
              </button>
            )}
          </div>

          {state.status === 'loading' && (
            <p className="animate-pulse text-xs text-terminal-muted">
              جارِ جمع البيانات والمقارنة… قد يستغرق حتى دقيقة.
            </p>
          )}
          {state.status === 'error' && (
            <p className="text-sm text-shariah-non-compliant">{state.message}</p>
          )}
          {state.status === 'done' && (
            <div className="rounded border border-terminal-border bg-terminal-surface p-4">
              <AnalysisText text={state.analysis} />
              <p className="mt-3 border-t border-terminal-border/50 pt-2 text-xs text-terminal-muted">
                <span className="ltr-nums">{state.model}</span>
                {state.cached && ' · من الكاش (آخر ساعة)'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Compare

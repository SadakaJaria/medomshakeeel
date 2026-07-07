import { useEffect, useState } from 'react'
import { analyzeSecurity } from '../../lib/analyze'

/** عرض مبسط: أسطر "## عنوان" تصبح عناوين، والباقي فقرات pre-wrap */
function AnalysisText({ text }) {
  const blocks = text.split(/\n(?=## )/)
  return (
    <div className="max-h-96 space-y-3 overflow-y-auto text-sm leading-relaxed">
      {blocks.map((block, i) => {
        const [first, ...rest] = block.split('\n')
        if (first.startsWith('## ')) {
          return (
            <section key={i}>
              <h3 className="mb-1 font-semibold text-market-up">
                {first.slice(3)}
              </h3>
              <p className="whitespace-pre-wrap">{rest.join('\n').trim()}</p>
            </section>
          )
        }
        return (
          <p key={i} className="whitespace-pre-wrap">
            {block.trim()}
          </p>
        )
      })}
    </div>
  )
}

/** بطاقة تحليل AI في صفحة الورقة المالية */
function AnalyzeCard({ security }) {
  const [state, setState] = useState({ status: 'idle' })

  // إعادة الضبط عند تغيير الورقة
  useEffect(() => {
    setState({ status: 'idle' })
  }, [security.tvSymbol])

  const run = async (force) => {
    setState({ status: 'loading' })
    try {
      const result = await analyzeSecurity(security, { force })
      setState({ status: 'done', ...result })
    } catch (err) {
      setState({ status: 'error', message: err.message })
    }
  }

  return (
    <div className="rounded border border-terminal-border bg-terminal-surface p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">تحليل AI</h2>
        {state.status === 'done' && (
          <button
            type="button"
            onClick={() => run(true)}
            className="text-xs text-terminal-muted transition-colors hover:text-terminal-text"
            title="تجاهل الكاش وأعد التحليل"
          >
            ↻ إعادة التحليل
          </button>
        )}
      </div>

      {state.status === 'idle' && (
        <button
          type="button"
          onClick={() => run(false)}
          className="w-full rounded bg-market-up/15 px-3 py-2 text-sm font-semibold text-market-up transition-colors hover:bg-market-up/25"
        >
          حلّل
        </button>
      )}

      {state.status === 'loading' && (
        <p className="animate-pulse text-xs text-terminal-muted">
          جارِ جمع البيانات والتحليل… قد يستغرق حتى دقيقة.
        </p>
      )}

      {state.status === 'error' && (
        <div className="space-y-2">
          <p className="text-xs text-shariah-non-compliant">{state.message}</p>
          <button
            type="button"
            onClick={() => run(false)}
            className="rounded border border-terminal-border px-3 py-1.5 text-xs text-terminal-muted transition-colors hover:text-terminal-text"
          >
            حاول مجدداً
          </button>
        </div>
      )}

      {state.status === 'done' && (
        <div>
          <AnalysisText text={state.analysis} />
          <p className="mt-3 border-t border-terminal-border/50 pt-2 text-xs text-terminal-muted">
            <span className="ltr-nums">{state.model}</span>
            {state.cached && ' · من الكاش (آخر ساعة)'}
          </p>
        </div>
      )}
    </div>
  )
}

export default AnalyzeCard

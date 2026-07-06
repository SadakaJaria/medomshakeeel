import { Link } from 'react-router-dom'
import { SECURITY_TYPES } from '../../lib/halal'
import ShariahBadge from './ShariahBadge'
import SingleQuote from '../tradingview/SingleQuote'

/** بطاقة ورقة في الـ Watchlist: سعر وتغيّر (TradingView) + حالة شرعية */
function WatchlistCard({ security, onRemove }) {
  return (
    <div className="flex flex-col rounded border border-terminal-border bg-terminal-surface transition-colors hover:border-terminal-muted">
      <SingleQuote tvSymbol={security.tvSymbol} />

      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-terminal-border/50 px-3 py-2 text-xs">
        <span className="ltr-nums font-medium">{security.tvSymbol}</span>
        <ShariahBadge security={security} />
        <span className="text-terminal-muted">
          {SECURITY_TYPES[security.type] ?? security.type}
        </span>
        <span className="ms-auto flex items-center gap-3">
          <Link
            to={`/security/${encodeURIComponent(security.tvSymbol)}`}
            className="text-terminal-muted transition-colors hover:text-terminal-text"
          >
            التفاصيل
          </Link>
          <button
            type="button"
            onClick={onRemove}
            title="إزالة من المتابعة"
            className="text-terminal-muted transition-colors hover:text-shariah-non-compliant"
          >
            ★
          </button>
        </span>
      </div>
    </div>
  )
}

export default WatchlistCard

import { NavLink } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const links = [
  { to: '/', label: 'الداشبورد' },
  { to: '/markets', label: 'الأسواق' },
  { to: '/watchlist', label: 'المتابعة' },
  { to: '/universe', label: 'الكون الحلال' },
  { to: '/security', label: 'الورقة المالية' },
  { to: '/compare', label: 'مقارنة' },
  { to: '/tools', label: 'الأدوات' },
]

function Nav() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 border-b border-terminal-border bg-terminal-surface">
      <div className="flex items-center gap-6 px-4 py-2">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="text-market-up">▲</span>
          <span className="text-base font-bold">ميداس الحلال</span>
        </NavLink>

        <nav className="flex items-center gap-1 text-sm">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `rounded px-3 py-1.5 transition-colors ${
                  isActive
                    ? 'bg-terminal-bg font-semibold text-terminal-text'
                    : 'text-terminal-muted hover:text-terminal-text'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
          className="ms-auto rounded border border-terminal-border px-2.5 py-1 text-sm text-terminal-muted transition-colors hover:text-terminal-text"
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </header>
  )
}

export default Nav

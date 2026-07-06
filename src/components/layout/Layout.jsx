import { Outlet } from 'react-router-dom'
import Nav from './Nav'

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-terminal-bg text-terminal-text">
      <Nav />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { HalalUniverseProvider } from './context/HalalUniverseContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Watchlist from './pages/Watchlist'
import SecurityPage from './pages/SecurityPage'
import HalalUniverse from './pages/HalalUniverse'

function App() {
  return (
    <ThemeProvider>
      <HalalUniverseProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/universe" element={<HalalUniverse />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/security/:tvSymbol" element={<SecurityPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </HalalUniverseProvider>
    </ThemeProvider>
  )
}

export default App

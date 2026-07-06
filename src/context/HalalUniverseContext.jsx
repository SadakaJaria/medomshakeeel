import { createContext, useContext, useEffect, useState } from 'react'
import seed from '../data/halal-universe.seed.json'

const STORAGE_KEY = 'halal-universe'

const HalalUniverseContext = createContext(null)

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // بيانات تالفة — نرجع للـ seed
  }
  return seed
}

export function HalalUniverseProvider({ children }) {
  const [universe, setUniverse] = useState(loadInitial)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(universe))
  }, [universe])

  /** الإضافة — tvSymbol هو المفتاح الفريد */
  const addSecurity = (security) => {
    setUniverse((prev) => {
      if (prev.some((s) => s.tvSymbol === security.tvSymbol)) return prev
      return [...prev, security]
    })
  }

  /**
   * التعديل — إذا تغيّرت الحالة الشرعية نحفظ الحالة السابقة
   * في shariah.previousStatus لتفعيل التنبيه البصري.
   */
  const updateSecurity = (tvSymbol, updated) => {
    setUniverse((prev) =>
      prev.map((s) => {
        if (s.tvSymbol !== tvSymbol) return s
        const statusChanged = s.shariah.status !== updated.shariah.status
        return {
          ...updated,
          shariah: {
            ...updated.shariah,
            previousStatus: statusChanged
              ? s.shariah.status
              : s.shariah.previousStatus,
          },
        }
      }),
    )
  }

  const removeSecurity = (tvSymbol) => {
    setUniverse((prev) => prev.filter((s) => s.tvSymbol !== tvSymbol))
  }

  /** إضافة/إزالة من قائمة المتابعة */
  const toggleWatchlist = (tvSymbol) => {
    setUniverse((prev) =>
      prev.map((s) =>
        s.tvSymbol === tvSymbol ? { ...s, watchlist: !s.watchlist } : s,
      ),
    )
  }

  /** استبدال كامل — للاستيراد من ملف JSON */
  const replaceUniverse = (list) => {
    if (Array.isArray(list)) setUniverse(list)
  }

  return (
    <HalalUniverseContext.Provider
      value={{
        universe,
        addSecurity,
        updateSecurity,
        removeSecurity,
        toggleWatchlist,
        replaceUniverse,
      }}
    >
      {children}
    </HalalUniverseContext.Provider>
  )
}

export function useHalalUniverse() {
  const ctx = useContext(HalalUniverseContext)
  if (!ctx)
    throw new Error('useHalalUniverse يجب استخدامه داخل HalalUniverseProvider')
  return ctx
}

'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'

// ============================================
// LENIS CONTROL CONTEXT
// ============================================
// Context untuk mengontrol Lenis scroll
// Digunakan untuk stop/start scroll saat Sheet/Drawer/Modal dibuka

interface LenisContextType {
  isScrollEnabled: boolean
  disableScroll: () => void
  enableScroll: () => void
}

const LenisContext = createContext<LenisContextType | undefined>(undefined)

export function LenisProvider({ children }: { children: ReactNode }) {
  const [isScrollEnabled, setIsScrollEnabled] = useState(true)

  const disableScroll = useCallback(() => {
    setIsScrollEnabled(false)
  }, [])

  const enableScroll = useCallback(() => {
    setIsScrollEnabled(true)
  }, [])

  return (
    <LenisContext.Provider
      value={{ isScrollEnabled, disableScroll, enableScroll }}
    >
      {children}
    </LenisContext.Provider>
  )
}

export function useLenisControl() {
  const context = useContext(LenisContext)
  if (!context) {
    throw new Error('useLenisControl must be used within LenisProvider')
  }
  return context
}

// Hook untuk otomatis disable/enable scroll saat modal state berubah
export function useLenisScrollLock() {
  const { disableScroll, enableScroll } = useLenisControl()

  // Effect akan dihandle di komponen yang menggunakannya
  // Return fungsi untuk manual control jika dibutuhkan
  return { disableScroll, enableScroll }
}

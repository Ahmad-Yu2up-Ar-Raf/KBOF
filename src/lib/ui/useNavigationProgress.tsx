import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

type ProgressCtx = {
  start: () => void
  complete: () => void
  progress: number
  visible: boolean
}

const Ctx = createContext<ProgressCtx | null>(null)

export function NavigationProgressProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const showTimer = useRef<number | null>(null)
  const incTimer = useRef<number | null>(null)
  const hideTimer = useRef<number | null>(null)
  const fallbackTimer = useRef<number | null>(null)

  const SHOW_AFTER = 30
  const MIN_VISIBLE = 240
  const CAP = 88
  const FALLBACK = 10000
  const visibleRef = useRef(false)

  const clearAll = () => {
    if (showTimer.current) window.clearTimeout(showTimer.current)
    if (incTimer.current) window.clearInterval(incTimer.current)
    if (hideTimer.current) window.clearTimeout(hideTimer.current)
    if (fallbackTimer.current) window.clearTimeout(fallbackTimer.current)
    showTimer.current =
      incTimer.current =
      hideTimer.current =
      fallbackTimer.current =
        null
  }

  const start = useCallback(() => {
    if (showTimer.current || visibleRef.current) return

    fallbackTimer.current = window.setTimeout(() => {
      setProgress(100)
      setVisible(false)
      clearAll()
    }, FALLBACK)

    showTimer.current = window.setTimeout(() => {
      showTimer.current = null
      setVisible(true)
      visibleRef.current = true
      setProgress(6)
      incTimer.current = window.setInterval(() => {
        setProgress((p) => {
          const diff = CAP - p
          const step = Math.max(1, Math.round(diff * 0.12))
          return Math.min(CAP, p + step)
        })
      }, 220)
    }, SHOW_AFTER)
  }, [])

  const complete = useCallback(() => {
    if (showTimer.current) {
      window.clearTimeout(showTimer.current)
      showTimer.current = null
      setVisible(true)
      visibleRef.current = true
      setProgress(100)
      if (incTimer.current) {
        window.clearInterval(incTimer.current)
        incTimer.current = null
      }
      hideTimer.current = window.setTimeout(() => {
        setVisible(false)
        visibleRef.current = false
        setProgress(0)
        clearAll()
      }, MIN_VISIBLE)
      return
    }

    if (incTimer.current) {
      window.clearInterval(incTimer.current)
      incTimer.current = null
    }
    setProgress(100)
    hideTimer.current = window.setTimeout(() => {
      setVisible(false)
      visibleRef.current = false
      setProgress(0)
      clearAll()
    }, MIN_VISIBLE)
  }, [])

  useEffect(() => {
    visibleRef.current = visible
  }, [visible])

  useEffect(() => {
    return () => {
      clearAll()
    }
  }, [])

  return (
    <Ctx.Provider value={{ start, complete, progress, visible }}>
      {children}
    </Ctx.Provider>
  )
}

export function useNavigationProgress() {
  const ctx = useContext(Ctx)
  if (!ctx)
    throw new Error(
      'useNavigationProgress must be used inside NavigationProgressProvider',
    )
  return ctx
}

// =============================================================================
// USE CONFETTI - Leaderboard
// =============================================================================
// Hook for managing confetti effect on leaderboard page
// =============================================================================

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

// =============================================================================
// CONSTANTS
// =============================================================================

const CONFETTI_COLORS = ['#956c42', '#e2d8c3', '#d4c8aa', '#b54a35']
const CONFETTI_DURATION_MS = 3000
const SESSION_KEY = 'leaderboard-confetti-played'

// =============================================================================
// HOOK
// =============================================================================

export function useConfettiEffect() {
  useEffect(() => {
    // Check if confetti has already been played this session
    if (sessionStorage.getItem(SESSION_KEY)) return

    // Mark as played
    sessionStorage.setItem(SESSION_KEY, 'true')

    const endTime = Date.now() + CONFETTI_DURATION_MS

    const frame = () => {
      if (Date.now() > endTime) return

      // Left side
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: CONFETTI_COLORS,
      })

      // Right side
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: CONFETTI_COLORS,
      })

      requestAnimationFrame(frame)
    }

    frame()
  }, [])
}

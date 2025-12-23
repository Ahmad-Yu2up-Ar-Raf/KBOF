import { useEffect, useState } from 'react'
import animationData from 'public/assets/animations/Preload.json'
import { useLottie } from 'lottie-react'
import { BlurFade } from './blur-fade'

/**
 * Props untuk Preload Component
 * @param onComplete - Callback yang dipanggil saat preload animation selesai
 */
interface PreloadProps {
  onComplete?: () => void
}

/**
 * Preload Component
 * Menampilkan splash screen animation saat website pertama kali dibuka
 *
 * Flow:
 * 1. Fade in (0.4s)
 * 2. Hold animation (3s)
 * 3. Fade out (0.4s)
 * 4. Call onComplete callback
 */
export default function Preload({ onComplete }: PreloadProps) {
  const [show, setShow] = useState(true)

  // ========== CONFIG DURASI ANIMASI ==========
  const FADE_DURATION = 0.4 // Durasi fade in/out dalam detik
  const HOLD_DURATION = 6 // Durasi hold animation dalam detik
  // ===========================================

  useEffect(() => {
    // Hitung total waktu preload (fade in + hold + fade out)
    const totalHoldTime = (FADE_DURATION + HOLD_DURATION) * 1000

    // Timer untuk mulai fade out
    const fadeOutTimer = setTimeout(() => {
      setShow(false)

      // Setelah fade out selesai, panggil callback onComplete
      const completeTimer = setTimeout(() => {
        if (onComplete) {
          onComplete()
        }
      }, FADE_DURATION * 1000)

      return () => clearTimeout(completeTimer)
    }, totalHoldTime)

    return () => clearTimeout(fadeOutTimer)
  }, [FADE_DURATION, HOLD_DURATION, onComplete])

  // Konfigurasi Lottie animation
  const lottieOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  const { View } = useLottie(lottieOptions)

  // Skip preload untuk mobile devices

  return (
    <BlurFade
      initial=""
      duration={FADE_DURATION}
      show={show}
      isPreload
      className="flex fixed inset-0 bg-background z-9999 justify-center items-center pointer-events-none"
    >
      <div className="md:scale-100 scale-150">{View}</div>
    </BlurFade>
  )
}

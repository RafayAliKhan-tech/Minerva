import { useState, useEffect, useRef } from 'react'
import { Clock } from 'lucide-react'

function readDeadline(storageKey, duration) {
  if (!storageKey || typeof window === 'undefined') return Date.now() + duration * 1000

  try {
    const stored = Number(sessionStorage.getItem(storageKey))
    if (Number.isFinite(stored) && stored > 0) return stored
    const deadline = Date.now() + duration * 1000
    sessionStorage.setItem(storageKey, String(deadline))
    return deadline
  } catch {
    return Date.now() + duration * 1000
  }
}

function Timer({ duration, onTimeUp, isActive = true, storageKey }) {
  const safeDuration = Number.isFinite(Number(duration)) ? Number(duration) : 60
  const [deadline, setDeadline] = useState(() => readDeadline(storageKey, safeDuration))
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, Math.ceil((deadline - Date.now()) / 1000)))
  const hasFinished = useRef(false)

  useEffect(() => {
    const nextDeadline = readDeadline(storageKey, safeDuration)
    setDeadline(nextDeadline)
    setTimeLeft(Math.max(0, Math.ceil((nextDeadline - Date.now()) / 1000)))
    hasFinished.current = false
  }, [storageKey, safeDuration])

  useEffect(() => {
    if (!isActive) return

    if (timeLeft <= 0) {
      if (!hasFinished.current) {
        hasFinished.current = true
        onTimeUp?.()
      }
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)))
    }, 1000)

    return () => clearInterval(timer)
  }, [deadline, timeLeft, isActive, onTimeUp])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isWarning = timeLeft <= 10
  const isCritical = timeLeft <= 5

  return (
    <div
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        isCritical
          ? 'bg-red-100 text-red-700'
          : isWarning
            ? 'bg-orange-pill text-orange'
            : 'bg-brown/10 text-brown'
      }`}
    >
      <Clock
        className={`h-4 w-4 ${isCritical ? 'animate-pulse' : ''}`}
        aria-hidden="true"
      />
      <span>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  )
}

export default Timer

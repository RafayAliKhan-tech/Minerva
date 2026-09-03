import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

function Timer({ duration, onTimeUp, isActive = true }) {
  const safeDuration = Number.isFinite(Number(duration)) ? Number(duration) : 60
  const [timeLeft, setTimeLeft] = useState(safeDuration)

  useEffect(() => {
    setTimeLeft(safeDuration)
  }, [safeDuration])

  useEffect(() => {
    if (!isActive) return

    if (timeLeft <= 0) {
      onTimeUp?.()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isActive, onTimeUp])

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

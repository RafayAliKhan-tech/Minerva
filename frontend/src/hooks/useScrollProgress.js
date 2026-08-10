import { useState, useEffect } from 'react'

export function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref?.current
    if (!el) return

    const update = () => {
      const rect = el.getBoundingClientRect()
      const windowH = window.innerHeight
      const total = rect.height + windowH
      const scrolled = windowH - rect.top
      setProgress(Math.min(1, Math.max(0, scrolled / total)))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ref])

  return progress
}

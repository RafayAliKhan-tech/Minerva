import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { backgroundMotion } from '../lib/backgroundMotionState'

gsap.registerPlugin(ScrollTrigger)

export function useBackgroundMotion() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onPointerMove = (event) => {
      backgroundMotion.mouseX = (event.clientX / window.innerWidth) * 2 - 1
      backgroundMotion.mouseY = -(event.clientY / window.innerHeight) * 2 + 1
    }

    const onPointerLeave = () => {
      backgroundMotion.mouseX = 0
      backgroundMotion.mouseY = 0
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)

    let scrollTrigger
    if (!reducedMotion) {
      scrollTrigger = ScrollTrigger.create({
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          backgroundMotion.scroll = self.progress
        },
      })
    }

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      scrollTrigger?.kill()
      backgroundMotion.scroll = 0
      backgroundMotion.mouseX = 0
      backgroundMotion.mouseY = 0
    }
  }, [])
}

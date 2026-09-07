import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  initBlurReveals,
  initHeroTitleAnimation,
  initHoverTextWave,
  initScrambleReveals,
  initSplitTextReveals,
} from '../lib/textAnimations'

gsap.registerPlugin(ScrollTrigger)

export function useCinematicMotion(rootRef) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 767px)').matches

    const ctx = gsap.context(() => {
      if (reducedMotion || isMobile) return

      const heroShell = root.querySelector('.hero-scroll-shell')
      const heroTransform = root.querySelector('.hero-transform')
      const heroCopy = root.querySelector('.hero-copy')
      const heroTitle = root.querySelector('.hero-title')
      const bgLayer = root.querySelector('.layer-bg')

      const cleanupText = [
        initHeroTitleAnimation(root),
        initSplitTextReveals(root),
        initBlurReveals(root),
        initScrambleReveals(root),
        initHoverTextWave(root),
      ]

      const setParallaxVars = (mx, my) => {
        root.style.setProperty('--mx', mx.toFixed(3))
        root.style.setProperty('--my', my.toFixed(3))
        root.style.setProperty('--mx-bg', (mx * 0.4).toFixed(3))
        root.style.setProperty('--my-bg', (my * 0.4).toFixed(3))
        root.style.setProperty('--mx-fg', (mx * 1.2).toFixed(3))
        root.style.setProperty('--my-fg', (my * 1.2).toFixed(3))
      }

      const handlePointerMove = (event) => {
        const rect = root.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5
        setParallaxVars(x * 2, y * 2)
      }

      const handlePointerLeave = () => setParallaxVars(0, 0)

      root.addEventListener('pointermove', handlePointerMove)
      root.addEventListener('pointerleave', handlePointerLeave)

      if (heroShell && heroTransform) {
        gsap.to(heroTransform, {
          y: -10,
          rotateY: 2,
          duration: 5.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })

        if (heroCopy) {
          gsap.to(heroCopy, {
            y: -4,
            duration: 4.8,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: 0.8,
          })
        }

        const morphTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroShell,
            start: 'top top',
            end: '+=100%',
            scrub: true,
            anticipatePin: 1,
          },
        })

        morphTl
          .to(
            heroTitle,
            {
              opacity: 0,
              y: -72,
              scale: 0.91,
              filter: 'blur(6px)',
              ease: 'power2.out',
            },
            0.15,
          )
          .to(
            heroCopy,
            {
              opacity: 0,
              y: 40,
              filter: 'blur(8px)',
              ease: 'power2.out',
            },
            0.2,
          )

        if (bgLayer) {
          gsap.to(bgLayer, {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
              trigger: heroShell,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.2,
            },
          })
        }

      }

      gsap.utils.toArray('.path-card').forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 48, opacity: 0, filter: 'blur(10px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.08,
          },
        )

        gsap.to(card, {
          yPercent: 8 + index * 2,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        })
      })

      gsap.utils.toArray('.journey-item').forEach((item, index) => {
        gsap.fromTo(
          item,
          { x: index % 2 === 0 ? -36 : 36, opacity: 0, filter: 'blur(8px)' },
          {
            x: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 86%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.06,
          },
        )
      })

      const stackIllustration = root.querySelector('.stack-illustration')
      if (stackIllustration) {
        gsap.fromTo(
          stackIllustration,
          { y: 60, opacity: 0, rotateY: -20 },
          {
            y: 0,
            opacity: 1,
            rotateY: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: stackIllustration,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      }

      gsap.utils.toArray('.tilt-card').forEach((card) => {
        const tilt = (event) => {
          const rect = card.getBoundingClientRect()
          const x = (event.clientX - rect.left) / rect.width
          const y = (event.clientY - rect.top) / rect.height
          gsap.to(card, {
            rotateX: (0.5 - y) * 14,
            rotateY: (x - 0.5) * 14,
            translateY: -8,
            duration: 0.45,
            ease: 'power3.out',
          })
        }

        const reset = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            translateY: 0,
            duration: 0.75,
            ease: 'power3.out',
          })
        }

        card.addEventListener('pointermove', tilt)
        card.addEventListener('pointerleave', reset)
      })

      return () => {
        root.removeEventListener('pointermove', handlePointerMove)
        root.removeEventListener('pointerleave', handlePointerLeave)
        cleanupText.forEach((fn) => fn())
      }
    }, root)

    return () => ctx.revert()
  }, [rootRef])
}

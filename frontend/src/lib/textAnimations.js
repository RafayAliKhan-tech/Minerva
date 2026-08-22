import SplitType from 'split-type'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$'

export function scrambleTo(element, finalText, { duration = 0.85 } = {}) {
  if (!element) return
  const target = finalText ?? element.textContent ?? ''
  const proxy = { progress: 0 }
  const len = target.length

  gsap.to(proxy, {
    progress: 1,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      const p = proxy.progress
      let out = ''
      for (let i = 0; i < len; i += 1) {
        const threshold = (i + 1) / len
        out += p >= threshold
          ? target[i]
          : CHARS[Math.floor(Math.random() * CHARS.length)]
      }
      element.textContent = out
    },
    onComplete: () => {
      element.textContent = target
    },
  })
}

function revealChars(chars, { stagger = 0.028, duration = 0.75 } = {}) {
  if (!chars?.length) return
  gsap.to(chars, {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    duration,
    stagger,
    ease: 'expo.out',
  })
}

function hideChars(chars) {
  if (!chars?.length) return
  gsap.set(chars, {
    opacity: 0,
    y: 22,
    filter: 'blur(8px)',
  })
}

export function initSplitTextReveals(root, { immediate = false } = {}) {
  const splits = []
  const triggers = []

  root.querySelectorAll('[data-split-text]').forEach((element) => {
    const type = element.dataset.splitText || 'chars'
    const split = new SplitType(element, { types: type })
    splits.push(split)

    const units = type === 'words' ? split.words : split.chars
    if (!units?.length) return

    gsap.set(units, {
      opacity: 0,
      y: 22,
      filter: 'blur(8px)',
      display: 'inline-block',
    })

    const play = () => revealChars(units)

    if (immediate || element.dataset.splitImmediate !== undefined) {
      play()
      return
    }

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 88%',
      end: 'bottom 12%',
      onEnter: play,
      onEnterBack: play,
      onLeave: () => hideChars(units),
    })
    triggers.push(trigger)
  })

  return () => {
    triggers.forEach((t) => t.kill())
    splits.forEach((s) => s.revert())
  }
}

export function initBlurReveals(root) {
  const tweens = []

  root.querySelectorAll('[data-blur-reveal]').forEach((element) => {
    gsap.set(element, {
      opacity: 0,
      y: 20,
      filter: 'blur(12px)',
    })

    const heroReveal = element.closest('.hero-copy')
    const tween = gsap.to(element, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.9,
      ease: 'power3.out',
      delay: heroReveal ? 0.55 : 0,
      scrollTrigger: heroReveal
        ? undefined
        : {
            trigger: element,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
    })
    tweens.push(tween)
  })

  return () => tweens.forEach((t) => t.kill())
}

export function initScrambleReveals(root) {
  const triggers = []

  root.querySelectorAll('[data-scramble-text]').forEach((element) => {
    const finalText = element.dataset.scrambleText || element.textContent
    gsap.set(element, { opacity: 1 })

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 88%',
      onEnter: () => scrambleTo(element, finalText, { duration: 0.85 }),
      once: true,
    })
    triggers.push(trigger)
  })

  return () => triggers.forEach((t) => t.kill())
}

export function initHoverTextWave(root) {
  const cleanups = []

  root.querySelectorAll('[data-hover-wave]').forEach((element) => {
    const split = new SplitType(element, { types: 'chars' })
    const chars = split.chars ?? []
    if (!chars.length) return

    gsap.set(chars, { display: 'inline-block' })

    const enter = () => {
      gsap.to(chars, {
        y: -5,
        duration: 0.32,
        stagger: 0.018,
        ease: 'power2.out',
      })
    }

    const leave = () => {
      gsap.to(chars, {
        y: 0,
        duration: 0.32,
        stagger: 0.012,
        ease: 'power2.out',
      })
    }

    element.addEventListener('pointerenter', enter)
    element.addEventListener('pointerleave', leave)

    cleanups.push(() => {
      element.removeEventListener('pointerenter', enter)
      element.removeEventListener('pointerleave', leave)
      split.revert()
    })
  })

  return () => cleanups.forEach((fn) => fn())
}

export function initHeroTitleAnimation(root) {
  const title = root.querySelector('.hero-title')
  if (!title) return () => {}

  const lines = title.querySelectorAll('.hero-title-line')
  const splits = []

  lines.forEach((line, lineIndex) => {
    const split = new SplitType(line, { types: 'chars' })
    splits.push(split)
    const chars = split.chars ?? []
    gsap.set(chars, {
      opacity: 0,
      y: 22,
      filter: 'blur(12px)',
      display: 'inline-block',
    })

    gsap.to(chars, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.75,
      stagger: 0.028,
      ease: 'expo.out',
      delay: 0.15 + lineIndex * 0.12,
    })
  })

  return () => splits.forEach((s) => s.revert())
}

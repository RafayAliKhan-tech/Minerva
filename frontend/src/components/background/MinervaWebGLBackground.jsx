import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useBackgroundMotion } from '../../hooks/useBackgroundMotion'
import CareerPathScene from './CareerPathScene'

function BackgroundFallback() {
  return <div className="minerva-webgl-fallback" aria-hidden="true" />
}

export default function MinervaWebGLBackground() {
  useBackgroundMotion()
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return (
    <div className="minerva-webgl-background" aria-hidden="true">
      {reducedMotion ? (
        <BackgroundFallback />
      ) : (
        <Suspense fallback={<BackgroundFallback />}>
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 1.8, 6.2], fov: 42, near: 0.1, far: 30 }}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          >
            <CareerPathScene />
          </Canvas>
        </Suspense>
      )}
      <div className="minerva-webgl-atmosphere">
        <div className="minerva-webgl-glow minerva-webgl-glow-top" />
        <div className="minerva-webgl-vignette" />
        <div className="minerva-webgl-noise" />
      </div>
    </div>
  )
}

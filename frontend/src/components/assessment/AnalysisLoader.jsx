import { useEffect, useState } from 'react'
import Container from '../common/Container'
import { CheckCircle2 } from 'lucide-react'

function AnalysisLoader({ steps = [], onComplete }) {
  const [completedSteps, setCompletedSteps] = useState([])

  useEffect(() => {
    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex < steps.length) {
        setCompletedSteps((prev) => [...prev, steps[currentIndex]])
        currentIndex++
      } else {
        clearInterval(interval)
        setTimeout(() => onComplete?.(), 500)
      }
    }, 600)

    return () => clearInterval(interval)
  }, [steps, onComplete])

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-cream-dark py-16 sm:py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          {/* Loading animation */}
          <div className="mb-12 flex justify-center">
            <div className="relative h-24 w-24">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange to-orange-light opacity-10" />
              <div className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-orange border-r-orange" />
              <div className="flex h-full items-center justify-center">
                <span className="text-xl font-serif text-orange">Minerva</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="font-serif text-3xl font-semibold text-brown sm:text-4xl">
            Analyzing Your Responses
          </h2>
          <p className="mt-4 text-base text-brown-light">
            Getting ready to show you what we discovered...
          </p>

          {/* Steps */}
          <div className="mt-12 space-y-3">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex items-center gap-4 rounded-xl px-6 py-3 transition-all duration-300 ${
                  completedSteps.includes(step)
                    ? 'bg-white shadow-sm'
                    : 'bg-white/50 opacity-40'
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all ${
                    completedSteps.includes(step)
                      ? 'bg-journey-green text-journey-green-dark'
                      : 'bg-brown/10 text-brown/50'
                  }`}
                >
                  {completedSteps.includes(step) ? (
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    completedSteps.includes(step)
                      ? 'text-brown'
                      : 'text-brown-light'
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default AnalysisLoader

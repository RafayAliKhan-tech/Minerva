import { useEffect, useRef, useState } from 'react'
import { Check, LoaderCircle } from 'lucide-react'

const STEP_DURATION = 900
const FINISH_DELAY = 500

function AnalysisLoader({ steps = [], onComplete }) {
  const [activeStep, setActiveStep] = useState(0)
  const [isFinalizing, setIsFinalizing] = useState(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    let stepIndex = 0
    let finishTimer

    if (!steps.length) {
      finishTimer = window.setTimeout(() => onCompleteRef.current?.(), 0)
      return () => window.clearTimeout(finishTimer)
    }

    const stepTimer = window.setInterval(() => {
      stepIndex += 1
      if (stepIndex < steps.length) {
        setActiveStep(stepIndex)
        return
      }

      window.clearInterval(stepTimer)
      setActiveStep(steps.length)
      setIsFinalizing(true)
      finishTimer = window.setTimeout(() => onCompleteRef.current?.(), FINISH_DELAY)
    }, STEP_DURATION)

    return () => {
      window.clearInterval(stepTimer)
      window.clearTimeout(finishTimer)
    }
  }, [steps])

  const progress = steps.length ? Math.min(activeStep / steps.length, 1) * 100 : 100
  const currentLabel = isFinalizing
    ? 'Finalizing your results'
    : steps[activeStep] || 'Preparing your results'

  return (
    <main className="analysis-loader-screen" aria-live="polite">
      <section className="analysis-loader-content" aria-label="Analysis progress">
        <div className="analysis-loader-brand-mark" aria-hidden="true">
          M
        </div>

        <header className="analysis-loader-heading">
          <p className="analysis-loader-eyebrow">Minerva · Analysis</p>
          <h1>Analyzing your responses</h1>
          <p>Moving through each stage to prepare your results.</p>
        </header>

        <div className="analysis-loader-progress">
          <div className="analysis-loader-progress-label">
            <span>{isFinalizing ? currentLabel : `Now: ${currentLabel}`}</span>
            <strong>
              {steps.length ? `${Math.min(activeStep + 1, steps.length)} / ${steps.length}` : 'Ready'}
            </strong>
          </div>
          <div
            className="analysis-loader-progress-track"
            role="progressbar"
            aria-label="Analysis sequence progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <ol className="analysis-loader-sequence">
          {steps.map((step, index) => {
            const isComplete = index < activeStep
            const isCurrent = index === activeStep && !isFinalizing
            return (
              <li
                className={`analysis-loader-step${isComplete ? ' is-complete' : ''}${isCurrent ? ' is-current' : ''}`}
                key={`${step}-${index}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className="analysis-loader-step-indicator">
                  {isComplete ? (
                    <Check size={14} aria-hidden="true" />
                  ) : isCurrent ? (
                    <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <b>{String(index + 1).padStart(2, '0')}</b>
                  )}
                </span>
                <span className="analysis-loader-step-label">{step}</span>
                <span className="analysis-loader-step-status">
                  {isComplete ? 'Complete' : isCurrent ? 'In progress' : 'Up next'}
                </span>
              </li>
            )
          })}
        </ol>

        <p className="analysis-loader-footnote">
          {isFinalizing
            ? 'Your result is on its way.'
            : 'Each step completes before the next one begins.'}
        </p>
      </section>
    </main>
  )
}

export default AnalysisLoader

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AnalysisLoader from '../components/assessment/AnalysisLoader'
import Button from '../components/common/Button'
import { useJourney2Assessment } from '../auth/Journey2AssessmentContext'

const domainSteps = {
  'web-development': [
    'Analyzing technical skills',
    'Evaluating problem-solving approach',
    'Assessing user-centric thinking',
    'Measuring debugging capability',
    'Generating domain fit score',
  ],
  'default': [
    'Analyzing your responses',
    'Evaluating key skills',
    'Assessing domain fit',
    'Identifying strengths',
    'Building recommendations',
  ],
}

function DomainAnalysis() {
  const { domainId } = useParams()
  const navigate = useNavigate()
  const { submitAssessment, error } = useJourney2Assessment()
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps = domainSteps[domainId] || domainSteps['default']

  const handleComplete = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setSubmitError('')
    try {
      await submitAssessment()
      navigate(`/explore/domain-assessment/${domainId}/results`)
    } catch (requestError) {
      setSubmitError(requestError?.message || error || 'Unable to submit Journey 2 assessment.')
      setIsSubmitting(false)
    }
  }

  if (submitError || error) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-5 px-6 text-center">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-brown">We couldn’t prepare your result</h1>
          <p className="mt-3 text-brown-light">{submitError || error}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={handleComplete} disabled={isSubmitting} variant="dark" size="lg">
            {isSubmitting ? 'Submitting...' : 'Retry submission'}
          </Button>
          <Button onClick={() => navigate('/explore/domain-selection')} variant="ghost" size="md">
            Back to career selection
          </Button>
        </div>
      </main>
    )
  }

  return <>
    <AnalysisLoader
      steps={steps}
      onComplete={handleComplete}
    />
  </>
}

export default DomainAnalysis

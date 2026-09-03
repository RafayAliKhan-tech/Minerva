import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AnalysisLoader from '../components/assessment/AnalysisLoader'
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

  const steps = domainSteps[domainId] || domainSteps['default']

  const handleComplete = async () => {
    try {
      await submitAssessment()
      navigate(`/explore/domain-assessment/${domainId}/results`)
    } catch (requestError) {
      setSubmitError(requestError?.message || error || 'Unable to submit Journey 2 assessment.')
    }
  }

  return <>
    {(submitError || error) && <p className="mx-auto mb-4 max-w-2xl rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{submitError || error}</p>}
    <AnalysisLoader
      steps={steps}
      onComplete={handleComplete}
    />
  </>
}

export default DomainAnalysis

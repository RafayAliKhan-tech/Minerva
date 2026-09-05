import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AnalysisLoader from '../components/assessment/AnalysisLoader'
import { submitJourney1 } from '../api/minervaApi'

const steps = [
  'Problem-solving patterns',
  'Decision-making patterns',
  'Creative preferences',
  'Analytical thinking',
  'Response behavior',
]

const findAssessmentId = (value, key = '') => {
  if (typeof value === 'string' || typeof value === 'number') {
    return key && (/^(assessment|assessmentid|assessment_id|id)$/i.test(key)) ? String(value) : null
  }
  if (!value || typeof value !== 'object') return null

  for (const [childKey, childValue] of Object.entries(value)) {
    const found = findAssessmentId(childValue, childKey)
    if (found) return found
  }

  return null
}

function ExploringAnalysis() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const handleComplete = useCallback(async () => {
    setError('')
    try {
      const savedResponses = JSON.parse(sessionStorage.getItem('exploringResponses') || '{}')
      const answers = Object.entries(savedResponses)
        .filter(([, response]) => response?.selectedOption != null)
        .map(([questionId, response]) => ({
          questionId: String(questionId),
          selectedOption: String(response.selectedOption),
        }))

      const result = await submitJourney1({
        answers,
      })
      const assessmentId = findAssessmentId(result)
      if (!assessmentId) throw new Error('Journey 1 did not return an assessment id.')

      sessionStorage.setItem('journey1AssessmentId', String(assessmentId))
      navigate('/explore/assessment/results')
    } catch (submissionError) {
      console.error('Journey 1 submission failed', submissionError)
      const responseData = submissionError?.response?.data
      console.error('Journey 1 submit response.data:', responseData)
      setError(responseData?.message || responseData?.error || 'We could not submit your assessment. Please try again.')
    }
  }, [navigate])

  return <>
    {error && <p className="mx-auto mb-4 max-w-2xl rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    <AnalysisLoader
      steps={steps}
      onComplete={handleComplete}
    />
  </>
}

export default ExploringAnalysis

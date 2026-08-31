import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AnalysisLoader from '../components/assessment/AnalysisLoader'

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

  const steps = domainSteps[domainId] || domainSteps['default']

  const handleComplete = () => {
    alert('No backend api found')
  }

  return (
    <AnalysisLoader
      steps={steps}
      onComplete={handleComplete}
    />
  )
}

export default DomainAnalysis

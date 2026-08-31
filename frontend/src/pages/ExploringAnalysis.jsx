import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AnalysisLoader from '../components/assessment/AnalysisLoader'

const steps = [
  'Problem-solving patterns',
  'Decision-making patterns',
  'Creative preferences',
  'Analytical thinking',
  'Response behavior',
]

function ExploringAnalysis() {
  const navigate = useNavigate()

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

export default ExploringAnalysis

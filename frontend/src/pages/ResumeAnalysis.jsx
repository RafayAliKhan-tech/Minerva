import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AnalysisLoader from '../components/assessment/AnalysisLoader'

const steps = [
  'Reading Resume',
  'Identifying Skills',
  'Analyzing Projects',
  'Understanding Education',
  'Analyzing Experience',
  'Mapping Industry Skills',
]

function ResumeAnalysis() {
  const navigate = useNavigate()

  const handleComplete = () => {
    navigate('/explore/resume/insights')
  }

  return (
    <AnalysisLoader
      steps={steps}
      onComplete={handleComplete}
    />
  )
}

export default ResumeAnalysis

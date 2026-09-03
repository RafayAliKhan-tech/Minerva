import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AnalysisLoader from '../components/assessment/AnalysisLoader'
import { useRoute3Assessment } from '../auth/Route3AssessmentContext'

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
  const { file, start } = useRoute3Assessment()
  const [error, setError] = useState(null)

  const handleComplete = async () => {
    try {
      await start(file)
      navigate('/explore/resume/assessment/1')
    } catch (err) {
      console.error('Failed to start assessment:', err)
      setError('Failed to start assessment. Please try again.')
    }
  }

  if (error) return <div style={{ padding: '2rem', textAlign: 'center' }}><p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p><button type="button" onClick={() => navigate('/explore/resume')}>Start again</button></div>

  return (
    <AnalysisLoader
      steps={steps}
      onComplete={handleComplete}
    />
  )
}

export default ResumeAnalysis

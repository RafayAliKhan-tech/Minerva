import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AnalysisLoader from '../components/assessment/AnalysisLoader'
import { useAuth } from '../auth/AuthContext'
import { startRoute3 } from '../api/minervaApi'

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
  const { user } = useAuth()
  const [error, setError] = useState(null)

  const handleComplete = async () => {
    try {
      // Call startroute3 API to get questions and attemptId
      const result = await startRoute3({
        userId: user?.email || user?.Email,
        resumeFile: sessionStorage.getItem('resumeFile'),
      })

      // Store the attemptId and questions
      if (result?.attemptId) {
        sessionStorage.setItem('route3AttemptId', result.attemptId)
      }
      if (result?.questions) {
        sessionStorage.setItem('route3Questions', JSON.stringify(result.questions))
      }

      navigate('/explore/resume/assessment/1')
    } catch (err) {
      console.error('Failed to start assessment:', err)
      setError('Failed to start assessment. Please try again.')
      // Fallback - still proceed
      setTimeout(() => {
        navigate('/explore/resume/assessment/1')
      }, 2000)
    }
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
        <p style={{ color: '#666' }}>Redirecting to assessment...</p>
      </div>
    )
  }

  return (
    <AnalysisLoader
      steps={steps}
      onComplete={handleComplete}
    />
  )
}

export default ResumeAnalysis

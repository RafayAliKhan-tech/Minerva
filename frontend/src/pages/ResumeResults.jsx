import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, Loader } from 'lucide-react'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import Button from '../components/common/Button'
import SkillBar from '../components/assessment/SkillBar'
import { useAuth } from '../auth/AuthContext'
import { submitRoute3, getRoute3Result } from '../api/minervaApi'
import { saveLatestAssessment } from '../utils/userData'

function ResumeResults() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const location = useLocation()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      const attemptId = sessionStorage.getItem('route3AttemptId')
      const answers = JSON.parse(sessionStorage.getItem('route3Answers') || '{}')

      if (!attemptId) {
        setError('No assessment found. Please start again.')
        setLoading(false)
        return
      }

      // Submit answers to backend
      try {
        await submitRoute3({
          attemptId,
          answers,
          userId: user?.email || user?.Email,
        })
      } catch (submitErr) {
        console.error('Submit failed:', submitErr)
        // Continue to get results even if submit fails
      }

      // Get results from backend
      const result = await getRoute3Result(attemptId)

      if (result) {
        setResults({
          attemptId,
          skillGaps: result.skillGaps || [],
          overallScore: result.overallScore || 0,
          recommendations: result.recommendations || [],
          targetRole: result.targetRole || 'Your Target Role',
          message: result.message || 'Review your skill gaps below.',
        })

        saveLatestAssessment(user, {
          type: 'resume',
          label: 'Resume & Role Assessment',
          domain: result.targetRole || 'Job Ready',
          score: result.overallScore || 0,
        })
      } else {
        setResults({
          attemptId,
          skillGaps: [],
          overallScore: 65,
          recommendations: ['Continue learning'],
          targetRole: 'Your Target Role',
          message: 'Assessment complete.',
        })
      }
    } catch (err) {
      console.error('Failed to load results:', err)
      setError('Failed to load assessment results. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AssessmentLayout onBack={() => navigate(-1)} showProgress={false}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Loader size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p>Evaluating your assessment...</p>
        </div>
      </AssessmentLayout>
    )
  }

  if (error) {
    return (
      <AssessmentLayout onBack={() => navigate(-1)} showProgress={false}>
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
          <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>
          <Button onClick={() => navigate('/explore/resume')} variant="dark" size="lg">
            Start Over
          </Button>
        </div>
      </AssessmentLayout>
    )
  }

  if (!results) {
    return null
  }

  return (
    <AssessmentLayout onBack={() => navigate(-1)} showProgress={false}>
      <div className="space-y-10">
        {/* Score Card */}
        <div className="rounded-3xl border border-orange-pill bg-orange-pill/20 p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange">Your Readiness</p>
          <h2 className="mt-4 text-5xl font-bold text-orange">{results.overallScore}%</h2>
          <p className="mt-4 text-base text-brown-light">{results.message}</p>
        </div>

        {/* Skill Gaps */}
        {results.skillGaps && results.skillGaps.length > 0 && (
          <div className="rounded-3xl border border-beige-border bg-white p-8">
            <h3 className="text-xl font-semibold text-brown mb-6">Skills to Develop</h3>
            <div className="space-y-4">
              {results.skillGaps.map((gap, idx) => (
                <SkillBar
                  key={idx}
                  skill={gap.name}
                  percentage={gap.level || 0}
                  size="md"
                />
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {results.recommendations && results.recommendations.length > 0 && (
          <div className="rounded-3xl border border-journey-green bg-journey-green/10 p-8">
            <h3 className="text-xl font-semibold text-brown mb-6">Next Steps</h3>
            <div className="space-y-3">
              {results.recommendations.map((rec, idx) => (
                <div key={idx} className="rounded-2xl border border-journey-green bg-white p-4 text-brown">
                  {rec}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            to={`/explore/resume/skill-gap/${results.targetRole?.toLowerCase().replace(/\s+/g, '-') || 'default'}`}
            variant="dark"
            size="lg"
            icon={ArrowRight}
            className="flex-1"
          >
            View Full Skill Gap
          </Button>
          <Button
            to="/dashboard"
            variant="ghost"
            size="lg"
            className="flex-1"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </AssessmentLayout>
  )
}

export default ResumeResults

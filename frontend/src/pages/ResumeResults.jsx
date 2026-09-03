import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader, CheckCircle2, XCircle } from 'lucide-react'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import Button from '../components/common/Button'
import { useAuth } from '../auth/AuthContext'
import { useRoute3Assessment } from '../auth/Route3AssessmentContext'
import { saveLatestAssessment } from '../utils/userData'

function ResumeResults() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { submit, attemptId, error: contextError, isLoading } = useRoute3Assessment()
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadResults = async () => {
    try {
      const answers = JSON.parse(sessionStorage.getItem('route3Answers') || '{}')
      if (!attemptId) throw new Error('No backend Route 3 attempt ID is available.')
      const backendResult = await submit(answers)
      if (!backendResult || typeof backendResult !== 'object') throw new Error('Route 3 returned an invalid result.')
      setResult(backendResult)
      const data = backendResult?.data || backendResult?.result || backendResult
      saveLatestAssessment(user, { type: 'resume', label: 'Resume & Role Assessment', domain: data?.highestScoredRole || data?.targetRole || data?.role || 'Route 3 assessment', score: data?.resumeScore ?? data?.overallScore ?? data?.score, attemptId })
    } catch (err) {
        console.error('Failed to load results:', err)
        setError(err?.response?.data?.message || err?.response?.data?.error || err.message || contextError || 'Unable to complete Journey 3.')
      }
    }
    loadResults()
  }, [attemptId, submit, user, contextError])

  if (!result && !error || isLoading) {
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

  if (!result) return null

  const data = result?.data || result?.result || result
  const list = (value) => Array.isArray(value) ? value : []
  const evaluations = list(data.evaluations || data.answerEvaluations || data.evaluationResults || data.answers)
  const renderList = (items) => items.map((item, idx) => <div key={idx} className="rounded-xl border border-beige-border bg-white p-4 text-brown">{typeof item === 'string' ? item : item.name || item.title || item.text || item.description}</div>)

  return (
    <AssessmentLayout onBack={() => navigate(-1)} showProgress={false}>
      <div className="space-y-10">
        {/* Score Card */}
        <div className="rounded-3xl border border-orange-pill bg-orange-pill/20 p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange">Backend Resume Score</p>
          <h2 className="mt-4 text-5xl font-bold text-orange">{data.resumeScore ?? data.overallScore ?? data.score ?? '--'}</h2>
          <p className="mt-4 text-base text-brown-light">Highest scored role: {data.highestScoredRole || data.targetRole || data.recommendedRole || '--'}</p>
          {data.atsCompatibility !== undefined && <p className="mt-2 text-base text-brown-light">ATS compatibility: {typeof data.atsCompatibility === 'object' ? JSON.stringify(data.atsCompatibility) : data.atsCompatibility}</p>}
        </div>

        {/* Skill Gaps */}
        {list(data.categorizedSkills || data.skills || data.skillProfile).length > 0 && (
          <div className="rounded-3xl border border-beige-border bg-white p-8">
            <h3 className="text-xl font-semibold text-brown mb-6">Categorized Skills</h3>
            <div className="space-y-3">{renderList(list(data.categorizedSkills || data.skills || data.skillProfile))}</div>
          </div>
        )}

        {/* Recommendations */}
        {evaluations.length > 0 && (
          <div className="rounded-3xl border border-journey-green bg-journey-green/10 p-8">
            <h3 className="text-xl font-semibold text-brown mb-6">Answer Evaluation</h3>
            <div className="space-y-3">{evaluations.map((item, idx) => <div key={idx} className="rounded-xl border border-beige-border bg-white p-4"><div className="flex items-center gap-2 text-brown"><strong>{item.skill_id || item.skillId || item.skill || item.questionId}</strong>{item.is_correct === true ? <CheckCircle2 className="text-green-600" size={18} /> : item.is_correct === false ? <XCircle className="text-red-600" size={18} /> : null}</div>{item.reasoning && <p className="mt-2 text-sm text-brown-light">{item.reasoning}</p>}</div>)}</div>
          </div>
        )}

        {list(data.strengths).length > 0 && <div className="rounded-3xl border border-journey-green bg-journey-green/10 p-8"><h3 className="text-xl font-semibold text-brown mb-6">Strengths</h3><div className="space-y-3">{renderList(list(data.strengths))}</div></div>}
        {list(data.weaknesses || data.areasToImprove).length > 0 && <div className="rounded-3xl border border-orange-pill bg-orange-pill/20 p-8"><h3 className="text-xl font-semibold text-brown mb-6">Weaknesses</h3><div className="space-y-3">{renderList(list(data.weaknesses || data.areasToImprove))}</div></div>}

        {/* CTA */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            to={`/explore/resume/skill-gap/${(data.highestScoredRole || data.targetRole || data.recommendedRole || 'default').toLowerCase().replace(/\s+/g, '-')}`}
            variant="dark"
            size="lg"
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

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader, CheckCircle2, XCircle } from 'lucide-react'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import Button from '../components/common/Button'
import { useAuth } from '../auth/AuthContext'
import { useRoute3Assessment } from '../auth/Route3AssessmentContext'
import { getRoute3Result } from '../api/minervaApi'
import { saveLatestAssessment } from '../utils/userData'

const unwrapResult = (value) => value?.data || value?.result || value || {}
const firstValue = (value, keys) => keys.reduce((found, key) => found ?? value?.[key], undefined)

const getAnalysis = (value) => {
  const data = unwrapResult(value)
  return unwrapResult(data.analysisResult || data.analysis_result || data.resumeAnalysis || data.resume_analysis)
}

const getField = (value, keys) => firstValue(value, keys) ?? firstValue(getAnalysis(value), keys)
const getScalar = (value, keys) => {
  const field = getField(value, keys)
  if (field === null || field === undefined) return null
  if (typeof field !== 'object') return field
  return firstValue(field, ['final_score', 'finalScore', 'resume_score', 'resumeScore', 'overall_score', 'overallScore', 'score', 'value']) ?? null
}
const getHighestRole = (value) => {
  const analysis = getAnalysis(value)
  const directRole = getField(value, ['highestScoredRole', 'highest_scored_role', 'highestScoredField', 'highest_scored_field', 'targetRole', 'target_role', 'recommendedRole', 'recommended_role', 'role', 'field'])
  if (typeof directRole === 'string' && directRole.trim()) return directRole

  const scoreMap = analysis?.field_scores || analysis?.fieldScores || analysis?.role_scores || analysis?.roleScores
  if (scoreMap && typeof scoreMap === 'object') {
    const entries = Array.isArray(scoreMap)
      ? scoreMap.map((item) => [item?.field || item?.field_name || item?.role || item?.name, item])
      : Object.entries(scoreMap)
    const highest = entries
      .map(([name, score]) => [name, Number(typeof score === 'object' ? score?.score ?? score?.value ?? score?.final_score ?? score?.field_score : score)])
      .filter(([name]) => typeof name === 'string' && name.trim())
      .filter(([, score]) => Number.isFinite(score))
      .sort((left, right) => right[1] - left[1])[0]
    if (highest) return highest[0]
  }

  return null
}

function ResumeResults() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { submit, startResult, result: storedResult, attemptId, error: contextError, isLoading } = useRoute3Assessment()
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const loadingRef = useRef(false)

  useEffect(() => {
    const loadResults = async () => {
    if (loadingRef.current) return
    loadingRef.current = true
    try {
      if (!attemptId) throw new Error('No backend Route 3 attempt ID is available.')
      const savedResult = storedResult || JSON.parse(sessionStorage.getItem('route3Result') || 'null')
      const hasPendingSubmission = sessionStorage.getItem('route3PendingSubmission') === 'true'
      const backendResult = savedResult || (hasPendingSubmission
        ? await submit(JSON.parse(sessionStorage.getItem('route3Answers') || '{}'))
        : await getRoute3Result(attemptId))
      if (!backendResult || typeof backendResult !== 'object') throw new Error('Route 3 returned an invalid result.')
      setResult(backendResult)
      const data = { ...getAnalysis(startResult), ...unwrapResult(backendResult) }
      saveLatestAssessment(user, { type: 'resume', label: 'Resume & Role Assessment', domain: getHighestRole(data) || 'Route 3 assessment', score: getScalar(data, ['resumeScore', 'resume_score', 'overallScore', 'overall_score', 'score', 'final_score']), attemptId })
    } catch (err) {
        console.error('Failed to load results:', err)
        setError(err?.response?.data?.message || err?.response?.data?.error || err.message || contextError || 'Unable to complete Journey 3.')
      }
    }
    loadResults()
  }, [attemptId, storedResult, submit, user, contextError])

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

  const data = { ...getAnalysis(startResult), ...unwrapResult(result) }
  const list = (value) => Array.isArray(value) ? value : []
  const evaluations = list(data.evaluations || data.evaluation_results || data.answerEvaluations || data.answer_evaluations || data.evaluationResults || data.answers)
  const renderList = (items) => items.map((item, idx) => <div key={idx} className="rounded-xl border border-beige-border bg-white p-4 text-brown">{typeof item === 'string' ? item : item.name || item.title || item.text || item.description}</div>)

  return (
    <AssessmentLayout onBack={() => navigate(-1)} showProgress={false}>
      <div className="space-y-10">
        {/* Score Card */}
        <div className="rounded-3xl border border-orange-pill bg-orange-pill/20 p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange">Backend Resume Score</p>
          <h2 className="mt-4 text-5xl font-bold text-orange">{getScalar(data, ['resumeScore', 'resume_score', 'overallScore', 'overall_score', 'score', 'final_score']) ?? '--'}</h2>
          <p className="mt-4 text-base text-brown-light">Highest scored role: {getHighestRole(data) || '--'}</p>
          {getField(data, ['atsCompatibility', 'ats_compatibility']) !== undefined && <p className="mt-2 text-base text-brown-light">ATS compatibility: {typeof getField(data, ['atsCompatibility', 'ats_compatibility']) === 'object' ? JSON.stringify(getField(data, ['atsCompatibility', 'ats_compatibility'])) : getField(data, ['atsCompatibility', 'ats_compatibility'])}</p>}
        </div>

        {/* Skill Gaps */}
        {list(data.categorizedSkills || data.categorized_skills || data.skills || data.skillProfile || data.skill_profile).length > 0 && (
          <div className="rounded-3xl border border-beige-border bg-white p-8">
            <h3 className="text-xl font-semibold text-brown mb-6">Categorized Skills</h3>
            <div className="space-y-3">{renderList(list(data.categorizedSkills || data.categorized_skills || data.skills || data.skillProfile || data.skill_profile))}</div>
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
            to="/dashboard"
            variant="ghost"
            size="lg"
            className="flex-1"
          >
            Back to Dashboard
          </Button>
        </div>
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              sessionStorage.removeItem('route3AttemptId')
              sessionStorage.removeItem('route3Questions')
              sessionStorage.removeItem('route3Answers')
              sessionStorage.removeItem('route3Result')
              sessionStorage.removeItem('route3StartResult')
              sessionStorage.removeItem('route3PendingSubmission')
              navigate('/explore/resume')
            }}
          >
            Reassess / Start New Assessment
          </Button>
        </div>
      </div>
    </AssessmentLayout>
  )
}

export default ResumeResults

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader, CheckCircle2, XCircle, Zap, Check, FileText, Star, Target, ArrowLeft, ArrowRight } from 'lucide-react'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import Button from '../components/common/Button'
import ResumeAnalysisResultCard from '../components/common/ResumeAnalysisResultCard'
import { useAuth } from '../auth/AuthContext'
import { useRoute3Assessment } from '../auth/Route3AssessmentContext'
import { generateRoadmap, getRoute3Result } from '../api/minervaApi'
import { saveLatestAssessment, saveAssessmentOutput, saveRoadmap } from '../utils/userData'

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
  const [roadmapError, setRoadmapError] = useState('')
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false)
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
      saveAssessmentOutput(user, 'journey3', data)
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
      <AssessmentLayout onBack={() => navigate(-1)} showProgress={false} contentClassName="max-w-none">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Loader size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p>Evaluating your assessment...</p>
        </div>
      </AssessmentLayout>
    )
  }

  if (error) {
    return (
      <AssessmentLayout onBack={() => navigate(-1)} showProgress={false} contentClassName="max-w-none">
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
  const correctAnswers = evaluations.filter((item) => item?.is_correct !== false).length
  const assessmentScore = evaluations.length
    ? Math.round((correctAnswers / evaluations.length) * 5 * 10) / 10
    : null
  const renderList = (items) => items.map((item, idx) => <div key={idx} className="rounded-xl border border-beige-border bg-white p-4 text-brown">{typeof item === 'string' ? item : item.name || item.title || item.text || item.description}</div>)
  const score = getScalar(data, ['resumeScore', 'resume_score', 'overallScore', 'overall_score', 'score', 'final_score'])
  const strengths = list(data.strengths)
  const weaknesses = list(data.weaknesses || data.areasToImprove)
  const skills = list(data.categorizedSkills || data.categorized_skills || data.skills || data.skillProfile || data.skill_profile)

  const handleGenerateRoadmap = async () => {
    const journeyOutput = unwrapResult(result)
    if (!Array.isArray(journeyOutput?.skill_profile)) {
      setRoadmapError('Journey 3 did not return the evaluated skill profile required to generate a roadmap.')
      return
    }

    setIsGeneratingRoadmap(true)
    setRoadmapError('')
    try {
      const created = await generateRoadmap({
        journey: 3,
        weekly_hours: 5,
        journey_output: journeyOutput,
      })
      const roadmapId = created?.roadmap_id || created?.roadmapId
      if (!roadmapId) throw new Error('The roadmap API did not return a valid roadmap ID.')

      const roadmap = created?.result || {}
      const savedRoadmap = {
        ...roadmap,
        id: roadmapId,
        domain: roadmap.career || 'Resume skill development',
        domainId: null,
        source: 'journey3',
        status: 'generated',
        createdAt: new Date().toISOString(),
      }
      saveRoadmap(user, savedRoadmap)
      navigate(`/roadmap-detail/${roadmapId}`, {
        state: {
          ...savedRoadmap,
          returnTo: { pathname: '/explore/resume/results' },
        },
      })
    } catch (roadmapRequestError) {
      console.error('Journey 3 roadmap generation failed:', roadmapRequestError)
      setRoadmapError(roadmapRequestError?.response?.data?.message || roadmapRequestError?.response?.data?.error || roadmapRequestError.message || 'Unable to generate your Journey 3 roadmap.')
    } finally {
      setIsGeneratingRoadmap(false)
    }
  }

  const renderInsightItems = (items, Icon) => items.map((item, idx) => <li key={idx}><Icon size={15} /> <div><strong>{typeof item === 'string' ? item : item.name || item.title || item.text || item.description}</strong>{typeof item !== 'string' && item.description && <small>{item.description}</small>}</div></li>)

  return (
    <AssessmentLayout onBack={() => navigate(-1)} showProgress={false} contentClassName="max-w-none" className="resume-results-layout">
      <div className="resume-results-page">
        <header className="resume-results-hero">
          <div>
            <div className="resume-results-badge"><FileText size={17} /> Journey 3 Results</div>
            <h1>Your Assessment Results</h1>
            <p>See how your resume-based assessment performed and where your skills can grow.</p>
          </div>
          <Button className="resume-results-hero-action text-white" to="/explore/resume/insights" state={{ analysis: data }} variant="secondary" size="md" icon={ArrowRight}>View Resume Analysis</Button>
        </header>
        <main className="resume-results-main">
          <section className="resume-results-score-card">
            <div className="resume-results-score-copy">
              <div className="resume-results-badge"><FileText size={17} /> Journey 3 Results</div>
              <p className="resume-results-kicker">ASSESSMENT PERFORMANCE</p>
              <h1>Your Assessment Score</h1>
              <div className="resume-results-score-value">{assessmentScore ?? '--'} <span>{assessmentScore !== null ? 'Answer accuracy' : 'Awaiting evaluation'}</span></div>
              <p>This score reflects how well you performed across the resume-based assessment questions.</p>
            </div>
            <div className="resume-results-ring"><strong>{assessmentScore ?? '--'}</strong><small>/ 5</small></div>
            <div className="resume-results-metrics">
              <div><span><Target size={15} /></span><strong>Questions reviewed</strong><b>{evaluations.length}</b><i><em style={{ width: '100%' }} /></i></div>
              <div><span><CheckCircle2 size={15} /></span><strong>Answers on track</strong><b>{correctAnswers}</b><i><em style={{ width: `${evaluations.length ? (correctAnswers / evaluations.length) * 100 : 0}%` }} /></i></div>
            </div>
          </section>

          {evaluations.length > 0 && <section className="resume-results-evaluation"><div className="resume-results-section-heading"><span><Target size={17} /></span><div><h2>Answer Evaluation</h2><p>Review each response and the reasoning behind its result.</p></div></div><div className="resume-results-evaluation-grid">{evaluations.map((item, idx) => <article key={idx} className={item.is_correct === false ? 'is-evaluation-wrong' : 'is-evaluation-correct'}><header><span>{item.is_correct === false ? <XCircle size={20} /> : <CheckCircle2 size={20} />}<strong>{item.skill_id || item.skillId || item.skill || item.questionId || `Question ${idx + 1}`}</strong></span><b>{item.is_correct === false ? 'Needs work' : 'On track'}</b></header>{item.reasoning ? <p>{item.reasoning}</p> : <p>No additional feedback was provided for this response.</p>}</article>)}</div></section>}

          <section className="resume-analysis-results-section">
            <div className="resume-results-section-heading"><span><FileText size={17} /></span><div><h2>Resume Analysis</h2><p>Your resume insights, separate from your assessment performance.</p></div></div>
            <div className="resume-analysis-results-score"><span>Resume score</span><strong>{score ?? '--'}<small>/100</small></strong><i><em style={{ width: `${Math.max(0, Math.min(100, Number(score) || 0))}%` }} /></i></div>
            <div className="resume-results-insights">
              {strengths.length > 0 && <section className="resume-results-insight-card strengths"><header><span><Star size={18} /></span><div><h2>Strengths</h2><p>Key strengths identified in your resume.</p></div></header><ul>{renderInsightItems(strengths, Check)}</ul></section>}
              {weaknesses.length > 0 && <section className="resume-results-insight-card weaknesses"><header><span><XCircle size={18} /></span><div><h2>Weaknesses</h2><p>Areas to improve in your resume.</p></div></header><ul>{renderInsightItems(weaknesses, XCircle)}</ul></section>}
            </div>
            {skills.length > 0 && <div className="resume-results-skills"><h2>Categorized Skills</h2><div>{renderList(skills)}</div></div>}
            <ResumeAnalysisResultCard analysis={data} />
          </section>
          {roadmapError && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{roadmapError}</p>}
          <div className="resume-results-actions"><Button className="resume-results-dashboard-action resume-back-button" to="/dashboard" variant="ghost" size="lg" icon={ArrowLeft} iconPosition="left">Back</Button><Button className="resume-results-roadmap-action" onClick={handleGenerateRoadmap} disabled={isGeneratingRoadmap} variant="secondary" size="lg">{isGeneratingRoadmap ? 'Generating roadmap...' : 'Generate Personalized Roadmap'}</Button></div>
          <div className="resume-results-secondary-actions"><Button variant="secondary" size="sm" onClick={() => { sessionStorage.removeItem('route3AttemptId'); sessionStorage.removeItem('route3Questions'); sessionStorage.removeItem('route3Answers'); sessionStorage.removeItem('route3Result'); sessionStorage.removeItem('route3StartResult'); sessionStorage.removeItem('route3PendingSubmission'); navigate('/explore/resume') }}>Reassess / Start New Assessment</Button></div>
        </main>

      </div>
    </AssessmentLayout>
  )
}

export default ResumeResults

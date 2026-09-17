import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import SkillBar from '../components/assessment/SkillBar'
import Button from '../components/common/Button'
import { ArrowLeft, BarChart3, CheckCircle2, ClipboardList, Flag, Lightbulb, ShieldCheck, Target, Trophy, XCircle } from 'lucide-react'
import { generateRoadmap, getJourney2Result } from '../api/minervaApi'
import { useAuth } from '../auth/AuthContext'
import { useJourney2Assessment } from '../auth/Journey2AssessmentContext'
import { saveLatestAssessment, saveAssessmentOutput, saveRoadmap } from '../utils/userData'

const unwrap = (payload) => {
  let value = payload
  while (value && typeof value === 'object' && !Array.isArray(value) && (value.data || value.result)) {
    value = value.data || value.result
  }
  return value
}
const getProfile = (payload) => {
  const data = unwrap(payload)
  return data?.result || data?.profile || data?.assessmentResult || data?.assessment_result || data
}
const getMatches = (profile) => {
  const matches = profile?.potentialDomains || profile?.potential_domains || profile?.careerMatches || profile?.career_matches || profile?.matches || profile?.domains || profile?.recommendedCareers || profile?.recommended_careers || []
  if (Array.isArray(matches) && matches.length > 0) return matches
  if (matches && typeof matches === 'object' && !Array.isArray(matches) && Object.keys(matches).length > 0) {
    return Object.entries(matches).map(([name, value]) => ({ name, ...(typeof value === 'object' ? value : { score: value }) }))
  }

  // Journey 2 scores one career chosen before the assessment; its backend
  // contract has no separate matches collection. Represent that returned
  // selected career for this page without inventing a recommendation.
  return profile?.career
    ? [{ career: profile.career, careerName: profile.career_name, match: profile.readiness_percent }]
    : []
}
const getName = (match) => match?.domain || match?.career || match?.careerName || match?.career_name || match?.name || match?.label || match?.field || 'Selected career'
const getScore = (match) => Number(match?.match ?? match?.score ?? match?.percentage ?? match?.fit ?? match?.match_score ?? match?.matchScore ?? 0)
const getArray = (value) => Array.isArray(value) ? value : (value && typeof value === 'object' ? Object.values(value) : [])
const getRoadmapPayload = (payload) => {
  const data = unwrap(payload)
  return data?.result || data
}
const getRoadmapId = (payload) => {
  if (!payload || typeof payload !== 'object') return null
  const directId = payload.roadmapId || payload.roadmap_id || payload.id || payload.Id
  if (directId) return directId
  if (payload.roadmap && typeof payload.roadmap === 'object') return getRoadmapId(payload.roadmap)
  return null
}

function DomainResults() {
  const { domainId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { selectedCareer, error: contextError } = useJourney2Assessment()
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const loadResult = async () => {
      try {
        const careerId = selectedCareer?.career_id || selectedCareer?.careerId || selectedCareer?.id || domainId
        const backendResult = await getJourney2Result(careerId)
        console.groupCollapsed('[Journey2] Result response')
        console.debug('careerId:', careerId)
        console.debug('raw result:', backendResult)
        console.debug('unwrapped result:', unwrap(backendResult))
        console.groupEnd()
        if (!backendResult || backendResult.status === false) throw new Error(backendResult?.message || 'The Journey 2 API returned no result.')
        const profile = getProfile(backendResult)
        console.debug('[Journey2] Extracted profile:', profile)
        if (!profile || typeof profile !== 'object') throw new Error('The Journey 2 result response is invalid.')
        setResult(backendResult)
        saveAssessmentOutput(user, 'journey2', profile)
        const matches = getMatches(profile)
        console.debug('[Journey2] Extracted matches:', matches)
        saveLatestAssessment(user, {
          type: 'domain',
          label: `${selectedCareer?.career_name || selectedCareer?.careerName || domainId} assessment`,
          domain: selectedCareer?.career_name || selectedCareer?.careerName || domainId,
          score: getScore(matches[0]),
          source: 'journey2',
          careerId,
        })
      } catch (resultError) {
        console.error('[Journey2] Result loading failed:', resultError)
        setError(resultError?.response?.data?.message || resultError?.response?.data?.error || resultError.message || contextError || 'Unable to load your Journey 2 result.')
      }
    }
    loadResult()
  }, [user, selectedCareer, domainId, contextError])

  if (error) return <AssessmentLayout onBack={() => navigate('/explore/domain-selection')} showProgress={false}><div className="rounded-3xl border border-red-200 bg-white p-8 shadow-card"><h1 className="font-serif text-3xl font-semibold text-brown">Journey 2 result unavailable</h1><p className="mt-4 text-brown-light">{error}</p><Button onClick={() => navigate('/explore/domain-selection')} variant="dark" size="lg" className="mt-8">Start again</Button></div></AssessmentLayout>
  if (!result) return <AssessmentLayout onBack={() => navigate('/explore/domain-selection')} showProgress={false}><p className="text-center text-brown-light">Loading backend result...</p></AssessmentLayout>

  const profile = getProfile(result)
  const matches = getMatches(profile)
  const traits = getArray(profile.scores || profile.skills || profile.skill_scores || profile.skillScores)
  const insights = getArray(profile.insights || profile.recommendations || profile.strengths || profile.recommendations_list)
  const careerName = selectedCareer?.career_name || selectedCareer?.careerName || selectedCareer?.name || domainId
  const careerId = selectedCareer?.career_id || selectedCareer?.careerId || selectedCareer?.id || domainId
  const totalQuestions = Number(profile.totalQuestions || profile.total_questions || profile.questionsAttempted || profile.questions_attempted || 5)
  const score = Math.max(0, Math.min(100, getScore(matches[0]) || Number(profile.readiness_percent || profile.readinessPercent || profile.average_score || profile.averageScore || 0)))
  const correctAnswers = Number(profile.correctAnswers || profile.correct_answers || profile.correct || Math.round((score / 100) * totalQuestions))
  const incorrectAnswers = Math.max(0, totalQuestions - correctAnswers)

  const handleBuildRoadmap = async (match = matches[0] || {}) => {
    setIsGenerating(true)
    setError('')
    try {
      const matchScore = getScore(match)
      const strengths = getArray(profile.strengths || profile.strong_areas || profile.strongAreas)
      const areasToImprove = getArray(profile.weaknesses || profile.weak_areas || profile.weakAreas || profile.moderate_areas || profile.moderateAreas)
      const created = await generateRoadmap({ journey: 2, weekly_hours: 5, journey_output: result })
      console.groupCollapsed('[Journey2] Roadmap response')
      console.debug('raw response:', created)
      console.debug('unwrapped response:', unwrap(created))
      console.groupEnd()
      const roadmap = getRoadmapPayload(created)
      console.log('[Journey2] Roadmap API payload:', JSON.stringify(created, null, 2))
      const roadmapId = getRoadmapId(created) || getRoadmapId(roadmap)
      if (!roadmapId) {
        throw new Error(`The roadmap API did not return a valid roadmap ID. Response: ${JSON.stringify(created)}`)
      }
      const saved = { ...roadmap, id: roadmapId, domain: roadmap.domain || getName(match), domainId: careerId, source: 'journey2', status: roadmap.status || 'generated' }
      sessionStorage.setItem('journey2RoadmapId', String(roadmapId))
      saveRoadmap(user, saved)
      navigate(`/roadmap-detail/${roadmapId}`, { state: { ...saved, returnTo: { pathname: `/explore/domain-assessment/${careerId}/results` } } })
    } catch (roadmapError) {
      console.error('[Journey2] Roadmap generation failed:', roadmapError, roadmapError?.response?.data)
      setError(roadmapError?.response?.data?.message || roadmapError?.response?.data?.error || roadmapError.message || 'Unable to generate your roadmap.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <AssessmentLayout onBack={() => navigate('/explore/domain-selection')} showProgress={false} contentClassName="max-w-none" className="journey2-results-layout">
      {/* <button className="journey2-results-back" type="button" onClick={() => navigate('/explore/domain-selection')}><ArrowLeft size={16} /> Back</button> */}
      <div className="journey2-results-grid">
        <main className="journey2-results-card">
          <div className="journey2-results-badge"><Trophy size={16} /> Journey 2 • Results</div>
          <h1>Your {careerName} result</h1>
          <p className="journey2-results-subtitle">Here's how you performed in the {totalQuestions} questions. Review your score and insights to understand your strengths and next steps.</p>
          <section className="journey2-score-panel">
            <div className="journey2-score-ring" style={{ '--score': `${score * 3.6}deg` }}><strong>{score}%</strong><span>Readiness</span></div>
            <div className="journey2-score-stats"><div><ClipboardList size={17} /><span>Total Questions<strong>{totalQuestions}</strong></span></div><div><CheckCircle2 size={17} /><span>Correct Answers<strong>{correctAnswers}</strong></span></div><div><XCircle size={17} /><span>Incorrect Answers<strong>{incorrectAnswers}</strong></span></div></div>
            <div className="journey2-result-message"><ShieldCheck size={24} /><div><h2>{score >= 70 ? 'Great Job!' : 'Keep Building!'}</h2><p>{score >= 70 ? 'You have a strong understanding of this career domain. Keep going to improve even further!' : 'You are making progress. Review the areas below and keep practicing.'}</p></div></div>
          </section>
          <h2 className="journey2-question-summary-title">Question Summary</h2>
          <div className="journey2-question-summary">{Array.from({ length: totalQuestions }, (_, index) => <div key={index} className={index < correctAnswers ? 'is-correct' : 'is-incorrect'}><span>{index + 1}</span><strong>{index < correctAnswers ? 'Correct' : 'Incorrect'}</strong></div>)}</div>
          {traits.length > 0 && <section className="journey2-result-traits"><h2>Skill Insights</h2>{traits.map((trait, index) => <SkillBar key={`${trait.name || trait.label || index}`} skill={trait.name || trait.label} percentage={Number(trait.score ?? trait.percentage ?? 0)} size="md" />)}</section>}
          {insights.length > 0 && <section className="journey2-result-insights"><h2>Insights</h2>{insights.map((insight, index) => <div key={index}><CheckCircle2 size={17} /><p>{typeof insight === 'string' ? insight : insight.text || insight.description || insight.title}</p></div>)}</section>}
          {error && <p className="journey2-results-error" role="alert">{error}</p>}
          <div className="journey2-results-actions"><Button onClick={() => navigate('/explore/domain-selection')} variant="ghost" size="md"><ArrowLeft size={15} /> Back </Button><Button onClick={() => handleBuildRoadmap()} disabled={isGenerating || !matches.length} variant="secondary" size="lg">{isGenerating ? 'Generating...' : 'View Detailed Insights →'}</Button></div>
        </main>
        <aside className="journey2-results-sidebar">
          <section className="journey2-performance-card"><div className="journey2-sidebar-title"><span><BarChart3 size={17} /></span><h2>Performance Overview</h2></div><div className="journey2-performance-stats"><strong>{score}%<small>Overall Readiness</small></strong><strong>{correctAnswers}/{totalQuestions}<small>Correct Answers</small></strong></div></section>
          <section className="journey2-summary-card"><div className="journey2-sidebar-title"><span><ClipboardList size={17} /></span><h2>Quick Summary</h2></div>{[[Target, 'Career Area', careerName, ShieldCheck], [ClipboardList, 'Questions Attempted', totalQuestions], [CheckCircle2, 'Correct Answers', correctAnswers], [XCircle, 'Incorrect Answers', incorrectAnswers], [Target, 'Average Score', `${score}%`]].map(([Icon, label, value, ValueIcon]) => <div className="journey2-summary-row" key={label}><Icon size={16} /><span>{label}</span><strong>{ValueIcon && <ValueIcon size={12} />}{value}</strong></div>)}</section>
          <section className="journey2-results-next"><Lightbulb size={19} /><div><h2>Keep Going!</h2><p>You're on the right track. Focus on the areas you found challenging and continue building your skills in {careerName}.</p></div><Flag size={18} /></section>
        </aside>
      </div>
    </AssessmentLayout>
  )
}

export default DomainResults

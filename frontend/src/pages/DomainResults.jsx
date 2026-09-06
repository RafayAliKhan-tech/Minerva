import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import SkillBar from '../components/assessment/SkillBar'
import Button from '../components/common/Button'
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react'
import { generateRoadmap, getJourney2Result } from '../api/minervaApi'
import { useAuth } from '../auth/AuthContext'
import { useJourney2Assessment } from '../auth/Journey2AssessmentContext'
import { saveLatestAssessment, saveRoadmap } from '../utils/userData'

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
      const roadmapId = getRoadmapId(roadmap)
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

  return <AssessmentLayout onBack={() => navigate('/explore/domain-selection')} showProgress={false}>
    <div className="rounded-3xl border border-beige-border bg-white p-8 shadow-card sm:p-12">
      <h1 className="font-serif text-4xl font-semibold text-brown">Your {careerName} result</h1>
      <p className="mt-4 text-base text-brown-light">This result was generated by the Journey 2 backend.</p>
      {matches.length > 0 && <section className="mt-10"><h2 className="font-serif text-2xl font-semibold text-brown">Career matches</h2><div className="mt-5 space-y-4">{matches.map((match, index) => <div key={`${getName(match)}-${index}`} className="rounded-xl border border-beige-border bg-cream-dark p-5"><div className="flex items-center justify-between"><strong className="text-brown">{getName(match)}</strong><span className="font-bold text-orange">{getScore(match)}%</span></div><button type="button" onClick={() => handleBuildRoadmap(match)} disabled={isGenerating} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange px-4 py-2 font-semibold text-white disabled:opacity-60"><Zap size={15} />{isGenerating ? 'Generating...' : 'Generate roadmap'}</button></div>)}</div></section>}
      {traits.length > 0 && <section className="mt-10"><h2 className="font-serif text-2xl font-semibold text-brown">Backend scores</h2><div className="mt-5 space-y-4">{traits.map((trait, index) => <SkillBar key={`${trait.name || trait.label || index}`} skill={trait.name || trait.label} percentage={Number(trait.score ?? trait.percentage ?? 0)} size="md" />)}</div></section>}
      {insights.length > 0 && <section className="mt-10"><h2 className="font-serif text-2xl font-semibold text-brown">Insights</h2><div className="mt-5 space-y-3">{insights.map((insight, index) => <div key={index} className="flex gap-3 rounded-xl border border-journey-green bg-journey-green/20 p-4"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-journey-green-dark" /><p className="text-brown">{typeof insight === 'string' ? insight : insight.text || insight.description || insight.title}</p></div>)}</div></section>}
      {error && <p className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</p>}
      <Button onClick={() => handleBuildRoadmap()} disabled={isGenerating || !matches.length} variant="dark" size="lg" icon={ArrowRight} className="mt-10">{isGenerating ? 'Generating roadmap...' : 'Generate roadmap'}</Button>
    </div>
  </AssessmentLayout>
}

export default DomainResults

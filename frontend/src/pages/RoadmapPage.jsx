import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Check, Circle, Clock3, MessageCircle, Sparkles } from 'lucide-react'
import Container from '../components/common/Container'
import { useAuth } from '../auth/AuthContext'
import { getRoadmapKey, saveRoadmap } from '../utils/userData'
import { getRoadmapResult } from '../api/minervaApi'

const fallbackMilestones = [
  { phase: '01', title: 'Sharpen your foundation', detail: 'Strengthen the fundamentals that make your target role easier to reach.', tasks: ['JavaScript essentials', 'Accessible interface patterns', 'Git workflow'] },
  { phase: '02', title: 'Build proof of skill', detail: 'Turn learning into visible work that communicates how you think.', tasks: ['Build a responsive product page', 'Connect a REST API', 'Write a project case study'] },
  { phase: '03', title: 'Move toward opportunity', detail: 'Practice the conversations and applications that open your next door.', tasks: ['Polish portfolio', 'Practice interview stories', 'Apply to three aligned roles'] },
]

const normalizeMilestones = (source, useFallback = true) => {
  if (!source) return useFallback ? fallbackMilestones : []

  const phases = Array.isArray(source) ? source : source.phases || source.curriculum?.phases || source.milestones || source.roadmap?.phases || (source.result && !Array.isArray(source.result) ? source.result.phases : null) || []
  if (phases.length === 0) return useFallback ? fallbackMilestones : []

  return phases.map((phase, index) => {
    const items = phase.tasks || phase.objectives || phase.topics || phase.lessons || phase.resources || []
    return {
      phase: String(index + 1).padStart(2, '0'),
      title: phase.title || phase.name || ('Phase ' + (index + 1)),
      detail: phase.detail || phase.description || ('Phase ' + (index + 1) + ' learning objectives'),
      tasks: Array.isArray(items) ? items.map((item) => typeof item === 'string' ? item : item.title || item.name || item.label || 'Milestone task') : [],
    }
  })
}

const normalizeRoadmap = (raw, fallbackState = {}) => {
  const roadmapArray = Array.isArray(raw) ? raw : Array.isArray(raw?.result) ? raw.result : null
  const isRoadmapArray = Array.isArray(roadmapArray)
  const selectedCareer = fallbackState.domainId || fallbackState.domain || fallbackState.career
  const roadmapData = (raw?.result && typeof raw.result === 'object' && !isRoadmapArray) ? raw.result
    : (isRoadmapArray ? roadmapArray.find((item) => item?.career === selectedCareer) : null)

  const data = roadmapData || (isRoadmapArray ? {} : raw?.data || raw?.roadmap || raw || {})
  const domain = data.domain || data.career || data.domainName || fallbackState.domain || 'Your roadmap'
  const domainId = data.domainId || data.domain_id || fallbackState.domainId || fallbackState.roadmapId || null
  const matchScore = Number(data.matchScore ?? data.score ?? fallbackState.score ?? 0)
  const milestones = normalizeMilestones(data, !isRoadmapArray)
  const timelineWeeks = data.timeline?.total_duration_weeks || milestones.length * 4
  const curriculum = data.curriculum || { phases: milestones, weeks: timelineWeeks }

  return {
    id: data.id || data.roadmapId || data.roadmap_id || raw?.roadmap_id || raw?.roadmapId || fallbackState.roadmapId || 'default',
    domain,
    domainId,
    matchScore,
    curriculum,
    milestones,
    strengths: data.strengths || fallbackState.strengths || [],
    areasToImprove: data.areasToImprove || fallbackState.areasToImprove || [],
    createdAt: data.createdAt || new Date().toISOString(),
    status: data.status || 'generated',
  }
}

function RoadmapPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { roadmapId: routeRoadmapId } = useParams()
  const context = location.state || {}
  const returnTarget = context.returnTo || { pathname: '/dashboard' }
  const lastRoadmapKey = getRoadmapKey(user, '__last__')
  const effectiveRoadmapId = routeRoadmapId || context.roadmapId || null
  const isJourney2Roadmap = context.source === 'journey2' || sessionStorage.getItem('journey2RoadmapId') === effectiveRoadmapId
  const [roadmap, setRoadmap] = useState(normalizeRoadmap(context, context))
  const [completed, setCompleted] = useState([])
  const [isLoading, setIsLoading] = useState(Boolean(routeRoadmapId || context.roadmapId))
  const [routeError, setRouteError] = useState('')

  useEffect(() => {
    try {
      if (!effectiveRoadmapId) {
        setCompleted([])
        return
      }
      const stored = JSON.parse(localStorage.getItem(getRoadmapKey(user, effectiveRoadmapId)) || '[]')
      setCompleted(Array.isArray(stored) ? stored : [])
    } catch {
      setCompleted([])
    }
  }, [user, effectiveRoadmapId])

  useEffect(() => {
    const loadRoadmap = async () => {
      if (!effectiveRoadmapId) {
        setRoadmap(normalizeRoadmap(context, context))
        setRouteError('No real backend roadmap is available yet. Generate one from your assessment result first.')
        setIsLoading(false)
        return
      }

      const fallback = normalizeRoadmap(context, context)
      setRoadmap(fallback)
      setRouteError('')
      setIsLoading(true)

      try {
        const response = await getRoadmapResult(effectiveRoadmapId)
        const nextRoadmap = normalizeRoadmap(response, { ...context, roadmapId: effectiveRoadmapId })
        setRoadmap(nextRoadmap)
        saveRoadmap(user, nextRoadmap)
        localStorage.setItem(getRoadmapKey(user, nextRoadmap.id), JSON.stringify(completed))
        localStorage.setItem(lastRoadmapKey, nextRoadmap.id)
      } catch (error) {
        console.error('Failed to load roadmap result', error)
        if (isJourney2Roadmap) setRoadmap({ ...fallback, milestones: [], curriculum: { phases: [], weeks: 0 } })
        else setRoadmap(fallback)
        setRouteError('We could not load the roadmap from the backend. Please generate it again from your assessment result.')
      } finally {
        setIsLoading(false)
      }
    }

    loadRoadmap()
  }, [context, effectiveRoadmapId, user, completed.length])

  const persist = (items) => {
    setCompleted(items)
    localStorage.setItem(getRoadmapKey(user, effectiveRoadmapId), JSON.stringify(items))
    localStorage.setItem(lastRoadmapKey, effectiveRoadmapId)
  }

  const toggle = (task) => {
    persist(completed.includes(task) ? completed.filter((item) => item !== task) : [...completed, task])
  }

  const milestoneList = useMemo(() => isJourney2Roadmap && routeError ? [] : (roadmap.milestones || fallbackMilestones), [roadmap, isJourney2Roadmap, routeError])
  const total = milestoneList.reduce((sum, item) => sum + (item.tasks || []).length, 0)
  const assessmentTarget = roadmap.domainId || context.domainId || context.roadmapId || 'ui_ux'

  const backLabel = returnTarget.pathname?.includes('/explore/domain-assessment') ? 'Back to result' : 'Back to dashboard'

  return <main className="roadmap-page"><Container>
    <Link to={returnTarget} className="back-link"><ArrowLeft size={15} /> {backLabel}</Link>
    <div className="roadmap-heading"><div><p className="dashboard-kicker">PERSONALIZED ROADMAP</p><h1>{roadmap.domain ? `${roadmap.domain} roadmap` : 'Your next 90 days, made visible.'}</h1><p>{roadmap.matchScore ? `Built around your ${roadmap.matchScore}% assessment result and the skills it surfaced.` : 'Built from your assessment signals, resume profile, and target direction.'}</p></div><div className="roadmap-progress-card"><Sparkles size={18} /><strong>{completed.length}/{total}</strong><span>milestones complete</span></div></div>

    {isLoading && <p className="text-center text-brown-light mb-6">Loading your roadmap...</p>}
    {routeError && <p className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{routeError}</p>}

    <div className="roadmap-layout"><div className="roadmap-timeline">{milestoneList.map((item, index) => <article className="roadmap-milestone" key={`${item.title}-${index}`}><div className="roadmap-phase">{String(index + 1).padStart(2, '0')}<span>{index === 0 ? 'NOW' : index === 1 ? 'NEXT' : 'LATER'}</span></div><div className="roadmap-milestone-body"><h2>{item.title}</h2><p>{item.detail}</p><div className="roadmap-task-list">{(item.tasks || []).map((task) => <button type="button" className={`roadmap-task ${completed.includes(task) ? 'is-complete' : ''}`} key={`${item.title}-${task}`} onClick={() => toggle(task)}><span>{completed.includes(task) ? <Check size={14} /> : <Circle size={14} />}</span>{task}</button>)}</div></div></article>)}</div><aside className="roadmap-aside"><Clock3 size={22} /><p className="dashboard-kicker">THIS WEEK</p><h2>One focused hour beats a scattered day.</h2><p>Choose one task, make it visible, and let the next step become easier.</p><button type="button" onClick={() => navigate(`/explore/domain-assessment/${assessmentTarget}`)} className="dashboard-primary-action" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>Start assessment <ArrowUpRight size={15} /></button><Link to="/chat" className="dashboard-outline-action" style={{ marginTop: '1rem' }}>Ask for a plan <MessageCircle size={15} /></Link></aside></div>
    <div className="roadmap-bottom-actions"><button type="button" onClick={() => navigate(`/explore/domain-assessment/${assessmentTarget}`)} className="dashboard-primary-action">Continue with your domain assessment <ArrowUpRight size={16} /></button><Link to={returnTarget} className="dashboard-text-link">{backLabel} <ArrowUpRight size={15} /></Link></div>
  </Container></main>
}
export default RoadmapPage

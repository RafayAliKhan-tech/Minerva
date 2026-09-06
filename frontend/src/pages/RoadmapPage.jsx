import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Check, Circle, Clock3, Download, MessageCircle, Sparkles } from 'lucide-react'
import Container from '../components/common/Container'
import { useAuth } from '../auth/AuthContext'
import { getRoadmapKey, saveRoadmap } from '../utils/userData'
import { getRoadmapResult } from '../api/minervaApi'
import resourceData from '../../../Minerva-VSCode/roadmap/roadmap/resources.json'

const bundledResourceCatalog = (resourceData.resources || []).reduce((catalog, resource) => {
  catalog[resource.resource_id] = resource
  return catalog
}, {})

const fallbackMilestones = [
  { phase: '01', title: 'Sharpen your foundation', detail: 'Strengthen the fundamentals that make your target role easier to reach.', tasks: ['JavaScript essentials', 'Accessible interface patterns', 'Git workflow'] },
  { phase: '02', title: 'Build proof of skill', detail: 'Turn learning into visible work that communicates how you think.', tasks: ['Build a responsive product page', 'Connect a REST API', 'Write a project case study'] },
  { phase: '03', title: 'Move toward opportunity', detail: 'Practice the conversations and applications that open your next door.', tasks: ['Polish portfolio', 'Practice interview stories', 'Apply to three aligned roles'] },
]

const normalizeMilestones = (source, resourceCatalog = {}, useFallback = true) => {
  if (!source) return useFallback ? fallbackMilestones : []

  const phases = Array.isArray(source) ? source : source.phases || source.curriculum?.phases || source.milestones || source.roadmap?.phases || (source.result && !Array.isArray(source.result) ? source.result.phases : null) || []
  if (phases.length === 0) return useFallback ? fallbackMilestones : []

  return phases.map((phase, index) => {
    const items = phase.tasks || phase.objectives || phase.topics || phase.lessons || []
    const resourceIds = Array.isArray(phase.resources) ? phase.resources : []
    return {
      phase: String(index + 1).padStart(2, '0'),
      title: phase.title || phase.name || ('Phase ' + (index + 1)),
      detail: phase.detail || phase.description || ('Phase ' + (index + 1) + ' learning objectives'),
      tasks: Array.isArray(items) ? items.map((item) => typeof item === 'string' ? item : item.title || item.name || item.label || 'Milestone task') : [],
      resources: resourceIds.map((resource) => resourceCatalog[resource] || resource),
      estimatedHours: phase.estimated_hours || phase.estimatedHours || phase.hours || null,
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
  const resourceCatalog = { ...bundledResourceCatalog, ...(data.resource_catalog || data.resourceCatalog || {}) }
  const milestones = normalizeMilestones(data, resourceCatalog, !isRoadmapArray)
  const resolveResourceList = (items) => (Array.isArray(items) ? items : []).map((item) => resourceCatalog[item] || item)
  const resources = [
    ...milestones.flatMap((milestone) => milestone.resources || []),
    ...resolveResourceList(data.certifications),
    ...resolveResourceList(data.job_preparation || data.jobPreparation),
    ...resolveResourceList(data.recommended_jobs || data.recommendedJobs),
  ].filter((item, index, list) => list.findIndex((candidate) => (candidate?.resource_id || candidate) === (item?.resource_id || item)) === index)
  const timelineWeeks = data.timeline?.total_duration_weeks || milestones.length * 4
  const curriculum = data.curriculum || { phases: milestones, weeks: timelineWeeks }
  const phases = Array.isArray(data.phases) ? data.phases : (Array.isArray(curriculum.phases) ? curriculum.phases : [])

  return {
    id: data.id || data.roadmapId || data.roadmap_id || raw?.roadmap_id || raw?.roadmapId || fallbackState.roadmapId || 'default',
    rawRoadmap: data,
    domain,
    domainId,
    matchScore,
    curriculum,
    milestones,
    resources,
    resourceCatalog,
    phases,
    learningObjectives: Array.isArray(data.learning_objectives) ? data.learning_objectives : (Array.isArray(data.learningObjectives) ? data.learningObjectives : []),
    certifications: resolveResourceList(data.certifications),
    jobPreparation: resolveResourceList(data.job_preparation || data.jobPreparation),
    recommendedJobs: resolveResourceList(data.recommended_jobs || data.recommendedJobs),
    timeline: data.timeline && typeof data.timeline === 'object' ? data.timeline : { total_duration_weeks: timelineWeeks, hours_per_week: null, total_estimated_hours: null, weeks: [] },
    strengths: data.strengths || fallbackState.strengths || [],
    areasToImprove: data.areasToImprove || fallbackState.areasToImprove || [],
    createdAt: data.createdAt || new Date().toISOString(),
    status: data.status || 'generated',
  }
}

const displayItem = (item) => {
  if (typeof item === 'string' || typeof item === 'number') return String(item)
  return item?.title || item?.name || item?.skill || item?.label || item?.description || item?.id || JSON.stringify(item)
}

const resourceLink = (resource) => {
  const url = resource?.url || resource?.link || resource?.href
  const label = displayItem(resource)
  return url ? <a href={url} target="_blank" rel="noreferrer">{label}<ArrowUpRight size={13} /></a> : <span>{label}</span>
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
  const downloadRoadmap = () => {
    const blob = new Blob([JSON.stringify(roadmap.rawRoadmap || roadmap, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${String(roadmap.domain || 'roadmap').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-roadmap.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const timelineWeeks = Array.isArray(roadmap.timeline?.weeks)
    ? roadmap.timeline.weeks.map((week) => ({
      ...week,
      resourceDetails: (week.resources || []).map((resource) => roadmap.resourceCatalog[resource] || resource),
    }))
    : []
  const backendPhases = roadmap.milestones
  const sectionCard = (title, items) => items.length > 0 && <><section className="roadmap-info-card"><h2>{title}</h2><div className="roadmap-chip-list">{items.map((item, index) => <span className="roadmap-chip" key={`${title}-${index}`}>{title === 'Resources' ? resourceLink(item) : displayItem(item)}</span>)}</div></section>{title === 'Learning objectives' && roadmap.resources?.length > 0 && <section className="roadmap-info-card"><h2>Resources</h2><div className="roadmap-resource-cards">{roadmap.resources.map((item, index) => <article className="roadmap-resource-card" key={`resource-${index}`}><div><strong>{displayItem(item)}</strong><small>{item.resource_type || item.type || 'Resource'}{item.provider ? ` · ${item.provider}` : ''}{item.estimated_hours ? ` · ${item.estimated_hours} hours` : ''}</small></div>{resourceLink(item)}</article>)}</div></section>}</>

  return <main className="roadmap-page"><Container>
    <Link to={returnTarget} className="back-link"><ArrowLeft size={15} /> {backLabel}</Link>
    <div className="roadmap-heading"><div><p className="dashboard-kicker">PERSONALIZED ROADMAP</p><h1>{roadmap.domain ? `${roadmap.domain} roadmap` : 'Your next 90 days, made visible.'}</h1><p>{roadmap.matchScore ? `Built around your ${roadmap.matchScore}% assessment result and the skills it surfaced.` : 'Built from your assessment signals, resume profile, and target direction.'}</p></div><div className="roadmap-heading-actions"><button type="button" onClick={downloadRoadmap} className="dashboard-outline-action"><Download size={16} /> Download roadmap</button><div className="roadmap-progress-card"><Sparkles size={18} /><strong>{completed.length}/{total}</strong><span>milestones complete</span></div></div></div>

    {isLoading && <p className="text-center text-brown-light mb-6">Loading your roadmap...</p>}
    {routeError && <p className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{routeError}</p>}

    <div className="roadmap-layout"><div className="roadmap-timeline">{backendPhases.map((item, index) => <article className="roadmap-milestone" key={`${item.title || item.name}-${index}`}><div className="roadmap-phase">{String(item.phase || index + 1).padStart(2, '0')}<span>{index === 0 ? 'NOW' : index === 1 ? 'NEXT' : 'LATER'}</span></div><div className="roadmap-milestone-body"><h2>{item.title || item.name || `Phase ${index + 1}`}</h2><p>{item.description || item.detail || `${(item.objectives || []).length} learning objectives`}</p><div className="roadmap-task-list">{(item.objectives || item.tasks || item.topics || []).map((task) => { const label = displayItem(task); return <button type="button" className={`roadmap-task ${completed.includes(label) ? 'is-complete' : ''}`} key={`${item.title}-${label}`} onClick={() => toggle(label)}><span>{completed.includes(label) ? <Check size={14} /> : <Circle size={14} />}</span>{label}</button> })}</div>{item.resources?.length > 0 && <div className="roadmap-resource-cards">{item.resources.map((resource, resourceIndex) => <article className="roadmap-resource-card" key={`${item.title}-resource-${resourceIndex}`}><div><strong>{displayItem(resource)}</strong><small>{resource.resource_type || resource.type || 'Resource'}{resource.provider ? ` · ${resource.provider}` : ''}{resource.estimated_hours ? ` · ${resource.estimated_hours} hours` : ''}</small></div>{resourceLink(resource)}</article>)}</div>}</div></article>)}{timelineWeeks.length > 0 && <section className="roadmap-week-grid"><div className="roadmap-section-heading"><h2>Weekly timeline</h2><span>{roadmap.timeline.total_duration_weeks || timelineWeeks.length} weeks</span></div>{timelineWeeks.map((week) => <article className="roadmap-week-card" key={week.week}><strong>Week {week.week}</strong><p>{week.milestone || week.focus?.join(', ') || 'Roadmap progress'}</p><small>{week.estimated_hours || 0} hours · {week.resourceDetails?.map(displayItem).join(', ') || 'Focus work'}</small></article>)}</section>}</div><aside className="roadmap-aside"><Clock3 size={22} /><p className="dashboard-kicker">ROADMAP AT A GLANCE</p><h2>{roadmap.timeline.total_estimated_hours ? `${roadmap.timeline.total_estimated_hours} hours of focused work.` : 'One focused hour beats a scattered day.'}</h2><p>{roadmap.timeline.hours_per_week ? `${roadmap.timeline.hours_per_week} hours per week across ${roadmap.timeline.total_duration_weeks || timelineWeeks.length} weeks.` : 'Choose one task, make it visible, and let the next step become easier.'}</p>{sectionCard('Learning objectives', roadmap.learningObjectives)}{sectionCard('Certifications', roadmap.certifications)}{sectionCard('Job preparation', roadmap.jobPreparation)}{sectionCard('Recommended jobs', roadmap.recommendedJobs)}<button type="button" onClick={() => navigate(`/explore/domain-assessment/${assessmentTarget}`)} className="dashboard-primary-action" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>Start assessment <ArrowUpRight size={15} /></button><Link to="/chat" className="dashboard-outline-action" style={{ marginTop: '1rem' }}>Ask for a plan <MessageCircle size={15} /></Link></aside></div>
    <div className="roadmap-bottom-actions"><button type="button" onClick={() => navigate(`/explore/domain-assessment/${assessmentTarget}`)} className="dashboard-primary-action">Continue with your domain assessment <ArrowUpRight size={16} /></button><Link to={returnTarget} className="dashboard-text-link">{backLabel} <ArrowUpRight size={15} /></Link></div>
  </Container></main>
}
export default RoadmapPage

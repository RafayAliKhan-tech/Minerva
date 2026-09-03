import { useMemo, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowUpRight, BriefcaseBusiness, ChartNoAxesCombined, MessageCircle, PlayCircle, Sparkles, Target, Zap, Trash2 } from 'lucide-react'
import Container from '../components/common/Container'
import { useAuth } from '../auth/AuthContext'
import { getDisplayName, getLatestAssessment, getRoadmaps, deleteRoadmap } from '../utils/userData'

const journeyItems = [
  { label: 'Profile signal', value: 'Strong', detail: 'Your strengths are ready to use', icon: Sparkles },
  { label: 'Skills in motion', value: '6 / 10', detail: 'Keep building your target stack', icon: ChartNoAxesCombined },
  { label: 'Career direction', value: 'Frontend', detail: 'Based on your latest activity', icon: Target },
]

function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [roadmaps, setRoadmaps] = useState([])
  
  useEffect(() => {
    setRoadmaps(getRoadmaps(user))
  }, [user])

  const resume = useMemo(() => {
    const raw = sessionStorage.getItem('resumeFile')
    return raw ? JSON.parse(raw) : null
  }, [])
  const domain = sessionStorage.getItem('selectedDomain')
  const career = sessionStorage.getItem('selectedCareer') || 'frontend'
  const latest = getLatestAssessment(user)
  const displayName = getDisplayName(user)
  const latestScore = latest?.score ?? null
  const latestLabel = latest?.label || 'No assessment yet'

  const latestResultRoute = (() => {
    if (!latest) return '/explore'

    if (latest.type === 'exploring') return '/explore/assessment/results'
    if (latest.type === 'domain') {
      const currentDomain = sessionStorage.getItem('selectedDomain') || latest.domainId || null
      return currentDomain ? `/explore/domain-assessment/${currentDomain}/results` : '/explore/domain-selection'
    }
    if (latest.type === 'resume') return '/explore/resume/results'
    return '/explore'
  })()

  const handleDeleteRoadmap = (roadmapId) => {
    deleteRoadmap(user, roadmapId)
    setRoadmaps(getRoadmaps(user))
  }

  return (
    <main className="dashboard-page">
      <Container>
        <div className="dashboard-heading">
          <div>
            <p className="dashboard-kicker">MINERVA COMMAND CENTER</p>
            <h1>{displayName}'s career, in motion.</h1>
            <p className="dashboard-subtitle">A living view of your profile, next steps, and opportunities.</p>
          </div>
          <Link className="dashboard-primary-action" to="/explore">Continue your journey <ArrowUpRight size={16} /></Link>
        </div>

        <section className="dashboard-grid dashboard-top-grid">
          <article className="dashboard-card dashboard-profile-card">
            <div className="dashboard-card-top"><span>PROFILE SIGNAL</span><Sparkles size={18} /></div>
            <div className="dashboard-score-ring"><strong>{latestScore === null ? '--' : `${latestScore}%`}</strong><span>latest result</span></div>
            <h2>{latestLabel}</h2>
            <p>{latest ? `Completed ${new Date(latest.completedAt).toLocaleDateString()}. Your latest assessment is saved to this account.` : 'Complete an assessment and your latest result will appear here.'}</p>
            {latest ? (
              <Link to={latestResultRoute} className="dashboard-text-link" style={{ marginTop: '0.9rem' }}>View Result <ArrowUpRight size={15} /></Link>
            ) : (
              <Link to="/explore/domain-selection" className="dashboard-text-link">Explore domains <ArrowUpRight size={15} /></Link>
            )}
          </article>
          <article className="dashboard-card dashboard-focus-card">
            <div className="dashboard-card-top"><span>CURRENT FOCUS</span><Target size={18} /></div>
            <p className="dashboard-focus-label">Recommended target</p>
            <h2>{latest?.domain || (career === 'fullstack' ? 'Full Stack Developer' : 'Frontend Developer')}</h2>
            <div className="dashboard-progress"><span style={{ width: `${latestScore || 0}%` }} /></div>
            <div className="dashboard-progress-meta"><span>Readiness</span><strong>{latestScore === null ? '--' : `${latestScore}%`}</strong></div>
            <Link to={`/explore/resume/skill-gap/${career}`} className="dashboard-text-link">View skill gap <ArrowUpRight size={15} /></Link>
          </article>
          <article className="dashboard-card dashboard-resume-card">
            <div className="dashboard-card-top"><span>RESUME INTELLIGENCE</span><BriefcaseBusiness size={18} /></div>
            <h2>{resume?.name || 'Resume not connected'}</h2>
            <p>{resume ? 'Your resume is connected to personalized role matching.' : 'Upload your resume to unlock tailored job matches and feedback.'}</p>
            <Link to="/explore/resume" className="dashboard-outline-action">{resume ? 'Review insights' : 'Upload resume'} <ArrowUpRight size={15} /></Link>
          </article>
        </section>

        <section className="dashboard-section-heading"><div><p className="dashboard-kicker">YOUR SIGNALS</p><h2>Small moves. Clear direction.</h2></div><Link to="/explore/roadmap" className="dashboard-text-link">Open full roadmap <ArrowUpRight size={15} /></Link></section>
        <section className="dashboard-grid dashboard-signal-grid">
          {journeyItems.map(({ label, value, detail, icon: Icon }) => <article className="dashboard-signal" key={label}><Icon size={19} /><span>{label}</span><strong>{value}</strong><p>{detail}</p></article>)}
        </section>

        {roadmaps.length > 0 && (
          <>
            <section className="dashboard-section-heading"><div><p className="dashboard-kicker">YOUR ROADMAPS</p><h2>Personalized learning paths.</h2></div></section>
            <section className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {roadmaps.map((roadmap) => (
                <article key={roadmap.id} className="dashboard-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="dashboard-card-top">
                    <span>{roadmap.domain}</span>
                    <Zap size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <button
                      type="button"
                      onClick={() => navigate(`/roadmap-detail/${roadmap.id}`, { state: roadmap })}
                      style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '0.5rem' }}>
                        {roadmap.domain} Roadmap
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>
                        Match Score: <strong>{roadmap.matchScore}%</strong>
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '1rem' }}>
                        {roadmap.curriculum?.phases?.length || 0} phases • {roadmap.curriculum?.weeks || 0} weeks
                      </p>
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => navigate(`/roadmap-detail/${roadmap.id}`, { state: roadmap })}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        backgroundColor: '#23211f',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      Open route
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRoadmap(roadmap.id)}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #ddd',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Trash2 size={16} color="#666" />
                    </button>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}

        <section className="dashboard-section-heading"><div><p className="dashboard-kicker">READY WHEN YOU ARE</p><h2>Choose your next move.</h2></div></section>
        <section className="dashboard-grid dashboard-action-grid">
          <Link to="/chat" className="dashboard-action-card"><MessageCircle size={22} /><span>Ask Minerva</span><p>Talk through a decision with your profile context in view.</p><ArrowUpRight size={16} /></Link>
          <Link to="/mock-interview" className="dashboard-action-card"><PlayCircle size={22} /><span>Practice an interview</span><p>Build confidence with a role-specific mock interview.</p><ArrowUpRight size={16} /></Link>
          <Link to="/explore/roadmap" className="dashboard-action-card"><ChartNoAxesCombined size={22} /><span>Build momentum</span><p>Turn your skill gaps into a practical weekly plan.</p><ArrowUpRight size={16} /></Link>
        </section>
      </Container>
    </main>
  )
}

export default DashboardPage

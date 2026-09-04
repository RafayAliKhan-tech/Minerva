import { useMemo, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowUpRight, BriefcaseBusiness, ChartNoAxesCombined, MessageCircle, PlayCircle, Sparkles, Telescope, Compass, Target, Zap, Trash2 } from 'lucide-react'
import Container from '../components/common/Container'
import { useAuth } from '../auth/AuthContext'
import { getDisplayName, getJourneyAssessment, getResumeFile, getRoadmaps, deleteRoadmap } from '../utils/userData'

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
    const saved = getResumeFile(user)
    if (saved) return saved
    try {
      const raw = sessionStorage.getItem('resumeFile')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }, [user])
  const exploring = getJourneyAssessment(user, 'exploring')
  const careerInMind = getJourneyAssessment(user, 'domain')
  const resumeAssessment = getJourneyAssessment(user, 'resume')
  const displayName = getDisplayName(user)

  const journeyCards = [
    {
      title: 'I am exploring',
      description: 'Discover the career direction that fits your strengths and interests.',
      icon: Telescope,
      completed: exploring,
      route: '/explore/assessment/results',
      startRoute: '/explore/assessment',
      completedLabel: exploring?.domain || 'Exploration assessment complete',
      action: 'Start assessment',
      accent: 'dashboard-journey-green',
    },
    {
      title: 'Career in my mind',
      description: 'Turn a target career into a practical, personalized plan.',
      icon: Compass,
      completed: careerInMind,
      route: careerInMind?.careerId ? `/explore/domain-assessment/${careerInMind.careerId}/results` : '/explore/domain-selection',
      startRoute: '/explore/domain-selection',
      completedLabel: careerInMind?.domain || 'Career assessment complete',
      action: 'Choose a career',
      accent: 'dashboard-journey-tan',
    },
    {
      title: 'My resume',
      description: 'Upload your resume to uncover role matches and skill gaps.',
      icon: BriefcaseBusiness,
      completed: resumeAssessment,
      route: '/explore/resume/results',
      startRoute: '/explore/resume',
      completedLabel: resumeAssessment?.domain || resume?.name || 'Resume assessment complete',
      action: 'Upload resume',
      accent: 'dashboard-journey-orange',
    },
  ]

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
          {journeyCards.map(({ title, description, icon: Icon, completed, route, startRoute, completedLabel, action, accent }) => (
            <article className={`dashboard-card dashboard-journey-card ${accent}`} key={title}>
              <div className="dashboard-card-top"><span>{completed ? 'JOURNEY COMPLETE' : 'YOUR NEXT JOURNEY'}</span><Icon size={20} /></div>
              <div className="dashboard-journey-icon"><Icon size={25} /></div>
              <h2>{title}</h2>
              <p>{completed ? `${completedLabel}. Your result is saved to this account.` : description}</p>
              <Link to={completed ? route : startRoute} className="dashboard-journey-action">
                {completed ? 'View Result' : action} <ArrowUpRight size={15} />
              </Link>
            </article>
          ))}
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

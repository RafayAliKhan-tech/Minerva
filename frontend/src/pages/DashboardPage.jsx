import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, BriefcaseBusiness, ChartNoAxesCombined, MessageCircle, PlayCircle, Sparkles, Target } from 'lucide-react'
import Container from '../components/common/Container'

const journeyItems = [
  { label: 'Profile signal', value: 'Strong', detail: 'Your strengths are ready to use', icon: Sparkles },
  { label: 'Skills in motion', value: '6 / 10', detail: 'Keep building your target stack', icon: ChartNoAxesCombined },
  { label: 'Career direction', value: 'Frontend', detail: 'Based on your latest activity', icon: Target },
]

function DashboardPage() {
  const resume = useMemo(() => {
    const raw = sessionStorage.getItem('resumeFile')
    return raw ? JSON.parse(raw) : null
  }, [])
  const domain = sessionStorage.getItem('selectedDomain')
  const career = sessionStorage.getItem('selectedCareer') || 'frontend'

  return (
    <main className="dashboard-page">
      <Container>
        <div className="dashboard-heading">
          <div>
            <p className="dashboard-kicker">MINERVA COMMAND CENTER</p>
            <h1>Your career, in motion.</h1>
            <p className="dashboard-subtitle">A living view of your profile, next steps, and opportunities.</p>
          </div>
          <Link className="dashboard-primary-action" to="/explore">Continue your journey <ArrowUpRight size={16} /></Link>
        </div>

        <section className="dashboard-grid dashboard-top-grid">
          <article className="dashboard-card dashboard-profile-card">
            <div className="dashboard-card-top"><span>PROFILE SIGNAL</span><Sparkles size={18} /></div>
            <div className="dashboard-score-ring"><strong>78%</strong><span>career fit</span></div>
            <h2>{domain ? `${domain.replaceAll('-', ' ')} direction` : 'Your next direction'}</h2>
            <p>Minerva sees a promising pattern across your answers, interests, and current skills.</p>
            <Link to="/explore/domain-selection" className="dashboard-text-link">Refine profile <ArrowUpRight size={15} /></Link>
          </article>
          <article className="dashboard-card dashboard-focus-card">
            <div className="dashboard-card-top"><span>CURRENT FOCUS</span><Target size={18} /></div>
            <p className="dashboard-focus-label">Recommended target</p>
            <h2>{career === 'fullstack' ? 'Full Stack Developer' : 'Frontend Developer'}</h2>
            <div className="dashboard-progress"><span style={{ width: '64%' }} /></div>
            <div className="dashboard-progress-meta"><span>Readiness</span><strong>64%</strong></div>
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

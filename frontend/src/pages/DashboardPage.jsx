import { useMemo, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowUpRight, BriefcaseBusiness, MessageCircle, PlayCircle, Telescope, Compass, Zap, Trash2, UserRound } from 'lucide-react'
import Container from '../components/common/Container'
import ResumeAnalysisResultCard from '../components/common/ResumeAnalysisResultCard'
import { useAuth } from '../auth/AuthContext'
import { getJourneyAssessment, getResumeFile, getRoadmaps, deleteRoadmap, hasCompletedAnyAssessment } from '../utils/userData'

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
  const assessmentLocked = hasCompletedAnyAssessment(user)
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
      title: 'Journey 3 · Job Hunting',
      description: 'Complete a resume-based assessment and explore job-hunting next steps.',
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
            <h1>Your career, in motion.</h1>
            <p className="dashboard-subtitle">A living view of your profile, next steps, and opportunities.</p>
          </div>
        </div>

        <section className="dashboard-grid dashboard-top-grid">
          {journeyCards.map(({ title, description, icon: Icon, completed, route, startRoute, completedLabel, action, accent }) => {
            const unavailable = assessmentLocked && !completed
            return (
              <article className={`dashboard-card dashboard-journey-card ${accent}`} key={title}>
                <div className="dashboard-card-top"><span>{completed ? 'JOURNEY COMPLETE' : unavailable ? 'ASSESSMENT LOCKED' : 'YOUR NEXT JOURNEY'}</span><Icon size={20} /></div>
                <div className="dashboard-journey-icon"><Icon size={25} /></div>
                <h2>{title}</h2>
                <p>{completed ? `${completedLabel}. Your result is saved to this account.` : unavailable ? 'Your one-time assessment has been used. You can still view its saved results.' : description}</p>
                {completed
                  ? <Link to={route} className="dashboard-journey-action">View Result <ArrowUpRight size={15} /></Link>
                  : unavailable
                    ? <span className="dashboard-journey-action" aria-disabled="true">Assessment unavailable</span>
                    : <Link to={startRoute} className="dashboard-journey-action">{action} <ArrowUpRight size={15} /></Link>}
              </article>
            )
          })}
        </section>

        {roadmaps.length > 0 && (
          <>
            <section className="dashboard-section-heading"><div><p className="dashboard-kicker">YOUR ROADMAPS</p><h2>Personalized learning paths.</h2></div></section>
            <section className="dashboard-grid dashboard-roadmap-grid">
              {roadmaps.map((roadmap) => (
                <article key={roadmap.id} className="dashboard-card dashboard-roadmap-card">
                  <div className="dashboard-roadmap-top">
                    <span className="dashboard-roadmap-icon"><Zap size={17} /></span>
                    <button type="button" className="dashboard-roadmap-delete" onClick={() => handleDeleteRoadmap(roadmap.id)} aria-label={`Delete ${roadmap.domain} roadmap`} title="Delete roadmap">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="dashboard-roadmap-content">
                    <p className="dashboard-roadmap-eyebrow">PERSONALIZED PATH</p>
                    <h3>{roadmap.domain || 'Career development'} <span>roadmap</span></h3>
                    <p className="dashboard-roadmap-description">A focused learning path shaped around your assessment results.</p>
                    <div className="dashboard-roadmap-stats">
                      <div><strong>{roadmap.matchScore ?? 0}%</strong><span>match score</span></div>
                      <div><strong>{roadmap.curriculum?.phases?.length || 0}</strong><span>phases</span></div>
                      <div><strong>{roadmap.curriculum?.weeks || 0}</strong><span>weeks</span></div>
                    </div>
                  </div>
                  <button type="button" className="dashboard-roadmap-open" onClick={() => navigate(`/roadmap-detail/${roadmap.id}`, { state: roadmap })}>Open roadmap <ArrowUpRight size={15} /></button>
                </article>
              ))}
            </section>
          </>
        )}

        <section className="dashboard-section-heading"><div><p className="dashboard-kicker">READY WHEN YOU ARE</p><h2>Choose your next move.</h2></div></section>
        <section className="dashboard-grid dashboard-action-grid">
          <Link to="/analyze-resume" className="dashboard-action-card">
            <BriefcaseBusiness size={22} />
            <span>Analyze Resume</span>
            <p>Get a standalone resume analysis without starting Job Hunting.</p>
            <ArrowUpRight size={16} />
          </Link>
          {resume?.analysis && <ResumeAnalysisResultCard analysis={resume.analysis} variant="dark" to="/explore/resume/insights" />}
          <Link to="/chat" className="dashboard-action-card"><MessageCircle size={22} /><span>Ask Minerva</span><p>Talk through a decision with your profile context in view.</p><ArrowUpRight size={16} /></Link>
          <Link to="/mock-interview" className="dashboard-action-card"><PlayCircle size={22} /><span>Practice an interview</span><p>Build confidence with a role-specific mock interview.</p><ArrowUpRight size={16} /></Link>
          <Link to="/skill-profile" className="dashboard-action-card"><UserRound size={22} /><span>View your skill profile</span><p>See your goals, strengths, weak areas, and roadmap progress in one place.</p><ArrowUpRight size={16} /></Link>
        </section>
      </Container>
    </main>
  )
}

export default DashboardPage

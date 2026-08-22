import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Check, Circle, Clock3, MessageCircle, Sparkles } from 'lucide-react'
import Container from '../components/common/Container'
import { useAuth } from '../auth/AuthContext'
import { getRoadmapKey } from '../utils/userData'

const milestones = [
  { phase: '01', title: 'Sharpen your foundation', detail: 'Strengthen the fundamentals that make your target role easier to reach.', tasks: ['JavaScript essentials', 'Accessible interface patterns', 'Git workflow'] },
  { phase: '02', title: 'Build proof of skill', detail: 'Turn learning into visible work that communicates how you think.', tasks: ['Build a responsive product page', 'Connect a REST API', 'Write a project case study'] },
  { phase: '03', title: 'Move toward opportunity', detail: 'Practice the conversations and applications that open your next door.', tasks: ['Polish portfolio', 'Practice interview stories', 'Apply to three aligned roles'] },
]

function RoadmapPage() {
  const location = useLocation()
  const { user } = useAuth()
  const context = location.state || {}
  const lastRoadmapKey = getRoadmapKey(user, '__last__')
  const roadmapId = context.roadmapId || localStorage.getItem(lastRoadmapKey) || 'default'
  const [completed, setCompleted] = useState([])
  useEffect(() => {
    try { setCompleted(JSON.parse(localStorage.getItem(getRoadmapKey(user, roadmapId)) || '[]')) } catch { setCompleted([]) }
  }, [user, roadmapId])
  const persist = (items) => { setCompleted(items); localStorage.setItem(getRoadmapKey(user, roadmapId), JSON.stringify(items)); localStorage.setItem(lastRoadmapKey, roadmapId) }
  const toggle = (task) => persist(completed.includes(task) ? completed.filter((item) => item !== task) : [...completed, task])
  const total = milestones.reduce((sum, item) => sum + item.tasks.length, 0)
  return <main className="roadmap-page"><Container>
    <Link to="/dashboard" className="back-link"><ArrowLeft size={15} /> Dashboard</Link>
    <div className="roadmap-heading"><div><p className="dashboard-kicker">PERSONALIZED ROADMAP</p><h1>{context.domain ? `${context.domain} roadmap` : 'Your next 90 days, made visible.'}</h1><p>{context.score ? `Built around your ${context.score}% assessment result and the skills it surfaced.` : 'Built from your assessment signals, resume profile, and target direction.'}</p></div><div className="roadmap-progress-card"><Sparkles size={18} /><strong>{completed.length}/{total}</strong><span>milestones complete</span></div></div>
    <div className="roadmap-layout"><div className="roadmap-timeline">{milestones.map((item, index) => <article className="roadmap-milestone" key={item.phase}><div className="roadmap-phase">{item.phase}<span>{index === 0 ? 'NOW' : index === 1 ? 'NEXT' : 'LATER'}</span></div><div className="roadmap-milestone-body"><h2>{item.title}</h2><p>{item.detail}</p><div className="roadmap-task-list">{item.tasks.map((task) => <button className={`roadmap-task ${completed.includes(task) ? 'is-complete' : ''}`} key={task} onClick={() => toggle(task)}><span>{completed.includes(task) ? <Check size={14} /> : <Circle size={14} />}</span>{task}</button>)}</div></div></article>)}</div><aside className="roadmap-aside"><Clock3 size={22} /><p className="dashboard-kicker">THIS WEEK</p><h2>One focused hour beats a scattered day.</h2><p>Choose one task, make it visible, and let the next step become easier.</p><Link to="/chat" className="dashboard-outline-action">Ask for a plan <MessageCircle size={15} /></Link></aside></div>
    <div className="roadmap-bottom-actions"><Link to="/mock-interview" className="dashboard-primary-action">Practice for your target role <ArrowUpRight size={16} /></Link><Link to="/dashboard" className="dashboard-text-link">Back to dashboard <ArrowUpRight size={15} /></Link></div>
  </Container></main>
}
export default RoadmapPage

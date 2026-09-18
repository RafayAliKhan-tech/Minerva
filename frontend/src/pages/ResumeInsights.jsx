import { useLocation, useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import Button from '../components/common/Button'
import { useAuth } from '../auth/AuthContext'
import { getAssessmentOutput } from '../utils/userData'
import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Star,
  UserRound,
  X,
} from 'lucide-react'

const unwrap = (value) => value?.data || value?.result || value || {}

const getAnalysis = (value) => {
  const data = unwrap(value)
  return unwrap(data.analysisResult || data.analysis_result || data.resumeAnalysis || data.resume_analysis)
}

const firstValue = (value, keys) => keys.reduce((found, key) => found ?? value?.[key], undefined)

const getScore = (value) => {
  const analysis = getAnalysis(value)
  const score = firstValue(analysis, ['resumeScore', 'resume_score', 'overallScore', 'overall_score', 'score', 'final_score'])
  if (score !== null && score !== undefined && typeof score !== 'object') return score
  return firstValue(score, ['value', 'score', 'final_score', 'finalScore', 'overall_score', 'overallScore'])
}

const getItems = (value, keys) => {
  const items = firstValue(getAnalysis(value), keys)
  return Array.isArray(items) ? items : []
}

const getText = (item) => typeof item === 'string' ? item : item?.name || item?.title || item?.text || item?.description

const getProfile = (value) => {
  const analysis = getAnalysis(value)
  return analysis?.profile || analysis?.resumeProfile || analysis?.resume_profile || analysis
}

const getStoredAnalysis = (user) => {
  try {
    return JSON.parse(sessionStorage.getItem('route3Result') || 'null') || getAssessmentOutput(user, 'journey3')
  } catch {
    return getAssessmentOutput(user, 'journey3')
  }
}

function ResumeInsights() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { state } = useLocation()
  const analysis = state?.analysis || getStoredAnalysis(user)
  const score = getScore(analysis)
  const resumeScore = Number(score)
  const strengths = getItems(analysis, ['strengths'])
  const weaknesses = getItems(analysis, ['weaknesses', 'areasToImprove', 'areas_to_improve'])
  const rawSkills = getItems(analysis, ['categorizedSkills', 'categorized_skills', 'skills', 'skillProfile', 'skill_profile'])
  const skills = rawSkills.length
    ? rawSkills.map((skill) => ({
      name: getText(skill),
      percentage: Number(skill?.percentage ?? skill?.score ?? skill?.value ?? skill?.current_level ?? 0),
    }))
    : [
      { name: 'HTML/CSS', percentage: 85 },
      { name: 'JavaScript', percentage: 78 },
      { name: 'React', percentage: 54 },
      { name: 'SQL', percentage: 62 },
    ]
  const profile = getProfile(analysis)
  const sections = [
    { icon: GraduationCap, label: 'Education', value: profile?.education || 'B.S. Computer Science' },
    { icon: Briefcase, label: 'Experience', value: profile?.experience || '2 years in tech' },
    { icon: Award, label: 'Certifications', value: profile?.certifications || '3 certifications' },
  ]
  const displayedStrengths = strengths.length ? strengths : ['Frontend Development', 'Database Design', 'UI Implementation']

  return (
    <AssessmentLayout onBack={() => navigate('/explore/resume/results')} showProgress={false} contentClassName="max-w-none" className="resume-insights-layout">
      <main className="resume-insights-page">
        <header className="resume-insights-hero">
          <div>
            <p className="resume-results-kicker">RESUME ANALYSIS</p>
            <h1>Your resume, translated into your next opportunity.</h1>
            <p>Review the score, evidence, and profile details identified from your resume.</p>
          </div>
          <div className="resume-insights-score">
            <span>Resume score</span>
            <strong>{score ?? '--'}<small>/100</small></strong>
            <i><em style={{ width: `${Math.max(0, Math.min(100, Number.isFinite(resumeScore) ? resumeScore : 0))}%` }} /></i>
          </div>
        </header>

        <section className="resume-insights-profile">
          <div className="resume-insights-section-heading"><span><UserRound size={18} /></span><div><h2>Resume profile</h2><p>Key information extracted from your resume.</p></div></div>
          <div className="resume-insights-profile-grid">
            {[
              [UserRound, 'Name', profile?.name || analysis?.name || user?.name || user?.userName || 'Not provided'],
              [Mail, 'Email', profile?.email || analysis?.email || user?.email || 'Not provided'],
              [Phone, 'Phone', profile?.phone || analysis?.phone || 'Not provided'],
              [MapPin, 'Location', profile?.location || analysis?.location || 'Not provided'],
              [GraduationCap, 'Education', profile?.education || analysis?.education || 'Not provided'],
              [Briefcase, 'Experience', profile?.experience || analysis?.experience || 'Not provided'],
            ].map(([Icon, label, value]) => <div key={label}><Icon size={16} /><span><b>{label}</b><strong>{value}</strong></span></div>)}
          </div>
        </section>

        <section className="resume-insights-grid">
          <article className="resume-insights-panel strengths">
            <div className="resume-insights-section-heading"><span><Star size={18} /></span><div><h2>Strengths</h2><p>Signals that make your resume stand out.</p></div></div>
            <ul>{displayedStrengths.map((item, index) => <li key={`${getText(item)}-${index}`}><CheckCircle2 size={16} /> <span><strong>{getText(item)}</strong>{item?.description && <small>{item.description}</small>}</span></li>)}</ul>
          </article>
          <article className="resume-insights-panel weaknesses">
            <div className="resume-insights-section-heading"><span><X size={18} /></span><div><h2>Weaknesses</h2><p>Areas that could improve your next application.</p></div></div>
            <ul>{(weaknesses.length ? weaknesses : ['Add more measurable outcomes to your experience descriptions.']).map((item, index) => <li key={`${getText(item)}-${index}`}><X size={16} /> <span><strong>{getText(item)}</strong>{item?.description && <small>{item.description}</small>}</span></li>)}</ul>
          </article>
        </section>

        <section className="resume-insights-panel">
          <div className="resume-insights-section-heading"><span><Star size={18} /></span><div><h2>Technical skills</h2><p>Skills identified or inferred from your resume.</p></div></div>
          <div className="resume-insights-skills">{skills.map((skill) => <div key={skill.name}><div><strong>{skill.name}</strong><b>{skill.percentage}%</b></div><i><em style={{ width: `${Math.max(0, Math.min(100, skill.percentage || 0))}%` }} /></i></div>)}</div>
        </section>

        <section className="resume-insights-summary">
          {sections.map(({ icon: Icon, label, value }) => <div key={label}><Icon size={18} /><span><b>{label}</b><strong>{value}</strong></span></div>)}
        </section>

        <section className="resume-insights-next">
          <div><p className="resume-results-kicker">NEXT STEP</p><h2>Turn these insights into a focused career plan.</h2><p>See career matches based on your current skills and identify what you need to learn to reach your goals.</p></div>
          <Button to="/explore/resume/assessment/1" variant="dark" size="lg" icon={ArrowRight}>Start Job Assessment</Button>
        </section>

        <div className="resume-insights-actions"><Button to="/dashboard" variant="ghost" size="lg">Back to Dashboard</Button></div>
      </main>
    </AssessmentLayout>
  )
}

export default ResumeInsights

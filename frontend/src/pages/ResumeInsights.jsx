import { useLocation, useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import Button from '../components/common/Button'
import { useAuth } from '../auth/AuthContext'
import { getResumeFile } from '../utils/userData'
import {
  ArrowLeft,
  CheckCircle2,
  Star,
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

const getStoredAnalysis = (user) => {
  try {
    const savedResume = getResumeFile(user)
    if (savedResume?.analysis) return savedResume.analysis
    const sessionResume = JSON.parse(sessionStorage.getItem('resumeFile') || 'null')
    return sessionResume?.analysis || null
  } catch {
    return getResumeFile(user)?.analysis || null
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
  const rawSkills = firstValue(getAnalysis(analysis), ['categorizedSkills', 'categorized_skills', 'skills', 'skillProfile', 'skill_profile'])
  const skillGroups = Array.isArray(rawSkills)
    ? [{ name: 'Identified skills', skills: rawSkills }]
    : Object.entries(rawSkills || {}).filter(([, values]) => Array.isArray(values)).map(([name, values]) => ({ name, skills: values }))

  return (
    <AssessmentLayout onBack={() => navigate('/dashboard')} showProgress={false} contentClassName="max-w-none" className="resume-insights-layout">
      <main className="resume-insights-page">
        <header className="resume-insights-hero">
          <div>
            <p className="resume-results-kicker">RESUME ANALYSIS</p>
            <h1>Your resume, translated into your next opportunity.</h1>
            <p>Review the score, skills, strengths, and improvement areas returned by the resume analyzer.</p>
          </div>
          <div className="resume-insights-score">
            <span>Resume score</span>
            <strong>{score ?? '--'}<small>/100</small></strong>
            <i><em style={{ width: `${Math.max(0, Math.min(100, Number.isFinite(resumeScore) ? resumeScore : 0))}%` }} /></i>
          </div>
        </header>

        <section className="resume-insights-grid">
          <article className="resume-insights-panel strengths">
            <div className="resume-insights-section-heading"><span><Star size={18} /></span><div><h2>Strengths</h2><p>Signals that make your resume stand out.</p></div></div>
            {strengths.length > 0
              ? <ul>{strengths.map((item, index) => <li key={`${getText(item)}-${index}`}><CheckCircle2 size={16} /> <span><strong>{getText(item)}</strong>{item?.description && <small>{item.description}</small>}</span></li>)}</ul>
              : <p>No strengths were returned by the resume analysis.</p>}
          </article>
          <article className="resume-insights-panel weaknesses">
            <div className="resume-insights-section-heading"><span><X size={18} /></span><div><h2>Weaknesses</h2><p>Areas that could improve your next application.</p></div></div>
            {weaknesses.length > 0
              ? <ul>{weaknesses.map((item, index) => <li key={`${getText(item)}-${index}`}><X size={16} /> <span><strong>{getText(item)}</strong>{item?.description && <small>{item.description}</small>}</span></li>)}</ul>
              : <p>No weaknesses were returned by the resume analysis.</p>}
          </article>
        </section>

        <section className="resume-insights-panel">
          <div className="resume-insights-section-heading"><span><Star size={18} /></span><div><h2>Skills</h2><p>Skills returned by the resume analyzer, grouped by category.</p></div></div>
          {skillGroups.length > 0
            ? <div className="resume-insights-skills">{skillGroups.map(({ name, skills: groupSkills }) => <div key={name}><strong>{name.replaceAll('_', ' ')}</strong><ul>{groupSkills.map((skill, index) => <li key={`${getText(skill)}-${index}`}>{getText(skill)}</li>)}</ul></div>)}</div>
            : <p>No skills were returned by the resume analysis.</p>}
        </section>

        <div className="resume-insights-actions">
          <Button
            to="/dashboard"
            variant="ghost"
            size="lg"
            icon={ArrowLeft}
            iconPosition="left"
          >
            Back
          </Button>
        </div>
      </main>
    </AssessmentLayout>
  )
}

export default ResumeInsights

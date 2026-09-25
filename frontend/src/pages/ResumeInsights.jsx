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

const unwrap = (value) => {
  let current = value
  for (let depth = 0; depth < 4; depth += 1) {
    const nested = current?.data || current?.result
    if (!nested || typeof nested !== 'object') break
    current = nested
  }
  return current || {}
}

const getAnalysis = (value) => {
  const data = unwrap(value)
  const nested = data.analysisResult || data.analysis_result || data.resumeAnalysis || data.resume_analysis
  return nested ? unwrap(nested) : data
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
const getScoreBreakdown = (value) => {
  const score = firstValue(getAnalysis(value), ['resumeScore', 'resume_score', 'overallScore', 'overall_score', 'score', 'final_score'])
  return firstValue(score, ['breakdown']) || {}
}

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
  const hasScore = score !== null && score !== undefined && Number.isFinite(resumeScore)
  const strengths = getItems(analysis, ['strengths'])
  const weaknesses = getItems(analysis, ['weaknesses', 'areasToImprove', 'areas_to_improve'])
  const rawSkills = firstValue(getAnalysis(analysis), ['categorizedSkills', 'categorized_skills', 'skills', 'skillProfile', 'skill_profile'])
  const skillGroups = Array.isArray(rawSkills)
    ? [{ name: 'Identified skills', skills: rawSkills }]
    : Object.entries(rawSkills || {}).filter(([, values]) => Array.isArray(values)).map(([name, values]) => ({ name, skills: values }))
  const missingInfo = getItems(analysis, ['missing_info', 'missingInfo'])
  const atsAnalysis = firstValue(getAnalysis(analysis), ['ats_analysis', 'atsAnalysis'])
  const scoreBreakdown = getScoreBreakdown(analysis)
  const fieldScores = firstValue(getAnalysis(analysis), ['field_scores', 'fieldScores'])
  const scoredFields = fieldScores && typeof fieldScores === 'object'
    ? (Array.isArray(fieldScores)
        ? fieldScores.map((item) => [item?.field || item?.field_name || item?.name, item?.score ?? item?.value])
        : Object.entries(fieldScores))
      .filter(([name, value]) => typeof name === 'string' && Number.isFinite(Number(value)))
    : []

  return (
    <AssessmentLayout onBack={() => navigate('/dashboard')} showProgress={false} contentClassName="max-w-none" className="resume-insights-layout">
      <main className="resume-insights-page">
        <header className="resume-insights-hero">
          <div>
            <p className="resume-results-kicker">RESUME ANALYSIS</p>
            <h1>Resume analysis</h1>
            <p>These findings are based on the information returned by the resume analyzer.</p>
          </div>
          {hasScore && <div className="resume-insights-score">
            <span>Resume score</span>
            <strong>{resumeScore}<small>/100</small></strong>
            <i><em style={{ width: `${Math.max(0, Math.min(100, resumeScore))}%` }} /></i>
          </div>}
        </header>

        {Object.keys(scoreBreakdown).length > 0 && <section className="resume-insights-panel">
          <div className="resume-insights-section-heading"><span><Star size={18} /></span><div><h2>Score breakdown</h2><p>Category scores returned by the resume analyzer.</p></div></div>
          <div className="resume-insights-skills">{Object.entries(scoreBreakdown).map(([category, value]) => <div key={category}><strong>{category.replaceAll('_', ' ')}</strong><p>{value}</p></div>)}</div>
        </section>}

        {atsAnalysis && <section className="resume-insights-panel">
          <div className="resume-insights-section-heading"><span><CheckCircle2 size={18} /></span><div><h2>ATS analysis</h2><p>Compatibility details returned by the resume analyzer.</p></div></div>
          {atsAnalysis.ats_score !== undefined && <p>ATS score: {atsAnalysis.ats_score}</p>}
          {Array.isArray(atsAnalysis.issues) && atsAnalysis.issues.length > 0 && <ul>{atsAnalysis.issues.map((issue, index) => <li key={`${issue}-${index}`}><X size={16} /> <span>{issue}</span></li>)}</ul>}
        </section>}

        <section className="resume-insights-grid">
          <article className="resume-insights-panel strengths">
            <div className="resume-insights-section-heading"><span><Star size={18} /></span><div><h2>Strengths</h2><p>Strengths returned by the resume analyzer.</p></div></div>
            {strengths.length > 0
              ? <ul>{strengths.map((item, index) => <li key={`${getText(item)}-${index}`}><CheckCircle2 size={16} /> <span><strong>{getText(item)}</strong>{item?.description && <small>{item.description}</small>}</span></li>)}</ul>
              : <p>No strengths were returned by the resume analysis.</p>}
          </article>
          <article className="resume-insights-panel weaknesses">
            <div className="resume-insights-section-heading"><span><X size={18} /></span><div><h2>Weaknesses</h2><p>Weaknesses returned by the resume analyzer.</p></div></div>
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

        {missingInfo.length > 0 && <section className="resume-insights-panel">
          <div className="resume-insights-section-heading"><span><X size={18} /></span><div><h2>Missing or incomplete information</h2><p>Items identified by the resume analyzer.</p></div></div>
          <ul>{missingInfo.map((item, index) => <li key={`${getText(item)}-${index}`}><X size={16} /><span>{getText(item)}</span></li>)}</ul>
        </section>}

        {scoredFields.length > 0 && <section className="resume-insights-panel">
          <div className="resume-insights-section-heading"><span><Star size={18} /></span><div><h2>Field scores</h2><p>Scores returned for each field by the resume analyzer.</p></div></div>
          <div className="resume-insights-skills">{scoredFields.map(([field, value]) => <div key={field}><strong>{field.replaceAll('_', ' ')}</strong><p>{value}</p></div>)}</div>
        </section>}

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

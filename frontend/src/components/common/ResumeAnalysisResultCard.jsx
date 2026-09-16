import { ArrowUpRight, FileSearch } from 'lucide-react'
import { Link } from 'react-router-dom'

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
  return firstValue(score, ['value', 'score', 'final_score', 'finalScore', 'overall_score', 'overallScore']) ?? null
}

const getRole = (value) => {
  const analysis = getAnalysis(value)
  return firstValue(analysis, ['highestScoredRole', 'highest_scored_role', 'targetRole', 'target_role', 'recommendedRole', 'recommended_role', 'role', 'field']) || null
}

const getSkills = (value) => {
  const analysis = getAnalysis(value)
  const skills = firstValue(analysis, ['categorizedSkills', 'categorized_skills', 'skills', 'skillProfile', 'skill_profile'])
  return Array.isArray(skills) ? skills : []
}

function ResumeAnalysisResultCard({ analysis, variant = 'light', to = '/explore/resume/insights' }) {
  const score = getScore(analysis)
  const role = getRole(analysis)
  const skills = getSkills(analysis)

  return (
    <Link
      to={to}
      state={{ analysis }}
      className={`resume-analysis-result-card resume-analysis-result-card-${variant}`}
      aria-label="View Resume Analysis results"
    >
      <div className="resume-analysis-result-card-header">
        <span>RESUME ANALYSIS</span>
        <FileSearch size={20} aria-hidden="true" />
      </div>
      <div className="resume-analysis-result-card-content">
        <h3>{role || 'Your resume profile'}</h3>
        <p>{score !== null ? `Resume score: ${score}` : 'Your resume analysis is ready.'}</p>
        {skills.length > 0 && <p>{skills.length} skill{skills.length === 1 ? '' : 's'} identified</p>}
      </div>
      <span className="resume-analysis-result-card-link">View full analysis <ArrowUpRight size={15} aria-hidden="true" /></span>
    </Link>
  )
}

export default ResumeAnalysisResultCard

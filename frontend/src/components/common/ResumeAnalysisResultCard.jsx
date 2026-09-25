import { ArrowUpRight, FileSearch } from 'lucide-react'
import { Link } from 'react-router-dom'

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
  return firstValue(score, ['value', 'score', 'final_score', 'finalScore', 'overall_score', 'overallScore']) ?? null
}

const getRole = (value) => {
  const analysis = getAnalysis(value)
  const directRole = firstValue(analysis, ['highestScoredRole', 'highest_scored_role', 'highestScoredField', 'highest_scored_field', 'targetRole', 'target_role', 'recommendedRole', 'recommended_role', 'role', 'field'])
  if (typeof directRole === 'string' && directRole.trim()) return directRole
  const scores = firstValue(analysis, ['field_scores', 'fieldScores', 'role_scores', 'roleScores'])
  if (!scores || typeof scores !== 'object') return null
  const entries = Array.isArray(scores)
    ? scores.map((item) => [item?.field || item?.field_name || item?.role || item?.name, item?.score ?? item?.value])
    : Object.entries(scores)
  const highest = entries
    .map(([name, score]) => [name, Number(typeof score === 'object' ? score?.score ?? score?.value ?? score?.final_score : score)])
    .filter(([name, score]) => typeof name === 'string' && name.trim() && Number.isFinite(score))
    .sort((left, right) => right[1] - left[1])[0]
  return highest?.[0] || null
}

const getSkills = (value) => {
  const analysis = getAnalysis(value)
  const skills = firstValue(analysis, ['categorizedSkills', 'categorized_skills', 'skills', 'skillProfile', 'skill_profile'])
  if (Array.isArray(skills)) return skills
  if (!skills || typeof skills !== 'object') return []
  return Object.values(skills).flatMap((categorySkills) => Array.isArray(categorySkills) ? categorySkills : [])
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
        <h3>{role ? role.replaceAll('_', ' ') : 'Resume analysis'}</h3>
        <p>{score !== null ? `Resume score: ${score} / 100` : 'Resume analysis results'}</p>
        {skills.length > 0 && <p>{skills.length} skill{skills.length === 1 ? '' : 's'} identified</p>}
      </div>
      <span className="resume-analysis-result-card-link">View full analysis <ArrowUpRight size={15} aria-hidden="true" /></span>
    </Link>
  )
}

export default ResumeAnalysisResultCard

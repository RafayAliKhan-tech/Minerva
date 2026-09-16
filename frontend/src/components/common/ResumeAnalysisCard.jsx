import { ArrowUpRight, FileSearch } from 'lucide-react'
import { Link } from 'react-router-dom'

function ResumeAnalysisCard({ variant = 'dark' }) {
  return (
    <Link
      to="/explore/resume"
      className={`resume-analysis-card resume-analysis-card-${variant}`}
      aria-label="Open Resume Analysis"
    >
      <FileSearch size={22} aria-hidden="true" />
      <span>Resume Analysis</span>
      <p>Analyze your resume to uncover role matches and skill gaps.</p>
      <ArrowUpRight size={16} aria-hidden="true" />
    </Link>
  )
}

export default ResumeAnalysisCard

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import Button from '../components/common/Button'
import { useJourney2Assessment } from '../auth/Journey2AssessmentContext'
import { ArrowLeft, BarChart3, Brain, BriefcaseBusiness, CheckCircle2, Code2, Compass, Monitor, ShieldCheck, Sparkles, Target } from 'lucide-react'

function DomainSelection() {
  const navigate = useNavigate()
  const { careers, loadCareers, error, isLoading } = useJourney2Assessment()
  const [selectedCareer, setSelectedCareer] = useState(null)

  useEffect(() => {
    if (!careers.length) loadCareers().catch(() => null)
  }, [careers.length])

  const handleContinue = () => {
    if (!selectedCareer) return

    const careerId = selectedCareer.career_id || selectedCareer.careerId || selectedCareer.id
    sessionStorage.setItem('journey2CareerId', careerId)
    sessionStorage.removeItem('journey2AssessmentId')
    sessionStorage.removeItem('journey2Result')
    sessionStorage.setItem('journey2Responses', '{}')
    navigate(`/explore/domain-assessment/${careerId}`)
  }

  return (
    <AssessmentLayout
      onBack={() => navigate('/')}
      showProgress={false}
      contentClassName="max-w-none"
      className="journey2-selection-layout"
    >
      {/* <button className="journey2-selection-back" type="button" onClick={() => navigate('/')} aria-label="Back to home">
        <ArrowLeft size={16} /> Back
      </button> */}

      <div className="journey2-selection-grid">
        <main className="journey2-selection-card">
          <div className="journey2-selection-badge"><Target size={16} /> Journey 2 • Career Selection</div>
          <h1>Choose Your Career Path</h1>
          <p className="journey2-selection-subtitle">Select the career area you want to assess. Minerva will then test your skills through 5 practical questions.</p>

          {isLoading && <p className="journey2-selection-status">Loading careers...</p>}
          {error && <p className="journey2-selection-error" role="alert">{error}</p>}
          {!isLoading && !error && (
            <div className="journey2-career-grid">
              {careers.map((career, index) => {
                const careerId = career.career_id || career.careerId || career.id
                const careerName = career.career_name || career.careerName || career.name
                const normalizedName = String(careerName || '').toLowerCase()
                const Icon = normalizedName.includes('design') ? Monitor : normalizedName.includes('software') || normalizedName.includes('development') ? Code2 : normalizedName.includes('data') ? BarChart3 : normalizedName.includes('machine') || normalizedName.includes('ai') ? Brain : normalizedName.includes('security') ? ShieldCheck : [BriefcaseBusiness, Compass, Sparkles][index % 3]
                return (
                  <button key={careerId} type="button" onClick={() => setSelectedCareer(career)} className={`journey2-career-card ${selectedCareer === career ? 'is-selected' : ''}`}>
                    <span className={`journey2-career-icon journey2-career-icon-${index % 5}`}><Icon size={24} /></span>
                    <span className="journey2-career-copy"><strong>{careerName}</strong><small>{career.description || career.summary || 'Build practical skills and solve real-world problems.'}</small></span>
                    <span className="journey2-career-radio" aria-hidden="true" />
                    <span className="journey2-career-arrow">›</span>
                  </button>
                )
              })}
            </div>
          )}

          <div className="journey2-selection-actions">
            <p>{!selectedCareer && !error && !isLoading ? 'Choose a career path to continue.' : ''}</p>
            <Button onClick={handleContinue} variant="secondary" size="lg" disabled={!selectedCareer || isLoading || Boolean(error)}>Continue →</Button>
          </div>
        </main>

        <aside className="journey2-selection-aside">
          <div className="journey2-selection-aside-heading"><span><Target size={26} /></span><div><h2>Journey 2</h2><p>Assess Your Skills</p></div></div>
          {[
            [CheckCircle2, '5 Questions', 'You’ll answer 5 questions based on your selected career path.'],
            [Sparkles, 'Real-World Focus', 'Questions are designed to reflect real career challenges and skills.'],
            [BarChart3, 'Get Insights', 'At the end, you’ll receive a detailed analysis of your strengths and areas for improvement.'],
          ].map(([Icon, title, text]) => <div className="journey2-selection-benefit" key={title}><span><Icon size={20} /></span><div><h3>{title}</h3><p>{text}</p></div></div>)}
          <div className="journey2-selection-landscape"><div className="journey2-selection-sun" /><div className="journey2-selection-road" /><div className="journey2-selection-flag">⚑</div></div>
        </aside>
      </div>
    </AssessmentLayout>
  )
}

export default DomainSelection

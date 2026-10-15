import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import Button from '../components/common/Button'
import { useJourney2Assessment } from '../auth/Journey2AssessmentContext'
import {
  ArrowLeft,
  BarChart3,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Compass,
  Monitor,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react'

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
    <AssessmentLayout contentClassName="assessment-inner max-w-none">
      <button className="back-link" type="button" onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={16} aria-hidden="true" />
        Back to dashboard
      </button>

      <div className="journey2-selection">
        <div className="journey1-intro-badge">
          <Target size={16} /> Path 2 · Career in mind
        </div>
        <h1>Choose your career path</h1>
        <p>
          Select the career area you want to assess. Minerva will test your skills through focused,
          practical questions.
        </p>

        {isLoading && <p className="journey2-selection-status">Loading careers…</p>}
        {error && (
          <p className="auth-form-error" role="alert" style={{ marginTop: '1rem' }}>
            {error}
          </p>
        )}

        {!isLoading && !error && (
          <div className="journey2-career-grid">
            {careers.map((career, index) => {
              const careerId = career.career_id || career.careerId || career.id
              const careerName = career.career_name || career.careerName || career.name
              const normalizedName = String(careerName || '').toLowerCase()
              const Icon = normalizedName.includes('design')
                ? Monitor
                : normalizedName.includes('software') || normalizedName.includes('development')
                  ? Code2
                  : normalizedName.includes('data')
                    ? BarChart3
                    : normalizedName.includes('machine') || normalizedName.includes('ai')
                      ? Brain
                      : normalizedName.includes('security')
                        ? ShieldCheck
                        : [BriefcaseBusiness, Compass, Sparkles][index % 3]
              return (
                <button
                  key={careerId}
                  type="button"
                  onClick={() => setSelectedCareer(career)}
                  className={`journey2-career-card${selectedCareer === career ? ' is-selected' : ''}`}
                >
                  <span className="journey2-career-icon">
                    <Icon size={22} />
                  </span>
                  <span className="journey2-career-copy">
                    <strong>{careerName}</strong>
                    <small>
                      {career.description ||
                        career.summary ||
                        'Build practical skills for real-world problems.'}
                    </small>
                  </span>
                </button>
              )
            })}
          </div>
        )}

        <div className="journey2-selection-actions">
          <div className="journey2-selection-benefits">
            {[
              [CheckCircle2, 'Focused questions for your chosen path'],
              [Sparkles, 'Real-world skill challenges'],
              [BarChart3, 'Strengths and improvement insights'],
            ].map(([Icon, text]) => (
              <div key={text} className="journey2-selection-benefit-row">
                <Icon size={16} /> {text}
              </div>
            ))}
          </div>
          <Button
            onClick={handleContinue}
            variant="secondary"
            size="lg"
            disabled={!selectedCareer || isLoading || Boolean(error)}
          >
            Continue
          </Button>
        </div>
      </div>
    </AssessmentLayout>
  )
}

export default DomainSelection

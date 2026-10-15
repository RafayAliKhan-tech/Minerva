import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import Button from '../components/common/Button'
import { ArrowLeft, CheckCircle2, Clock, Sparkles } from 'lucide-react'
import { useJourney1Assessment } from '../auth/Journey1AssessmentContext'

function ExploringIntro() {
  const navigate = useNavigate()
  const { loadQuestions, error } = useJourney1Assessment()
  const [isStarting, setIsStarting] = useState(false)

  const handleStart = () => {
    setIsStarting(true)
    ;(async () => {
      try {
        sessionStorage.removeItem('journey1AssessmentId')
        await loadQuestions()
        navigate('/explore/assessment/activity/1')
      } catch {
        setIsStarting(false)
      } finally {
        setIsStarting(false)
      }
    })()
  }

  return (
    <AssessmentLayout contentClassName="assessment-inner">
      <button className="back-link" type="button" onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={16} aria-hidden="true" />
        Back to dashboard
      </button>

      <div className="journey1-intro">
        <div className="journey1-intro-badge">
          <Sparkles size={16} /> Path 1 · Exploring
        </div>
        <h1>You don&apos;t need to know your domain yet.</h1>
        <p>
          Discover where your natural strengths and interests could take you — then leave with
          clearer direction.
        </p>

        <div className="journey1-intro-details">
          <div className="journey1-intro-detail">
            <span>
              <Clock size={20} aria-hidden="true" />
            </span>
            <div>
              <small>Estimated time</small>
              <strong>About 3 minutes</strong>
            </div>
          </div>
          <div className="journey1-intro-detail">
            <span>
              <CheckCircle2 size={20} aria-hidden="true" />
            </span>
            <div>
              <small>What you&apos;ll get</small>
              <strong>Mind profile &amp; domain matches</strong>
            </div>
          </div>
        </div>

        <div className="journey1-intro-actions">
          <Button onClick={handleStart} variant="secondary" size="lg" disabled={isStarting}>
            {isStarting ? 'Starting…' : 'Start exploring'}
          </Button>
        </div>
        {error && (
          <p className="auth-form-error" role="alert" style={{ marginTop: '1rem' }}>
            {error}
          </p>
        )}
      </div>
    </AssessmentLayout>
  )
}

export default ExploringIntro

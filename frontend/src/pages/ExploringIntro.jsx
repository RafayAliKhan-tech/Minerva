import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import Button from '../components/common/Button'
import { ArrowLeft, CheckCircle2, Clock, Compass, Sparkles } from 'lucide-react'
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
      } catch (e) {
        setIsStarting(false)
        return
      } finally {
        setIsStarting(false)
      }
    })()
  }

  return (
    <AssessmentLayout
      contentClassName="max-w-none"
      className="journey1-intro-layout"
    >
      <button className="journey1-intro-back" type="button" onClick={() => navigate('/dashboard')} aria-label="Back to home">
        <ArrowLeft size={18} aria-hidden="true" />
        Back
      </button>

      <div className="journey1-intro-grid">
        <section className="journey1-intro-card">
          <div className="journey1-intro-card-content">
            <div className="journey1-intro-badge"><Sparkles size={16} /> Journey 1 Introduction</div>
            <h1>You don't need to know<br className="journey1-intro-title-break" /> your domain yet.</h1>
            <p className="journey1-intro-subtitle">Let's discover where your natural strengths and interests could take you.</p>

            <div className="journey1-intro-details">
              <div className="journey1-intro-detail">
                <span><Clock size={22} aria-hidden="true" /></span>
                <div><small>Estimated time</small><strong>3 minutes</strong></div>
              </div>
              <div className="journey1-intro-detail">
                <span><CheckCircle2 size={22} aria-hidden="true" /></span>
                <div><small>What you'll get</small><strong>Your personalized mind profile &amp; domain matches</strong></div>
              </div>
            </div>

            <div className="journey1-intro-actions">
              <Button onClick={handleStart} variant="dark" size="lg" disabled={isStarting}>
                {isStarting ? 'Starting...' : 'Start Exploring →'}
              </Button>
            </div>
            {error && <p className="journey1-intro-error" role="alert">{error}</p>}
          </div>
        </section>

        <aside className="journey1-intro-visual" aria-label="Discover your unique potential">
          <div className="journey1-intro-sun" />
          <div className="journey1-intro-cloud journey1-intro-cloud-one" />
          <div className="journey1-intro-cloud journey1-intro-cloud-two" />
          <div className="journey1-intro-mountain journey1-intro-mountain-one" />
          <div className="journey1-intro-mountain journey1-intro-mountain-two" />
          <div className="journey1-intro-path" />
          <div className="journey1-intro-signs">
            <span>Career</span><span>Skills</span><span>Interests</span><span>Future</span>
          </div>
          <div className="journey1-intro-person"><div className="journey1-intro-head" /><div className="journey1-intro-body" /><div className="journey1-intro-bag" /></div>
          <div className="journey1-intro-visual-copy">
            <div className="journey1-intro-compass"><Compass size={24} /></div>
            <h2>Discover Your<br />Unique Potential</h2>
            <p>Understand your mind, your strengths, and the possibilities that fit you best.</p>
          </div>
        </aside>
      </div>
    </AssessmentLayout>
  )
}

export default ExploringIntro

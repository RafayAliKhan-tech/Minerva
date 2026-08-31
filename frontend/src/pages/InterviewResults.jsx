import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, RotateCcw, Sparkles, Target, Loader } from 'lucide-react'
import Container from '../components/common/Container'
import { useAuth } from '../auth/AuthContext'
import { getRoute3Result } from '../api/minervaApi'

function InterviewResults() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [feedback, setFeedback] = useState([
    { label: 'Clarity', score: 82, note: 'Your thinking is easy to follow.' },
    { label: 'Evidence', score: 68, note: 'Add measurable outcomes to your examples.' },
    { label: 'Role alignment', score: 78, note: 'Your strengths map well to the role.' }
  ])
  const [loading, setLoading] = useState(true)
  const [overallScore, setOverallScore] = useState(76)
  const [nextStep, setNextStep] = useState('Make every answer land with evidence.')
  const [nextStepDetails, setNextStepDetails] = useState('Before your next application, prepare two project stories with a clear result: faster, simpler, more accessible, or more useful.')

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      const attemptId = sessionStorage.getItem('attemptId')
      if (!attemptId) {
        setLoading(false)
        return
      }

      const result = await getRoute3Result(attemptId)
      
      if (result?.feedback) {
        setFeedback(result.feedback)
      }
      
      if (result?.overallScore) {
        setOverallScore(result.overallScore)
      }

      if (result?.nextStep) {
        setNextStep(result.nextStep)
      }

      if (result?.details) {
        setNextStepDetails(result.details)
      }
    } catch (error) {
      console.error('Failed to fetch interview results:', error)
      // Use defaults already set
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="interview-results-page">
        <Container>
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Loader size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
            <p>Analyzing your interview...</p>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main className="interview-results-page">
      <Container>
        <Link to="/mock-interview" className="back-link">
          <RotateCcw size={15} /> Try another interview
        </Link>

        <div className="results-heading">
          <div>
            <p className="dashboard-kicker">INTERVIEW FEEDBACK</p>
            <h1>Your confidence has a shape now.</h1>
            <p>Here is the signal from your practice session, plus the next improvement with the highest return.</p>
          </div>
          <div className="results-score">
            <strong>{overallScore}%</strong>
            <span>overall readiness</span>
          </div>
        </div>

        <section className="results-grid">
          {feedback.map((item) => (
            <article className="result-metric" key={item.label}>
              <div>
                <span>{item.label}</span>
                <strong>{item.score}%</strong>
              </div>
              <div className="dashboard-progress">
                <span style={{ width: `${item.score}%` }} />
              </div>
              <p>{item.note}</p>
            </article>
          ))}
        </section>

        <section className="interview-feedback-panel">
          <div>
            <Target size={22} />
            <p className="dashboard-kicker">YOUR NEXT REP</p>
            <h2>{nextStep}</h2>
            <p>{nextStepDetails}</p>
          </div>
          <div className="feedback-checklist">
            <div>
              <CheckCircle2 size={17} /> Situation in one sentence
            </div>
            <div>
              <CheckCircle2 size={17} /> Your specific contribution
            </div>
            <div>
              <CheckCircle2 size={17} /> A result someone can feel
            </div>
          </div>
        </section>

        <div className="results-actions">
          <Link to="/explore/roadmap" className="dashboard-primary-action">
            Add this to my roadmap <ArrowRight size={16} />
          </Link>
          <Link to="/chat" className="dashboard-outline-action">
            <Sparkles size={15} /> Ask Minerva for feedback
          </Link>
        </div>
      </Container>
    </main>
  )
}

export default InterviewResults

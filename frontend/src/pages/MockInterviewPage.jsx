import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Mic2, Sparkles, Loader } from 'lucide-react'
import Container from '../components/common/Container'
import { useAuth } from '../auth/AuthContext'
import { startInterview, submitInterview } from '../api/minervaApi'

const defaultQuestions = [
  { prompt: 'Tell me about a project where you solved a difficult problem.', hint: 'Use the situation, your action, and the measurable result.' },
  { prompt: 'How do you make a user interface feel reliable and accessible?', hint: 'Connect your technical choices to the people using the product.' },
  { prompt: 'What would you improve in your current skill set next?', hint: 'Show self-awareness and a concrete learning plan.' },
]

function MockInterviewPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [role, setRole] = useState('Frontend Developer')
  const [active, setActive] = useState(0)
  const [answer, setAnswer] = useState('')
  const [answers, setAnswers] = useState([])
  const [questions, setQuestions] = useState(defaultQuestions)
  const [loading, setLoading] = useState(false)
  const [attempting, setAttempting] = useState(false)
  const [attemptId, setAttemptId] = useState(null)

  useEffect(() => {
    initializeInterview()
  }, [role])

  const initializeInterview = async () => {
    try {
      setLoading(true)
      const userId = user?.email || user?.Email || user?.id || 'guest-user'
      const result = await startInterview({
        userId,
        targetRole: role,
        roleTarget: role,
        userProfile: {
          displayName: user?.name || user?.fullName || user?.email || 'User',
        },
      })

      const nextAttemptId = result?.attemptId || result?.id || result?.attempt_id || `attempt-${Date.now()}`
      setAttemptId(nextAttemptId)
      sessionStorage.setItem('interviewAttemptId', nextAttemptId)
    } catch (error) {
      console.error('Failed to initialize interview:', error)
      const fallbackAttemptId = `attempt-${Date.now()}`
      setAttemptId(fallbackAttemptId)
      sessionStorage.setItem('interviewAttemptId', fallbackAttemptId)
    } finally {
      setLoading(false)
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    const next = [...answers, answer]
    setAnswers(next)
    setAnswer('')

    if (active === questions.length - 1) {
      // Submit all answers
      submitAnswers(next)
    } else {
      setActive(active + 1)
    }
  }

  const submitAnswers = async (finalAnswers) => {
    try {
      setAttempting(true)

      const payload = {
        attemptId,
        userId: user?.email || user?.Email || user?.id || 'guest-user',
        targetRole: role,
        roleTarget: role,
        responses: finalAnswers.map((ans, idx) => ({
          question: questions[idx]?.prompt || `Question ${idx + 1}`,
          answer: ans,
        })),
        answers: finalAnswers.map((ans, idx) => ({
          question: questions[idx]?.prompt || `Question ${idx + 1}`,
          answer: ans,
        })),
        userProfile: {
          displayName: user?.name || user?.fullName || user?.email || 'User',
        },
      }

      await submitInterview(payload)

      sessionStorage.setItem('interviewAnswers', JSON.stringify(finalAnswers))
      sessionStorage.setItem('interviewRole', role)
      sessionStorage.setItem('attemptId', attemptId)

      navigate('/mock-interview/results')
    } catch (error) {
      console.error('Failed to submit interview:', error)

      sessionStorage.setItem('interviewAnswers', JSON.stringify(finalAnswers))
      sessionStorage.setItem('interviewRole', role)
      sessionStorage.setItem('attemptId', attemptId)

      navigate('/mock-interview/results')
    } finally {
      setAttempting(false)
    }
  }

  if (loading) {
    return (
      <main className="interview-page">
        <Container>
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Loader size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
            <p>Preparing your interview...</p>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main className="interview-page">
      <Container>
        <div className="interview-heading">
          <div>
            <p className="dashboard-kicker">AI MOCK INTERVIEW</p>
            <h1>Practice the conversation before it counts.</h1>
            <p>Minerva will review clarity, evidence, confidence, and role alignment.</p>
          </div>
          <div className="interview-role-select">
            <label htmlFor="interview-role">TARGET ROLE</label>
            <select 
              id="interview-role" 
              value={role} 
              onChange={(event) => setRole(event.target.value)}
              disabled={active > 0}
            >
              <option>Frontend Developer</option>
              <option>Full Stack Developer</option>
              <option>Product Designer</option>
              <option>Data Analyst</option>
              <option>Backend Developer</option>
              <option>UI/UX Designer</option>
              <option>DevOps Engineer</option>
            </select>
          </div>
        </div>
        
        <div className="interview-progress">
          <span style={{ width: `${((active + 1) / questions.length) * 100}%` }} />
        </div>
        
        <div className="interview-layout">
          <section className="interview-question-card">
            <div className="interview-question-meta">
              <span>QUESTION {String(active + 1).padStart(2, '0')} / {questions.length}</span>
              <Mic2 size={19} />
            </div>
            <h2>{questions[active].prompt}</h2>
            <p>{questions[active].hint}</p>
            <form onSubmit={submit}>
              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Write your answer here..."
                required
                disabled={attempting}
              />
              <button 
                className="dashboard-primary-action" 
                type="submit"
                disabled={attempting || !answer.trim()}
              >
                {attempting ? (
                  <>
                    <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Processing...
                  </>
                ) : (
                  <>
                    {active === questions.length - 1 ? 'Finish interview' : 'Next question'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </section>
          
          <aside className="interview-coach-card">
            <Sparkles size={21} />
            <p className="dashboard-kicker">LIVE COACH</p>
            <h2>Keep it specific.</h2>
            <p>Strong answers use one clear example, explain your contribution, and finish with what changed because of your work.</p>
            <div className="interview-coach-check">
              <CheckCircle2 size={17} /> Role-aware prompts
            </div>
            <div className="interview-coach-check">
              <CheckCircle2 size={17} /> Actionable feedback
            </div>
          </aside>
        </div>
      </Container>
    </main>
  )
}

export default MockInterviewPage

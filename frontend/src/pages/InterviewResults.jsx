import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, RotateCcw, Sparkles, Loader } from 'lucide-react'
import Container from '../components/common/Container'
import { getInterviewResult } from '../api/minervaApi'
import { apiErrorMessage, extractInterviewResult } from '../api/backendContract'

const ATTEMPT_KEY = 'minervaInterviewAttemptId'

function InterviewResults() {
  const navigate = useNavigate()
  const location = useLocation()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const attemptId = location.state?.attemptId || (() => {
    try {
      return sessionStorage.getItem(ATTEMPT_KEY) || ''
    } catch {
      return ''
    }
  })()

  const loadResult = async () => {
    if (!attemptId) {
      setLoading(false)
      setError('No backend attempt ID is available. Complete a mock interview first.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await getInterviewResult(attemptId)
      console.log('Interview result response:', response)
      if (response?.status === false) {
        throw new Error(response?.message || 'The interview result API rejected this request.')
      }

      const parsed = extractInterviewResult(response)
      const validScores = parsed.scores?.length === 5
        && parsed.scores.every((score) => Number.isInteger(Number(score)) && Number(score) >= 0 && Number(score) <= 2)
      const validFeedback = parsed.feedback?.length === 5
      const numericTotal = Number(parsed.total)
      const scoreTotal = parsed.scores?.reduce((sum, score) => sum + Number(score), 0)
      if (!validScores || !validFeedback || !Number.isInteger(numericTotal) || numericTotal < 0 || numericTotal > 10 || numericTotal !== scoreTotal) {
        throw new Error('The interview result API returned an invalid evaluation. Expected 5 scores, 5 feedback entries, and a total matching the scores.')
      }
      setResult(parsed)
    } catch (requestError) {
      setResult(null)
      setError(apiErrorMessage(requestError, 'Unable to load the interview result.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResult()
  }, [attemptId])

  if (loading) {
    return (
      <main className="interview-results-page">
        <Container>
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Loader size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
            <p>Loading backend interview result...</p>
          </div>
        </Container>
      </main>
    )
  }

  const feedbackItems = Array.isArray(result?.feedback) ? result.feedback : []
  const scores = Array.isArray(result?.scores) ? result.scores : []
  const rows = 5

  return (
    <main className="interview-results-page">
      <Container>
        <Link to="/mock-interview" className="back-link">
          <RotateCcw size={15} /> Try another interview
        </Link>

        {error && (
          <div className="api-error-banner" role="alert">
            <p>{error}</p>
            {attemptId ? <button type="button" onClick={loadResult}>Retry</button> : null}
          </div>
        )}

        {!error && result && (
          <>
            <div className="results-heading">
              <div>
                <p className="dashboard-kicker">AI MOCK INTERVIEW RESULT</p>
                <h1>Your evaluation from the backend.</h1>
                <p>Scores and feedback are rendered exactly as returned by the interview result API.</p>
              </div>
              <div className="results-score">
                <strong>{result.total == null ? '--' : result.total} / 10</strong>
                <span>total score</span>
              </div>
            </div>

            {result.total == null && (
              <p className="api-error-banner" role="alert">The backend result did not include a total score.</p>
            )}

            <section className="interview-result-list">
              {Array.from({ length: rows }, (_, index) => {
                const score = scores[index]
                const feedback = feedbackItems[index]
                const feedbackText = typeof feedback === 'string'
                  ? feedback
                  : (feedback?.text || feedback?.feedback || feedback?.comment || JSON.stringify(feedback))
                return (
                  <article className="interview-result-item" key={`result-${index}`}>
                    <div className="interview-result-item-head">
                      <h2>Question {index + 1}</h2>
                      <strong>Score: {score == null ? '--' : score} / 2</strong>
                    </div>
                    <p>Feedback:</p>
                    <p>{feedbackText || 'No feedback was returned for this answer.'}</p>
                  </article>
                )
              })}
            </section>

            <div className="results-actions">
              <button type="button" className="dashboard-primary-action" onClick={() => navigate('/mock-interview')}>
                Practice again <ArrowRight size={16} />
              </button>
              <Link to="/chat" className="dashboard-outline-action">
                <Sparkles size={15} /> Ask Minerva
              </Link>
            </div>
          </>
        )}
      </Container>
    </main>
  )
}

export default InterviewResults

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Mic2, Sparkles, Loader } from 'lucide-react'
import Container from '../components/common/Container'
import { startInterview, submitInterview, getAllCareers, getJourney2Careers, getProfile } from '../api/minervaApi'
import {
  apiErrorMessage,
  careerIdentity,
  extractAttemptId,
  extractCareerList,
  extractQuestions,
  questionIdentity,
  resolveQuestionUi,
} from '../api/backendContract'
import { normalizeSkillProfile } from '../utils/skillProfile'

const ATTEMPT_KEY = 'minervaInterviewAttemptId'

function MockInterviewPage() {
  const navigate = useNavigate()
  const [fields, setFields] = useState([])
  const [selectedField, setSelectedField] = useState('')
  const [skillProfile, setSkillProfile] = useState(null)
  const [phase, setPhase] = useState('select')
  const [questions, setQuestions] = useState([])
  const [active, setActive] = useState(0)
  const [answer, setAnswer] = useState('')
  const [answers, setAnswers] = useState([])
  const [attemptId, setAttemptId] = useState('')
  const [loadingFields, setLoadingFields] = useState(true)
  const [starting, setStarting] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const loadFields = async () => {
    setLoadingFields(true)
    setError('')
    try {
      const [careerResponse, journeyResponse, profile] = await Promise.all([
        getAllCareers().catch((requestError) => requestError),
        getJourney2Careers().catch((requestError) => requestError),
        getProfile(),
      ])

      if (careerResponse instanceof Error && journeyResponse instanceof Error) {
        throw careerResponse
      }

      const catalog = extractCareerList(careerResponse instanceof Error ? {} : careerResponse)
      const journeyFields = extractCareerList(journeyResponse instanceof Error ? {} : journeyResponse)
      const nextFields = [...catalog, ...journeyFields]
        .map(careerIdentity)
        .filter((field) => field.id && field.name)
        .filter((field, index, list) => list.findIndex((item) => item.id === field.id || item.name === field.name) === index)

      if (!nextFields.length) {
        throw new Error('The backend returned no interview fields.')
      }

      setFields(nextFields)
      setSkillProfile(normalizeSkillProfile(profile))
    } catch (requestError) {
      setFields([])
      setError(apiErrorMessage(requestError, 'Unable to load interview fields from the backend.'))
    } finally {
      setLoadingFields(false)
    }
  }

  useEffect(() => {
    loadFields()
  }, [])

  const beginInterview = async (event) => {
    event.preventDefault()
    if (!selectedField) {
      setError('Select a field before starting the interview.')
      return
    }

    setStarting(true)
    setError('')
    setQuestions([])
    setAnswers([])
    setActive(0)
    setAnswer('')
    setAttemptId('')

    try {
      if (!skillProfile?.length) {
        throw new Error('No normalized skill profile is available. Complete an assessment before starting an interview.')
      }

      const payload = {
        targetRole: selectedField,
        skillProfile,
        numQuestions: 5,
      }

      const response = await startInterview(payload)
      console.log('Interview start response:', response)
      if (response?.status === false) {
        throw new Error(response?.message || 'The interview API rejected this start request.')
      }

      const nextQuestions = extractQuestions(response).map((question, index) => {
        const identity = questionIdentity(question)
        if (typeof question === 'string') {
          return { id: `interview-question-${index + 1}`, question, type: 'short_answer' }
        }
        return identity.id ? question : { ...question, id: `interview-question-${index + 1}` }
      })
      if (nextQuestions.length !== 5) {
        throw new Error(`The interview API must return exactly 5 questions, but returned ${nextQuestions.length}.`)
      }

      const invalid = nextQuestions.some((question) => {
        const identity = questionIdentity(question)
        const ui = resolveQuestionUi(question)
        return !identity.id || !identity.text || ui.ui === 'unknown' || (ui.ui === 'mcq' && ui.options.length === 0)
      })
      if (invalid) {
        throw new Error('The interview API returned an invalid question structure.')
      }

      const nextAttemptId = extractAttemptId(response)
      if (nextAttemptId) {
        setAttemptId(String(nextAttemptId))
        sessionStorage.setItem(ATTEMPT_KEY, String(nextAttemptId))
      } else {
        sessionStorage.removeItem(ATTEMPT_KEY)
      }

      setQuestions(nextQuestions)
      setPhase('interview')
    } catch (requestError) {
      setPhase('select')
      setError(apiErrorMessage(requestError, 'Unable to start the mock interview.'))
    } finally {
      setStarting(false)
    }
  }

  const currentQuestion = questions[active]
  const currentIdentity = currentQuestion ? questionIdentity(currentQuestion) : null
  const currentUi = currentQuestion ? resolveQuestionUi(currentQuestion) : null

  const submitCurrent = async (event) => {
    event.preventDefault()
    const value = String(answer || '').trim()
    if (!value || !currentQuestion) return
    if (active === questions.length - 1 && !attemptId) {
      setError('The interview did not return a backend attempt ID. Please start again.')
      return
    }

    const nextAnswers = [
      ...answers,
      {
        question: currentQuestion,
        questionId: currentIdentity.id,
        questionText: currentIdentity.text,
        questionType: currentIdentity.type,
        type: currentIdentity.type,
        answer: value,
        selectedOption: currentUi?.ui === 'mcq' ? value : undefined,
      },
    ]
    setAnswers(nextAnswers)
    setAnswer('')

    if (active < questions.length - 1) {
      setActive(active + 1)
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const payload = {
        attemptId,
        answers: nextAnswers.map((item) => ({ id: item.questionId, answer: item.answer })),
      }

      if (questions.length !== 5 || nextAnswers.length !== 5) {
        throw new Error('The interview must contain exactly 5 questions and 5 answers.')
      }

      const response = await submitInterview(payload)
      console.log('Interview submit response:', response)
      if (response?.status === false) {
        throw new Error(response?.message || 'The interview API rejected this submission.')
      }

      const submittedAttemptId = extractAttemptId(response) || attemptId
      if (!submittedAttemptId) {
        throw new Error('The interview API did not return an attempt ID.')
      }

      sessionStorage.setItem(ATTEMPT_KEY, String(submittedAttemptId))
      navigate('/mock-interview/results', { state: { attemptId: submittedAttemptId } })
    } catch (requestError) {
      setError(apiErrorMessage(requestError, 'Unable to submit the mock interview.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingFields) {
    return (
      <main className="interview-page">
        <Container>
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Loader size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
            <p>Loading interview fields...</p>
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
            <p>Questions, scoring, and feedback come from the interview APIs only.</p>
          </div>
          {phase === 'select' && (
            <form className="interview-role-select" onSubmit={beginInterview}>
              <label htmlFor="interview-role">SELECT FIELD</label>
              <select
                id="interview-role"
                value={selectedField}
                onChange={(event) => setSelectedField(event.target.value)}
                disabled={starting}
              >
                <option value="">Choose a field</option>
                {fields.map((field) => (
                  <option key={field.id} value={field.name}>{field.name}</option>
                ))}
              </select>
              <button className="dashboard-primary-action" type="submit" disabled={starting || !selectedField}>
                {starting ? 'Starting...' : 'Start interview'}
              </button>
            </form>
          )}
        </div>

        {error && (
          <div className="api-error-banner" role="alert">
            <p>{error}</p>
            {phase === 'select' ? (
              <button type="button" onClick={loadFields}>Retry</button>
            ) : (
              <button type="button" onClick={() => setPhase('select')}>Choose another field</button>
            )}
          </div>
        )}

        {phase === 'select' && !fields.length && !error && (
          <p className="api-empty-state">No backend fields are available for a mock interview.</p>
        )}

        {phase === 'interview' && currentQuestion && (
          <>
            <div className="interview-progress">
              <span style={{ width: `${((active + 1) / questions.length) * 100}%` }} />
            </div>
            <div className="interview-layout">
              <section className="interview-question-card">
                <div className="interview-question-meta">
                  <span>QUESTION {String(active + 1).padStart(2, '0')} / {questions.length}</span>
                  <Mic2 size={19} />
                </div>
                <h2>{currentIdentity.text}</h2>
                <p>{currentIdentity.type ? `Type: ${currentIdentity.type}` : selectedField}</p>
                <form onSubmit={submitCurrent}>
                  {currentUi.ui === 'mcq' && (
                    <div className="interview-options">
                      {currentUi.options.map((option, index) => {
                        const optionValue = String(option?.id ?? option?.Id ?? option?.value ?? option?.Value ?? option?.optionId ?? option?.OptionId ?? option?.text ?? option?.Text ?? option?.label ?? option?.Label ?? option)
                        const optionLabel = String(option?.text ?? option?.Text ?? option?.label ?? option?.Label ?? option?.value ?? option?.Value ?? option)
                        return (
                          <label key={`${optionValue}-${index}`} className={`interview-option ${answer === optionValue ? 'is-selected' : ''}`}>
                            <input
                              type="radio"
                              name={`question-${currentIdentity.id}`}
                              value={optionValue}
                              checked={answer === optionValue}
                              onChange={() => setAnswer(optionValue)}
                              disabled={submitting}
                            />
                            {optionLabel}
                          </label>
                        )
                      })}
                    </div>
                  )}
                  {currentUi.ui === 'text' && (
                    <textarea
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      placeholder="Write a short answer..."
                      required
                      disabled={submitting}
                    />
                  )}
                  {currentUi.ui === 'code' && (
                    <textarea
                      className="interview-code-input"
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      placeholder="Write your solution..."
                      required
                      disabled={submitting}
                    />
                  )}
                  <button
                    className="dashboard-primary-action"
                    type="submit"
                    disabled={submitting || !String(answer).trim()}
                  >
                    {submitting ? (
                      <>
                        <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        Submitting...
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
                <p className="dashboard-kicker">SELECTED FIELD</p>
                <h2>{selectedField}</h2>
                <p>Answers stay on this page until the backend evaluates them. No local scoring is applied.</p>
                <div className="interview-coach-check">
                  <CheckCircle2 size={17} /> Backend-generated questions
                </div>
                <div className="interview-coach-check">
                  <CheckCircle2 size={17} /> Backend evaluation only
                </div>
              </aside>
            </div>
          </>
        )}
      </Container>
    </main>
  )
}

export default MockInterviewPage

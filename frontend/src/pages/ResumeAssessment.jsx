import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Loader } from 'lucide-react'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import Button from '../components/common/Button'
import { useAuth } from '../auth/AuthContext'

function ResumeAssessment() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get questions from sessionStorage (set by ResumeAnalysis)
    const storedQuestions = sessionStorage.getItem('route3Questions')
    if (storedQuestions) {
      try {
        setQuestions(JSON.parse(storedQuestions))
      } catch (e) {
        console.error('Failed to parse questions:', e)
        setQuestions([
          { id: '1', prompt: 'Tell us about your primary technical skill', type: 'text' },
          { id: '2', prompt: 'What is your current role or title?', type: 'text' },
          { id: '3', prompt: 'How many years of experience do you have?', type: 'text' },
        ])
      }
    } else {
      setQuestions([
        { id: '1', prompt: 'Tell us about your primary technical skill', type: 'text' },
        { id: '2', prompt: 'What is your current role or title?', type: 'text' },
        { id: '3', prompt: 'How many years of experience do you have?', type: 'text' },
      ])
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <AssessmentLayout onBack={() => navigate('/explore/resume/analysis')}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Loader size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p>Loading assessment...</p>
        </div>
      </AssessmentLayout>
    )
  }

  if (!questions.length) {
    return (
      <AssessmentLayout onBack={() => navigate('/explore/resume/analysis')}>
        <p style={{ textAlign: 'center', color: '#666' }}>No assessment questions available</p>
      </AssessmentLayout>
    )
  }

  const question = questions[currentQuestion]
  const isLastQuestion = currentQuestion === questions.length - 1

  const handleAnswer = (value) => {
    setAnswers({
      ...answers,
      [question.id]: value,
    })
  }

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Store answers and navigate to results
      sessionStorage.setItem('route3Answers', JSON.stringify(answers))
      navigate('/explore/resume/results')
    }
  }

  return (
    <AssessmentLayout
      onBack={() => navigate('/explore/resume/analysis')}
      showProgress={true}
      currentStep={currentQuestion + 1}
      totalSteps={questions.length}
    >
      <div className="rounded-3xl border border-beige-border bg-white p-8 shadow-card sm:p-12 lg:p-16">
        <div className="max-w-2xl">
          {/* Question */}
          <div className="mb-12">
            <h1 className="font-serif text-3xl font-semibold text-brown sm:text-4xl">
              {question.prompt}
            </h1>
          </div>

          {/* Input */}
          <div className="mb-12">
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Your answer here..."
              className="w-full rounded-xl border border-beige-border p-4 min-h-32 focus:outline-none focus:border-orange"
              style={{
                borderColor: answers[question.id] ? '#f4a460' : '#e8ddd1',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* CTA */}
          <div className="flex gap-3">
            <Button
              onClick={handleNext}
              variant="dark"
              size="lg"
              icon={ArrowRight}
              className="flex-1"
              disabled={!answers[question.id]?.trim()}
            >
              {isLastQuestion ? 'Complete Assessment' : 'Next Question'}
            </Button>
            <Button
              onClick={() => navigate('/explore/resume/analysis')}
              variant="ghost"
              size="lg"
              className="flex-1"
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </AssessmentLayout>
  )
}

export default ResumeAssessment

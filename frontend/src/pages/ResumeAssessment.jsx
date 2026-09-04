import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import Button from '../components/common/Button'
import { useRoute3Assessment } from '../auth/Route3AssessmentContext'

function ResumeAssessment() {
  const navigate = useNavigate()
  const { questions, error } = useRoute3Assessment()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  if (error) return <AssessmentLayout onBack={() => navigate('/explore/resume/analysis')}><p className="text-center text-red-600">{error}</p></AssessmentLayout>

  if (!questions.length) {
    return (
      <AssessmentLayout onBack={() => navigate('/explore/resume/analysis')}>
        <p style={{ textAlign: 'center', color: '#666' }}>No backend assessment questions available.</p>
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
    const nextAnswers = { ...answers, [question.questionId || question.id]: answers[question.questionId || question.id] }
    if (!isLastQuestion) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Store answers and navigate to results
      sessionStorage.setItem('route3Answers', JSON.stringify(nextAnswers))
      sessionStorage.setItem('route3PendingSubmission', 'true')
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
            {question.options?.length > 0 ? (
              <div className="space-y-3">
                {question.options.map((option) => {
                  const optionId = option.id ?? option.value
                  const optionText = option.text ?? option.label ?? option.value
                  return <button key={optionId} type="button" onClick={() => handleAnswer(optionId)} className={`w-full rounded-xl border p-4 text-left transition-colors ${answers[question.id] === optionId ? 'border-orange bg-orange-pill/30' : 'border-beige-border bg-white hover:border-orange/50'}`}>{optionText}</button>
                })}
              </div>
            ) : (
              <textarea
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Your answer here..."
                className="w-full rounded-xl border border-beige-border p-4 min-h-32 text-[#23211f] focus:outline-none focus:border-orange"
                style={{ borderColor: answers[question.id] ? '#f4a460' : '#e8ddd1', fontFamily: 'inherit', color: '#23211f' }}
              />
            )}
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

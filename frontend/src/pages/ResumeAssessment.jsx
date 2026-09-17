import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BarChart3, Check, FileText, Lightbulb, Target } from 'lucide-react'
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
      contentClassName="max-w-none"
      className="resume-assessment-layout"
    >
      <div className="resume-assessment-page">
        <section className="resume-assessment-card">
          <div className="resume-assessment-badge"><FileText size={17} /> Journey 3 Assessment</div>
          <div className="resume-assessment-progress">
            <div><strong>Question {currentQuestion + 1} of {questions.length}</strong><strong>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</strong></div>
            <div className="resume-assessment-progress-track"><span style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} /></div>
          </div>

          <div className="resume-assessment-question">
            <h1>{question.prompt}</h1>
            {question.description && <p>{question.description}</p>}
          </div>

          <div className="resume-assessment-answer">
            {question.options?.length > 0 ? (
              <div className="resume-assessment-options">
                {question.options.map((option) => {
                  const optionId = option.id ?? option.value
                  const optionText = option.text ?? option.label ?? option.value
                  return <button key={optionId} type="button" onClick={() => handleAnswer(optionId)} className={answers[question.id] === optionId ? 'is-selected' : ''}>{optionText}</button>
                })}
              </div>
            ) : (
              <textarea
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Your answer here..."
                className="resume-assessment-textarea"
              />
            )}
          </div>

          <div className="resume-assessment-actions">
            <Button
              onClick={() => navigate('/explore/resume/analysis')}
              variant="ghost"
              size="lg"
              icon={ArrowLeft}
              iconPosition="left"
              className="resume-assessment-back"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              variant="dark"
              size="lg"
              icon={ArrowRight}
              className="resume-assessment-next"
              disabled={!answers[question.id] || (typeof answers[question.id] === 'string' && !answers[question.id].trim())}
            >
              {isLastQuestion ? 'Complete Assessment' : 'Next Question'}
            </Button>
          </div>
        </section>

        <aside className="resume-assessment-guide">
          <div className="resume-guide-heading"><span><Target size={21} /></span><div><h2>Assessment Guide</h2><p>This assessment helps us understand your analytical thinking, problem-solving approach, and how well you can work with real-world data and machine learning concepts.</p></div></div>
          <div className="resume-guide-section"><div className="resume-guide-section-title"><span><BarChart3 size={20} /></span><h2>Key Focus Areas</h2></div><ul><li><Check size={14} />Data Analysis &amp; Interpretation</li><li><Check size={14} />Feature Engineering</li><li><Check size={14} />Problem-Solving</li><li><Check size={14} />Machine Learning Knowledge</li><li><Check size={14} />Analytical Reasoning</li></ul></div>
          <div className="resume-guide-tip"><span><Lightbulb size={21} /></span><div><h2>Take your time</h2><p>There are {questions.length} questions in total.<br />You can move forward after completing each one.</p></div></div>
          <div className="resume-guide-art" aria-hidden="true"><BarChart3 size={116} strokeWidth={1.1} /></div>
        </aside>
      </div>
    </AssessmentLayout>
  )
}

export default ResumeAssessment

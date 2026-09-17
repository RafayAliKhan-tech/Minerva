import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import Timer from '../components/assessment/Timer'
import Button from '../components/common/Button'
import LogicPuzzle from '../components/assessment/LogicPuzzle'
import PriorityBoard from '../components/assessment/PriorityBoard'
import UIInspection from '../components/assessment/UIInspection'
import MultipleChoice from '../components/assessment/MultipleChoice'
import { useJourney1Assessment } from '../auth/Journey1AssessmentContext'
import { ArrowLeft, Brain, CheckCircle2, ClipboardList, Flag, Lightbulb, Sparkles, Target, Trophy } from 'lucide-react'

function ExploringActivity() {
  const { activityNum } = useParams()
  const navigate = useNavigate()
  const { questions, error, isLoading, loadQuestions } = useJourney1Assessment()
  const activityIndex = parseInt(activityNum, 10) - 1
  const activity = questions[activityIndex]

  const [timeUp, setTimeUp] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [saved, setSaved] = useState(false)

  const [logicAnswer, setLogicAnswer] = useState('')
  const [hintUsed, setHintUsed] = useState(false)

  const [prioritySlots, setPrioritySlots] = useState([null, null, null])
  const [priorityChanges, setPriorityChanges] = useState(0)

  const [selectedAreas, setSelectedAreas] = useState([])
  const [selectedOptions, setSelectedOptions] = useState({})

  const [activityStart, setActivityStart] = useState(Date.now())

  useEffect(() => {
    if (!questions.length && !error && !isLoading) {
      loadQuestions().catch(() => null)
    }
  }, [questions.length, error, isLoading])

  useEffect(() => {
    setTimeUp(false)
    setSubmitted(false)
    setSaved(false)
    setLogicAnswer('')
    setHintUsed(false)
    setPrioritySlots([null, null, null])
    setPriorityChanges(0)
    setSelectedAreas([])
    setActivityStart(Date.now())
  }, [activity?.questionId, activity?.id])

  useEffect(() => {
    if (!activity || !timeUp || saved) {
      return
    }
    saveResponse(true)
  }, [timeUp, saved, activity])

  const poolCards = useMemo(() => {
    return activity?.cards?.filter((card) => !prioritySlots.includes(card.id)) || []
  }, [activity, prioritySlots])

  const currentQuestionId = activity?.questionId || activity?.question_id || activity?.id
  const selectedOption = currentQuestionId ? selectedOptions[currentQuestionId] ?? null : null

  const canContinue = useMemo(() => {
    if (!activity) return false
    if (activity.type === 'logic-puzzle') {
      return submitted || timeUp
    }
    if (activity.type === 'priority-board') {
      return prioritySlots.filter(Boolean).length === 3 || timeUp
    }
    if (activity.type === 'ui-inspection') {
      return selectedAreas.length >= 2 || timeUp
    }
    if (activity.type === 'multiple-choice') {
      return selectedOption !== null || timeUp
    }
    return false
  }, [activity, submitted, timeUp, prioritySlots, selectedAreas, selectedOption])

  const getTimeTaken = () => Math.max(0, Math.round((Date.now() - activityStart) / 1000))

  const saveResponse = (auto = false) => {
    if (!activity || saved) return
    const answers = JSON.parse(sessionStorage.getItem('exploringResponses') || '{}')
    const baseResponse = {
      activityId: activity.id,
      questionId: activity.question_id || activity.id,
      category: 'exploring',
      timeTaken: getTimeTaken(),
      autoSubmitted: auto,
      completed: !auto || canContinue,
      timestamp: new Date().toISOString(),
    }

    let payload = {}
    if (activity.type === 'logic-puzzle') {
      payload = {
        ...baseResponse,
        answer: logicAnswer,
        hintUsed,
      }
    }
    if (activity.type === 'priority-board') {
      payload = {
        ...baseResponse,
        selectedItems: prioritySlots.filter(Boolean),
        order: prioritySlots.filter(Boolean),
        changes: priorityChanges,
      }
    }
    if (activity.type === 'ui-inspection') {
      payload = {
        ...baseResponse,
        selectedAreas,
      }
    }
    if (activity.type === 'multiple-choice') {
      payload = {
        ...baseResponse,
        selectedOption,
      }
    }

    answers[currentQuestionId] = payload
    sessionStorage.setItem('exploringResponses', JSON.stringify(answers))
    setSaved(true)
    setSubmitted(true)
  }

  const handleUseHint = () => {
    if (!hintUsed) {
      setHintUsed(true)
    }
  }

  const handleLogicSubmit = () => {
    if (!logicAnswer.trim()) return
    saveResponse(false)
  }

  const handleSlotDrop = (cardId, source, slotIndex) => {
    if (!activity || activity.type !== 'priority-board') return

    setPrioritySlots((currentSlots) => {
      const nextSlots = [...currentSlots]
      const existingSlot = nextSlots.findIndex((item) => item === cardId)
      if (source === 'pool') {
        if (existingSlot !== -1) {
          nextSlots[existingSlot] = null
        }
        nextSlots[slotIndex] = cardId
      } else if (source === 'slot') {
        const sourceIndex = currentSlots.indexOf(cardId)
        if (sourceIndex === slotIndex) return currentSlots
        nextSlots[sourceIndex] = nextSlots[slotIndex]
        nextSlots[slotIndex] = cardId
      }
      setPriorityChanges((count) => count + 1)
      return nextSlots
    })
  }

  const handleReturnToPool = (cardId, source) => {
    if (!activity || activity.type !== 'priority-board') return

    if (source !== 'slot') return
    setPrioritySlots((currentSlots) => {
      const nextSlots = currentSlots.map((item) => (item === cardId ? null : item))
      if (nextSlots.toString() !== currentSlots.toString()) {
        setPriorityChanges((count) => count + 1)
      }
      return nextSlots
    })
  }

  const toggleArea = (areaId) => {
    setSelectedAreas((current) => {
      if (current.includes(areaId)) {
        return current.filter((id) => id !== areaId)
      }
      return [...current, areaId]
    })
  }

  const handleNext = () => {
    if (!saved) {
      saveResponse(false)
    }
    if (activityIndex < questions.length - 1) {
      navigate(`/explore/assessment/activity/${activityIndex + 2}`)
    } else {
      navigate('/explore/assessment/analysis')
    }
  }

  const handlePrevious = () => {
    if (activityIndex > 0) {
      navigate(`/explore/assessment/activity/${activityIndex}`)
    } else {
      navigate('/explore/assessment')
    }
  }

  if (!activity) {
    return (
      <AssessmentLayout onBack={() => navigate('/explore/assessment')} showProgress={false}>
        <div className="text-center">
          <p className="text-brown-light">{isLoading ? 'Loading Journey 1 questions...' : error || 'Journey 1 questions are not loaded.'}</p>
          <Button onClick={() => navigate('/explore/assessment')} variant="dark" size="md" className="mt-6">Load questions</Button>
        </div>
      </AssessmentLayout>
    )
  }

  const isFirstActivity = activityIndex === 0
  const isLastActivity = activityIndex === questions.length - 1

  return (
    <AssessmentLayout
      onBack={handlePrevious}
      currentStep={activityIndex + 1}
      totalSteps={questions.length}
      title={activity.title}
      subtitle={activity.description}
      contentClassName="max-w-none"
      className="journey1-assessment-layout"
    >
      <button className="journey1-assessment-back" type="button" onClick={handlePrevious} aria-label="Go back">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="journey1-assessment-grid">
        <main className="journey1-assessment-card">
          <div className="journey1-assessment-card-top">
            <div className="journey1-assessment-badge"><ClipboardList size={16} /> Journey 1 Assessment</div>
            <div className="journey1-assessment-mode"><Brain size={18} /><span><strong>AI &amp; Machine Learning</strong><small>Exploring Mode</small></span></div>
          </div>
          <div className="journey1-assessment-question-meta">Question {activityIndex + 1} of {questions.length}</div>
          <h1>{activity.title}</h1>
          <p className="journey1-assessment-description">{activity.description}</p>

          <div className="journey1-assessment-question-body">
            {activity.type === 'logic-puzzle' && (
              <LogicPuzzle answer={logicAnswer} onAnswerChange={setLogicAnswer} hintUsed={hintUsed} onUseHint={handleUseHint} onSubmit={handleLogicSubmit} isSubmitted={submitted} isDisabled={timeUp} />
            )}
            {activity.type === 'priority-board' && (
              <PriorityBoard cards={poolCards} prioritySlots={prioritySlots.map((cardId) => activity.cards.find((card) => card.id === cardId))} onSlotDrop={handleSlotDrop} onReturnToPool={handleReturnToPool} changes={priorityChanges} isDisabled={timeUp} />
            )}
            {activity.type === 'ui-inspection' && (
              <UIInspection areas={activity.areas} selectedAreas={selectedAreas} onToggleArea={toggleArea} isDisabled={timeUp} />
            )}
            {activity.type === 'multiple-choice' && (
              <MultipleChoice question={activity} selectedOption={selectedOption} onOptionSelect={(optionId) => setSelectedOptions((current) => ({ ...current, [currentQuestionId]: optionId }))} isAnswered={submitted} canAnswer={!timeUp} />
            )}
            {!['logic-puzzle', 'priority-board', 'ui-inspection', 'multiple-choice'].includes(activity.type) && (
              <div className="journey1-assessment-unsupported">
                <p>This activity type is not available yet.</p>
                <small>Received activity type: {activity.type || 'unknown'}</small>
              </div>
            )}
          </div>

          <div className="journey1-assessment-footer">
            <div className="journey1-assessment-step"><span><i style={{ width: `${((activityIndex + 1) / questions.length) * 100}%` }} /></span>{activityIndex + 1} / {questions.length}</div>
            {timeUp && <div className="journey1-assessment-timeup">Time's up! Your response was saved automatically.</div>}
            <div className="journey1-assessment-actions">
              <Timer duration={180} storageKey={`minerva:journey1:timer:${activity.id || activity.question_id}`} onTimeUp={() => setTimeUp(true)} isActive={!submitted} />
              <Button onClick={handleNext} variant="dark" size="md" disabled={!canContinue}>{isLastActivity ? 'See Analysis →' : 'Next Question →'}</Button>
            </div>
          </div>
        </main>

        <aside className="journey1-assessment-sidebar">
          <section className="journey1-progress-card">
            <div className="journey1-sidebar-heading"><span><Target size={17} /></span><div><h2>Your Progress</h2><p>Complete all {questions.length} questions to finish this section.</p></div><strong>{Math.round(((activityIndex + 1) / questions.length) * 100)}%</strong></div>
            <div className="journey1-progress-track"><i style={{ width: `${((activityIndex + 1) / questions.length) * 100}%` }} /></div>
            <div className="journey1-question-dots">{questions.map((_, index) => <span key={index} className={index === activityIndex ? 'is-active' : index < activityIndex ? 'is-complete' : ''}>{index + 1}</span>)}</div>
          </section>
          <section className="journey1-overview-card">
            <div className="journey1-sidebar-title"><span><ClipboardList size={16} /></span><h2>Quick Overview</h2></div>
            {[
              [Sparkles, 'Mode', 'Exploring Mode'],
              [ClipboardList, 'Total Questions', `${questions.length} (2 per career)`],
              [CheckCircle2, 'Question Type', 'Interactive'],
              [Trophy, 'Scoring', '1 point per correct answer'],
              [Flag, 'Career Areas', '5 areas'],
            ].map(([Icon, label, value]) => <div className="journey1-overview-row" key={label}><Icon size={16} /><span>{label}</span><strong>{value}</strong></div>)}
          </section>
          <section className="journey1-keep-card"><Lightbulb size={19} /><div><h2>Keep in Mind</h2><p>There are no negative marks. Choose the option you think is correct based on your understanding and what you've learned so far.</p></div></section>
        </aside>
      </div>
    </AssessmentLayout>
  )
}

export default ExploringActivity

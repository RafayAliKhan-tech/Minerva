import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import ActivityHeader from '../components/assessment/ActivityHeader'
import Timer from '../components/assessment/Timer'
import Button from '../components/common/Button'
import LogicPuzzle from '../components/assessment/LogicPuzzle'
import PriorityBoard from '../components/assessment/PriorityBoard'
import UIInspection from '../components/assessment/UIInspection'
import { exploringActivities } from '../data/exploringActivities'

function ExploringActivity() {
  const { activityNum } = useParams()
  const navigate = useNavigate()
  const activityIndex = parseInt(activityNum, 10) - 1
  const activity = exploringActivities[activityIndex]

  const [timeUp, setTimeUp] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [saved, setSaved] = useState(false)

  const [logicAnswer, setLogicAnswer] = useState('')
  const [hintUsed, setHintUsed] = useState(false)

  const [prioritySlots, setPrioritySlots] = useState([null, null, null])
  const [priorityChanges, setPriorityChanges] = useState(0)

  const [selectedAreas, setSelectedAreas] = useState([])

  const [activityStart, setActivityStart] = useState(Date.now())

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
  }, [activity?.id])

  useEffect(() => {
    if (!activity || !timeUp || saved) {
      return
    }
    saveResponse(true)
  }, [timeUp, saved, activity])

  const poolCards = useMemo(() => {
    return activity?.cards?.filter((card) => !prioritySlots.includes(card.id)) || []
  }, [activity, prioritySlots])

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
    return false
  }, [activity, submitted, timeUp, prioritySlots, selectedAreas])

  const getTimeTaken = () => Math.max(0, Math.round((Date.now() - activityStart) / 1000))

  const saveResponse = (auto = false) => {
    if (!activity || saved) return

    const answers = JSON.parse(sessionStorage.getItem('exploringResponses') || '{}')
    const baseResponse = {
      activityId: activity.id,
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

    answers[activity.id] = payload
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
    if (activityIndex < exploringActivities.length - 1) {
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
        <p className="text-center text-brown-light">Activity not found</p>
      </AssessmentLayout>
    )
  }

  const isFirstActivity = activityIndex === 0
  const isLastActivity = activityIndex === exploringActivities.length - 1

  return (
    <AssessmentLayout
      onBack={handlePrevious}
      currentStep={activityIndex + 1}
      totalSteps={exploringActivities.length}
      title={activity.title}
      subtitle={activity.description}
    >
      <div className="mb-6 flex justify-end">
        <Timer duration={activity.duration} onTimeUp={() => setTimeUp(true)} isActive={!submitted} />
      </div>

      <ActivityHeader title={activity.title} subtitle={activity.description} step={activityIndex + 1} totalSteps={exploringActivities.length} />

      {activity.type === 'logic-puzzle' && (
        <LogicPuzzle
          answer={logicAnswer}
          onAnswerChange={setLogicAnswer}
          hintUsed={hintUsed}
          onUseHint={handleUseHint}
          onSubmit={handleLogicSubmit}
          isSubmitted={submitted}
          isDisabled={timeUp}
        />
      )}

      {activity.type === 'priority-board' && (
        <PriorityBoard
          cards={poolCards}
          prioritySlots={prioritySlots.map((cardId) => activity.cards.find((card) => card.id === cardId))}
          onSlotDrop={handleSlotDrop}
          onReturnToPool={handleReturnToPool}
          changes={priorityChanges}
          isDisabled={timeUp}
        />
      )}

      {activity.type === 'ui-inspection' && (
        <UIInspection
          areas={activity.areas}
          selectedAreas={selectedAreas}
          onToggleArea={toggleArea}
          isDisabled={timeUp}
        />
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button onClick={handlePrevious} variant="ghost" size="md" className="text-brown hover:text-orange">
          {isFirstActivity ? 'Back' : 'Previous'}
        </Button>

        {timeUp && (
          <div className="text-center text-sm text-orange font-medium">
            Time's up! Your response was saved automatically.
          </div>
        )}

        <Button onClick={handleNext} variant="dark" size="md" disabled={!canContinue}>
          {isLastActivity ? 'See Analysis' : 'Continue'}
        </Button>
      </div>
    </AssessmentLayout>
  )
}

export default ExploringActivity

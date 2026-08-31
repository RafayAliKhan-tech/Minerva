import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import Timer from '../components/assessment/Timer'
import Button from '../components/common/Button'
import CodeDebugger from '../components/assessment/CodeDebugger'
import PageBuilder from '../components/assessment/PageBuilder'
import ResponsiveChallenge from '../components/assessment/ResponsiveChallenge'
import PatternSpotter from '../components/assessment/PatternSpotter'
import DataCleaner from '../components/assessment/DataCleaner'
import VisualizationChooser from '../components/assessment/VisualizationChooser'
import PromptDetector from '../components/assessment/PromptDetector'
import StatementInspector from '../components/assessment/StatementInspector'
import ChoiceExplanation from '../components/assessment/ChoiceExplanation'
import UIInspection from '../components/assessment/UIInspection'
import MultipleChoice from '../components/assessment/MultipleChoice'
import { getDomainActivities, domains } from '../data/domainActivities'
import { readAttemptId, submitAssessment, startAssessment, saveAttemptId } from '../api/assessmentApi'

const getInitialState = (activity, saved = {}) => {
  switch (activity?.type) {
    case 'code-debugger':
      return { selectedLine: saved.selectedLine || null }
    case 'page-builder': {
      const savedIds = saved.canvasItems || []
      return {
        canvasItems: Array.from({ length: 7 }, (_, index) => {
          const id = savedIds[index]
          return activity.availableComponents.find((item) => item.id === id) || null
        }),
      }
    }
    case 'responsive-challenge':
      return {
        selectedAreaId: saved.selectedAreaId || null,
        assignedFixes: saved.assignedFixes || {},
      }
    case 'pattern-spotter':
      return { selectedOption: saved.selectedOption || null }
    case 'data-cleaner':
      return { selectedCells: saved.selectedCells || [] }
    case 'visualization-chooser':
      return { selectedOption: saved.selectedOption || null, explanation: saved.explanation || '' }
    case 'prompt-detector':
      return { selectedOption: saved.selectedOption || null, explanation: saved.explanation || '' }
    case 'statement-inspector':
      return { selectedOption: saved.selectedOption || null }
    case 'choice-explanation':
      return { selectedOption: saved.selectedOption || null, explanation: saved.explanation || '' }
    case 'ui-inspection':
      return { selectedAreas: saved.selectedAreas || [] }
    case 'multiple-choice':
      return { selectedOption: saved.selectedOption || null }
    default:
      return {}
  }
}

const buildResponse = (activity, state, autoSubmitted, canContinue) => {
  const response = {
    activityId: activity.id,
    questionId: activity.question_id || activity.id,
    selectedDomain: activity.domainId || activity.career,
    timeTaken: state.timeTaken,
    autoSubmitted,
    completed: !autoSubmitted || canContinue,
    timestamp: new Date().toISOString(),
  }

  if (activity.type === 'code-debugger') {
    response.selectedLine = state.selectedLine
  }
  if (activity.type === 'page-builder') {
    response.canvasItems = state.canvasItems.filter(Boolean).map((item) => item.id)
  }
  if (activity.type === 'responsive-challenge') {
    response.selectedAreaId = state.selectedAreaId
    response.assignedFixes = state.assignedFixes
  }
  if (activity.type === 'pattern-spotter') {
    response.selectedOption = state.selectedOption
  }
  if (activity.type === 'data-cleaner') {
    response.selectedCells = state.selectedCells
  }
  if (activity.type === 'visualization-chooser') {
    response.selectedOption = state.selectedOption
    response.explanation = state.explanation
  }
  if (activity.type === 'prompt-detector') {
    response.selectedOption = state.selectedOption
    response.explanation = state.explanation
  }
  if (activity.type === 'statement-inspector') {
    response.selectedOption = state.selectedOption
  }
  if (activity.type === 'choice-explanation') {
    response.selectedOption = state.selectedOption
    response.explanation = state.explanation
  }
  if (activity.type === 'ui-inspection') {
    response.selectedAreas = state.selectedAreas
  }
  if (activity.type === 'multiple-choice') {
    response.selectedOption = state.selectedOption
  }

  return response
}

function DomainAssessment() {
  const { domainId, activityNum } = useParams()
  const navigate = useNavigate()

  const domainData = domains.find((d) => d.id === domainId)
  const activities = getDomainActivities(domainId)

  const activityIndex = Math.max(0, Math.min(activities.length - 1, parseInt(activityNum || '1', 10) - 1))
  const activity = activities[activityIndex]

  const [currentState, setCurrentState] = useState({})
  const [timeUp, setTimeUp] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activityStart, setActivityStart] = useState(Date.now())

  useEffect(() => {
    if (!activity) return
    const responses = JSON.parse(sessionStorage.getItem('domainResponses') || '{}')
    const saved = responses[activity.id] || {}
    setCurrentState(getInitialState(activity, saved))
    setTimeUp(false)
    setSaved(false)
    setActivityStart(Date.now())
    // ensure domain attempt started (best-effort)
    ;(async () => {
      try {
        const attemptId = readAttemptId('domain')
        if (!attemptId) {
          const newAttempt = await startAssessment('domain', { domainId })
          if (newAttempt) saveAttemptId('domain', newAttempt)
        }
      } catch (e) {
        // ignore
      }
    })()
  }, [activity?.id])

  useEffect(() => {
    if (!activity || !timeUp || saved) return
    saveResponse(true)
  }, [activity, timeUp, saved])

  const setState = (patch) => {
    setCurrentState((prev) => ({ ...prev, ...patch }))
  }

  const getTimeTaken = () => Math.max(0, Math.round((Date.now() - activityStart) / 1000))

  const canContinue = useMemo(() => {
    if (!activity) return false
    const state = currentState
    if (activity.type === 'code-debugger') return state.selectedLine !== null || timeUp
    if (activity.type === 'page-builder') return state.canvasItems?.some(Boolean) || timeUp
    if (activity.type === 'responsive-challenge') return Object.keys(state.assignedFixes || {}).length > 0 || timeUp
    if (activity.type === 'pattern-spotter') return state.selectedOption !== null || timeUp
    if (activity.type === 'data-cleaner') return (state.selectedCells?.length || 0) > 0 || timeUp
    if (activity.type === 'visualization-chooser') return (state.selectedOption !== null && state.explanation?.trim()) || timeUp
    if (activity.type === 'prompt-detector') return (state.selectedOption !== null && state.explanation?.trim()) || timeUp
    if (activity.type === 'statement-inspector') return state.selectedOption !== null || timeUp
    if (activity.type === 'choice-explanation') return (state.selectedOption !== null && state.explanation?.trim()) || timeUp
    if (activity.type === 'ui-inspection') return (state.selectedAreas?.length || 0) >= 3 || timeUp
    if (activity.type === 'multiple-choice') return state.selectedOption !== null || timeUp
    return false
  }, [activity, currentState, timeUp])

  const saveResponse = (auto = false) => {
    if (!activity || saved) return
    const response = buildResponse(activity, { ...currentState, timeTaken: getTimeTaken() }, auto, canContinue)
    const responses = JSON.parse(sessionStorage.getItem('domainResponses') || '{}')
    responses[activity.id] = response
    sessionStorage.setItem('domainResponses', JSON.stringify(responses))
    setSaved(true)

    // send to backend if attempt exists (best-effort)
    ;(async () => {
      try {
        const attemptId = readAttemptId('domain')
        if (!attemptId) return
        await submitAssessment(attemptId, [response])
      } catch (e) {
        console.error('submit domain answer failed', e)
      }
    })()
  }

  const handleNext = () => {
    alert('No backend api found')
  }

  const handlePrevious = () => {
    alert('No backend api found')
  }

  if (!domainData) {
    return (
      <AssessmentLayout onBack={() => navigate('/explore/domain-selection')}>
        <p className="text-center text-brown-light">Domain not found.</p>
      </AssessmentLayout>
    )
  }

  if (!activity) {
    return (
      <AssessmentLayout
        onBack={() => navigate('/explore/domain-selection')}
        title={domainData.name}
        subtitle="This domain is coming soon. Pick another area or return later for more activities."
      >
        <div className="rounded-3xl border border-beige-border bg-white p-12 text-center text-brown-light shadow-sm">
          <p className="text-xl font-semibold text-brown">Coming Soon</p>
          <p className="mt-4">We are building domain-specific activities for {domainData.name}. Please select another career path or check back soon.</p>
          <div className="mt-8">
            <Button onClick={() => navigate('/explore/domain-selection')} variant="dark" size="md">
              Choose another domain
            </Button>
          </div>
        </div>
      </AssessmentLayout>
    )
  }

  const isFirstActivity = activityIndex === 0
  const isLastActivity = activityIndex === activities.length - 1

  return (
    <AssessmentLayout
      onBack={handlePrevious}
      currentStep={activityIndex + 1}
      totalSteps={activities.length}
      title={activity.title}
      subtitle={activity.description}
    >
      <div className="mb-6 flex justify-end">
        <Timer duration={activity.duration} onTimeUp={() => setTimeUp(true)} isActive={!saved} />
      </div>

      {activity.type === 'code-debugger' && (
        <CodeDebugger
          codeLines={activity.codeLines}
          selectedLine={currentState.selectedLine}
          onSelectLine={(lineId) => setState({ selectedLine: lineId })}
          isDisabled={timeUp}
        />
      )}

      {activity.type === 'page-builder' && (
        <PageBuilder
          availableComponents={activity.availableComponents}
          canvasItems={currentState.canvasItems}
          onAddToCanvas={(componentId, targetIndex) => {
            setState((prev) => {
              const next = [...(prev.canvasItems || Array.from({ length: 7 }, () => null))]
              if (next.some((item) => item?.id === componentId)) return prev
              next[targetIndex] = activity.availableComponents.find((item) => item.id === componentId)
              return { canvasItems: next }
            })
          }}
          onMoveCanvasItem={(fromIndex, toIndex) => {
            setState((prev) => {
              const next = [...(prev.canvasItems || Array.from({ length: 7 }, () => null))]
              const [moved] = next.splice(fromIndex, 1)
              next.splice(toIndex, 0, moved)
              return { canvasItems: next }
            })
          }}
          onRemoveFromCanvas={(index) => {
            setState((prev) => {
              const next = [...(prev.canvasItems || Array.from({ length: 7 }, () => null))]
              next[index] = null
              return { canvasItems: next }
            })
          }}
          isDisabled={timeUp}
        />
      )}

      {activity.type === 'responsive-challenge' && (
        <ResponsiveChallenge
          problemAreas={activity.problemAreas}
          selectedAreaId={currentState.selectedAreaId}
          assignedFixes={currentState.assignedFixes || {}}
          onSelectArea={(areaId) => setState({ selectedAreaId: areaId })}
          onAssignFix={(areaId, actionId) => {
            if (currentState.selectedAreaId !== areaId) return
            const action = activity.fixOptions.find((option) => option.id === actionId)
            if (!action) return
            setState((prev) => ({ assignedFixes: { ...(prev.assignedFixes || {}), [areaId]: action.name } }))
          }}
          fixOptions={activity.fixOptions}
          isDisabled={timeUp}
        />
      )}

      {activity.type === 'pattern-spotter' && (
        <PatternSpotter
          options={activity.options}
          selectedOptionId={currentState.selectedOption}
          onSelectOption={(selectedOption) => setState({ selectedOption })}
          isDisabled={timeUp}
        />
      )}

      {activity.type === 'data-cleaner' && (
        <DataCleaner
          rows={activity.rows}
          selectedCells={currentState.selectedCells || []}
          onToggleCell={(cellId) => {
            setState((prev) => {
              const selectedCells = prev.selectedCells || []
              return selectedCells.includes(cellId)
                ? { selectedCells: selectedCells.filter((id) => id !== cellId) }
                : { selectedCells: [...selectedCells, cellId] }
            })
          }}
          isDisabled={timeUp}
        />
      )}

      {activity.type === 'visualization-chooser' && (
        <VisualizationChooser
          options={activity.options}
          selectedOptionId={currentState.selectedOption}
          explanation={currentState.explanation || ''}
          onSelectOption={(selectedOption) => setState({ selectedOption })}
          onExplanationChange={(explanation) => setState({ explanation })}
          isDisabled={timeUp}
        />
      )}

      {activity.type === 'prompt-detector' && (
        <PromptDetector
          prompts={activity.prompts}
          selectedPromptId={currentState.selectedOption}
          explanation={currentState.explanation || ''}
          onSelectPrompt={(selectedOption) => setState({ selectedOption })}
          onExplanationChange={(explanation) => setState({ explanation })}
          isDisabled={timeUp}
        />
      )}

      {activity.type === 'statement-inspector' && (
        <StatementInspector
          statements={activity.statements}
          selectedStatementId={currentState.selectedOption}
          onSelectStatement={(selectedOption) => setState({ selectedOption })}
          isDisabled={timeUp}
        />
      )}

      {activity.type === 'choice-explanation' && (
        <ChoiceExplanation
          options={activity.options}
          selectedOptionId={currentState.selectedOption}
          explanation={currentState.explanation || ''}
          onSelectOption={(selectedOption) => setState({ selectedOption })}
          onExplanationChange={(explanation) => setState({ explanation })}
          isDisabled={timeUp}
        />
      )}

      {activity.type === 'ui-inspection' && (
        <UIInspection
          areas={activity.areas}
          selectedAreas={currentState.selectedAreas || []}
          onToggleArea={(areaId) => {
            setState((prev) => {
              const selectedAreas = prev.selectedAreas || []
              return selectedAreas.includes(areaId)
                ? { selectedAreas: selectedAreas.filter((id) => id !== areaId) }
                : { selectedAreas: [...selectedAreas, areaId] }
            })
          }}
          isDisabled={timeUp}
        />
      )}

      {activity.type === 'multiple-choice' && (
        <MultipleChoice
          question={activity}
          selectedOption={currentState.selectedOption}
          onOptionSelect={(selectedOption) => setState({ selectedOption })}
          isAnswered={saved}
          canAnswer={!timeUp}
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
          {isLastActivity ? 'See Results' : 'Continue'}
        </Button>
      </div>
    </AssessmentLayout>
  )
}

export default DomainAssessment

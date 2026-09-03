import { createContext, useContext, useMemo, useState } from 'react'
import { getJourney1Questions } from '../api/minervaApi'

const Journey1AssessmentContext = createContext(null)

const getQuestionList = (response) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.questions)) return response.questions
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.data?.questions)) return response.data.questions
  if (Array.isArray(response?.result)) return response.result
  if (Array.isArray(response?.result?.questions)) return response.result.questions
  return []
}

const normalizeQuestions = (response) => getQuestionList(response).map((question) => ({
  ...question,
  activityId: question.activityId ?? question.activity_id ?? question.questionId ?? question.question_id ?? question.id,
  questionId: question.questionId ?? question.question_id ?? question.id ?? question.activityId ?? question.activity_id,
  title: question.title ?? question.questionText ?? question.question_text ?? question.text,
  description: question.description ?? question.instruction ?? question.questionText ?? question.question_text ?? question.text,
  instruction: question.instruction ?? question.description,
  options: question.options,
  type: String(question.type ?? question.interaction ?? 'multiple-choice').replace('_', '-'),
}))

export function Journey1AssessmentProvider({ children }) {
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const loadQuestions = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await getJourney1Questions()
      const nextQuestions = normalizeQuestions(response)
      if (!nextQuestions.length || nextQuestions.some((question) => !question.questionId || !question.title || !Array.isArray(question.options))) {
        throw new Error('The Journey 1 API returned invalid or empty questions.')
      }
      setQuestions(nextQuestions)
      return nextQuestions
    } catch (requestError) {
      console.error('Failed to load Journey 1 questions', requestError)
      setQuestions([])
      setError(requestError?.response?.data?.message || requestError?.response?.data?.error || requestError.message || 'Unable to load Journey 1 questions.')
      throw requestError
    } finally {
      setIsLoading(false)
    }
  }

  const value = useMemo(() => ({ questions, isLoading, error, loadQuestions }), [questions, isLoading, error])
  return <Journey1AssessmentContext.Provider value={value}>{children}</Journey1AssessmentContext.Provider>
}

export const useJourney1Assessment = () => {
  const context = useContext(Journey1AssessmentContext)
  if (!context) throw new Error('useJourney1Assessment must be used inside Journey1AssessmentProvider')
  return context
}

export default Journey1AssessmentProvider
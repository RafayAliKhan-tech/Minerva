import { createContext, useContext, useMemo, useState } from 'react'
import { getJourney2Careers, getJourney2Questions, getJourney2Result, submitJourney2 } from '../api/minervaApi'

const Journey2AssessmentContext = createContext(null)

const unwrapList = (response, key) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.[key])) return response[key]
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.data?.[key])) return response.data[key]
  if (Array.isArray(response?.result)) return response.result
  if (Array.isArray(response?.result?.[key])) return response.result[key]
  return []
}

const normalizeQuestion = (question, index) => ({
  ...question,
  id: question.id ?? question.questionId ?? question.question_id ?? question.activityId ?? question.activity_id ?? `journey2-${index + 1}`,
  activityId: question.activityId ?? question.activity_id ?? question.questionId ?? question.id ?? `journey2-${index + 1}`,
  questionId: question.questionId ?? question.question_id ?? question.id ?? question.activityId ?? question.activity_id ?? `journey2-${index + 1}`,
  title: question.title ?? question.questionText ?? question.question_text ?? question.text ?? `Question ${index + 1}`,
  description: question.description ?? question.instruction ?? question.questionText ?? question.question_text ?? question.text ?? '',
  instruction: question.instruction ?? question.description ?? '',
  options: Array.isArray(question.options) ? question.options : [],
  type: String(question.type ?? question.interaction ?? 'multiple-choice').replace('_', '-'),
})

export function Journey2AssessmentProvider({ children }) {
  const [careers, setCareers] = useState([])
  const [selectedCareer, setSelectedCareer] = useState(null)
  const [questions, setQuestions] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const loadCareers = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await getJourney2Careers()
      const nextCareers = unwrapList(response, 'careers').filter((career) => career?.career_id || career?.careerId || career?.id)
      if (!nextCareers.length) throw new Error('The Journey 2 API returned no usable careers.')
      setCareers(nextCareers)
      return nextCareers
    } catch (requestError) {
      setCareers([])
      setError(requestError?.response?.data?.message || requestError?.response?.data?.error || requestError.message || 'Unable to load Journey 2 careers.')
      throw requestError
    } finally {
      setIsLoading(false)
    }
  }

  const loadQuestions = async (career) => {
    setIsLoading(true)
    setError('')
    try {
      const response = await getJourney2Questions(career)
      console.log('Raw Journey2 questions response:', response)
      const nextQuestions = unwrapList(response, 'questions').map(normalizeQuestion)
      console.log('Normalized Journey2 questions:', nextQuestions)
      console.log('Questions count:', nextQuestions.length)
      
      // Check for specific validation issues
      if (!nextQuestions.length) {
        throw new Error('The Journey 2 API returned no questions for this career.')
      }
      
      const invalidQuestions = nextQuestions.filter((question) => !question.questionId || !question.title || !Array.isArray(question.options))
      if (invalidQuestions.length) {
        console.warn('Invalid questions found:', invalidQuestions)
        throw new Error(`Invalid questions: ${invalidQuestions.length} out of ${nextQuestions.length} questions are missing required fields.`)
      }
      
      // Find and store the full career object by matching the career ID
      const careerObj = careers.find((c) => (c.career_id || c.careerId || c.id) === career) || { id: career }
      setSelectedCareer(careerObj)
      setQuestions(nextQuestions)
      return nextQuestions
    } catch (requestError) {
      console.error('Journey 2 loadQuestions error:', requestError)
      console.error('Error details:', {
        message: requestError?.message,
        response: requestError?.response?.data,
        status: requestError?.response?.status,
      })
      setQuestions([])
      const errorMessage = requestError?.response?.data?.message || requestError?.response?.data?.error || requestError.message || 'Unable to load Journey 2 questions.'
      setError(errorMessage)
      throw requestError
    } finally {
      setIsLoading(false)
    }
  }

  const submitAssessment = async () => {
    if (!selectedCareer || !questions.length) throw new Error('Journey 2 career and questions are not loaded.')
    const careerId = selectedCareer.career_id || selectedCareer.careerId || selectedCareer.id
    const stored = JSON.parse(sessionStorage.getItem('journey2Responses') || '{}')
    const answers = questions.map((question) => stored[question.activityId] || stored[question.questionId]).filter(Boolean)
    if (answers.length !== questions.length) throw new Error('Please answer every Journey 2 question before submitting.')

    setIsLoading(true)
    setError('')
    try {
      const submission = await submitJourney2({ career: careerId, answers })
      const assessmentId = submission?.assessmentId || submission?.assessment_id || submission?.resultId || submission?.result_id || submission?.id || submission?.data?.assessmentId
      if (!assessmentId && submission?.status === false) throw new Error(submission.message || 'Journey 2 submission was rejected.')
      if (assessmentId) sessionStorage.setItem('journey2AssessmentId', String(assessmentId))
      const result = await getJourney2Result(careerId)
      if (!result || result.status === false) throw new Error(result?.message || 'The Journey 2 API returned no result.')
      sessionStorage.setItem('journey2Result', JSON.stringify(result))
      return result
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.response?.data?.error || requestError.message || 'Unable to submit Journey 2 assessment.')
      throw requestError
    } finally {
      setIsLoading(false)
    }
  }

  const value = useMemo(() => ({ careers, selectedCareer, questions, error, isLoading, loadCareers, loadQuestions, submitAssessment }), [careers, selectedCareer, questions, error, isLoading])
  return <Journey2AssessmentContext.Provider value={value}>{children}</Journey2AssessmentContext.Provider>
}

export const useJourney2Assessment = () => {
  const context = useContext(Journey2AssessmentContext)
  if (!context) throw new Error('useJourney2Assessment must be used inside Journey2AssessmentProvider')
  return context
}

export default Journey2AssessmentProvider
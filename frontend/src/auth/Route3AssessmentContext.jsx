import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { startRoute3, submitRoute3, getRoute3Result } from '../api/minervaApi'

const Route3AssessmentContext = createContext(null)

const unwrap = (payload) => payload?.data ?? payload?.result ?? payload
const findValue = (value, keys) => {
  if (!value || typeof value !== 'object') return null
  for (const [key, child] of Object.entries(value)) {
    if (keys.some((name) => name.toLowerCase() === key.toLowerCase()) && (typeof child === 'string' || typeof child === 'number')) return String(child)
    const nested = findValue(child, keys)
    if (nested) return nested
  }
  return null
}
const getList = (payload, names) => {
  const data = unwrap(payload)
  if (Array.isArray(data)) return data
  for (const name of names) {
    if (Array.isArray(data?.[name])) return data[name]
  }
  return []
}
const normalizeQuestion = (question, index) => ({
  ...question,
  id: question.id ?? question.questionId ?? question.question_id ?? `route3-${index + 1}`,
  questionId: question.questionId ?? question.question_id ?? question.id ?? null,
  skillId: question.skillId ?? question.skill_id ?? question.skill?.id ?? null,
  prompt: question.prompt ?? question.question ?? question.text ?? question.title ?? '',
  options: Array.isArray(question.options) ? question.options : [],
  type: question.type || 'text',
})

export function Route3AssessmentProvider({ children }) {
  const [file, setFile] = useState(null)
  const [uploadResult, setUploadResult] = useState(null)
  const [startResult, setStartResult] = useState(null)
  const [questions, setQuestions] = useState([])
  const [attemptId, setAttemptId] = useState(sessionStorage.getItem('route3AttemptId') || '')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const start = useCallback(async (selectedFile) => {
    setIsLoading(true)
    setError('')
    try {
      if (!selectedFile) throw new Error('Please select a resume file.')
      const formData = new FormData()
      formData.append('file', selectedFile)
      const response = await startRoute3(formData)
      const nextQuestions = getList(response, ['questions']).map(normalizeQuestion)
      const nextAttemptId = findValue(response, ['attemptId', 'attempt_id', 'id'])
      if (!nextAttemptId) throw new Error('Route 3 did not return a valid attempt ID.')
      if (!nextQuestions.length) throw new Error('Route 3 did not return assessment questions.')
      setFile(selectedFile)
      setStartResult(response)
      setQuestions(nextQuestions)
      setAttemptId(nextAttemptId)
      sessionStorage.setItem('route3AttemptId', nextAttemptId)
      sessionStorage.setItem('route3Questions', JSON.stringify(nextQuestions))
      return response
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.response?.data?.error || requestError.message || 'Unable to start Journey 3.')
      throw requestError
    } finally {
      setIsLoading(false)
    }
  }, [])

  const submit = useCallback(async (answers) => {
    if (!attemptId) throw new Error('No backend Route 3 attempt ID is available.')
    if (!answers || Object.keys(answers).length !== questions.length) throw new Error('Please answer every backend-generated question.')
    setIsLoading(true)
    setError('')
    try {
      const response = await submitRoute3({ attemptId, answers })
      const finalResult = await getRoute3Result(attemptId)
      if (!finalResult || finalResult.status === false) throw new Error('Route 3 returned no evaluation result.')
      setResult(finalResult)
      sessionStorage.setItem('route3Result', JSON.stringify(finalResult))
      return finalResult
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.response?.data?.error || requestError.message || 'Unable to submit Journey 3.')
      throw requestError
    } finally {
      setIsLoading(false)
    }
  }, [attemptId, questions])

  const value = useMemo(() => ({ file, uploadResult, setUploadResult, startResult, questions, attemptId, result, error, isLoading, setFile, start, submit }), [file, uploadResult, startResult, questions, attemptId, result, error, isLoading, start, submit])
  return <Route3AssessmentContext.Provider value={value}>{children}</Route3AssessmentContext.Provider>
}

export const useRoute3Assessment = () => {
  const context = useContext(Route3AssessmentContext)
  if (!context) throw new Error('useRoute3Assessment must be used inside Route3AssessmentProvider')
  return context
}

export default Route3AssessmentProvider

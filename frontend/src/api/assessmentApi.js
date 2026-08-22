import api from './axiosInstance'

const START_KEY_MAP = {
  exploring: 'exploringAttemptId',
  domain: 'domainAttemptId',
  resume: 'resumeAttemptId',
}

export async function startAssessment(category, meta = {}) {
  const payload = { category, ...meta }
  const res = await api.post('/assessment/start', payload)
  const body = res.data || {}
  const data = body.data || body
  const attemptId = data?.attemptId || data?.attemptId || data?.id || data?.attempt || null
  return attemptId
}

export async function submitAssessment(attemptId, answers) {
  const payload = { attemptId, answers }
  const res = await api.post('/assessment/submit', payload)
  const body = res.data || {}
  return body.data || body
}

export async function getAssessmentResult(attemptId) {
  const res = await api.get(`/assessment/result?attemptId=${encodeURIComponent(attemptId)}`)
  const body = res.data || {}
  return body.data || body
}

export function saveAttemptId(category, attemptId) {
  const key = START_KEY_MAP[category] || 'assessmentAttemptId'
  try { sessionStorage.setItem(key, attemptId) } catch (e) {}
}

export function readAttemptId(category) {
  const key = START_KEY_MAP[category] || 'assessmentAttemptId'
  try { return sessionStorage.getItem(key) } catch (e) { return null }
}

export default { startAssessment, submitAssessment, getAssessmentResult, saveAttemptId, readAttemptId }

const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== '')

export const unwrapData = (payload) => {
  if (payload == null || typeof payload !== 'object') return payload
  if (payload.data !== undefined && payload.data !== null) return payload.data
  return payload
}

export const apiErrorMessage = (error, fallback) => (
  error?.response?.data?.message
  || error?.response?.data?.Message
  || error?.response?.data?.error
  || error?.response?.data?.Error
  || (typeof error?.response?.data === 'string' ? error.response.data : null)
  || error?.message
  || fallback
)

export const extractSessionId = (payload) => {
  const data = unwrapData(payload)
  return firstDefined(
    data?.sessionId,
    data?.session_id,
    data?.SessionId,
    payload?.sessionId,
    payload?.session_id,
    payload?.SessionId,
  )
}

export const extractChatAnswer = (payload) => {
  const data = unwrapData(payload)
  return firstDefined(
    data?.answer,
    data?.Answer,
    data?.reply,
    data?.Reply,
    data?.content,
    data?.response,
    data?.assistantMessage,
    data?.assistant_message,
    data?.messageText,
    typeof data?.message === 'string' ? data.message : null,
  )
}

export const extractHistoryMessages = (payload) => {
  const data = unwrapData(payload)
  const list = Array.isArray(data)
    ? data
    : (data?.messages || data?.Messages || data?.history || data?.chatHistory || data?.ChatHistory || [])

  if (!Array.isArray(list)) return []

  return list.map((item, index) => {
    const role = String(item?.role || item?.from || item?.sender || item?.messageType || item?.Role || '').toLowerCase()
    const from = role.includes('assistant') || role.includes('bot') || role.includes('ai') || role === 'system'
      ? 'assistant'
      : (role.includes('user') || role === 'human' || role === 'you' ? 'user' : (item?.from === 'assistant' ? 'assistant' : 'user'))
    const text = firstDefined(item?.text, item?.message, item?.content, item?.answer, item?.reply, item?.Message)
    return {
      id: firstDefined(item?.id, item?.messageId, item?.message_id, index),
      from: text && !role && item?.isUser === true ? 'user' : from,
      text: text == null ? '' : String(text),
    }
  }).filter((message) => message.text)
}

export const extractSkillProfile = (payload) => {
  const data = unwrapData(payload)
  return firstDefined(
    data?.skillProfile,
    data?.skill_profile,
    data?.normalizedSkillProfile,
    data?.NormalizedSkillProfile,
    data?.normalized_skill_profile,
  )
}

export const extractHighestScoredField = (payload) => {
  const data = unwrapData(payload)
  const value = firstDefined(
    data?.highestScoredField,
    data?.highest_scored_field,
    data?.HighestScoredField,
    data?.highestScoredRole,
    data?.highest_scored_role,
    data?.recommendedField,
  )
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (value && typeof value === 'object') {
    return firstDefined(value.name, value.field, value.career, value.careerName, value.career_name, value.label)
  }
  return null
}

export const extractQuestions = (payload) => {
  const data = unwrapData(payload)
  const list = data?.questions || data?.Questions || data?.interviewQuestions || (Array.isArray(data) ? data : [])
  return Array.isArray(list) ? list : []
}

export const extractAttemptId = (payload) => {
  const data = unwrapData(payload)
  return firstDefined(
    data?.attemptId,
    data?.attempt_id,
    data?.AttemptId,
    payload?.attemptId,
    payload?.attempt_id,
    payload?.AttemptId,
  )
}

export const extractInterviewResult = (payload) => {
  const data = unwrapData(payload)
  const nested = data?.result && typeof data.result === 'object' ? data.result : data
  const scores = nested?.scores ?? nested?.Scores
  const total = nested?.total ?? nested?.Total
  const feedback = nested?.feedback ?? nested?.Feedback
  return {
    scores: Array.isArray(scores) ? scores : null,
    total: total === undefined ? null : total,
    feedback: Array.isArray(feedback) ? feedback : (typeof feedback === 'string' ? [feedback] : null),
    raw: nested,
  }
}

export const extractCareerList = (payload) => {
  const data = unwrapData(payload)
  const list = Array.isArray(data)
    ? data
    : (data?.careers || data?.Careers || data?.fields || data?.Fields || [])
  return Array.isArray(list) ? list : []
}

export const careerIdentity = (career) => ({
  id: firstDefined(career?.career_id, career?.careerId, career?.id, career?.field, career?.name, career?.career_name, career?.careerName),
  name: firstDefined(career?.career_name, career?.careerName, career?.name, career?.field, career?.label, career?.career_id, career?.careerId, career?.id),
})

export const questionIdentity = (question) => ({
  id: firstDefined(question?.id, question?.questionId, question?.question_id, question?.QuestionId),
  text: firstDefined(question?.question, question?.questionText, question?.question_text, question?.prompt, question?.text, question?.Question),
  type: firstDefined(question?.type, question?.questionType, question?.question_type, question?.QuestionType),
  options: Array.isArray(question?.options) ? question.options : (Array.isArray(question?.Options) ? question.Options : []),
})

export const resolveQuestionUi = (question) => {
  const { type, options } = questionIdentity(question)
  const normalized = String(type || '').toLowerCase().replace(/[\s_]+/g, '-')

  if (['mcq', 'multiple-choice', 'multiplechoice', 'choice'].includes(normalized) || (options.length > 0 && !normalized)) {
    return { ui: 'mcq', options }
  }
  if (['coding', 'code', 'programming', 'problem', 'short-problem', 'code-problem'].includes(normalized)) {
    return { ui: 'code', options: [] }
  }
  if (['short', 'short-answer', 'shortanswer', 'text', 'open', 'open-ended'].includes(normalized) || !normalized) {
    return { ui: 'text', options: [] }
  }
  return { ui: 'unknown', type: normalized, options }
}

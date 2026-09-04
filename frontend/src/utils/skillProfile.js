const unwrap = (value) => {
  if (!value || typeof value !== 'object') return value
  if (value.data !== undefined && value.data !== null) return unwrap(value.data)
  if (value.Data !== undefined && value.Data !== null) return unwrap(value.Data)
  if (value.result !== undefined && value.result !== null) return unwrap(value.result)
  if (value.Result !== undefined && value.Result !== null) return unwrap(value.Result)
  return value
}

const readStored = (key) => {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const findProperty = (value, names) => {
  if (!value || typeof value !== 'object') return null
  for (const [key, child] of Object.entries(value)) {
    if (names.includes(key.toLowerCase()) && child !== null && child !== undefined) return child
    const nested = findProperty(child, names)
    if (nested !== null) return nested
  }
  return null
}

const normalizeValue = (value) => {
  if (Array.isArray(value)) return value.length ? value : null
  if (value && typeof value === 'object') return [value]
  return null
}

const isProfileRecord = (value) => value && typeof value === 'object' && Object.entries(value).some(([key, child]) => (
  ['skills', 'interests', 'degree', 'university', 'githuburl', 'linkedinurl', 'journeytype'].includes(key.toLowerCase())
    && child !== null && child !== undefined && child !== ''
))

const findProfileRecord = (value) => {
  if (!value || typeof value !== 'object') return null
  if (isProfileRecord(value)) return value
  for (const child of Object.values(value)) {
    const nested = findProfileRecord(child)
    if (nested) return nested
  }
  return null
}

export const normalizeSkillProfile = (...sources) => {
  for (const source of sources) {
    const value = findProperty(unwrap(source), [
      'skillprofile',
      'skill_profile',
      'normalizedskillprofile',
      'normalized_skill_profile',
      'preliminary_currentskillprofile',
      'preliminary_current_skill_profile',
      'currentskillprofile',
      'current_skill_profile',
    ])
    const normalized = normalizeValue(value)
    if (normalized) return normalized

    const record = findProfileRecord(source)
    if (isProfileRecord(record)) return [record]
  }
  return null
}

export const getStoredSkillProfile = () => normalizeSkillProfile(
  readStored('route3Result'),
  readStored('route3StartResult'),
  readStored('journey2Result'),
  readStored('journey1Result'),
)

export const getStoredHighestScoredField = () => {
  const sources = [
    readStored('route3Result'),
    readStored('route3StartResult'),
    readStored('journey2Result'),
    readStored('journey1Result'),
  ]
  for (const source of sources) {
    const direct = findProperty(unwrap(source), [
      'highestscoredfield', 'highest_scored_field', 'highestscoredrole', 'highest_scored_role',
      'recommendedfield', 'recommendedrole', 'targetrole', 'target_role', 'career', 'field',
    ])
    if (typeof direct === 'string' && direct.trim()) return direct

    const scoreMap = findProperty(unwrap(source), ['fieldscores', 'field_scores', 'rolescores', 'role_scores'])
    if (scoreMap && typeof scoreMap === 'object') {
      const entries = Array.isArray(scoreMap)
        ? scoreMap.map((item) => [item?.field || item?.role || item?.name, item])
        : Object.entries(scoreMap)
      const highest = entries
        .map(([name, item]) => [name, Number(typeof item === 'object' ? item?.score ?? item?.value ?? item?.final_score : item)])
        .filter(([name, score]) => typeof name === 'string' && name.trim() && Number.isFinite(score))
        .sort((left, right) => right[1] - left[1])[0]
      if (highest) return highest[0]
    }
  }
  return null
}

export default normalizeSkillProfile

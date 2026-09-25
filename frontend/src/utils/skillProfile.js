import { getAssessmentCompletion } from './userData'

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

const readLocal = (key) => {
  try {
    const raw = localStorage.getItem(key)
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
      'skills',
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

const asNumber = (value) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

const MAX_SKILL_LEVEL = 4

const getSkillRecords = (source) => {
  const value = findProperty(unwrap(source), [
    'skillprofile',
    'skill_profile',
    'normalizedskillprofile',
    'normalized_skill_profile',
    'preliminarycurrentskillprofile',
    'preliminary_current_skill_profile',
    'currentskillprofile',
    'current_skill_profile',
    'skills',
  ])
  return Array.isArray(value) ? value : []
}

const careerLabel = (value) => {
  const labels = {
    ai: 'AI & Machine Learning',
    cyber: 'Cybersecurity',
    data: 'Data & Analytics',
    development: 'Software Development',
    ui_ux: 'UI/UX Design',
  }
  const id = String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
  return labels[id] || String(value || '').replace(/[_-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

const normalizeCareerId = (value) => {
  const normalized = String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
  return {
    'data_analytics': 'data',
    'ai_machine_learning': 'ai',
    'cybersecurity': 'cyber',
    'software_development': 'development',
    'ui_ux_design': 'ui_ux',
  }[normalized] || normalized
}

const getCareerScores = (source) => {
  const data = unwrap(source)
  const scores = findProperty(data, ['deterministiccareerscores', 'deterministic_career_scores', 'fieldscores', 'field_scores', 'rolescores', 'role_scores'])
  if (Array.isArray(scores)) return scores.map((item) => ({ id: item?.career_id || item?.career || item?.field || item?.name, score: asNumber(item?.percentage ?? item?.score ?? item?.value) })).filter((item) => item.id)
  if (scores && typeof scores === 'object') return Object.entries(scores).map(([id, value]) => ({ id, score: asNumber(typeof value === 'object' ? value?.percentage ?? value?.score ?? value?.value : value) })).filter((item) => item.score !== null)
  return []
}

const getRoadmapFields = (roadmaps) => roadmaps
  .map((roadmap) => roadmap?.domain || roadmap?.career || roadmap?.target_role || roadmap?.targetRole)
  .filter(Boolean)
  .filter((field, index, fields) => fields.findIndex((item) => normalizeCareerId(item) === normalizeCareerId(field)) === index)

const getCareerMessage = (source) => {
  const scores = getCareerScores(source)
  if (!scores.length) return null
  const highest = Math.max(...scores.map((item) => item.score))
  if (highest === 0) return 'Your results are not yet compatible with a specific field. Use a roadmap to explore a direction from the foundations up.'
  const winners = scores.filter((item) => item.score === highest)
  return winners.map((item) => careerLabel(item.id)).join(' · ')
}

const normalizeSkill = (skill) => ({
  ...skill,
  name: skill?.skill_name || skill?.skillName || skill?.name || skill?.skill_id || 'Unnamed skill',
  current: Math.min(MAX_SKILL_LEVEL, asNumber(skill?.current_level ?? skill?.currentLevel) ?? 0),
  target: Math.min(MAX_SKILL_LEVEL, asNumber(skill?.target_level ?? skill?.targetLevel) ?? 0),
  gap: (() => {
    const current = asNumber(skill?.current_level ?? skill?.currentLevel)
    const target = asNumber(skill?.target_level ?? skill?.targetLevel)
    if (current === null || target === null) return null
    return Math.max(0, Math.min(MAX_SKILL_LEVEL, target) - Math.min(MAX_SKILL_LEVEL, current))
  })(),
})

const translateSource = (source, journey, roadmaps) => {
  const raw = unwrap(source)
  const skills = getSkillRecords(raw).map(normalizeSkill)
  const roadmapFields = getRoadmapFields(roadmaps)
  const isJourney1 = journey === 1
  const fields = isJourney1
    ? roadmapFields
    : [raw?.career || raw?.career_id || raw?.careerId || findProperty(raw, ['highestscoredfield', 'highest_scored_field', 'highestscoredrole', 'highest_scored_role']) || getCareerScores(raw).sort((a, b) => (b.score || 0) - (a.score || 0))[0]?.id].filter(Boolean)
  const grouped = fields.map((field) => {
    const fieldSkills = skills.filter((skill) => !skill.career || normalizeCareerId(skill.career) === normalizeCareerId(field))
    const strengths = fieldSkills.filter((skill) => skill.current !== null && skill.target !== null && skill.current >= skill.target - 1)
      .sort((a, b) => (b.current || 0) - (a.current || 0))
    const weakAreas = fieldSkills.filter((skill) => skill.current === 0 || (skill.target !== null && skill.current < skill.target - 1))
      .sort((a, b) => (b.gap || 0) - (a.gap || 0))
    return { id: field, label: careerLabel(field), skills: fieldSkills, strengths, weakAreas }
  })
  return {
    journey,
    journeyLabel: journey === 1 ? 'Journey 1 · Exploring' : journey === 2 ? 'Journey 2 · Career in mind' : 'Journey 3 · Resume',
    careers: isJourney1 ? (getCareerMessage(raw) || 'No career match yet') : fields.map(careerLabel).join(' · ') || 'Career not provided',
    fields: grouped,
    roadmapFields,
    missingCareer: journey === 3 && !fields.length,
  }
}

const getCompletedHours = (roadmap, completed) => {
  const source = roadmap?.result && typeof roadmap.result === 'object' ? roadmap.result : roadmap
  const milestones = source?.milestones || source?.curriculum?.phases || source?.phases || []
  const allItems = milestones.flatMap((phase, phaseIndex) => {
    const tasks = phase.tasks || phase.objectives || phase.topics || phase.lessons || []
    const phaseTasks = tasks.map((task) => {
      const label = typeof task === 'string' ? task : task?.title || task?.name || task?.label || 'Milestone task'
      return { key: String(label), hours: Number(phase.estimatedHours || phase.estimated_hours || phase.hours || 0) / Math.max(tasks.length, 1) }
    })
    const weeks = phase.weeks || phase.weekly_goals || phase.weeklyGoals || []
    const weekTasks = weeks.flatMap((week, weekIndex) => {
      const goals = week.goals || week.tasks || week.objectives || week.activities || []
      return goals.map((goal, goalIndex) => ({
      key: `week:${phaseIndex}:${weekIndex}:${goalIndex}`,
      hours: Number(week.estimatedHours || week.estimated_hours || week.hours || phase.estimatedHours || phase.estimated_hours || 0) / Math.max(goals.length, 1),
      }))
    })
    return [...phaseTasks, ...weekTasks, { key: `phase:${phaseIndex}`, hours: Number(phase.estimatedHours || phase.estimated_hours || phase.hours || 0) }]
  })
  return allItems.reduce((sum, item) => completed.includes(item.key) ? sum + (Number.isFinite(item.hours) ? item.hours : 0) : sum, 0)
}

export const getStoredSkillProfileView = (user) => {
  const key = (journey) => `minervaAssessmentOutput:${userKey(user)}:${journey}`
  const completion = getAssessmentCompletion(user)
  const completedJourney = completion?.source || ({
    exploring: 'journey1',
    domain: 'journey2',
    resume: 'journey3',
  }[completion?.type])
  const journey1 = getJourney1Stored(user)
  const journey2 = readLocal(key('journey2')) || readStored('journey2Result')
  const journey3 = readLocal(key('journey3')) || readStored('route3Result')
  const roadmaps = readRoadmaps(user)
  const selectedSource = {
    journey1: journey1 && translateSource(journey1, 1, roadmaps),
    journey2: journey2 && translateSource(journey2, 2, roadmaps),
    journey3: journey3 && translateSource(journey3, 3, roadmaps),
  }[completedJourney]
  const sources = selectedSource ? [selectedSource] : []
  const hours = roadmaps.reduce((sum, roadmap) => {
    const completed = readLocalStorage(`${getRoadmapStorageKey(user, roadmap.id)}`)
    return sum + getCompletedHours(roadmap, Array.isArray(completed) ? completed : [])
  }, 0)
  return { sources, roadmaps, completedHours: Math.round(hours * 10) / 10 }
}

const readLocalStorage = (key) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const userKey = (user) => String(user?.Email || user?.email || user?.userEmail || user?.emailAddress || 'guest').trim().toLowerCase() || 'guest'
const readRoadmaps = (user) => readLocal(`minervaRoadmaps:${userKey(user)}`) || []
const getRoadmapStorageKey = (user, id) => `minervaRoadmap:${userKey(user)}:${id}`
const getJourney1Stored = (user) => readLocal(`minervaJourney1Result:${userKey(user)}`) || readStored('journey1Result')

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

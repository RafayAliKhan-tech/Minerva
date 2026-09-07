const CAREER_NAMES = {
  ai: 'AI & Machine Learning',
  cyber: 'Cybersecurity',
  data: 'Data & Analytics',
  development: 'Software Development',
  ui_ux: 'UI/UX Design',
}

const asList = (value) => {
  if (Array.isArray(value)) return value
  if (value && typeof value === 'object') return [value]
  if (typeof value === 'string' && value.trim()) return [value.trim()]
  return []
}

const skillLabel = (skill) => {
  if (typeof skill === 'string') return skill
  return skill?.skill_name || skill?.name || skill?.skill || ''
}

const careerLabel = (career) => CAREER_NAMES[String(career || '').toLowerCase()] || career || 'Your profile'

const readableSkill = (skill) => {
  const name = skillLabel(skill)
  if (!name) return null
  const career = careerLabel(skill?.career)
  const level = skill?.current_level_label || skill?.currentLevelLabel
  const priority = skill?.priority && skill.priority !== 'None' ? `${skill.priority} priority` : ''
  const detail = [level, priority].filter(Boolean).join(', ')
  return {
    name,
    career,
    detail,
    label: detail ? `${name} (${detail})` : name,
    gap: Number.isFinite(Number(skill?.gap)) ? Number(skill.gap) : null,
    priority: String(skill?.priority || '').toLowerCase(),
    evidence: Number(skill?.positive_evidence || skill?.positiveEvidence || 0),
  }
}

const uniqueByName = (items) => {
  const seen = new Set()
  return items.filter((item) => {
    if (!item || seen.has(`${item.career}:${item.name}`)) return false
    seen.add(`${item.career}:${item.name}`)
    return true
  })
}

export const getSkillInsights = (result) => {
  const profile = asList(
    result?.preliminary_current_skill_profile
      || result?.preliminaryCurrentSkillProfile
      || result?.current_skill_profile
      || result?.currentSkillProfile,
  ).map(readableSkill).filter(Boolean)

  const strengths = uniqueByName(profile
    .filter((skill) => (skill.gap === 0 && skill.evidence > 0) || skill.priority === 'none')
    .sort((left, right) => right.evidence - left.evidence))
    .slice(0, 5)

  const weaknesses = uniqueByName(profile
    .filter((skill) => skill.gap > 0 || ['high', 'medium', 'low'].includes(skill.priority))
    .sort((left, right) => (right.gap || 0) - (left.gap || 0)))
    .slice(0, 5)

  return {
    strengths,
    weaknesses,
    profile: profile.slice(0, 8),
  }
}

export const getSkillInsightText = (item) => `${item.name} in ${item.career}${item.detail ? ` - ${item.detail}` : ''}`

export default getSkillInsights
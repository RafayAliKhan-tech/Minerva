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

const normalizeText = (value) => String(value || '').trim().toLowerCase().replace(/[_-]+/g, ' ')

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
    level: normalizeText(level),
    category: normalizeText(skill?.category),
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

const skillTopic = (item) => {
  const skill = normalizeText(item.name)
  const career = normalizeText(item.career)

  const topics = [
    {
      terms: ['model evaluation'],
      strength: 'evaluating machine learning models and understanding their performance',
      development: 'building deeper reasoning skills for evaluating machine learning models',
    },
    {
      terms: ['security awareness', 'social engineering awareness'],
      strength: 'recognizing security risks and applying security-aware thinking',
      development: 'strengthening cybersecurity risk identification and assessment',
    },
    {
      terms: ['risk detection'],
      strength: 'spotting potential risks and thinking carefully about security decisions',
      development: 'strengthening cybersecurity risk identification and assessment',
    },
    {
      terms: ['analytical reasoning', 'analytical thinking'],
      strength: 'breaking down information and drawing clear, evidence-based conclusions',
      development: 'interpreting information and drawing logical conclusions for better decisions',
    },
    {
      terms: ['machine learning reasoning'],
      strength: 'connecting machine learning concepts to practical problem-solving',
      development: 'strengthening problem-solving and reasoning skills in machine learning',
    },
    {
      terms: ['generalization'],
      strength: 'applying learned patterns thoughtfully across different situations',
      development: 'applying learned patterns more confidently across varied situations',
    },
    {
      terms: ['interaction design'],
      strength: 'thinking about how people interact with digital products',
      development: 'designing clearer and more intuitive interactions for users',
    },
    {
      terms: ['usability'],
      strength: 'considering clarity and ease of use in digital experiences',
      development: 'evaluating usability and making digital experiences easier to navigate',
    },
    {
      terms: ['logical problem solving', 'algorithmic thinking'],
      strength: 'approaching complex problems in a structured and logical way',
      development: 'strengthening structured problem-solving and algorithmic reasoning',
    },
  ]

  const match = topics.find((topic) => topic.terms.some((term) => skill.includes(term)))
  if (match) return match

  if (career.includes('data')) {
    return {
      strength: `using ${item.name.toLowerCase()} to support thoughtful, evidence-based decisions`,
      development: `developing ${item.name.toLowerCase()} to support stronger analytical decisions`,
    }
  }
  if (career.includes('cyber')) {
    return {
      strength: `applying ${item.name.toLowerCase()} to think carefully about security and risk`,
      development: `developing ${item.name.toLowerCase()} to strengthen security-focused decision-making`,
    }
  }
  if (career.includes('design')) {
    return {
      strength: `applying ${item.name.toLowerCase()} to create thoughtful user experiences`,
      development: `developing ${item.name.toLowerCase()} to create clearer user experiences`,
    }
  }
  return {
    strength: `applying ${item.name.toLowerCase()} to solve problems thoughtfully`,
    development: `developing ${item.name.toLowerCase()} through continued practice and reflection`,
  }
}

const getProficiencyLabel = (item) => {
  if (item.gap === 0) return item.evidence > 1 ? 'Strong Competency' : 'Proficient'
  if (item.level.includes('expert') || item.level.includes('proficient')) return 'Strong Competency'
  if (item.level.includes('functional')) return 'Developing Competency'
  if (item.level.includes('developing')) return 'Developing Competency'
  return 'Foundational Understanding'
}

export const getSkillInsightText = (item) => `${item.name} in ${item.career}${item.detail ? ` - ${item.detail}` : ''}`

export const getProfessionalSkillInsight = (item, type) => {
  const topic = skillTopic(item)
  const isStrength = type === 'strength'

  return {
    ...item,
    proficiency: isStrength ? getProficiencyLabel(item) : 'Development Opportunity',
    explanation: isStrength
      ? `Demonstrates a strong ability in ${topic.strength}.`
      : `Further development in ${topic.development} would strengthen overall readiness.`,
  }
}

export default getSkillInsights
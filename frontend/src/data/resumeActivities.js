import { getDomainActivities } from './domainActivities'

const focusProfiles = [
  {
    id: 'web-development',
    title: 'Frontend Readiness',
    skills: ['HTML/CSS', 'JavaScript', 'React'],
    signals: ['Frontend Development', 'UI Implementation', 'Interactive Web'],
    stronglyMatches: ['HTML/CSS', 'JavaScript', 'React'],
  },
  {
    id: 'data-science',
    title: 'Data Analysis Readiness',
    skills: ['Python', 'SQL', 'Pandas'],
    signals: ['Data Analysis', 'Insight Extraction', 'Dashboarding'],
    stronglyMatches: ['Python', 'SQL', 'Pandas'],
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Readiness',
    skills: ['Figma', 'UI Design', 'User Research'],
    signals: ['UX Design', 'Flow Thinking', 'Visual Clarity'],
    stronglyMatches: ['Figma', 'UI Design', 'User Research'],
  },
]

const defaultProfile = focusProfiles[0]

export const inferResumeProfile = (resumeFile) => {
  const name = resumeFile?.name?.toLowerCase() || ''
  if (name.includes('react') || name.includes('frontend') || name.includes('javascript') || name.includes('html')) {
    return focusProfiles[0]
  }
  if (name.includes('python') || name.includes('sql') || name.includes('pandas') || name.includes('data')) {
    return focusProfiles[1]
  }
  if (name.includes('figma') || name.includes('ui') || name.includes('ux') || name.includes('design')) {
    return focusProfiles[2]
  }
  return defaultProfile
}

export const getResumeActivities = (profileId) => {
  const baseActivities = getDomainActivities(profileId)
  return baseActivities.slice(0, 3)
}

export const generateResumeResults = (profileId, answers) => {
  const profile = focusProfiles.find((item) => item.id === profileId) || defaultProfile
  const readiness = {
    'web-development': {
      scores: [
        { name: 'Technical Skills', score: 80 },
        { name: 'Problem Solving', score: Math.min(100, 70 + (answers['find-bug']?.selectedLine === 'line-3' ? 15 : 0)) },
        { name: 'Responsive Thinking', score: Math.min(100, 65 + Object.keys(answers['responsive-web']?.assignedFixes || {}).length * 10) },
        { name: 'Career Fit', score: 78 },
      ],
      gap: ['React', 'REST APIs', 'Git/GitHub'],
      jobs: ['Frontend Intern', 'Junior Frontend Developer', 'Web Developer Trainee'],
    },
    'data-science': {
      scores: [
        { name: 'Technical Skills', score: 76 },
        { name: 'Problem Solving', score: Math.min(100, 70 + (answers['find-pattern']?.selectedOption === 'misleading-correlation' ? 15 : 0)) },
        { name: 'Data Readiness', score: Math.min(100, 65 + answers['clean-data']?.selectedCells?.length * 10) },
        { name: 'Career Fit', score: 75 },
      ],
      gap: ['Pandas', 'Data Visualization', 'Feature Engineering'],
      jobs: ['Data Analyst Intern', 'Junior Data Analyst', 'Insights Analyst'],
    },
    'ui-ux': {
      scores: [
        { name: 'Design Thinking', score: 82 },
        { name: 'Usability Awareness', score: Math.min(100, 65 + (answers['find-ux-problems']?.selectedAreas?.length || 0) * 10) },
        { name: 'Flow Design', score: Math.min(100, 70 + (answers['design-flow']?.canvasItems?.length || 0) * 8) },
        { name: 'Career Fit', score: 77 },
      ],
      gap: ['User Research', 'Accessibility', 'Prototyping'],
      jobs: ['UI/UX Intern', 'Junior UX Designer', 'Product Design Trainee'],
    },
  }

  return {
    title: profile.title,
    skills: profile.skills,
    signals: profile.signals,
    scores: readiness[profileId]?.scores || readiness['web-development'].scores,
    gap: readiness[profileId]?.gap || readiness['web-development'].gap,
    jobs: readiness[profileId]?.jobs || readiness['web-development'].jobs,
    fitMessage: `Your resume points to ${profile.signals[0]} and ${profile.signals[1]}.`, 
  }
}

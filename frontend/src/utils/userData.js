export const getUserEmail = (user) => user?.Email || user?.email || user?.userEmail || user?.emailAddress || ''

export const getDisplayName = (user) => {
  const firstName = user?.firstName || user?.FirstName || ''
  const lastName = user?.lastName || user?.LastName || ''
  return user?.fullName || user?.FullName || user?.displayName || user?.DisplayName || [firstName, lastName].filter(Boolean).join(' ') || user?.name || user?.userName || user?.UserName || user?.Email || user?.email || 'Minerva user'
}

const getUserKey = (user) => getUserEmail(user).trim().toLowerCase() || 'guest'
const getAssessmentCompletionKey = (user) => `minervaAssessmentCompletion:${getUserKey(user)}`

export const saveLatestAssessment = (user, assessment) => {
  let hasStoredCompletion = false
  try {
    hasStoredCompletion = Boolean(
      localStorage.getItem(getAssessmentCompletionKey(user))
      || localStorage.getItem(`minervaLatestAssessment:${getUserKey(user)}`)
    )
  } catch {
    hasStoredCompletion = false
  }

  const legacyCompletion = hasStoredCompletion ? null : getAssessmentCompletion(user)
  if (hasStoredCompletion || (legacyCompletion && legacyCompletion.source !== assessment.source)) {
    window.dispatchEvent(new Event('minerva:assessment-completed'))
    return
  }

  try {
    const completed = { ...assessment, completedAt: new Date().toISOString() }
    localStorage.setItem(`minervaLatestAssessment:${getUserKey(user)}`, JSON.stringify(completed))
    localStorage.setItem(`minervaJourneyAssessment:${getUserKey(user)}:${assessment.type}`, JSON.stringify(completed))
    localStorage.setItem(getAssessmentCompletionKey(user), JSON.stringify(completed))
  } catch {
    // Ignore unavailable storage.
  }
  window.dispatchEvent(new Event('minerva:assessment-completed'))
}

export const getAssessmentCompletion = (user) => {
  try {
    const marker = localStorage.getItem(getAssessmentCompletionKey(user))
    if (marker) return JSON.parse(marker)

    const latest = localStorage.getItem(`minervaLatestAssessment:${getUserKey(user)}`)
    if (latest) return JSON.parse(latest)

    const legacyCandidates = [
      ['journey3', `minervaAssessmentOutput:${getUserKey(user)}:journey3`, 'resume'],
      ['journey2', `minervaAssessmentOutput:${getUserKey(user)}:journey2`, 'domain'],
      ['journey1', `minervaJourney1Result:${getUserKey(user)}`, 'exploring'],
    ]
    const legacy = legacyCandidates.find(([, key]) => localStorage.getItem(key))
    if (!legacy) return null
    return { source: legacy[0], type: legacy[2] }
  } catch {
    return null
  }
}

export const hasCompletedAnyAssessment = (user) => {
  try {
    if (localStorage.getItem(getAssessmentCompletionKey(user))) return true
    if (localStorage.getItem(`minervaLatestAssessment:${getUserKey(user)}`)) return true
    return ['journey1', 'journey2', 'journey3'].some((journey) => (
      Boolean(localStorage.getItem(`minervaAssessmentOutput:${getUserKey(user)}:${journey}`))
      || (journey === 'journey1' && Boolean(localStorage.getItem(`minervaJourney1Result:${getUserKey(user)}`)))
    ))
  } catch {
    return false
  }
}

export const getLatestAssessment = (user) => {
  try {
    const raw = localStorage.getItem(`minervaLatestAssessment:${getUserKey(user)}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const getRoadmapKey = (user, roadmapId = 'default') => `minervaRoadmap:${getUserKey(user)}:${roadmapId}`

export const saveRoadmap = (user, roadmap) => {
  try {
    const key = `minervaRoadmaps:${getUserKey(user)}`
    const existing = getRoadmaps(user) || []
    const updated = existing.filter((r) => r.id !== roadmap.id)
    updated.push(roadmap)
    localStorage.setItem(key, JSON.stringify(updated))
    return roadmap
  } catch {
    console.error('Failed to save roadmap')
    return null
  }
}

export const getRoadmaps = (user) => {
  try {
    const key = `minervaRoadmaps:${getUserKey(user)}`
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const getRoadmapById = (user, roadmapId) => {
  try {
    const roadmaps = getRoadmaps(user)
    return roadmaps.find((r) => r.id === roadmapId)
  } catch {
    return null
  }
}

export const deleteRoadmap = (user, roadmapId) => {
  try {
    const key = `minervaRoadmaps:${getUserKey(user)}`
    const existing = getRoadmaps(user) || []
    const updated = existing.filter((r) => r.id !== roadmapId)
    localStorage.setItem(key, JSON.stringify(updated))
  } catch {
    console.error('Failed to delete roadmap')
  }
}

export const getJourneyAssessment = (user, type) => {
  try {
    const raw = localStorage.getItem(`minervaJourneyAssessment:${getUserKey(user)}:${type}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const saveResumeFile = (user, resume) => {
  try {
    localStorage.setItem(`minervaResumeFile:${getUserKey(user)}`, JSON.stringify(resume))
  } catch {
    // Ignore unavailable storage.
  }
}

export const getResumeFile = (user) => {
  try {
    const raw = localStorage.getItem(`minervaResumeFile:${getUserKey(user)}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const saveJourney1Result = (user, result) => {
  try {
    localStorage.setItem(`minervaJourney1Result:${getUserKey(user)}`, JSON.stringify(result))
  } catch {
    // Ignore unavailable storage.
  }
}

export const getJourney1Result = (user) => {
  try {
    const raw = localStorage.getItem(`minervaJourney1Result:${getUserKey(user)}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const saveAssessmentOutput = (user, journey, result) => {
  try {
    localStorage.setItem(`minervaAssessmentOutput:${getUserKey(user)}:${journey}`, JSON.stringify(result))
  } catch {
    console.error(`Failed to save ${journey} assessment output`)
  }
}

export const getAssessmentOutput = (user, journey) => {
  try {
    const raw = localStorage.getItem(`minervaAssessmentOutput:${getUserKey(user)}:${journey}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
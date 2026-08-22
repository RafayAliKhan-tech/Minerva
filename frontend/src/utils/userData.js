export const getUserEmail = (user) => user?.Email || user?.email || user?.userEmail || user?.emailAddress || ''

export const getDisplayName = (user) => {
  const firstName = user?.firstName || user?.FirstName || ''
  const lastName = user?.lastName || user?.LastName || ''
  return user?.fullName || user?.FullName || user?.displayName || user?.DisplayName || [firstName, lastName].filter(Boolean).join(' ') || user?.name || user?.userName || user?.UserName || user?.Email || user?.email || 'Minerva user'
}

const getUserKey = (user) => getUserEmail(user).trim().toLowerCase() || 'guest'

export const saveLatestAssessment = (user, assessment) => {
  try {
    localStorage.setItem(`minervaLatestAssessment:${getUserKey(user)}`, JSON.stringify({ ...assessment, completedAt: new Date().toISOString() }))
  } catch {
    // Ignore unavailable storage.
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
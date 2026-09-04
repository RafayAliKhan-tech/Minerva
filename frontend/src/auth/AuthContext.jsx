import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getUserEmail } from '../utils/userData'

const AuthContext = createContext(null)
const TOKEN_KEY = 'token'
const USER_KEY = 'minervaUser'
const LAST_ACTIVITY_KEY = 'minervaLastActivity'
const ONBOARDED_PREFIX = 'minervaOnboarded:'
const INACTIVITY_LIMIT = 15 * 60 * 1000

const getStored = (key) => {
  try {
    return localStorage.getItem(key) || sessionStorage.getItem(key)
  } catch {
    return null
  }
}

const removeStored = (key) => {
  try {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  } catch {
    // Storage can be unavailable in private browsing.
  }
}

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStored(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    try {
      const stored = getStored(USER_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const navigate = useNavigate()
  const location = useLocation()

  const clearSession = (reason = 'logout') => {
    removeStored(TOKEN_KEY)
    removeStored(USER_KEY)
    removeStored(LAST_ACTIVITY_KEY)
    try {
      sessionStorage.clear()
    } catch {
      // Ignore unavailable session storage.
    }
    setToken(null)
    setUser(null)
    if (location.pathname !== '/login') {
      navigate(`/login${reason === 'timeout' ? '?reason=timeout' : ''}`, { replace: true })
    }
  }

  const establishSession = (nextToken, nextUser, remember = true) => {
    const storage = remember ? localStorage : sessionStorage
    removeStored(TOKEN_KEY)
    removeStored(USER_KEY)
    storage.setItem(TOKEN_KEY, nextToken)
    if (nextUser) storage.setItem(USER_KEY, JSON.stringify(nextUser))
    storage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
    setToken(nextToken)
    setUser(nextUser || null)
  }

  useEffect(() => {
    if (!token) return undefined

    if (!getStored(LAST_ACTIVITY_KEY)) {
      try {
        const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage
        storage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
      } catch {
        // Ignore storage errors and keep the in-memory session alive.
      }
    }

    const markActivity = () => {
      try {
        const last = Number(getStored(LAST_ACTIVITY_KEY) || 0)
        if (Date.now() - last > 1000) {
          const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage
          storage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
        }
      } catch {
        // Ignore storage errors and keep the in-memory session alive.
      }
    }
    const activityEvents = ['keydown', 'pointermove', 'pointerover', 'click', 'scroll', 'touchstart']
    activityEvents.forEach((event) => window.addEventListener(event, markActivity, { passive: true }))
    const timer = window.setInterval(() => {
      const last = Number(getStored(LAST_ACTIVITY_KEY) || 0)
      if (last && Date.now() - last >= INACTIVITY_LIMIT) clearSession('timeout')
    }, 10000)
    window.addEventListener('minerva:session-expired', clearSession)

    return () => {
      activityEvents.forEach((event) => window.removeEventListener(event, markActivity))
      window.clearInterval(timer)
      window.removeEventListener('minerva:session-expired', clearSession)
    }
  }, [token, location.pathname])

  const completeOnboarding = (email = getUserEmail(user)) => {
    const normalizedEmail = email?.trim().toLowerCase()
    if (!normalizedEmail) return
    localStorage.setItem(`${ONBOARDED_PREFIX}${normalizedEmail}`, 'true')
  }

  const hasCompletedOnboarding = (email = getUserEmail(user)) => {
    const normalizedEmail = email?.trim().toLowerCase()
    if (!normalizedEmail) return false
    return localStorage.getItem(`${ONBOARDED_PREFIX}${normalizedEmail}`) === 'true'
  }

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: Boolean(token),
    establishSession,
    logout: () => clearSession(),
    expireSession: () => clearSession('timeout'),
    completeOnboarding,
    hasCompletedOnboarding,
  }), [token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
export default AuthProvider
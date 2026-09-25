import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { hasCompletedAnyAssessment } from '../utils/userData'

function AssessmentAccessRoute() {
  const { user } = useAuth()
  const location = useLocation()
  const [isLocked, setIsLocked] = useState(() => hasCompletedAnyAssessment(user))

  useEffect(() => {
    const refreshLock = () => setIsLocked(hasCompletedAnyAssessment(user))
    window.addEventListener('minerva:assessment-completed', refreshLock)
    window.addEventListener('storage', refreshLock)
    refreshLock()
    return () => {
      window.removeEventListener('minerva:assessment-completed', refreshLock)
      window.removeEventListener('storage', refreshLock)
    }
  }, [user])

  if (isLocked || hasCompletedAnyAssessment(user)) {
    return <Navigate to="/dashboard" replace state={{ from: location.pathname, reason: 'assessment-completed' }} />
  }

  return <Outlet />
}

export default AssessmentAccessRoute

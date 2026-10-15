import { useEffect, useState } from 'react'
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import Container from '../components/common/Container'
import Button from '../components/common/Button'
import api from '../api/axiosInstance'
import { getProfile, updateJourney } from '../api/minervaApi'
import { useAuth } from '../auth/AuthContext'
import { getLatestAssessment } from '../utils/userData'

const categoryOptions = [
  { key: 'exploring', title: "I'm exploring", description: 'Discover career options that fit your strengths and interests.' },
  { key: 'career', title: 'I have a career in mind', description: 'Turn a target role into a focused development plan.' },
  { key: 'jobhunting', title: "I'm job hunting", description: 'Connect your skills to roles and practical next steps.' },
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loginSucceeded, setLoginSucceeded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('exploring')
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { establishSession, completeOnboarding } = useAuth()
  const returnTo = typeof location.state?.from === 'string' ? location.state.from : '/dashboard'

  useEffect(() => {
    if (location.state?.registeredEmail) {
      setEmail(location.state.registeredEmail)
      setFormSuccess('Account created successfully. You can now log in.')
    }
    if (location.state?.resetSuccess) setFormSuccess(location.state.resetSuccess)
  }, [location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setFormError('')
    setFormSuccess('')
    if (!EMAIL_PATTERN.test(email.trim())) {
      setFormError('Please enter a valid email address.')
      setIsSubmitting(false)
      return
    }
    try {
      const res = await api.post('/api/auth/loginuser', { Email: email, Password: password })
      const payload = res.data || {}
      let token = null
      if (payload.token) token = payload.token
      else if (payload.data && payload.data.token) token = payload.data.token
      else if (payload.accessToken) token = payload.accessToken
      else if (typeof payload.data === 'string') token = payload.data
      if (!token) {
        setFormError(payload.message || 'Invalid email or password.')
        return
      }
      const user =
        payload.user ||
        payload.data?.user ||
        payload.profile ||
        payload.data?.profile ||
        (typeof payload.data === 'object' ? payload.data : null) ||
        { email: email.trim() }
      establishSession(token, user, remember)
      let profile = null
      try {
        profile = await getProfile()
      } catch {
        // Local assessment record remains available if profile loading fails.
      }
      const journeyType = profile?.JourneyType || profile?.journeyType || profile?.journey_type
      const hasAssessmentHistory = Boolean(journeyType || getLatestAssessment(user))
      if (hasAssessmentHistory) {
        navigate(returnTo || '/dashboard', { replace: true })
      } else {
        setLoginSucceeded(true)
      }
    } catch (error) {
      const resp = error?.response
      if (resp?.data?.message) setFormError(resp.data.message)
      else if (resp) setFormError(`Login failed (${resp.status}). Please check your credentials.`)
      else setFormError(error?.message || 'Unable to connect to server. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setLoginSucceeded(false)
    navigate(returnTo || '/dashboard', { replace: true })
  }

  const handleContinue = async () => {
    setLoginSucceeded(false)
    const journeyType = { exploring: 'exploring', career: 'career_mind', jobhunting: 'job_hunting' }[selectedCategory]
    try {
      await updateJourney({ JourneyType: journeyType })
    } catch {
      // Journey transition still works if profile persistence is unavailable.
    }
    completeOnboarding(email.trim())
    const targetRoute = {
      exploring: '/explore/assessment',
      career: '/explore/domain-selection',
      jobhunting: '/explore/resume',
    }[selectedCategory]
    navigate(targetRoute, { state: { category: selectedCategory } })
  }

  return (
    <section className="auth-stage">
      <Container className="auth-stage-inner">
        <div className="auth-form-column">
          <p className="auth-eyebrow">Minerva</p>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-description">Sign in to continue your career path.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-input">
              <UserRound size={18} />
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
              />
            </label>
            <label className="auth-input">
              <LockKeyhole size={18} />
              <input
                required
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>
            <p className="auth-forgot-link">
              <Link to="/forgot-password">Forgot password?</Link>
            </p>
            {formSuccess && (
              <p className="auth-form-success" role="status">
                {formSuccess}
              </p>
            )}
            {formError && (
              <p className="auth-form-error" role="alert">
                {formError}
              </p>
            )}
            <div className="auth-options">
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />{' '}
                Remember me
              </label>
            </div>
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="auth-submit"
              icon={ArrowRight}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          <p className="auth-switch">
            Don&apos;t have an account?{' '}
            <Button to="/signup" variant="ghost" size="sm" className="auth-link">
              Create account
            </Button>
          </p>
        </div>

        <div className="auth-art">
          <div className="auth-art-card">
            <h2>Pick up where you left off</h2>
            <p>Assessments, roadmaps, chat, and interview practice — all in one place.</p>
            <ul className="auth-art-list">
              <li>
                <span>1</span> Complete one focused assessment
              </li>
              <li>
                <span>2</span> Review your skill profile
              </li>
              <li>
                <span>3</span> Follow a personalized roadmap
              </li>
            </ul>
          </div>
        </div>
      </Container>
      <p className="auth-copyright">&copy; {new Date().getFullYear()} Minerva. All rights reserved.</p>

      {loginSucceeded && (
        <div className="journey-picker-overlay">
          <div className="journey-picker" role="dialog" aria-modal="true" aria-labelledby="journey-picker-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="auth-eyebrow">Login successful</p>
                <h2 id="journey-picker-title" className="mt-2 text-2xl">
                  Choose your path
                </h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Select the path that fits your goals. Minerva will tailor the next steps.
                </p>
              </div>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleClose}>
                Close
              </button>
            </div>
            <div className="journey-picker-grid">
              {categoryOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className={`journey-picker-option${selectedCategory === option.key ? ' is-selected' : ''}`}
                  onClick={() => setSelectedCategory(option.key)}
                >
                  <p>{option.title}</p>
                  <p>{option.description}</p>
                </button>
              ))}
            </div>
            <div className="journey-picker-actions">
              <button type="button" className="btn btn-outline btn-md" onClick={handleClose}>
                Choose later
              </button>
              <button type="button" className="btn btn-secondary btn-md" onClick={handleContinue}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default LoginPage

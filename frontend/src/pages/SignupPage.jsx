import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import Container from '../components/common/Container'
import Button from '../components/common/Button'
import api from '../api/axiosInstance'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [agree, setAgree] = useState(true)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const getRegistrationError = (data) => {
    if (!data) return ''
    if (typeof data === 'string') return data
    if (data.message) return data.message
    if (data.error) return typeof data.error === 'string' ? data.error : JSON.stringify(data.error)
    if (data.errors) return Object.values(data.errors).flat().join(' ')
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setFormError('')
    if (!EMAIL_PATTERN.test(email.trim())) {
      setFormError('Please enter a valid email address.')
      return
    }
    if (!agree) {
      setFormError('Please accept the terms to continue.')
      return
    }
    if (password !== confirm) {
      setFormError('Passwords do not match.')
      return
    }
    setIsSubmitting(true)
    try {
      const normalizedEmail = email.trim()
      const res = await api.post('/api/auth/registeruser', {
        userName: normalizedEmail,
        Email: normalizedEmail,
        Password: password,
      })
      const payload = res.data || {}
      if (res.status >= 400 || payload?.status === 'error' || payload?.status === false) {
        setFormError(getRegistrationError(payload) || 'Registration failed. Please try again.')
        return
      }
      navigate('/login', { replace: true, state: { registeredEmail: normalizedEmail } })
    } catch (error) {
      const resp = error?.response
      const backendMessage = getRegistrationError(resp?.data)
      if (backendMessage) setFormError(backendMessage)
      else if (resp) setFormError(`Registration failed (${resp.status}). Please try again.`)
      else setFormError(error?.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-stage">
      <Container className="auth-stage-inner">
        <div className="auth-form-column">
          <p className="auth-eyebrow">Minerva</p>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-description">
            Join Minerva for AI-guided career clarity — discover, plan, and grow.
          </p>
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-input">
              <Mail size={18} />
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>
            <label className="auth-input">
              <LockKeyhole size={18} />
              <input
                required
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm password"
              />
            </label>
            <div className="auth-options">
              <label>
                <input
                  id="agree"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />{' '}
                I agree to the Minerva terms and privacy policy.
              </label>
            </div>
            {formError && (
              <p className="auth-form-error" role="alert">
                {formError}
              </p>
            )}
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="auth-submit"
              icon={ArrowRight}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </Button>
          </form>
          <p className="auth-switch">
            Already have an account?{' '}
            <Button to="/login" variant="ghost" size="sm" className="auth-link">
              Sign in
            </Button>
          </p>
        </div>
        <div className="auth-art">
          <div className="auth-art-card">
            <h2>Start with where you are</h2>
            <p>Three paths, one assessment, and a roadmap you can actually follow.</p>
            <ul className="auth-art-list">
              <li>
                <span>1</span> Exploring — discover direction
              </li>
              <li>
                <span>2</span> Career in mind — build a plan
              </li>
              <li>
                <span>3</span> Job hunting — leverage your resume
              </li>
            </ul>
          </div>
        </div>
      </Container>
      <p className="auth-copyright">&copy; {new Date().getFullYear()} Minerva. All rights reserved.</p>
    </section>
  )
}

export default SignupPage

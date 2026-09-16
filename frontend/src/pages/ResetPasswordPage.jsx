import { useEffect, useState } from 'react'
import { ArrowRight, LockKeyhole } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Container from '../components/common/Container'
import Button from '../components/common/Button'
import api from '../api/axiosInstance'

function ResetPasswordPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const email = params.get('email') || ''
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [state, setState] = useState({ checking: true, loading: false, valid: false, success: '', error: '' })

  useEffect(() => {
    let active = true
    const validate = async () => {
      if (!email || !token) {
        setState({ checking: false, loading: false, valid: false, success: '', error: 'This password reset link is invalid or has expired.' })
        return
      }
      try {
        await api.post('/api/auth/validatepasswordresettoken', { Email: email, Token: token })
        if (active) setState({ checking: false, loading: false, valid: true, success: '', error: '' })
      } catch (error) {
        if (active) setState({ checking: false, loading: false, valid: false, success: '', error: error.response?.data?.message || 'This password reset link is invalid or has expired.' })
      }
    }
    validate()
    return () => { active = false }
  }, [email, token])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (password.length < 6) {
      setState((current) => ({ ...current, error: 'Your password must be at least 6 characters.' }))
      return
    }
    if (password !== confirm) {
      setState((current) => ({ ...current, error: 'Passwords do not match.' }))
      return
    }

    setState((current) => ({ ...current, loading: true, error: '' }))
    try {
      const response = await api.post('/api/auth/resetpassword', {
        Email: email,
        Token: token,
        NewPassword: password,
        ConfirmPassword: confirm,
      })
      setState((current) => ({ ...current, loading: false, success: response.data?.message || 'Your password has been reset.', error: '' }))
      setTimeout(() => navigate('/login', { replace: true, state: { resetSuccess: response.data?.message || 'Your password has been reset. You can now log in.' } }), 1200)
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: error.response?.data?.message || 'Unable to reset your password. Please request a new link.', success: '' }))
    }
  }

  return (
    <section className="auth-stage">
      <Container className="auth-stage-inner">
        <div className="auth-form-column">
          <p className="auth-eyebrow">MINERVA CAREER COMPASS</p>
          <h1 className="auth-title">Choose a New Password</h1>
          {state.checking && <p className="auth-description">Validating your secure reset link...</p>}
          {!state.checking && !state.valid && <div className="auth-form"><p className="auth-form-error" role="alert">{state.error}</p><Link to="/forgot-password" className="auth-link">Request a new link</Link></div>}
          {!state.checking && state.valid && !state.success && (
            <form onSubmit={handleSubmit} className="auth-form">
              <label className="auth-input"><LockKeyhole /><input required type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" /></label>
              <label className="auth-input"><LockKeyhole /><input required type="password" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} placeholder="Confirm new password" /></label>
              {state.error && <p className="auth-form-error" role="alert">{state.error}</p>}
              <Button type="submit" variant="light" size="lg" className="auth-submit" icon={ArrowRight} disabled={state.loading} aria-busy={state.loading}>
                {state.loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
          {state.success && <p className="auth-form-success" role="status">{state.success}</p>}
        </div>
      </Container>
    </section>
  )
}

export default ResetPasswordPage

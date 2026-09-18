import { useState } from 'react'
import { ArrowRight, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/common/Container'
import Button from '../components/common/Button'
import api from '../api/axiosInstance'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState({ loading: false, success: '', error: '' })

  const handleSubmit = async (event) => {
    event.preventDefault()
    const normalizedEmail = email.trim()
    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setState({ loading: false, success: '', error: 'Please enter a valid email address.' })
      return
    }

    setState({ loading: true, success: '', error: '' })
    try {
      const response = await api.post('/api/auth/requestpasswordreset', { Email: normalizedEmail })
      setState({
        loading: false,
        success: response.data?.message || 'If an account exists for that email, we sent a password reset link.',
        error: '',
      })
    } catch (error) {
      setState({
        loading: false,
        success: '',
        error: error.response?.data?.message || 'Unable to process your request. Please try again.',
      })
    }
  }

  return (
    <section className="auth-stage">
      <Container className="auth-stage-inner">
        <div className="auth-form-column">
          <p className="auth-eyebrow">MINERVA CAREER COMPASS</p>
          <h1 className="auth-title">Reset Your Password</h1>
          <p className="auth-description">Enter your email and we will send you a secure link to choose a new password.</p>
          {state.success ? (
            <div className="auth-form">
              <p className="auth-form-success" role="status">{state.success}</p>
              <Link to="/login" className="auth-link">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <label className="auth-input">
                <Mail />
                <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" />
              </label>
              {state.error && <p className="auth-form-error" role="alert">{state.error}</p>}
              <Button type="submit" variant="light" size="lg" className="auth-submit" icon={ArrowRight} disabled={state.loading} aria-busy={state.loading}>
                {state.loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <p className="auth-switch"><Link to="/login" className="auth-link">Back to Login</Link></p>
            </form>
          )}
        </div>
      </Container>
      <p className="auth-copyright">&copy; {new Date().getFullYear()} Minerva. All rights reserved.</p>
    </section>
  )
}

export default ForgotPasswordPage

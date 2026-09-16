import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Container from '../components/common/Container'
import api from '../api/axiosInstance'

function VerifyEmailPage() {
  const location = useLocation()
  const [state, setState] = useState({ loading: true, success: '', error: '' })

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const userId = params.get('userId')
    const token = params.get('token')
    if (!userId || !token) {
      setState({ loading: false, success: '', error: 'This verification link is invalid or has expired.' })
      return
    }
    api.post('/api/auth/confirmemail', { UserId: userId, Token: token })
      .then((response) => setState({ loading: false, success: response.data?.message || 'Your email has been verified.', error: '' }))
      .catch((error) => setState({ loading: false, success: '', error: error.response?.data?.message || 'This verification link is invalid or has expired.' }))
  }, [location.search])

  return (
    <section className="auth-stage">
      <Container className="auth-stage-inner">
        <div className="auth-form-column">
          <p className="auth-eyebrow">MINERVA CAREER COMPASS</p>
          <h1 className="auth-title">{state.loading ? 'Verifying Your Email' : state.success ? 'Email Verified' : 'Verification Failed'}</h1>
          {state.loading && <p className="auth-description">Please wait while we verify your account.</p>}
          {state.success && <div className="auth-form"><p className="auth-form-success" role="status">{state.success}</p><Link to="/login" className="auth-link">Continue to Login</Link></div>}
          {state.error && <div className="auth-form"><p className="auth-form-error" role="alert">{state.error}</p><Link to="/login" className="auth-link">Back to Login</Link></div>}
        </div>
      </Container>
    </section>
  )
}

export default VerifyEmailPage

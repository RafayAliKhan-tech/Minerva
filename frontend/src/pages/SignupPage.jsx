import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import Container from '../components/common/Container'
import Button from '../components/common/Button'
import api from '../api/axiosInstance'

function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [agree, setAgree] = useState(true)
  const [formError, setFormError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!agree) { setFormError('Please accept the Terms of Service and Privacy Policy to continue.'); return }
    if (password !== confirm) { setFormError('Passwords do not match.'); return }
    try {
      const normalizedName = fullName.trim().replace(/\s+/g, ' ')
      const res = await api.post('/api/auth/registeruser', { userName: normalizedName, fullName: normalizedName, Email: email.trim(), Password: password })
      const payload = res.data || {}
      if (res.status >= 400 || payload?.status === 'error') { setFormError(payload.message || 'Registration failed. Please check your details and try again.'); return }
      navigate('/login', { replace: true, state: { registeredEmail: email.trim() } })
    } catch (error) {
      console.error('Signup error:', error)
      const resp = error?.response
      if (resp?.data?.message) setFormError(resp.data.message)
      else if (resp) setFormError(`Registration failed (${resp.status}). Please try again.`)
      else setFormError(error?.message || 'Something went wrong. Please try again.')
    }
  }

  return <section className="auth-stage"><Container className="auth-stage-inner">
    <div className="auth-form-column"><p className="auth-eyebrow">Create your account</p><h1 className="auth-title">Start Your AI Career<br /><span>Journey in CS</span></h1><p className="auth-description">Join Minerva and get AI-powered guidance to discover, plan,<br className="hidden sm:block" /> and grow your future in Computer Science.</p>
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-input"><UserRound /><input required autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" /></label>
        <label className="auth-input"><Mail /><input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" /></label>
        <label className="auth-input"><LockKeyhole /><input required type={showPwd ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create password" /><button type="button" onClick={() => setShowPwd(!showPwd)} aria-label={showPwd ? 'Hide password' : 'Show password'}>{showPwd ? <EyeOff /> : <Eye />}</button></label>
        <label className="auth-input"><LockKeyhole /><input required type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" /></label>
        <div className="auth-options"><label><input id="agree" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></label></div>
        {formError && <p className="auth-form-error" role="alert">{formError}</p>}
        <Button type="submit" variant="light" size="lg" className="auth-submit" icon={ArrowRight}>Create Account</Button>
      </form><p className="auth-switch">Already have an account? <Button to="/login" variant="ghost" size="sm" className="auth-link">Log in</Button></p>
    </div><div className="auth-art"><img src="/register.png" alt="Minerva AI career journey dashboard" /></div>
  </Container></section>
}

export default SignupPage

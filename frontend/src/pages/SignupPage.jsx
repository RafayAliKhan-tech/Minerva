import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import Container from '../components/common/Container'
import Button from '../components/common/Button'
import api from '../api/axiosInstance'

function SocialButton({ children, onClick, ariaLabel }) { return <button type="button" onClick={onClick} aria-label={ariaLabel} className="auth-social-button">{children}</button> }

function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [agree, setAgree] = useState(true)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) { alert('Passwords do not match'); return }
    try {
      const res = await api.post('/api/auth/registeruser', { userName: fullName, Email: email, Password: password })
      const payload = res.data || {}
      if (res.status >= 400 || payload?.status === 'error') { alert(payload.message || 'Registration failed'); return }
      alert('Account created successfully')
    } catch (error) {
      console.error('Signup error:', error)
      const resp = error?.response
      if (resp?.data?.message) alert(resp.data.message)
      else if (resp) alert(`Registration failed (${resp.status} ${resp.statusText})`)
      else alert(error?.message || 'Something went wrong')
    }
  }

  return <section className="auth-stage"><Container className="auth-stage-inner">
    <div className="auth-form-column"><p className="auth-eyebrow">Create your account</p><h1 className="auth-title">Start Your AI Career<br /><span>Journey in CS</span></h1><p className="auth-description">Join Minerva and get AI-powered guidance to discover, plan,<br className="hidden sm:block" /> and grow your future in Computer Science.</p>
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-input"><UserRound /><input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" /></label>
        <label className="auth-input"><Mail /><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" /></label>
        <label className="auth-input"><LockKeyhole /><input required type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create password" /><button type="button" onClick={() => setShowPwd(!showPwd)} aria-label={showPwd ? 'Hide password' : 'Show password'}>{showPwd ? <EyeOff /> : <Eye />}</button></label>
        <label className="auth-input"><LockKeyhole /><input required type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" /></label>
        <div className="auth-options"><label><input id="agree" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></label></div>
        <Button type="submit" variant="light" size="lg" className="auth-submit" icon={ArrowRight}>Create Account</Button>
        <div className="auth-divider"><span>or continue with</span></div><div className="auth-socials"><SocialButton ariaLabel="Sign up with Google" onClick={() => alert('Google signup')}><span className="google-mark">G</span> Google</SocialButton><SocialButton ariaLabel="Sign up with LinkedIn" onClick={() => alert('LinkedIn signup')}><span className="social-mark">in</span> LinkedIn</SocialButton><SocialButton ariaLabel="Sign up with GitHub" onClick={() => alert('GitHub signup')}><span className="social-mark">GH</span> GitHub</SocialButton></div>
      </form><p className="auth-switch">Already have an account? <Button to="/login" variant="ghost" size="sm" className="auth-link">Log in</Button></p>
    </div><div className="auth-art"><img src="/register.png" alt="Minerva AI career journey dashboard" /></div>
  </Container></section>
}

export default SignupPage

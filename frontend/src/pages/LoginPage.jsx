import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/common/Container'
import Button from '../components/common/Button'
import api from '../api/axiosInstance'
import { useAuth } from '../auth/AuthContext'

const categoryOptions = [
  { key: 'exploring', title: "I'm Exploring", description: 'Just browsing career options and discovering what fits you best.' },
  { key: 'career', title: 'I Have a Career in Mind', description: 'You know your direction and want AI help to sharpen the path.' },
  { key: 'jobhunting', title: "I'm Job Hunting", description: 'You need fast opportunities, market-aligned skills, and interview prep.' },
]

function SocialButtons() {
  return <div className="auth-socials"><button type="button"><span className="google-mark">G</span> Google</button><button type="button"><span className="social-mark">in</span> LinkedIn</button><button type="button"><span className="social-mark">GH</span> GitHub</button></div>
}

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loginSucceeded, setLoginSucceeded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('exploring')
  const navigate = useNavigate()
  const { establishSession, hasCompletedOnboarding, completeOnboarding } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/api/auth/loginuser', { Email: email, Password: password })
      const payload = res.data || {}
      let token = null
      if (payload.token) token = payload.token
      else if (payload.data && payload.data.token) token = payload.data.token
      else if (payload.accessToken) token = payload.accessToken
      else if (typeof payload.data === 'string') token = payload.data
      if (!token) { alert(payload.message || 'Invalid email or password'); return }
      const user = payload.user || payload.data?.user || payload.profile || payload.data?.profile || { email }
      const explicitlyNew = payload.isNewUser ?? payload.data?.isNewUser ?? payload.newUser ?? payload.data?.newUser
      establishSession(token, user, remember)
      if (explicitlyNew === false || (!explicitlyNew && hasCompletedOnboarding(email))) {
        navigate('/dashboard', { replace: true })
      } else {
        setLoginSucceeded(true)
      }
    } catch (error) {
      console.error('Login error:', error)
      const resp = error?.response
      if (resp?.data?.message) alert(resp.data.message)
      else if (resp) alert(`Login failed (${resp.status} ${resp.statusText})`)
      else alert(error?.message || 'Unable to connect to server')
    }
  }

  const handleContinue = () => {
    setLoginSucceeded(false)
    completeOnboarding(email)
    const targetRoute = { exploring: '/explore/assessment/activity/1', career: '/explore/domain-selection', jobhunting: '/explore/resume' }[selectedCategory]
    navigate(targetRoute)
  }

  return <section className="auth-stage"><Container className="auth-stage-inner">
    <div className="auth-form-column">
      <p className="auth-eyebrow">Welcome back</p>
      <h1 className="auth-title">Log In to Continue<br /><span>Your AI Career Journey</span></h1>
      <p className="auth-description">Access your personalized roadmap, skill insights,<br className="hidden sm:block" /> and job matches — all in one place.</p>
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-input"><UserRound /><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" /></label>
        <label className="auth-input"><LockKeyhole /><input required type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" /><button type="button" onClick={() => setShowPwd(!showPwd)} aria-label={showPwd ? 'Hide password' : 'Show password'}>{showPwd ? <EyeOff /> : <Eye />}</button></label>
        <div className="auth-options"><label><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me</label><a href="#">Forgot password?</a></div>
        <Button type="submit" variant="light" size="lg" className="auth-submit" icon={ArrowRight}>Log In</Button>
      </form>
      <div className="auth-divider"><span>or continue with</span></div><SocialButtons />
      <p className="auth-switch">Don't have an account? <Button to="/signup" variant="ghost" size="sm" className="auth-link">Create account</Button></p>
    </div>
    <div className="auth-art"><img src="/login.png" alt="Minerva career guidance dashboard" /></div>
  </Container>{loginSucceeded && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111]/70 px-4 py-10 backdrop-blur-sm"><div className="w-full max-w-2xl rounded-2xl border border-[#444] bg-[#202020] p-8 text-white shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d7c4ae]">Login Successful</p><h2 className="mt-3 text-3xl font-semibold">Choose your journey</h2><p className="mt-3 text-sm leading-relaxed text-[#b5b5b5]">Select the path that best fits your current goals and Minerva will tailor the next steps.</p></div><button type="button" onClick={() => setLoginSucceeded(false)} className="rounded-full border border-[#555] px-3 py-2 text-sm text-[#d2d2d2]">Close</button></div><div className="mt-8 grid gap-4 sm:grid-cols-3">{categoryOptions.map((option) => <button key={option.key} type="button" onClick={() => setSelectedCategory(option.key)} className={`rounded-xl border px-5 py-6 text-left ${selectedCategory === option.key ? 'border-[#d7c4ae] bg-[#3a3631]' : 'border-[#444] bg-[#292929]'}`}><p className="text-base font-semibold">{option.title}</p><p className="mt-2 text-sm text-[#b5b5b5]">{option.description}</p></button>)}</div><div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => setLoginSucceeded(false)} className="rounded-full border border-[#555] px-5 py-3 text-sm font-semibold text-[#d2d2d2]">Choose later</button><button type="button" onClick={handleContinue} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#1a1a1a]">Continue as {categoryOptions.find((option) => option.key === selectedCategory)?.title}</button></div></div></div>}</section>
}

export default LoginPage

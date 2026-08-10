import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/common/Container'
import Button from '../components/common/Button'
import { heroImageUrl } from '../assets'

const categoryOptions = [
  {
    key: 'exploring',
    title: "I'm Exploring",
    description: 'Just browsing career options and discovering what fits you best.',
  },
  {
    key: 'career',
    title: 'I Have a Career in Mind',
    description: 'You know your direction and want AI help to sharpen the path.',
  },
  {
    key: 'jobhunting',
    title: "I'm Job Hunting",
    description: 'You need fast opportunities, market-aligned skills, and interview prep.',
  },
]

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loginSucceeded, setLoginSucceeded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('exploring')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(
        'https://localhost:7000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Invalid email or password')
        return
      }

      localStorage.setItem('token', data.token)

      setLoginSucceeded(true)

    } catch (error) {
      console.log(error)
      alert('Unable to connect to server')
    }
  }


  const handleContinue = () => {
    setLoginSucceeded(false)
    const targetRoute = {
      exploring: '/explore/assessment/activity/1',
      career: '/explore/domain-selection',
      jobhunting: '/explore/resume',
    }[selectedCategory]

    navigate(targetRoute)
  }

  return (
    <Container as="section" className="py-16">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
        <div className="mx-auto w-full max-w-xl">
          <span className="inline-flex rounded-full bg-orange-pill px-4 py-2 text-sm font-semibold text-orange">
            Welcome back
          </span>
          <h1 className="mt-6 text-4xl font-display font-semibold leading-tight text-brown sm:text-5xl">
            Sign in and continue your AI-powered career journey
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brown-light">
            Access your personalized recommendations, progress dashboard, and career path guidance with Minerva.
          </p>

          <div className="mt-10 rounded-[2rem] border border-beige-border bg-white/95 p-8 shadow-[0_24px_80px_-40px_rgba(113,63,18,0.35)] sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-brown">Email address</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-beige-border bg-cream/80 px-4 py-3 text-sm text-brown placeholder:text-brown-light focus:outline-none focus:ring-2 focus:ring-orange/20"
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-medium text-brown">
                  <span>Password</span>
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="text-brown-light hover:text-orange"
                  >
                    {showPwd ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    required
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-beige-border bg-cream/80 px-4 py-3 pr-12 text-sm text-brown placeholder:text-brown-light focus:outline-none focus:ring-2 focus:ring-orange/20"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brown/70">
                    {showPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-brown-light">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-beige-border text-brown focus:ring-orange"
                  />
                  Remember me
                </label>
                <a href="#" className="text-sm font-medium text-orange hover:underline">
                  Forgot password?
                </a>
              </div>
              <Button type="submit" variant="dark" size="lg" className="w-full">
                Log In
              </Button>
            </form>

            <div className="mt-6 border-t border-beige-border pt-5 text-sm text-brown-light">
              Don’t have an account?{' '}
              <Button to="/signup" variant="ghost" size="sm" className="!px-0 text-brown hover:text-orange">
                Create account
              </Button>
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-md">
          <div className="absolute -left-8 top-6 h-36 w-36 rounded-full bg-orange-pill/25 blur-2xl" />
          <div className="rounded-[2rem] border border-beige-border bg-cream/90 p-6 shadow-float">
            <div className="mb-6 rounded-3xl bg-white/90 p-4 text-sm text-brown-light shadow-sm">
              <p className="font-semibold text-brown">Career confidence starts here</p>
              <p className="mt-2 leading-relaxed">
                Track progress, discover AI-suggested roles, and stay on course with curated learning paths.
              </p>
            </div>
            <img
              src={heroImageUrl}
              alt="Student working on a laptop"
              className="w-full rounded-[1.75rem] object-cover shadow-2xl"
            />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/95 p-4 text-sm text-brown shadow-sm">
                <p className="font-semibold text-brown">AI-curated</p>
                <p className="mt-2 text-brown-light">Pathway matches</p>
              </div>
              <div className="rounded-3xl bg-white/95 p-4 text-sm text-brown shadow-sm">
                <p className="font-semibold text-brown">Fast onboarding</p>
                <p className="mt-2 text-brown-light">Ready in minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loginSucceeded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brown/30 px-4 py-10 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2rem] border border-beige-border bg-white/95 p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange">Login Successful</p>
                <h2 className="mt-3 text-3xl font-semibold text-brown">Choose your journey</h2>
                <p className="mt-3 text-sm leading-relaxed text-brown-light">
                  Select the path that best fits your current goals and Minerva will tailor the next steps.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLoginSucceeded(false)}
                className="rounded-full border border-beige-border bg-cream px-3 py-2 text-sm text-brown transition-colors hover:bg-cream-light"
              >
                Close
              </button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {categoryOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setSelectedCategory(option.key)}
                  className={`rounded-3xl border px-5 py-6 text-left transition-all ${selectedCategory === option.key
                    ? 'border-orange bg-orange-pill/20 shadow-lg'
                    : 'border-beige-border bg-white/80 hover:border-orange/70 hover:bg-cream'
                    }`}
                >
                  <p className="text-base font-semibold text-brown">{option.title}</p>
                  <p className="mt-2 text-sm text-brown-light">{option.description}</p>
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setLoginSucceeded(false)}
                className="inline-flex items-center justify-center rounded-full border border-beige-border bg-cream px-5 py-3 text-sm font-semibold text-brown transition-colors hover:bg-cream-light"
              >
                Choose later
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="inline-flex items-center justify-center rounded-full bg-orange px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange/90"
              >
                Continue as {categoryOptions.find((option) => option.key === selectedCategory)?.title}
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  )
}

export default LoginPage

import { useState } from 'react'
import Container from '../components/common/Container'
import Button from '../components/common/Button'
import { Eye, EyeOff } from 'lucide-react'
import { heroImageUrl } from '../assets'

function SocialButton({ children, onClick, className = '', ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex w-full items-center justify-center gap-3 rounded-lg border border-beige-border bg-white px-4 py-2 text-sm text-brown-light transition-shadow hover:shadow-sm ${className}`}
    >
      {children}
    </button>
  )
}

function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [agree, setAgree] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault()
    // placeholder submit — integrate with API/auth later
    if (password !== confirm) {
      alert('Passwords do not match')
      return
    }
    alert(`Signing up ${fullName} — ${email}`)
  }

  return (
    <Container as="section" className="py-16">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left / Form column */}
        <div className="mx-auto w-full max-w-xl lg:col-span-6">
          <h1 className="mb-4 text-4xl font-display leading-tight text-brown">
            Create Your Account
            <br />
            <span className="text-4xl font-display text-brown">Start Your <span className="text-emerald-700">Journey</span></span>
          </h1>
          <p className="mb-8 text-sm text-brown-light">
            Join Minerva and get AI-powered guidance to discover, plan, and grow your future.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-brown">Full Name</label>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-beige-border bg-white/80 px-4 py-3 text-sm text-brown placeholder:text-brown-light focus:outline-none focus:ring-2 focus:ring-orange/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-brown">Email Address</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-beige-border bg-white/80 px-4 py-3 text-sm text-brown placeholder:text-brown-light focus:outline-none focus:ring-2 focus:ring-orange/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-brown">Password</label>
              <div className="relative">
                <input
                  required
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full rounded-lg border border-beige-border bg-white/80 px-4 py-3 pr-12 text-sm text-brown placeholder:text-brown-light focus:outline-none focus:ring-2 focus:ring-orange/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-brown">Confirm Password</label>
              <input
                required
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm your password"
                className="w-full rounded-lg border border-beige-border bg-white/80 px-4 py-3 text-sm text-brown placeholder:text-brown-light focus:outline-none focus:ring-2 focus:ring-orange/20"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="agree"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="h-4 w-4 rounded border-beige-border text-brown focus:ring-orange"
              />
              <label htmlFor="agree" className="text-sm text-brown-light">
                I agree to the <a href="#" className="text-orange underline">Terms of Service</a> and <a href="#" className="text-orange underline">Privacy Policy</a>
              </label>
            </div>

            <div>
              <Button type="submit" variant="dark" size="lg" className="w-full">
                Sign Up
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-beige-border" />
              <div className="text-sm text-brown-light">or sign up with</div>
              <div className="flex-1 border-t border-beige-border" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <SocialButton ariaLabel="Sign up with Google" onClick={() => alert('Google signup')}> 
                <img src="/google.svg" alt="Google" className="h-4 w-4" />
                Google
              </SocialButton>
              <SocialButton ariaLabel="Sign up with LinkedIn" onClick={() => alert('LinkedIn signup')}> 
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zM13.32 8.48c-2.67 0-4.32 1.45-4.32 4.39V21h4v-6.93c0-1.08.38-1.81 1.7-1.81 1.45 0 2.06.98 2.06 2.39V21h4v-7.34c0-3.7-1.98-5.42-4.64-5.42z" />
                </svg>
                LinkedIn
              </SocialButton>
              <SocialButton ariaLabel="Sign up with GitHub" onClick={() => alert('GitHub signup')}> 
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d="M12 .296a12 12 0 00-3.79 23.41c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.64.24 2.86.12 3.16.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.82.58A12 12 0 0012 .296z" />
                </svg>
                GitHub
              </SocialButton>
            </div>
          </form>
        </div>

        {/* Right / Hero image */}
        <div className="hidden lg:col-span-6 lg:block">
          <div className="relative flex items-center justify-center">
            {/* soft circular backdrop matching theme */}
            <div className="absolute -right-12 -top-6 h-[520px] w-[520px] rounded-full bg-cream/90 shadow-float" />
            <img
              src={heroImageUrl}
              alt="Hero student"
              className="relative z-20 max-w-[520px] w-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </Container>
  )
}

export default SignupPage

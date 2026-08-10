import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import Button from '../components/common/Button'
import { Clock, CheckCircle2 } from 'lucide-react'

function ExploringIntro() {
  const navigate = useNavigate()
  const [isStarting, setIsStarting] = useState(false)

  console.log('ExploringIntro component loaded')

  const handleStart = () => {
    console.log('Start button clicked, navigating to activity 1')
    setIsStarting(true)
    setTimeout(() => {
      navigate('/explore/assessment/activity/1')
    }, 300)
  }

  return (
    <AssessmentLayout
      onBack={() => navigate('/')}
      showProgress={false}
    >
      {/* Main card */}
      <div className="rounded-3xl border border-beige-border bg-white p-8 shadow-card sm:p-12 lg:p-16">
        <div className="max-w-2xl">
          {/* Title */}
          <h1 className="font-serif text-4xl font-semibold text-brown sm:text-5xl">
            You don't need to know your domain yet.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg leading-relaxed text-brown-light">
            Let's discover where your natural strengths and interests could take you.
          </p>

          {/* Info cards */}
          <div className="mt-12 space-y-4">
            {[
              {
                icon: Clock,
                label: 'Estimated time',
                value: '3 minutes',
              },
              {
                icon: CheckCircle2,
                label: 'What you\'ll get',
                value: 'Your personalized mind profile & domain matches',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-center gap-4 rounded-xl bg-cream-dark p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-pill text-orange">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brown-light">
                      {item.label}
                    </p>
                    <p className="text-base font-semibold text-brown">{item.value}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* How it works */}
          <div className="mt-12 rounded-2xl bg-orange-pill p-6">
            <h3 className="font-semibold text-brown">How it works</h3>
            <ol className="mt-4 space-y-3 text-sm text-brown-light">
              <li className="flex gap-3">
                <span className="font-bold text-orange">1.</span>
                <span>Answer 3 short interactive activities</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange">2.</span>
                <span>Minerva analyzes your thinking patterns</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange">3.</span>
                <span>Get your personalized profile and domain matches</span>
              </li>
            </ol>
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={handleStart}
              variant="dark"
              size="lg"
              disabled={isStarting}
              className="flex-1"
            >
              {isStarting ? 'Starting...' : 'Start Exploring'}
            </Button>
            <Button
              to="/"
              variant="ghost"
              size="lg"
              className="flex-1"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </AssessmentLayout>
  )
}

export default ExploringIntro

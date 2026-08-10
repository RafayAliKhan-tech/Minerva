import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import SkillBar from '../components/assessment/SkillBar'
import DomainCard from '../components/assessment/DomainCard'
import Button from '../components/common/Button'
import { generateMindProfile } from '../data/exploringActivities'
import { domains } from '../data/domainActivities'
import { Sparkles, ArrowRight } from 'lucide-react'

function ExploringResults() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    // Get responses from session storage
    const responses = JSON.parse(sessionStorage.getItem('exploringResponses') || '{}')
    const mindProfile = generateMindProfile(responses)
    setProfile(mindProfile)
  }, [])

  if (!profile) {
    return (
      <AssessmentLayout onBack={() => navigate('/')}>
        <p className="text-center text-brown-light">Loading your profile...</p>
      </AssessmentLayout>
    )
  }

  const behavioraltrait = [
    {
      name: 'Analytical Thinking',
      score: profile.analyticalThinking,
    },
    {
      name: 'Problem Solving',
      score: profile.problemSolving,
    },
    {
      name: 'Creative Thinking',
      score: profile.creativeThinking,
    },
    {
      name: 'User Thinking',
      score: profile.userThinking,
    },
  ]

  return (
    <AssessmentLayout
      onBack={() => navigate('/')}
      showProgress={false}
    >
      {/* Main card */}
      <div className="rounded-3xl border border-beige-border bg-white p-8 shadow-card sm:p-12 lg:p-16">
        <div className="max-w-3xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-serif text-4xl font-semibold text-brown sm:text-5xl">
              Here's What We Discovered About You
            </h1>
            <p className="mt-4 text-base text-brown-light">
              Based on your responses, here's your unique behavioral profile.
            </p>
          </div>

          {/* Behavioral traits */}
          <div className="mb-12 space-y-6">
            <h2 className="font-serif text-2xl font-semibold text-brown">
              Your Behavioral Profile
            </h2>
            {behavioraltrait.map((trait) => (
              <SkillBar
                key={trait.name}
                skill={trait.name}
                percentage={trait.score}
                size="md"
              />
            ))}
          </div>

          {/* Insights */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-semibold text-brown mb-6">
              Your Strongest Signals
            </h2>
            <div className="space-y-3">
              {profile.insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl border border-beige-border bg-cream-dark p-4"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-journey-green text-journey-green-dark mt-0.5">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <p className="text-base text-brown-light">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mb-12 h-px bg-beige-border" />

          {/* Potential domains */}
          <div>
            <h2 className="font-serif text-2xl font-semibold text-brown mb-6">
              Potential CS Domains
            </h2>
            <div className="space-y-4">
              {profile.potentialDomains.map((domainMatch) => {
                const domain = domains.find((d) => d.name === domainMatch.domain)
                return (
                  <div
                    key={domainMatch.domain}
                    className="flex items-center justify-between rounded-xl border border-beige-border bg-cream-dark p-4"
                  >
                    <div className="flex items-center gap-4">
                      {domain && domain.icon && (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-pill text-orange">
                          {<domain.icon className="h-6 w-6" aria-hidden="true" />}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-brown">{domainMatch.domain}</p>
                        <p className="text-xs text-brown-light">Based on your signals</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange">{domainMatch.match}%</p>
                      <p className="text-xs text-brown-light">Match</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Info note */}
          <div className="mt-12 rounded-2xl bg-orange-pill p-6">
            <p className="text-sm text-brown">
              <span className="font-semibold">Note:</span> These are potential matches based on your behavioral signals. This is not a definitive diagnosis, but rather indicators of where your strengths might naturally lead you.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Button
              to="/explore/domain-selection"
              variant="dark"
              size="lg"
              icon={ArrowRight}
              className="flex-1"
            >
              Explore a Domain
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

export default ExploringResults

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import SkillBar from '../components/assessment/SkillBar'
import Button from '../components/common/Button'
import { domains, generateDomainResult } from '../data/domainActivities'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

function DomainResults() {
  const { domainId } = useParams()
  const navigate = useNavigate()
  const [domainData, setDomainData] = useState(null)
  const [results, setResults] = useState(null)

  useEffect(() => {
    const domain = domains.find((d) => d.id === domainId)
    setDomainData(domain)

    const responses = JSON.parse(sessionStorage.getItem('domainResponses') || '{}')
    const mockResults = generateDomainResult(domainId, responses)
    setResults(mockResults)
  }, [domainId])

  if (!domainData || !results) {
    return (
      <AssessmentLayout onBack={() => navigate('/explore/domain-selection')}>
        <p className="text-center text-brown-light">Loading results...</p>
      </AssessmentLayout>
    )
  }

  const DomainIcon = domainData.icon

  return (
    <AssessmentLayout onBack={() => navigate('/explore/domain-selection')} showProgress={false}>
      <div className="rounded-3xl border border-beige-border bg-white p-8 shadow-card sm:p-12 lg:p-16">
        <div className="max-w-3xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-pill text-orange">
              <DomainIcon className="h-8 w-8" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-semibold text-brown sm:text-4xl">
                Your {domainData.name} Fit
              </h1>
              <p className="mt-2 text-sm text-brown-light">Domain assessment results</p>
            </div>
          </div>

          <div className="mb-8 h-px bg-beige-border" />

          <div className="mb-12 rounded-2xl border border-orange-pill bg-orange-pill/30 p-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-orange">
                Your {domainData.name} Fit
              </p>
              <p className="mt-4 font-serif text-6xl font-bold text-orange">
                {results.domainFitPercentage}%
              </p>
              <p className="mt-4 text-base text-brown-light">{results.insight}</p>
            </div>
          </div>

          <div className="mb-12 space-y-6">
            <h2 className="font-serif text-2xl font-semibold text-brown">Your {domainData.name} Strengths</h2>
            {results.scores.map((score) => (
              <SkillBar
                key={score.name}
                skill={score.name}
                percentage={score.score}
                size="md"
              />
            ))}
          </div>

          <div className="mb-12">
            <h2 className="font-serif text-2xl font-semibold text-brown mb-6">Your Strengths</h2>
            <div className="space-y-3">
              {results.strengths.map((strength, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl border border-journey-green bg-journey-green/20 p-4"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-journey-green-dark text-white mt-0.5">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <p className="text-base text-brown">{strength}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-serif text-2xl font-semibold text-brown mb-6">
              Skills You Should Strengthen
            </h2>
            <div className="space-y-3">
              {results.areasToImprove.map((area, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl border border-orange-pill bg-orange-pill/30 p-4"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange text-white mt-0.5 text-sm font-bold">
                    ⚠
                  </div>
                  <p className="text-base text-brown">{area}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12 rounded-2xl bg-orange-pill p-6">
            <p className="text-sm text-brown">
              <span className="font-semibold">Next Step:</span> Build your roadmap based on your technical fit and skill gap.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              to="/explore/skill-gap"
              variant="dark"
              size="lg"
              icon={ArrowRight}
              className="flex-1"
            >
              Build My Roadmap
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

export default DomainResults

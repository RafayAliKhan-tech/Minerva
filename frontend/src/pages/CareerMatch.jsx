import { useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import DomainCard from '../components/assessment/DomainCard'
import Button from '../components/common/Button'
import { Code2, Layout, Database, ArrowRight } from 'lucide-react'

const careerMatches = [
  {
    id: 'frontend',
    icon: Layout,
    name: 'Frontend Developer',
    description: 'Build user interfaces and web applications',
    match: 89,
  },
  {
    id: 'fullstack',
    icon: Code2,
    name: 'Full Stack Developer',
    description: 'Work with both frontend and backend technologies',
    match: 78,
  },
  {
    id: 'ui-developer',
    icon: Database,
    name: 'UI/UX Developer',
    description: 'Bridge design and development',
    match: 73,
  },
]

function CareerMatch() {
  const navigate = useNavigate()

  const handleSelectCareer = (careerId) => {
    sessionStorage.setItem('selectedCareer', careerId)
    navigate(`/explore/resume/skill-gap/${careerId}`)
  }

  return (
    <AssessmentLayout onBack={() => navigate('/explore/resume/insights')} showProgress={false}>
      <div className="rounded-3xl border border-beige-border bg-white p-8 shadow-card sm:p-12 lg:p-16">
        <div className="max-w-3xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-serif text-4xl font-semibold text-brown sm:text-5xl">
              Where Your Current Skills Can Take You
            </h1>
            <p className="mt-4 text-base text-brown-light">
              Based on your resume, these careers align well with your experience
            </p>
          </div>

          {/* Career cards */}
          <div className="mb-12 space-y-4">
            {careerMatches.map((career) => (
              <div
                key={career.id}
                className="group flex flex-col gap-4 rounded-2xl border-2 border-beige-border bg-white p-6 hover:border-orange/40 hover:shadow-md transition-all duration-200 cursor-pointer sm:p-8"
                onClick={() => handleSelectCareer(career.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-pill text-orange mt-1">
                      <career.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-brown">
                        {career.name}
                      </h3>
                      <p className="mt-2 text-sm text-brown-light">{career.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange text-lg">{career.match}%</p>
                    <p className="text-xs text-brown-light">Match</p>
                  </div>
                </div>

                {/* Matching skills preview */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brown-light">
                    Matching skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-journey-green px-3 py-1 text-xs font-medium text-journey-green-dark">
                      ✓ HTML
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-journey-green px-3 py-1 text-xs font-medium text-journey-green-dark">
                      ✓ CSS
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-journey-green px-3 py-1 text-xs font-medium text-journey-green-dark">
                      ✓ JavaScript
                    </span>
                  </div>
                </div>

                {/* Missing skills preview */}
                <div className="space-y-2 border-t border-beige-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brown-light">
                    Skills to learn
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-pill px-3 py-1 text-xs font-medium text-orange">
                      ⚠ React
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-pill px-3 py-1 text-xs font-medium text-orange">
                      ⚠ TypeScript
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-sm font-medium text-brown group-hover:text-orange transition-colors">
                    View Skill Gap <ArrowRight className="inline h-4 w-4 ml-1" />
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Info note */}
          <div className="mb-12 rounded-2xl bg-orange-pill p-6">
            <p className="text-sm text-brown">
              <span className="font-semibold">Tip:</span> Select a career to see a detailed skill
              gap analysis and build your personalized learning roadmap.
            </p>
          </div>

          {/* CTA */}
          <Button to="/" variant="ghost" size="lg" className="w-full">
            Back to Home
          </Button>
        </div>
      </div>
    </AssessmentLayout>
  )
}

export default CareerMatch

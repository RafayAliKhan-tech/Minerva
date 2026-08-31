import { useLocation } from 'react-router-dom'
import Container from '../components/common/Container'
import Button from '../components/common/Button'
import { MapPin, Sparkles, Briefcase } from 'lucide-react'

const cards = [
  {
    icon: Sparkles,
    title: 'Personalized Path',
    description: 'AI analyzes your strengths and preferences to recommend the best fit.',
  },
  {
    icon: Briefcase,
    title: 'Job Ready',
    description: 'Match with roles, skills, and interview prep tailored to your goals.',
  },
  {
    icon: MapPin,
    title: 'Next Steps',
    description: 'A guided roadmap with milestones for every stage of your journey.',
  },
]

function ExplorePage() {
  const location = useLocation()
  const category = location.state?.category || 'exploring'

  const categoryLabels = {
    exploring: "I'm Exploring",
    career: 'I Have a Career in Mind',
    jobhunting: "I'm Job Hunting",
  }

  const categoryHeadlines = {
    exploring: 'You don’t need to know your domain yet.',
    career: 'Choose the career path you want to explore.',
    jobhunting: 'Start with your resume to unlock tailored questions.',
  }

  const categoryDescriptions = {
    exploring:
      "Let's discover where your natural strengths and interests could take you.",
    career:
      'Pick the career you want to develop, then answer domain-specific challenges to validate your fit.',
    jobhunting:
      'Upload your resume first and Minerva will use it to shape a job-ready assessment.',
  }

  const startPaths = {
    exploring: '/explore/assessment/activity/1',
    career: '/explore/domain-selection',
    jobhunting: '/explore/resume',
  }

  return (
    <Container as="section" className="py-16">
      <div className="rounded-[2rem] border border-beige-border bg-cream/90 p-8 shadow-float sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-orange-pill px-4 py-2 text-sm font-semibold text-orange">
              {categoryLabels[category]}
            </span>
            <h1 className="mt-6 text-4xl font-display font-semibold text-brown sm:text-5xl">
              {categoryHeadlines[category]}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-brown-light">
              {categoryDescriptions[category]}
            </p>
          </div>
          <div className="rounded-[2rem] bg-white/95 p-5 shadow-lg">
            <p className="text-sm font-semibold text-brown">Current focus</p>
            <p className="mt-2 text-sm text-brown-light">{categoryLabels[category]}</p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} className="rounded-[2rem] border border-beige-border bg-white/95 p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-orange-pill text-orange">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-brown">{card.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-brown-light">{card.description}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-beige-border bg-brown/5 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brown">How this works</h3>
            <p className="mt-3 text-sm text-brown-light">
              Each path is tailored to your choice: self-discovery, domain-specific questions, or resume-based readiness.
            </p>
          </div>
          <div className="rounded-[2rem] border border-beige-border bg-white/95 p-6">
            <p className="text-sm font-semibold text-brown">Real questions</p>
            <p className="mt-2 text-sm text-brown-light">Interactive tasks adapt to your selected goal and profile.</p>
          </div>
          <div className="rounded-[2rem] border border-beige-border bg-white/95 p-6">
            <p className="text-sm font-semibold text-brown">Clear next step</p>
            <p className="mt-2 text-sm text-brown-light">Start from the right entry page for the flow you chose.</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button to="/" variant="ghost" size="md" className="text-brown hover:text-orange">
            Back to Landing
          </Button>
          <Button to={startPaths[category]} variant="dark" size="md">
            {category === 'exploring' ? 'Start Exploring' : category === 'career' ? 'Choose my career' : 'Upload my resume'}
          </Button>
        </div>
      </div>
    </Container>
  )
}

export default ExplorePage

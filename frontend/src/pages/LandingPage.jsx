import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/landing/Hero'
import Container from '../components/common/Container'
import { useAuth } from '../auth/AuthContext'

const pathCards = [
  {
    id: 'exploring',
    title: "I'm exploring",
    text: 'Discover career directions that fit your interests, strengths, and ambitions.',
    route: '/explore/assessment',
    guestRoute: '/signup',
  },
  {
    id: 'career',
    title: 'I have a career in mind',
    text: 'Turn a target role into a focused learning and development plan.',
    route: '/explore/domain-selection',
    guestRoute: '/signup',
  },
  {
    id: 'job',
    title: "I'm job hunting",
    text: 'Connect your current skills to roles and a practical next step.',
    route: '/explore/resume',
    guestRoute: '/signup',
  },
]

const steps = [
  {
    number: '01',
    title: 'Understand your profile',
    description: 'Reflect on interests, strengths, skills, and goals.',
  },
  {
    number: '02',
    title: 'See your options',
    description: 'Explore career directions that fit your context.',
  },
  {
    number: '03',
    title: 'Find your gaps',
    description: 'Learn which skills move you closer to target roles.',
  },
  {
    number: '04',
    title: 'Plan your next move',
    description: 'Leave with priorities for learning and action.',
  },
]

function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const openPath = (card) => {
    navigate(isAuthenticated ? card.route : card.guestRoute, {
      state: isAuthenticated ? undefined : { intent: card.id },
    })
  }

  return (
    <div className="landing-page-shell">
      <Hero />

      <section id="paths" className="section-block alt">
        <Container>
          <div className="section-intro">
            <span className="eyebrow">Choose your path</span>
            <h2>Where are you in your journey?</h2>
            <p>
              Start from where you are today. Minerva adapts guidance to your situation — not a
              generic checklist.
            </p>
          </div>

          <div className="path-grid">
            {pathCards.map((card, index) => (
              <button
                key={card.id}
                type="button"
                className="path-card"
                onClick={() => openPath(card)}
              >
                <span className="path-card-index">Path 0{index + 1}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <span className="path-card-cta">
                  {isAuthenticated ? 'Continue' : 'Get started'}
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      <section id="how-it-works" className="section-block">
        <Container>
          <div className="section-intro">
            <span className="eyebrow">How it works</span>
            <h2>A simple path from clarity to action</h2>
            <p>From self-discovery to a practical plan — guided at every step.</p>
          </div>

          <div className="steps-list">
            {steps.map((step) => (
              <article key={step.number} className="step-card">
                <div className="num">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}

export default LandingPage

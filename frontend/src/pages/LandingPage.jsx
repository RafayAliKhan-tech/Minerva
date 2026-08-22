import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import Hero from '../components/landing/Hero'
import GlobalCinematicBackground from '../components/layout/GlobalCinematicBackground'
import { useCinematicMotion } from '../hooks/useCinematicMotion'

const pathCards = [
  {
    id: 'exploring',
    title: "I'm Exploring",
    text: 'Explore career directions that fit your interests, strengths, and ambitions.',
    image: '/card-1.png',
  },
  {
    id: 'career',
    title: 'I Have a Career in Mind',
    text: 'Turn a career goal into a focused learning and development plan.',
    image: '/card-2.png',
  },
  {
    id: 'job',
    title: "I'm Job Hunting",
    text: 'See how your current skills connect to roles and opportunities ahead.',
    image: '/card-3.png',
  },
]

const roadmap = [
  {
    number: '01',
    title: 'Understand your profile',
    description: 'Reflect on your interests, strengths, skills, and goals.',
    icon: 'clipboard',
  },
  {
    number: '02',
    title: 'See your options',
    description: 'Use that context to explore career directions that fit.',
    icon: 'brain',
  },
  {
    number: '03',
    title: 'Find your gaps',
    description: 'Understand which skills can move you closer to your target roles.',
    icon: 'chart',
  },
  {
    number: '04',
    title: 'Plan your next move',
    description: 'Leave with practical priorities for learning, growth, and action.',
    icon: 'map',
  },
]

function LandingPage() {
  const rootRef = useRef(null)
  useCinematicMotion(rootRef)

  return (
    <div ref={rootRef} className="landing-page-shell hero-scene">
      <GlobalCinematicBackground />
      <Hero />

      <section id="features" className="path-section">
        <div className="container">
          <div className="path-intro">
            <span className="eyebrow" data-scramble-text="CHOOSE YOUR PATH">
              Choose your path
            </span>
            <h2 data-split-text="chars">Where Are You in Your Journey?</h2>
            <p data-blur-reveal>
              Start with where you are today. Minerva helps you choose a direction based on your
              own profile and goals.
            </p>
          </div>

          <div className="path-grid">
            {pathCards.map((card, index) => (
              <article key={card.id} className="path-card tilt-card">
                <div className="path-card-photo">
                  <img src={card.image} alt="" />
                </div>
                <div className="path-card-body">
                  <h3 data-split-text="words">{card.title}</h3>
                  <p>{card.text}</p>
                  <div className="path-arrow" aria-hidden="true">
                    <ArrowRight size={16} strokeWidth={2} />
                  </div>
                </div>
                <span className="card-index">0{index + 1}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="journey-section">
        <div className="container journey-inner">
          <div className="journey-copy">
            <span className="eyebrow journey-eyebrow">✦&nbsp; HOW IT WORKS</span>
            <h2 data-split-text="chars">
              A Simple 4-Step Journey to Your Perfect Career
            </h2>
            <p className="journey-description">
              From self-discovery to smart decisions.<br />
              Minerva guides you at every step.
            </p>
          </div>

          <div className="journey-visual">
            <div className="journey-art-wrap tilt-card" aria-hidden="true">
              <div className="journey-art-halo" />
              <img className="journey-art" src="/section-landing.png" alt="" />
            </div>
          </div>

          <div id="roadmap" className="journey-list">
            {roadmap.map((item) => (
              <div key={item.number} className="journey-item">
                <div className="step-badge">
                  <span className="step-icon">{renderIcon(item.icon)}</span>
                </div>
                <div className="step-text">
                  <h3>{item.title}</h3>
                  <p data-blur-reveal>{item.description}</p>
                </div>
                <span className="step-number">{item.number}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

function renderIcon(icon) {
  const common = { size: 18, strokeWidth: 1.8 }

  switch (icon) {
    case 'clipboard':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={common.strokeWidth} {...common}><path d="M9 4h6m-6 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m-6 0h6" /><path d="M9 8h6M9 12h6M9 16h4" /></svg>
    case 'brain':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={common.strokeWidth} {...common}><path d="M9 5a3 3 0 0 0-3 3v1.5c0 .8.3 1.5.9 2.1.5.5 1 .8 1.5 1.1V13c0 .6.4 1 1 1h.5a1 1 0 0 1 1 1v1.5c0 .6-.4 1-1 1h-1.5A3.5 3.5 0 0 1 6 13.5V8a5 5 0 0 1 10 0v5.5A3.5 3.5 0 0 1 12.5 17H11a1 1 0 0 1-1-1v-1.5a1 1 0 0 1 1-1h.5c.6-.3 1.1-.6 1.6-1.1A3 3 0 0 0 15 9.5V8a3 3 0 0 0-3-3h-1.5A3.5 3.5 0 0 0 9 5Z" /><path d="M10 7.5h4M10 10.5h4M12 13v3" /></svg>
    case 'chart':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={common.strokeWidth} {...common}><path d="M4 18V6m0 12h16m-10-6V8m4 10V4m4 14v-8" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 18h16" /></svg>
    case 'map':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={common.strokeWidth} {...common}><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z" strokeLinejoin="round" /><path d="M9 4v13m6-10v13" /></svg>
    default:
      return null
  }
}

export default LandingPage

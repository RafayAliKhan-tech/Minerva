import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../common/Container'

function Hero() {
  return (
    <section className="hero-section">
      <Container>
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow">AI career compass</div>
            <h1 className="hero-title">
              Minerva
              <span className="muted">Find direction. Build your next step.</span>
            </h1>
            <p className="hero-subtitle">
              Understand your strengths, interests, and goals — then turn that clarity into career
              options, skill gaps, and an achievable plan.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="btn btn-secondary btn-lg">
                Start your journey
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a href="/#paths" className="btn btn-outline btn-lg">
                Choose a path
              </a>
            </div>
          </div>

          <aside className="hero-panel" aria-label="How Minerva works">
            <p className="eyebrow">What you get</p>
            <h2 style={{ margin: 0, fontSize: '1.35rem' }}>Clarity in four moves</h2>
            <div className="hero-flow">
              {[
                'Map your profile',
                'Explore fitting roles',
                'Spot skill gaps',
                'Follow a focused plan',
              ].map((item, index) => (
                <div className="hero-flow-item" key={item}>
                  <i>{index + 1}</i>
                  {item}
                </div>
              ))}
            </div>
            <div className="hero-stat-grid">
              <div className="hero-stat">
                <strong>3</strong>
                <span>Paths</span>
              </div>
              <div className="hero-stat">
                <strong>AI</strong>
                <span>Guidance</span>
              </div>
              <div className="hero-stat">
                <strong>1</strong>
                <span>Roadmap</span>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  )
}

export default Hero

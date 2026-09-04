import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="hero-section hero-scroll-shell">
      <div className="hero-scene-layers">
        <div className="hero-copy-glow" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <div className="hero-badge">
              <span aria-hidden="true">✦</span>
              AI Career Compass
            </div>
            <h1 className="hero-title">
              <span className="hero-title-line">Find your <span className="hero-title-break">direction.</span></span>
              <span className="hero-title-line hero-title-muted">Build your <span className="hero-title-break">future.</span></span>
            </h1>

            <p className="hero-subtitle">
              Minerva helps you understand your strengths, interests, skills, and goals, then turn
              that clarity into career options and an achievable next step.
            </p>

            <div className="hero-actions">
              <Link to="/signup" className="primary-cta">
                Start Your Journey
                <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-visual-glow" aria-hidden="true" />
            <div className="hero-visual-arc" aria-hidden="true" />
            <div className="hero-transform">
              <div className="hero-platform-glow" aria-hidden="true" />
              <div className="hero-floor-fade" aria-hidden="true" />
              <img
                className="hero-character"
                src="/laptop.png"
                alt="Minerva career dashboard showing skills and job matches"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

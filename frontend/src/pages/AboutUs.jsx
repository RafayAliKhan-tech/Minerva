import { ArrowRight, Compass, HeartHandshake, Sparkles, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/common/Container'

const principles = [
  { icon: Compass, title: 'Clarity before pressure', text: 'Career decisions become easier when your strengths and options are visible in one calm place.' },
  { icon: Target, title: 'Progress that feels practical', text: 'Every recommendation turns into a next step you can understand, start, and measure.' },
  { icon: HeartHandshake, title: 'Built around your context', text: 'Your interests, assessments, resume, and goals shape guidance that feels personal.' },
]

function AboutUs() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <Container>
          <p className="dashboard-kicker">ABOUT MINERVA</p>
          <h1>A clearer way to choose what comes next.</h1>
          <p className="about-lede">Minerva is an AI career companion for students and early-career builders who want direction without being boxed into a single answer.</p>
          <Link to="/signup" className="dashboard-primary-action">Start discovering <ArrowRight size={16} /></Link>
        </Container>
      </section>
      <section className="about-principles">
        <Container>
          <div className="about-section-intro"><div><p className="dashboard-kicker">OUR APPROACH</p><h2>Useful guidance, made human.</h2></div><Sparkles size={28} /></div>
          <div className="about-principle-grid">{principles.map(({ icon: Icon, title, text }) => <article key={title} className="about-principle"><Icon size={22} /><h3>{title}</h3><p>{text}</p></article>)}</div>
        </Container>
      </section>
      <section className="about-cta"><Container><h2>Your next direction can start with one honest assessment.</h2><Link to="/explore" className="dashboard-outline-action">Explore Minerva <ArrowRight size={15} /></Link></Container></section>
    </main>
  )
}

export default AboutUs

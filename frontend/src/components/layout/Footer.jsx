import { ArrowUpRight, Building2, Compass, Layers3, Sparkles } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import Logo from '../common/Logo'
import Container from '../common/Container'
import { footerLinks } from '../../data/footer'

const sectionIcons = {
  platform: Layers3,
  company: Building2,
  explore: Compass,
}

function FooterLink({ link, onAnchorClick }) {
  return (
    <Link
      to={link.href}
      onClick={(event) => onAnchorClick(event, link.href)}
      className="group inline-flex items-center gap-1.5 text-sm text-[#77736e] transition-colors hover:text-[#1A1A1A]"
    >
      {link.label}
      <ArrowUpRight
        size={13}
        strokeWidth={1.8}
        className="opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />
    </Link>
  )
}

function FooterSection({ name, links, onAnchorClick }) {
  const Icon = sectionIcons[name]
  const title = name === 'explore' ? 'Explore' : name[0].toUpperCase() + name.slice(1)

  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#272522]">
        <Icon size={14} strokeWidth={1.8} aria-hidden="true" />
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <FooterLink link={link} onAnchorClick={onAnchorClick} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function Footer({ compact = false }) {
  const location = useLocation()

  const handleAnchorClick = (event, href) => {
    if (!href.startsWith('/#') || location.pathname !== '/') return

    const target = document.getElementById(href.slice(2))
    if (!target) return

    event.preventDefault()
    target.scrollIntoView({ behavior: 'smooth' })
  }

  if (compact) {
    return (
      <footer className="auth-footer border-t border-[#E0E0E0] bg-[#F5F5F5]">
        <Container className="auth-footer-inner">
          <p>&copy; {new Date().getFullYear()} Minerva. All rights reserved.</p>
        </Container>
      </footer>
    )
  }

  return (
    <footer className="site-footer border-t border-[#dedbd6] bg-[#f5f4f1]" id="about">
      <Container className="py-12 sm:py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Logo />
            <div className="mt-5 flex items-start gap-3">
              <Sparkles size={17} className="mt-1 shrink-0 text-[#c38d66]" aria-hidden="true" />
              <p className="max-w-sm text-sm leading-7 text-[#77736e]">
                AI-powered career clarity for discovering your strengths, planning your next step,
                and growing with confidence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:gap-10">
            <FooterSection name="platform" links={footerLinks.platform} onAnchorClick={handleAnchorClick} />
            <FooterSection name="company" links={footerLinks.company} onAnchorClick={handleAnchorClick} />
            <FooterSection name="explore" links={footerLinks.explore} onAnchorClick={handleAnchorClick} />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#dedbd6] pt-6 text-xs text-[#8a857f] sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Minerva. All rights reserved.</p>
          <p>Discover. Plan. Grow.</p>
        </div>
      </Container>
    </footer>
  )
}

export default Footer

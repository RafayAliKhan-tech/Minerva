import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'
import Logo from '../common/Logo'
import Button from '../common/Button'
import Container from '../common/Container'
import { navLinks } from '../../data/navigation'

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const isActive = (link) => {
    if (link.exact) return location.pathname === link.href
    if (link.href.startsWith('/#')) return false
    return location.pathname === link.href
  }

  const handleNavClick = (href) => {
    setMobileOpen(false)
    if (href.startsWith('/#')) {
      if (location.pathname !== '/') {
        return
      }
      const id = href.replace('/#', '')
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'border-b border-beige-border/60 bg-cream/95 shadow-sm backdrop-blur-md'
          : 'bg-cream/80 backdrop-blur-sm'
      }`}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between sm:h-20" aria-label="Main navigation">
          <Logo />

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 lg:flex xl:gap-2">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.href.startsWith('/#') ? (
                  <a
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-orange xl:px-4 ${
                      isActive(link)
                        ? 'text-orange underline decoration-orange decoration-2 underline-offset-8'
                        : 'text-brown-light'
                    }`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-orange xl:px-4 ${
                      isActive(link)
                        ? 'text-orange underline decoration-orange decoration-2 underline-offset-8'
                        : 'text-brown-light'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <Button to="/login" variant="ghost" size="sm">
              Log In
            </Button>
            <Button to="/signup" variant="dark" size="sm" icon={ArrowRight}>
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-brown transition-colors hover:bg-cream-dark lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </Container>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 top-16 z-40 lg:hidden ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-brown/20 transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
        <div
          className={`absolute inset-x-0 top-0 border-b border-beige-border bg-cream px-4 py-6 shadow-lg transition-all duration-300 sm:px-6 ${
            mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.href.startsWith('/#') ? (
                  <a
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="block rounded-lg px-4 py-3 text-base font-medium text-brown-light transition-colors hover:bg-cream-dark hover:text-orange"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-cream-dark hover:text-orange ${
                      isActive(link) ? 'text-orange' : 'text-brown-light'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 border-t border-beige-border pt-6">
            <Button to="/login" variant="outline" size="md" className="w-full">
              Log In
            </Button>
            <Button to="/signup" variant="dark" size="md" icon={ArrowRight} className="w-full">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar

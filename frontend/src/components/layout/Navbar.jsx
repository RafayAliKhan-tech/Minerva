import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight, LogOut } from 'lucide-react'
import Logo from '../common/Logo'
import Button from '../common/Button'
import Container from '../common/Container'
import { navLinks } from '../../data/navigation'
import { useAuth } from '../../auth/AuthContext'
import { getDisplayName } from '../../utils/userData'

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()
  const isLanding = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setAccountOpen(false)
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

  const headerClass = isLanding
    ? scrolled || mobileOpen
      ? 'border-b border-[#E0E0E0] bg-[#F5F5F5]/92 shadow-sm backdrop-blur-md'
      : 'bg-transparent'
    : scrolled || mobileOpen
      ? 'border-b border-[#E0E0E0] bg-[#F5F5F5]/92 shadow-sm backdrop-blur-md'
      : 'bg-[#F5F5F5]/85 backdrop-blur-sm'

  const navbarTheme = isLanding && !scrolled && !mobileOpen ? 'navbar-dark' : 'navbar-light'
  const displayName = getDisplayName(user)
  const initials = displayName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'M'

  const linkClass = (active) =>
    isLanding
      ? `rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors xl:px-4 ${
          active ? 'text-[#1A1A1A]' : 'text-[#707070] hover:text-[#1A1A1A]'
        }`
      : `rounded-lg px-3 py-2 text-sm font-medium transition-colors xl:px-4 ${
          active ? 'text-[#1A1A1A]' : 'text-[#707070] hover:text-[#1A1A1A]'
        }`

  return (
    <header className={`site-navbar fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isLanding ? 'landing-navbar' : ''} ${navbarTheme} ${headerClass}`}>
      <Container>
        <nav className="flex h-16 items-center justify-between sm:h-20" aria-label="Main navigation">
          <Logo />

          <ul className="hidden items-center gap-1 lg:flex xl:gap-2">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.href.startsWith('/#') ? (
                  <a
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`nav-link ${linkClass(isActive(link))}`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link to={link.href} className={`nav-link ${linkClass(isActive(link))}`}>
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            {isAuthenticated ? (
              <div className="relative">
                <button type="button" onClick={() => setAccountOpen((open) => !open)} className="navbar-avatar flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-sm" aria-label="Open account menu" aria-expanded={accountOpen}>
                  {initials}
                </button>
                {accountOpen && <div className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-[#E0E0E0] bg-white p-2 text-[#1A1A1A] shadow-lg">
                  <div className="border-b border-[#E0E0E0] px-3 py-2"><p className="text-xs uppercase tracking-wide text-[#707070]">Signed in as</p><p className="truncate text-sm font-semibold">{displayName}</p></div>
                  <button type="button" onClick={logout} className="account-logout flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-red-50"><LogOut size={15} /> Logout</button>
                </div>}
              </div>
            ) : isLanding ? (
              <Link
                to="/signup"
                className="navbar-cta inline-flex items-center gap-2 rounded-full border border-[#E0E0E0] bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1A1A1A] shadow-[0_8px_24px_rgba(26,26,26,0.06)] transition-transform hover:-translate-y-0.5"
              >
                Get Started
                <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Button to="/login" variant="ghost" size="sm">
                  Log In
                </Button>
                <Button to="/signup" variant="light" size="sm" icon={ArrowRight}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-[#1A1A1A] transition-colors hover:bg-[#ECECEC] lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </Container>

      <div
        id="mobile-menu"
        className={`fixed inset-0 top-16 z-40 lg:hidden ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-[#1A1A1A]/20 transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
        <div
          className={`absolute inset-x-0 top-0 border-b border-[#E0E0E0] bg-[#F5F5F5] px-4 py-6 shadow-lg transition-all duration-300 sm:px-6 ${
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
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-[#707070] transition-colors hover:bg-[#ECECEC] hover:text-[#1A1A1A]"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-[#ECECEC] hover:text-[#1A1A1A] ${
                      isActive(link) ? 'text-[#1A1A1A]' : 'text-[#707070]'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 border-t border-[#E0E0E0] pt-6">
            {isAuthenticated ? <><div className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-[#1A1A1A]"><span className="navbar-avatar flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold">{initials}</span><span className="truncate">{displayName}</span></div><button type="button" onClick={logout} className="account-logout flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 text-sm font-semibold"><LogOut size={16} /> Logout</button></> : <><Button to="/login" variant="outline" size="md" className="w-full">Log In</Button><Button to="/signup" variant="light" size="md" icon={ArrowRight} className="w-full">Get Started</Button></>}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar

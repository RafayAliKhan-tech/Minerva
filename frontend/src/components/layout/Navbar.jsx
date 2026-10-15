import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight, LogOut, UserRound } from 'lucide-react'
import Logo from '../common/Logo'
import Button from '../common/Button'
import Container from '../common/Container'
import { navLinks, appNavLinks } from '../../data/navigation'
import { useAuth } from '../../auth/AuthContext'
import { getDisplayName } from '../../utils/userData'

const AUTH_ONLY = new Set(['/login', '/signup', '/forgot-password', '/reset-password'])

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()
  const isLanding = location.pathname === '/'
  const isAuthPage = AUTH_ONLY.has(location.pathname)

  useEffect(() => {
    let frameId = 0
    const onScroll = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12)
        frameId = 0
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frameId) window.cancelAnimationFrame(frameId)
    }
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

  const handleAnchor = (href) => {
    if (!href.startsWith('/#')) return
    if (location.pathname !== '/') return
    const el = document.getElementById(href.replace('/#', ''))
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const visibleLinks = isAuthenticated
    ? appNavLinks
    : isLanding
      ? navLinks
      : []

  const displayName = getDisplayName(user)
  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'M'

  return (
    <header
      className={`site-navbar${isLanding ? ' landing-navbar' : ''}${scrolled || mobileOpen ? ' is-scrolled navbar-light' : ''}`}
    >
      <Container>
        <nav className="navbar-inner" aria-label="Main navigation">
          <Logo />

          <ul className="navbar-links">
            {visibleLinks.map((link) => (
              <li key={link.label}>
                {link.href.startsWith('/#') ? (
                  <a
                    href={link.href}
                    className="nav-link"
                    onClick={() => handleAnchor(link.href)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    className={`nav-link${location.pathname === link.href ? ' is-active' : ''}`}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                <Button to="/dashboard" variant="light" size="sm">
                  Dashboard
                </Button>
                <div className="relative">
                  <button
                    type="button"
                    className="navbar-avatar"
                    aria-label="Open account menu"
                    aria-expanded={accountOpen}
                    onClick={() => setAccountOpen((open) => !open)}
                  >
                    {initials}
                  </button>
                  {accountOpen && (
                    <div className="account-menu">
                      <div className="account-menu-meta">
                        <p>Signed in as</p>
                        <p>{displayName}</p>
                      </div>
                      <Link to="/profile">
                        <UserRound size={15} /> Profile
                      </Link>
                      <Link to="/skill-profile">
                        <UserRound size={15} /> Skill profile
                      </Link>
                      <button type="button" className="account-logout" onClick={logout}>
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : isAuthPage ? (
              <>
                <Link to="/login" className="nav-link">
                  Log in
                </Link>
                <Button to="/signup" variant="secondary" size="sm" icon={ArrowRight}>
                  Get started
                </Button>
              </>
            ) : (
              <>
                <Button to="/login" variant="ghost" size="sm">
                  Log in
                </Button>
                <Button to="/signup" variant="secondary" size="sm" icon={ArrowRight}>
                  Get started
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            className="navbar-menu-btn"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </Container>

      {mobileOpen && (
        <div id="mobile-menu" className="navbar-mobile" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="navbar-mobile-panel relative">
            {visibleLinks.map((link) =>
              link.href.startsWith('/#') ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="nav-link"
                  onClick={() => {
                    handleAnchor(link.href)
                    setMobileOpen(false)
                  }}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className="nav-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="mt-3 flex flex-col gap-2 border-t border-[var(--color-border)] pt-3">
              {isAuthenticated ? (
                <>
                  <Button to="/dashboard" variant="secondary" size="md" className="w-full">
                    Dashboard
                  </Button>
                  <Button to="/profile" variant="outline" size="md" className="w-full">
                    Profile
                  </Button>
                  <button type="button" className="btn btn-ghost btn-md account-logout" onClick={logout}>
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Button to="/login" variant="outline" size="md" className="w-full">
                    Log in
                  </Button>
                  <Button to="/signup" variant="secondary" size="md" className="w-full" icon={ArrowRight}>
                    Get started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar

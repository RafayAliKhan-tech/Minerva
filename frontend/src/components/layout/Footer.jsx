import { Link, useLocation } from 'react-router-dom'
import Logo from '../common/Logo'
import Container from '../common/Container'
import { footerLinks } from '../../data/footer'
import { useAuth } from '../../auth/AuthContext'

function FooterColumn({ title, links, isAuthenticated, onAnchorClick }) {
  const visible = links.filter((link) => {
    if (link.auth && !isAuthenticated) return false
    if (link.guest && isAuthenticated) return false
    return true
  })

  if (!visible.length) return null

  return (
    <div>
      <h3>{title}</h3>
      <ul>
        {visible.map((link) => (
          <li key={link.label}>
            {link.disabled ? (
              <span className="is-disabled" title="Coming soon">
                {link.label}
              </span>
            ) : link.href.startsWith('/#') ? (
              <Link to={link.href} onClick={(event) => onAnchorClick(event, link.href)}>
                {link.label}
              </Link>
            ) : (
              <Link to={link.href}>{link.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Footer() {
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  const handleAnchorClick = (event, href) => {
    if (!href.startsWith('/#') || location.pathname !== '/') return
    const target = document.getElementById(href.slice(2))
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="site-footer" id="about">
      <Container>
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>
              AI-powered career clarity — understand your strengths, explore fitting roles, and
              move forward with a practical plan.
            </p>
          </div>
          <div className="footer-cols">
            <FooterColumn
              title="Product"
              links={footerLinks.product}
              isAuthenticated={isAuthenticated}
              onAnchorClick={handleAnchorClick}
            />
            <FooterColumn
              title="Company"
              links={footerLinks.company}
              isAuthenticated={isAuthenticated}
              onAnchorClick={handleAnchorClick}
            />
            <FooterColumn
              title="Tools"
              links={footerLinks.tools}
              isAuthenticated={isAuthenticated}
              onAnchorClick={handleAnchorClick}
            />
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Minerva. All rights reserved.</p>
          <p>Discover. Plan. Grow.</p>
        </div>
      </Container>
    </footer>
  )
}

export default Footer

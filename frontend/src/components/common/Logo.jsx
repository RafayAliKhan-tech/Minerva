import { Link } from 'react-router-dom'
import minervaLogo from '../../assets/logo/minerva-logo.png'

function Logo({ className = '', showTagline = false }) {
  return (
    <Link to="/" className={`inline-flex items-center ${className}`} aria-label="Minerva home">
      <img
        src={minervaLogo}
        alt="Minerva — Discover, Plan, Grow"
        className="h-8 w-auto object-contain sm:h-15"
      />
      {showTagline && (
        <span className="sr-only">Discover • Plan • Grow</span>
      )}
    </Link>
  )
}

export default Logo

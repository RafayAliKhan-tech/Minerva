import { Link } from 'react-router-dom'

function Logo({ className = '', compact = false }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label="Minerva home"
    >
      <span
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)] text-sm font-bold text-white"
        aria-hidden="true"
      >
        M
      </span>
      {!compact && (
        <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-ink)]">
          Minerva
        </span>
      )}
    </Link>
  )
}

export default Logo

import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

function JourneyIllustration({ type }) {
  const illustrations = {
    telescope: (
      <svg viewBox="0 0 120 120" className="h-28 w-28 sm:h-32 sm:w-32" aria-hidden="true">
        <circle cx="60" cy="60" r="50" fill="#d4e4cc" opacity="0.5" />
        <rect x="35" y="70" width="50" height="8" rx="4" fill="#3d5c3a" opacity="0.3" />
        <rect x="45" y="45" width="30" height="30" rx="15" fill="none" stroke="#3d5c3a" strokeWidth="4" />
        <line x1="60" y1="45" x2="60" y2="25" stroke="#3d5c3a" strokeWidth="3" />
        <circle cx="60" cy="22" r="4" fill="#3d5c3a" />
        <rect x="30" y="78" width="60" height="6" rx="3" fill="#3d5c3a" opacity="0.5" />
      </svg>
    ),
    compass: (
      <svg viewBox="0 0 120 120" className="h-28 w-28 sm:h-32 sm:w-32" aria-hidden="true">
        <circle cx="60" cy="60" r="50" fill="#e8ddd0" opacity="0.5" />
        <circle cx="60" cy="60" r="35" fill="none" stroke="#2d1e17" strokeWidth="2" opacity="0.3" />
        <circle cx="60" cy="60" r="28" fill="#f5ede4" stroke="#2d1e17" strokeWidth="2" />
        <polygon points="60,35 65,60 60,85 55,60" fill="#c4651a" />
        <polygon points="60,35 55,60 60,60 65,60" fill="#2d1e17" />
        <circle cx="60" cy="60" r="4" fill="#2d1e17" />
      </svg>
    ),
    backpack: (
      <svg viewBox="0 0 120 120" className="h-28 w-28 sm:h-32 sm:w-32" aria-hidden="true">
        <circle cx="60" cy="60" r="50" fill="#f4c9a0" opacity="0.4" />
        <rect x="38" y="45" width="44" height="50" rx="8" fill="#c4651a" />
        <rect x="42" y="50" width="36" height="30" rx="4" fill="#a0522d" />
        <path d="M48 45 Q60 30 72 45" fill="none" stroke="#2d1e17" strokeWidth="3" />
        <rect x="55" y="55" width="10" height="12" rx="2" fill="#2d1e17" opacity="0.3" />
        <rect x="35" y="60" width="8" height="20" rx="4" fill="#a0522d" />
        <rect x="77" y="60" width="8" height="20" rx="4" fill="#a0522d" />
      </svg>
    ),
  }

  return illustrations[type] || null
}

function JourneyCard({ journey }) {
  const Icon = journey.icon

  return (
    <Link
      to={journey.route}
      className={`group relative flex flex-col overflow-hidden rounded-3xl ${journey.bgClass} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-8`}
    >
      <div className="flex flex-1 flex-col">
        <div className="mb-6 flex items-center justify-center">
          <JourneyIllustration type={journey.illustration} />
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/60 text-brown">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold text-brown sm:text-2xl">
              {journey.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-brown-light sm:text-base">
              {journey.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <span
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-110 ${journey.buttonClass}`}
          aria-hidden="true"
        >
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
    </Link>
  )
}

export default JourneyCard

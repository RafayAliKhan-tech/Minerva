import { ArrowRight } from 'lucide-react'

function DomainCard({
  icon: Icon,
  name,
  description,
  match,
  isSelectable = false,
  isSelected = false,
  onClick,
  showMatch = false,
  matchColor = 'text-orange',
}) {
  return (
    <button
      onClick={onClick}
      disabled={isSelectable === false}
      className={`group flex flex-col gap-4 rounded-2xl border-2 p-6 text-left transition-all duration-200 sm:p-7 lg:p-8 ${
        isSelected
          ? 'border-orange bg-orange-pill/50 shadow-md'
          : 'border-beige-border bg-white hover:border-orange/40 hover:shadow-md'
      } ${isSelectable === false ? '' : 'cursor-pointer'}`}
    >
      {/* Icon */}
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-pill text-orange">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-serif text-lg font-semibold text-brown sm:text-xl">
          {name}
        </h3>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-brown-light">
            {description}
          </p>
        )}
      </div>

      {/* Match percentage or action */}
      <div className="flex items-center justify-between pt-2">
        {showMatch && match !== undefined ? (
          <span className={`font-semibold ${matchColor}`}>{match}% Match</span>
        ) : null}
        {isSelectable && (
          <ArrowRight className="h-5 w-5 text-orange transition-transform group-hover:translate-x-1" aria-hidden="true" />
        )}
      </div>
    </button>
  )
}

export default DomainCard

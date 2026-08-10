function OptionCard({
  option,
  selected,
  onClick,
  disabled = false,
  showLabel = true,
}) {
  return (
    <button
      onClick={() => !disabled && onClick(option.id)}
      disabled={disabled}
      className={`group relative flex flex-col gap-4 rounded-2xl border-2 p-6 text-left transition-all duration-200 sm:p-7 lg:p-8 ${
        selected
          ? 'border-orange bg-orange-pill/50 shadow-md'
          : 'border-beige-border bg-white hover:border-orange/40 hover:bg-orange/5'
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      {/* Selection indicator */}
      <div className="flex items-start justify-between">
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
            selected
              ? 'border-orange bg-orange'
              : 'border-brown/20 bg-transparent group-hover:border-orange'
          }`}
        >
          {selected && (
            <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
          )}
        </div>
        {showLabel && (
          <span className="text-xs font-bold uppercase tracking-wider text-brown-light">
            {option.label}
          </span>
        )}
      </div>

      {/* Content */}
      <div>
        <h3 className="font-serif text-lg font-semibold text-brown sm:text-xl">
          {option.title}
        </h3>
        {option.description && (
          <p className="mt-2 text-sm text-brown-light sm:text-base">
            {option.description}
          </p>
        )}
      </div>
    </button>
  )
}

export default OptionCard

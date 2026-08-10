function CopilotStep({ step, isLast }) {
  const Icon = step.icon

  return (
    <div className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
      {/* Connector line — desktop */}
      {!isLast && (
        <div
          className="absolute top-8 left-[calc(50%+2rem)] hidden h-0.5 w-[calc(100%-4rem)] border-t-2 border-dashed border-beige-border lg:block"
          aria-hidden="true"
        />
      )}

      {/* Connector line — mobile */}
      {!isLast && (
        <div
          className="absolute top-full left-1/2 h-8 w-0.5 -translate-x-1/2 border-l-2 border-dashed border-beige-border lg:hidden"
          aria-hidden="true"
        />
      )}

      <span
        className="mb-3 text-5xl font-serif font-bold text-beige-border select-none"
        aria-hidden="true"
      >
        {step.number}
      </span>

      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-pill text-orange">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>

      <h3 className="font-serif text-lg font-semibold text-brown sm:text-xl">
        {step.title}
      </h3>

      <p className="mt-2 max-w-xs text-sm leading-relaxed text-brown-light">
        {step.description}
      </p>
    </div>
  )
}

export default CopilotStep

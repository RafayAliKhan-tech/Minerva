function ActivityHeader({ title, subtitle, step, totalSteps }) {
  const progress = Math.round((step / totalSteps) * 100)

  return (
    <div className="mb-10 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brown-light">
            Activity {step} of {totalSteps}
          </p>
          <h2 className="font-serif text-3xl font-semibold text-brown sm:text-4xl">
            {title}
          </h2>
        </div>
        <div className="rounded-full bg-brown/10 px-4 py-2 text-sm font-semibold text-brown">
          {progress}% complete
        </div>
      </div>

      {subtitle && (
        <p className="max-w-3xl text-base leading-relaxed text-brown-light">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default ActivityHeader

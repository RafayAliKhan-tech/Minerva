function ProgressIndicator({ step, totalSteps }) {
  const progress = Math.round((step / totalSteps) * 100)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-brown-light">
        <span>Step {step} of {totalSteps}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-brown/10">
        <div className="h-full bg-gradient-to-r from-orange to-orange-light transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

export default ProgressIndicator

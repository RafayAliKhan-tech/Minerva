function SkillBar({ skill, percentage, size = 'md' }) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`font-medium text-brown ${sizeClasses[size]}`}>{skill}</span>
        <span className="text-sm font-semibold text-orange">{percentage}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-brown/10">
        <div
          className="h-full bg-gradient-to-r from-orange to-orange-light transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${skill}: ${percentage}%`}
        />
      </div>
    </div>
  )
}

export default SkillBar

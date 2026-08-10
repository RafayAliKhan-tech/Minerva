function Badge({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-orange-pill px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge

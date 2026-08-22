function Badge({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-[#f6eee8] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#494543] ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge

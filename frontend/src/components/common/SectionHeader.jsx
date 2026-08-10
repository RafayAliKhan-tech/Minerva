import Badge from './Badge'

function SectionHeader({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
}) {
  const alignClass =
    align === 'center' ? 'text-center mx-auto' : 'text-left'

  return (
    <div className={`max-w-3xl ${alignClass} ${className}`}>
      {badge && <Badge className="mb-4">{badge}</Badge>}
      {title && (
        <h2 className="font-serif text-3xl font-semibold leading-tight text-brown sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-brown-light sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionHeader

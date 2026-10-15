import { Link } from 'react-router-dom'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  dark: 'btn-dark',
  light: 'btn-light',
}

const sizes = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  to,
  className = '',
  icon: Icon,
  iconPosition = 'right',
  type = 'button',
  disabled = false,
  ...props
}) {
  const classes = `btn ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`.trim()

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="h-4 w-4" aria-hidden="true" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="h-4 w-4" aria-hidden="true" />}
    </>
  )

  if (to && !disabled) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  if (href && !disabled) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button type={type} className={classes} disabled={disabled} {...props}>
      {content}
    </button>
  )
}

export default Button

import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const variants = {
  primary:
    'bg-brown text-white hover:bg-brown/90 shadow-md hover:shadow-lg',
  secondary:
    'bg-orange text-white hover:bg-orange-light shadow-md hover:shadow-lg',
  outline:
    'border-2 border-brown/20 bg-transparent text-brown hover:border-brown/40 hover:bg-white/50',
  ghost:
    'bg-transparent text-brown hover:text-orange',
  dark:
    'bg-brown text-white hover:bg-brown/90',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-3.5 text-base',
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
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${variants[variant]} ${sizes[size]} ${className}`

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="h-4 w-4" aria-hidden="true" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="h-4 w-4" aria-hidden="true" />}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  )
}

export default Button

function Container({ children, className = '', as: Tag = 'div' }) {
  return (
    <Tag className={`container ${className}`.trim()}>
      {children}
    </Tag>
  )
}

export default Container

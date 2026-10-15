import Container from '../common/Container'

/**
 * Assessment content shell. Back / progress chrome stays intentionally
 * disabled — each journey page owns its own navigation controls.
 */
function AssessmentLayout({
  children,
  contentClassName = 'assessment-inner',
  className = '',
}) {
  return (
    <div className={`assessment-shell ${className}`.trim()}>
      <Container>
        <div className={contentClassName}>{children}</div>
      </Container>
    </div>
  )
}

export default AssessmentLayout

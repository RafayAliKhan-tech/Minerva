import { Link } from 'react-router-dom'
import Button from '../components/common/Button'

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div>
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>This route doesn&apos;t exist, or the link you followed is outdated.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button to="/" variant="secondary" size="md">
            Go home
          </Button>
          <Link to="/dashboard" className="btn btn-outline btn-md">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage

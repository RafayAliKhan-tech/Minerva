import { ArrowRight, Compass } from 'lucide-react'
import Container from '../components/common/Container'
import Button from '../components/common/Button'

function PlaceholderPage({ title, description, icon: Icon = Compass }) {
  return (
    <div className="flex min-h-[70vh] items-center pt-24 pb-16">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-pill text-orange">
            <Icon className="h-8 w-8" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-3xl font-semibold text-brown sm:text-4xl">{title}</h1>
          <p className="mt-4 text-brown-light">{description}</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button to="/" variant="dark" icon={ArrowRight}>
              Back to Home
            </Button>
            <Button to="/signup" variant="outline">
              Get Started
            </Button>
          </div>
          <p className="mt-8 text-sm text-brown-light/70">
            This page is a placeholder — full functionality coming soon.
          </p>
        </div>
      </Container>
    </div>
  )
}

export default PlaceholderPage

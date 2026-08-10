import Container from '../common/Container'
import SectionHeader from '../common/SectionHeader'
import JourneyCard from './JourneyCard'
import { journeys } from '../../data/journeys'

function JourneySection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24" id="features">
      <Container>
        <SectionHeader
          badge="Every Journey Is Unique"
          title="Where Are You in Your Career Journey?"
          subtitle="Whether you're just starting out or ready to take the next step, Minerva meets you where you are."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
          {journeys.map((journey) => (
            <JourneyCard key={journey.id} journey={journey} />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default JourneySection

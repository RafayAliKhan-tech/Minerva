import { Sparkles } from 'lucide-react'
import Container from '../common/Container'
import SectionHeader from '../common/SectionHeader'
import CopilotStep from './CopilotStep'
import { copilotSteps } from '../../data/copilotSteps'

function CopilotSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24" id="how-it-works">
      <div className="bg-gradient-to-b from-cream-dark/50 to-cream py-16 sm:py-20 lg:py-24">
        <Container>
          <SectionHeader
            badge={
              <>
                Why Minerva? <Sparkles className="inline h-3.5 w-3.5" aria-hidden="true" />
              </>
            }
            title="Your AI Career Co-Pilot"
            subtitle="From understanding who you are to landing your dream role — Minerva guides every step of your career journey."
          />

          <div className="mt-14 grid gap-10 sm:grid-cols-2 sm:gap-8 lg:mt-16 lg:grid-cols-4 lg:gap-6">
            {copilotSteps.map((step, index) => (
              <CopilotStep
                key={step.number}
                step={step}
                isLast={index === copilotSteps.length - 1}
              />
            ))}
          </div>
        </Container>
      </div>
    </section>
  )
}

export default CopilotSection

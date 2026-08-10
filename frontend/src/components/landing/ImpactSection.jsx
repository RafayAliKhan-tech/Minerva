import Container from '../common/Container'
import TestimonialCard from './TestimonialCard'
import { statistics, testimonial } from '../../data/impact'

function ImpactSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24" id="success-stories">
      {/* Decorative mountain path */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.07]" aria-hidden="true">
        <svg
          className="absolute -bottom-10 -left-10 h-96 w-96 text-brown"
          viewBox="0 0 400 400"
          fill="currentColor"
        >
          <path d="M50 350 L150 150 L250 250 L350 80 L380 350 Z" opacity="0.3" />
          <path
            d="M100 350 Q200 200 300 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="8 8"
          />
          <rect x="290" y="100" width="4" height="30" />
          <polygon points="292,95 300,110 284,110" />
        </svg>
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Statistics */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange">
              Minerva Impact
            </p>
            <h2 className="mb-10 font-serif text-3xl font-semibold text-brown sm:text-4xl">
              Real Results for Real Students
            </h2>

            <div className="grid grid-cols-2 gap-6 sm:gap-8">
              {statistics.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className={`py-4 ${index % 2 === 0 ? 'border-r border-beige-border pr-6' : ''} ${index < 2 ? 'border-b border-beige-border' : ''}`}
                  >
                    <div className="mb-2 flex items-center gap-2 text-orange">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <p className="font-serif text-3xl font-bold text-brown sm:text-4xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-brown-light">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Testimonial */}
          <TestimonialCard testimonial={testimonial} />
        </div>
      </Container>
    </section>
  )
}

export default ImpactSection

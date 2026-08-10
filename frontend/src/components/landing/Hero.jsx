import { ArrowRight, Play, Sparkles, Brain, Target, BookOpen, Briefcase } from 'lucide-react'
import Container from '../common/Container'
import Badge from '../common/Badge'
import Button from '../common/Button'
import { heroImageUrl } from '../../assets'

const floatingCards = [
  {
    icon: Brain,
    label: 'AI Assessments',
    position: 'top-4 -left-4 sm:top-8 sm:-left-8 lg:-left-12',
    animation: 'animate-float',
  },
  {
    icon: Target,
    label: 'Career Matches',
    position: 'top-1/4 -right-2 sm:-right-6 lg:-right-10',
    animation: 'animate-float-delayed',
  },
  {
    icon: BookOpen,
    label: 'Skills to Learn',
    position: 'bottom-1/3 -left-2 sm:-left-6 lg:-left-8',
    animation: 'animate-float-delayed',
  },
  {
    icon: Briefcase,
    label: 'Top Opportunities',
    position: 'bottom-8 -right-4 sm:bottom-12 sm:-right-8 lg:-right-12',
    animation: 'animate-float',
  },
]

function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-28">
      {/* Decorative dots */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-32 left-[10%] h-2 w-2 rounded-full bg-orange/30" />
        <div className="absolute top-48 right-[15%] h-1.5 w-1.5 rounded-full bg-orange/40" />
        <div className="absolute bottom-32 left-[20%] h-1 w-1 rounded-full bg-orange/25" />
        <div className="absolute top-64 right-[30%] text-orange/30">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <div className="animate-fade-in-up max-w-xl">
            <Badge>
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              AI-Powered Career Guidance
            </Badge>

            <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.15] text-brown sm:text-5xl lg:text-[3.25rem]">
              Not Just Answers.{' '}
              <span className="italic text-orange">Your Right Path.</span>
            </h1>

            <p className="mt-6 text-base leading-relaxed text-brown-light sm:text-lg">
              Minerva uses AI to understand your strengths, interests, skills, and goals — guiding
              you toward career paths that truly fit who you are.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button to="/signup" variant="dark" size="lg" icon={ArrowRight}>
                Start Your Journey
              </Button>
              <Button
                href="/#how-it-works"
                variant="ghost"
                size="lg"
                className="group !px-0"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brown/20 transition-colors group-hover:border-orange group-hover:text-orange">
                  <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                </span>
                See How It Works
              </Button>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative mx-auto aspect-[4/5] max-w-md lg:max-w-lg">
              {/* Main image */}
              <div className="relative h-full w-full overflow-hidden rounded-3xl bg-cream-dark shadow-float">
                <img
                  src={heroImageUrl}
                  alt="Student working on a laptop, exploring career options with Minerva AI"
                  className="h-full w-full object-cover object-center"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brown/10 to-transparent" />
              </div>

              {/* Floating cards */}
              {floatingCards.map((card) => {
                const Icon = card.icon
                return (
                  <div
                    key={card.label}
                    className={`absolute ${card.position} ${card.animation} z-10 hidden sm:block`}
                  >
                    <div className="flex items-center gap-2.5 rounded-2xl border border-beige-border/50 bg-white px-4 py-3 shadow-float">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-pill text-orange">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <span className="whitespace-nowrap text-xs font-semibold text-brown sm:text-sm">
                        {card.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Mobile floating cards grid */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:hidden">
              {floatingCards.map((card) => {
                const Icon = card.icon
                return (
                  <div
                    key={card.label}
                    className="flex items-center gap-2 rounded-xl border border-beige-border/50 bg-white px-3 py-2.5 shadow-card"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-pill text-orange">
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-semibold text-brown">{card.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Hero

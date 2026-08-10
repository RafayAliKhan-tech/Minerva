import { Quote, Star } from 'lucide-react'

function TestimonialCard({ testimonial }) {
  return (
    <article className="relative rounded-3xl border border-beige-border/50 bg-white p-8 shadow-card sm:p-10">
      <Quote
        className="mb-6 h-10 w-10 text-orange/30"
        aria-hidden="true"
      />

      <blockquote className="font-serif text-lg leading-relaxed text-brown sm:text-xl">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <footer className="mt-8 flex items-center gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-dark text-sm font-semibold text-brown"
          aria-hidden="true"
        >
          {testimonial.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <div>
          <cite className="not-italic font-semibold text-brown">{testimonial.name}</cite>
          <p className="text-sm text-brown-light">{testimonial.title}</p>
        </div>
        <div className="ml-auto flex gap-0.5" aria-label={`${testimonial.rating} out of 5 stars`}>
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-orange text-orange" aria-hidden="true" />
          ))}
        </div>
      </footer>
    </article>
  )
}

export default TestimonialCard

import Logo from '../common/Logo'
import Container from '../common/Container'
import { footerLinks } from '../../data/footer'

function Footer({ compact = false }) {
  if (compact) {
    return (
      <footer className="auth-footer border-t border-[#E0E0E0] bg-[#F5F5F5]">
        <Container className="auth-footer-inner">
          <p>&copy; {new Date().getFullYear()} Minerva. All rights reserved.</p>
        </Container>
      </footer>
    )
  }

  return (
    <footer className={`site-footer border-t border-[#E0E0E0] bg-[#F5F5F5]${compact ? ' auth-footer' : ''}`} id="about">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#707070]">
              Minerva uses AI to understand your strengths, interests, and goals — guiding you
              toward career paths that truly fit who you are.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#1A1A1A]">
                Platform
              </h3>
              <ul className="space-y-3">
                {footerLinks.platform.map((link) => (
                  <li key={link.label}>
                    <span className="text-sm text-[#707070]">{link.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#1A1A1A]">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <span className="text-sm text-[#707070]">{link.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#1A1A1A]">
                Support
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <span className="text-sm text-[#707070]">{link.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-[#E0E0E0] pt-8">
          <p className="text-center text-sm text-[#707070] sm:text-left">
            &copy; {new Date().getFullYear()} Minerva. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}

export default Footer

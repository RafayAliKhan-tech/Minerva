export const footerLinks = {
  product: [
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Career paths', href: '/#paths' },
    { label: 'Dashboard', href: '/dashboard', auth: true },
  ],
  company: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Get started', href: '/signup' },
  ],
  tools: [
    { label: 'Ask Minerva', href: '/chat', auth: true },
    { label: 'Mock interviews', href: '/mock-interview', auth: true },
    { label: 'Analyze resume', href: '/analyze-resume', auth: true },
    { label: 'Sign in', href: '/login', guest: true },
  ],
}

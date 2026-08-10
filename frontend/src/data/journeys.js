import { Telescope, Compass, Briefcase } from 'lucide-react'

export const journeys = [
  {
    id: 'exploring',
    title: "I'm Exploring",
    description: 'I want to discover the best career options for me.',
    route: '/explore/assessment',
    bgClass: 'bg-journey-green',
    buttonClass: 'bg-journey-green-dark hover:bg-journey-green-dark/90',
    icon: Telescope,
    illustration: 'telescope',
  },
  {
    id: 'career-in-mind',
    title: 'I Have a Domain in Mind',
    description: 'I know what I want to do and need a plan to get there.',
    route: '/explore/domain-selection',
    bgClass: 'bg-journey-tan',
    buttonClass: 'bg-brown hover:bg-brown/90',
    icon: Compass,
    illustration: 'compass',
  },
  {
    id: 'looking-for-job',
    title: "My Resume",
    description: 'I want to improve my profile and find the right opportunities.',
    route: '/explore/resume',
    bgClass: 'bg-journey-orange',
    buttonClass: 'bg-orange hover:bg-orange-light',
    icon: Briefcase,
    illustration: 'backpack',
  },
]

import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import SkillBar from '../components/assessment/SkillBar'
import Button from '../components/common/Button'
import { CheckCircle2, AlertCircle, ArrowRight, Zap } from 'lucide-react'
import { saveRoadmap } from '../utils/userData'

const skillGapData = {
  frontend: {
    title: 'Frontend Developer',
    currentSkills: [
      { name: 'HTML', percentage: 85 },
      { name: 'CSS', percentage: 85 },
      { name: 'JavaScript', percentage: 78 },
    ],
    skillsToLearn: [
      { name: 'React', description: 'JavaScript library for building UIs', priority: 'high' },
      { name: 'Git & Version Control', description: 'Manage code versions and collaboration', priority: 'high' },
      { name: 'API Integration', description: 'Connect frontend with backend services', priority: 'medium' },
      { name: 'Testing (Jest, React Testing)', description: 'Write unit and integration tests', priority: 'medium' },
      { name: 'TypeScript', description: 'Type-safe JavaScript development', priority: 'low' },
    ],
  },
  fullstack: {
    title: 'Full Stack Developer',
    currentSkills: [
      { name: 'HTML', percentage: 85 },
      { name: 'CSS', percentage: 85 },
      { name: 'JavaScript', percentage: 78 },
      { name: 'SQL', percentage: 62 },
    ],
    skillsToLearn: [
      { name: 'Node.js & Express', description: 'Backend JavaScript framework', priority: 'high' },
      { name: 'Database Design', description: 'Schema design and optimization', priority: 'high' },
      { name: 'React', description: 'Frontend framework', priority: 'high' },
      { name: 'API Design', description: 'RESTful and GraphQL API design', priority: 'medium' },
    ],
  },
  'ui-developer': {
    title: 'UI/UX Developer',
    currentSkills: [
      { name: 'HTML', percentage: 85 },
      { name: 'CSS', percentage: 85 },
      { name: 'JavaScript', percentage: 78 },
    ],
    skillsToLearn: [
      { name: 'UI Design Tools', description: 'Figma, Adobe XD, Sketch', priority: 'high' },
      { name: 'UX Principles', description: 'User research, personas, usability', priority: 'high' },
      { name: 'Accessibility (A11y)', description: 'WCAG standards and implementation', priority: 'high' },
      { name: 'React Components', description: 'Building reusable UI components', priority: 'medium' },
    ],
  },
}

const generateSampleCurriculum = (domain, matchScore = 65) => {
  const curriculumByDomain = {
    'Frontend Developer': {
      weeks: 12,
      level: matchScore > 70 ? 'Intermediate' : matchScore > 40 ? 'Beginner' : 'Basic',
      phases: [
        { week: 1, title: 'React Fundamentals', topics: ['Components', 'Props', 'State'], status: 'upcoming' },
        { week: 2, title: 'Hooks & State Management', topics: ['useState', 'useEffect', 'Custom Hooks'], status: 'upcoming' },
        { week: 3, title: 'Styling & Responsive Design', topics: ['CSS-in-JS', 'Tailwind', 'Media Queries'], status: 'upcoming' },
        { week: 4, title: 'API Integration', topics: ['Fetch API', 'Axios', 'Error Handling'], status: 'upcoming' },
      ],
      resources: [
        { type: 'course', title: 'React Complete Course', platform: 'Udemy' },
        { type: 'project', title: 'Build E-commerce UI', difficulty: 'Intermediate' },
        { type: 'practice', title: 'LeetCode JavaScript', platform: 'LeetCode' },
      ]
    },
    'Full Stack Developer': {
      weeks: 16,
      level: matchScore > 70 ? 'Intermediate' : matchScore > 40 ? 'Beginner' : 'Basic',
      phases: [
        { week: 1, title: 'Node.js & Express', topics: ['Server Setup', 'Routing', 'Middleware'], status: 'upcoming' },
        { week: 2, title: 'Database Design', topics: ['SQL', 'MongoDB', 'Schema Design'], status: 'upcoming' },
        { week: 3, title: 'Authentication', topics: ['JWT', 'OAuth', 'Sessions'], status: 'upcoming' },
        { week: 4, title: 'Deployment', topics: ['Vercel', 'Heroku', 'Docker'], status: 'upcoming' },
      ],
      resources: [
        { type: 'course', title: 'Full Stack Bootcamp', platform: 'Coursera' },
        { type: 'project', title: 'Build Social App', difficulty: 'Advanced' },
        { type: 'practice', title: 'GitHub Projects', platform: 'GitHub' },
      ]
    },
    'UI/UX Developer': {
      weeks: 12,
      level: matchScore > 70 ? 'Intermediate' : matchScore > 40 ? 'Beginner' : 'Basic',
      phases: [
        { week: 1, title: 'Design Tools', topics: ['Figma Basics', 'Components', 'Prototyping'], status: 'upcoming' },
        { week: 2, title: 'UX Principles', topics: ['User Research', 'Personas', 'Wireframing'], status: 'upcoming' },
        { week: 3, title: 'Visual Design', topics: ['Color Theory', 'Typography', 'Layouts'], status: 'upcoming' },
        { week: 4, title: 'Accessibility', topics: ['WCAG', 'Color Contrast', 'Screen Readers'], status: 'upcoming' },
      ],
      resources: [
        { type: 'course', title: 'Google UX Design Certificate', platform: 'Coursera' },
        { type: 'project', title: 'Redesign Website', difficulty: 'Beginner' },
        { type: 'practice', title: 'Daily UI Challenge', platform: 'Dribbble' },
      ]
    },
    'ui-developer': {
      weeks: 12,
      level: matchScore > 70 ? 'Intermediate' : matchScore > 40 ? 'Beginner' : 'Basic',
      phases: [
        { week: 1, title: 'Design Tools', topics: ['Figma Basics', 'Components', 'Prototyping'], status: 'upcoming' },
        { week: 2, title: 'UX Principles', topics: ['User Research', 'Personas', 'Wireframing'], status: 'upcoming' },
        { week: 3, title: 'Visual Design', topics: ['Color Theory', 'Typography', 'Layouts'], status: 'upcoming' },
        { week: 4, title: 'Accessibility', topics: ['WCAG', 'Color Contrast', 'Screen Readers'], status: 'upcoming' },
      ],
      resources: [
        { type: 'course', title: 'Google UX Design Certificate', platform: 'Coursera' },
        { type: 'project', title: 'Redesign Website', difficulty: 'Beginner' },
        { type: 'practice', title: 'Daily UI Challenge', platform: 'Dribbble' },
      ]
    },
  }

  return curriculumByDomain[domain] || {
    weeks: 12,
    level: 'Beginner',
    phases: [],
    resources: []
  }
}

function SkillGap() {
  const { careerId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const data = skillGapData[careerId]

  const handleGenerateRoadmap = () => {
    alert('No backend api found')
  }

  if (!data) {
    return (
      <AssessmentLayout onBack={() => navigate('/explore/resume/career-match')}>
        <p className="text-center text-brown-light">Career not found</p>
      </AssessmentLayout>
    )
  }

  return (
    <AssessmentLayout onBack={() => navigate('/explore/resume/career-match')} showProgress={false}>
      <div className="rounded-3xl border border-beige-border bg-white p-8 shadow-card sm:p-12 lg:p-16">
        <div className="max-w-3xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-serif text-4xl font-semibold text-brown sm:text-5xl">
              Your Skill Gap
            </h1>
            <p className="mt-2 text-lg font-semibold text-orange">{data.title}</p>
            <p className="mt-4 text-base text-brown-light">
              Here's what you already have and what you need to learn
            </p>
          </div>

          {/* Current skills */}
          <div className="mb-12">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-journey-green text-journey-green-dark">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-brown">You Already Have</h2>
            </div>
            <div className="space-y-6 rounded-2xl border border-journey-green bg-journey-green/10 p-8">
              {data.currentSkills.map((skill) => (
                <SkillBar
                  key={skill.name}
                  skill={skill.name}
                  percentage={skill.percentage}
                  size="md"
                />
              ))}
            </div>
          </div>

          {/* Skills to learn */}
          <div className="mb-12">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange text-white">
                <AlertCircle className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-brown">You Should Strengthen</h2>
            </div>
            <div className="space-y-3 rounded-2xl border border-orange-pill bg-orange-pill/20 p-8">
              {data.skillsToLearn.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-start gap-4 rounded-xl border border-orange-pill bg-white p-4"
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white mt-0.5 text-sm font-bold ${
                      skill.priority === 'high'
                        ? 'bg-red-500'
                        : skill.priority === 'medium'
                          ? 'bg-orange'
                          : 'bg-blue-500'
                    }`}
                  >
                    {skill.priority === 'high' ? '!' : skill.priority === 'medium' ? '→' : '?'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-brown">{skill.name}</p>
                    <p className="text-sm text-brown-light">{skill.description}</p>
                  </div>
                  <div className="text-xs font-medium uppercase tracking-wider text-brown-light">
                    {skill.priority === 'high'
                      ? 'Priority'
                      : skill.priority === 'medium'
                        ? 'Important'
                        : 'Nice to have'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-12 rounded-2xl border border-beige-border bg-cream-dark p-8">
            <h3 className="font-serif text-xl font-semibold text-brown mb-4">
              Recommended Learning Path
            </h3>
            <ol className="space-y-3 text-sm text-brown-light">
              <li className="flex gap-3">
                <span className="font-bold text-orange">1.</span>
                <span>Focus on high-priority skills first to reach the job-ready stage</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange">2.</span>
                <span>Build projects that combine multiple skills</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange">3.</span>
                <span>Fill important gaps based on job descriptions</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange">4.</span>
                <span>Polish nice-to-have skills as you advance</span>
              </li>
            </ol>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={handleGenerateRoadmap}
              variant="dark"
              size="lg"
              icon={Zap}
              className="flex-1"
            >
              Generate Personalized Roadmap
            </Button>
            <Button to="/dashboard" variant="ghost" size="lg" className="flex-1">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </AssessmentLayout>
  )
}

export default SkillGap

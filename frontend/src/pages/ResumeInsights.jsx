import { useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import SkillBar from '../components/assessment/SkillBar'
import Button from '../components/common/Button'
import {
  Code2,
  Database,
  Palette,
  Book,
  Briefcase,
  Award,
  ArrowRight,
} from 'lucide-react'

function ResumeInsights() {
  const navigate = useNavigate()

  const skills = [
    { name: 'HTML/CSS', percentage: 85 },
    { name: 'JavaScript', percentage: 78 },
    { name: 'React', percentage: 54 },
    { name: 'SQL', percentage: 62 },
  ]

  const sections = [
    { icon: Book, label: 'Education', value: 'B.S. Computer Science' },
    { icon: Briefcase, label: 'Experience', value: '2 years in tech' },
    { icon: Award, label: 'Certifications', value: '3 certifications' },
  ]

  const strengths = [
    'Frontend Development',
    'Database Design',
    'UI Implementation',
  ]

  return (
    <AssessmentLayout onBack={() => navigate('/explore')} showProgress={false}>
      <div className="rounded-3xl border border-beige-border bg-white p-8 shadow-card sm:p-12 lg:p-16">
        <div className="max-w-3xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-serif text-4xl font-semibold text-brown sm:text-5xl">
              Your Current Skill Profile
            </h1>
            <p className="mt-4 text-base text-brown-light">
              Based on your resume analysis
            </p>
          </div>

          {/* Skills */}
          <div className="mb-12 space-y-6">
            <h2 className="font-serif text-2xl font-semibold text-brown">Technical Skills</h2>
            {skills.map((skill) => (
              <SkillBar key={skill.name} skill={skill.name} percentage={skill.percentage} />
            ))}
          </div>

          {/* Summary sections */}
          <div className="mb-12 grid gap-4 md:grid-cols-3">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <div
                  key={section.label}
                  className="rounded-xl border border-beige-border bg-cream-dark p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-pill text-orange">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-brown-light">
                      {section.label}
                    </h3>
                  </div>
                  <p className="font-semibold text-brown">{section.value}</p>
                </div>
              )
            })}
          </div>

          {/* Strongest areas */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-semibold text-brown mb-6">
              Your Strongest Areas
            </h2>
            <div className="flex flex-wrap gap-3">
              {strengths.map((strength) => (
                <div
                  key={strength}
                  className="inline-flex items-center gap-2 rounded-full bg-journey-green px-4 py-2 text-sm font-medium text-journey-green-dark"
                >
                  <span>✓</span>
                  {strength}
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mb-12 h-px bg-beige-border" />

          {/* Next step info */}
          <div className="mb-12 rounded-2xl bg-orange-pill p-6">
            <p className="text-sm text-brown">
              <span className="font-semibold">Next:</span> See career matches based on your
              current skills and identify what you need to learn to reach your goals.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              to="/explore/resume/assessment/1"
              variant="dark"
              size="lg"
              icon={ArrowRight}
              className="flex-1"
            >
              Start Job Assessment
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

export default ResumeInsights

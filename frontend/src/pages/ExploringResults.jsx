import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import SkillBar from '../components/assessment/SkillBar'
import DomainCard from '../components/assessment/DomainCard'
import Button from '../components/common/Button'
import { generateMindProfile } from '../data/exploringActivities'
import { domains } from '../data/domainActivities'
import { Sparkles, ArrowRight, Zap } from 'lucide-react'
import { readAttemptId, getAssessmentResult } from '../api/assessmentApi'
import { useAuth } from '../auth/AuthContext'
import { saveLatestAssessment, saveRoadmap, getRoadmaps } from '../utils/userData'

const generateSampleCurriculum = (domain, matchScore) => {
  const curriculumByDomain = {
    'UI/UX Design': {
      weeks: 12,
      level: matchScore > 70 ? 'Intermediate' : matchScore > 40 ? 'Beginner' : 'Basic',
      phases: [
        { week: 1, title: 'Design Fundamentals', topics: ['Color Theory', 'Typography', 'Layout Principles'], status: 'upcoming' },
        { week: 2, title: 'Wireframing Basics', topics: ['Low Fidelity', 'User Flow', 'Information Architecture'], status: 'upcoming' },
        { week: 3, title: 'Prototyping Tools', topics: ['Figma', 'Adobe XD', 'Sketch'], status: 'upcoming' },
        { week: 4, title: 'User Research', topics: ['User Testing', 'Interviews', 'Personas'], status: 'upcoming' },
      ],
      resources: [
        { type: 'course', title: 'UI/UX Design Masterclass', platform: 'Udemy' },
        { type: 'project', title: 'Redesign Personal Portfolio', difficulty: 'Beginner' },
        { type: 'practice', title: 'Daily Design Challenge', platform: 'Dribbble' },
      ]
    },
    'Development': {
      weeks: 16,
      level: matchScore > 70 ? 'Intermediate' : matchScore > 40 ? 'Beginner' : 'Basic',
      phases: [
        { week: 1, title: 'JavaScript Fundamentals', topics: ['Variables', 'Functions', 'DOM'], status: 'upcoming' },
        { week: 2, title: 'React Basics', topics: ['Components', 'State', 'Props'], status: 'upcoming' },
        { week: 3, title: 'Backend Basics', topics: ['Node.js', 'Express', 'REST APIs'], status: 'upcoming' },
        { week: 4, title: 'Database', topics: ['SQL', 'MongoDB', 'Data Modeling'], status: 'upcoming' },
      ],
      resources: [
        { type: 'course', title: 'Full Stack Web Development', platform: 'Coursera' },
        { type: 'project', title: 'Build a Todo App', difficulty: 'Beginner' },
        { type: 'practice', title: 'LeetCode Problems', platform: 'LeetCode' },
      ]
    },
    'Data Analytics': {
      weeks: 12,
      level: matchScore > 70 ? 'Intermediate' : matchScore > 40 ? 'Beginner' : 'Basic',
      phases: [
        { week: 1, title: 'Data Basics', topics: ['Statistics', 'Probability', 'Excel'], status: 'upcoming' },
        { week: 2, title: 'Python for Data', topics: ['Pandas', 'NumPy', 'Data Cleaning'], status: 'upcoming' },
        { week: 3, title: 'Data Visualization', topics: ['Matplotlib', 'Tableau', 'Power BI'], status: 'upcoming' },
        { week: 4, title: 'SQL & Databases', topics: ['SQL Queries', 'Database Design'], status: 'upcoming' },
      ],
      resources: [
        { type: 'course', title: 'Data Analytics Bootcamp', platform: 'Google Career Certificates' },
        { type: 'project', title: 'Analyze Public Dataset', difficulty: 'Beginner' },
        { type: 'practice', title: 'Kaggle Competitions', platform: 'Kaggle' },
      ]
    },
    'Artificial Intelligence': {
      weeks: 20,
      level: matchScore > 70 ? 'Intermediate' : matchScore > 40 ? 'Beginner' : 'Basic',
      phases: [
        { week: 1, title: 'Math Foundations', topics: ['Linear Algebra', 'Calculus', 'Statistics'], status: 'upcoming' },
        { week: 2, title: 'Python Advanced', topics: ['OOP', 'Data Structures', 'Algorithms'], status: 'upcoming' },
        { week: 3, title: 'Machine Learning', topics: ['Supervised Learning', 'Unsupervised Learning', 'Scikit-learn'], status: 'upcoming' },
        { week: 4, title: 'Deep Learning', topics: ['Neural Networks', 'TensorFlow', 'PyTorch'], status: 'upcoming' },
      ],
      resources: [
        { type: 'course', title: 'Machine Learning Specialization', platform: 'Coursera' },
        { type: 'project', title: 'Build a Classification Model', difficulty: 'Intermediate' },
        { type: 'practice', title: 'Research Papers', platform: 'ArXiv' },
      ]
    },
    'Cybersecurity': {
      weeks: 14,
      level: matchScore > 70 ? 'Intermediate' : matchScore > 40 ? 'Beginner' : 'Basic',
      phases: [
        { week: 1, title: 'Security Basics', topics: ['Encryption', 'Authentication', 'Firewalls'], status: 'upcoming' },
        { week: 2, title: 'Network Security', topics: ['TCP/IP', 'VPN', 'Intrusion Detection'], status: 'upcoming' },
        { week: 3, title: 'Ethical Hacking', topics: ['Penetration Testing', 'Vulnerability Assessment'], status: 'upcoming' },
        { week: 4, title: 'Compliance & Risk', topics: ['GDPR', 'ISO 27001', 'Risk Management'], status: 'upcoming' },
      ],
      resources: [
        { type: 'course', title: 'Cybersecurity Fundamentals', platform: 'CompTIA Security+' },
        { type: 'project', title: 'Build a Secure App', difficulty: 'Intermediate' },
        { type: 'practice', title: 'HackTheBox', platform: 'HackTheBox' },
      ]
    }
  }

  return curriculumByDomain[domain] || {
    weeks: 12,
    level: 'Beginner',
    phases: [],
    resources: []
  }
}

function ExploringResults() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const attemptId = readAttemptId('exploring')
        if (attemptId) {
          const server = await getAssessmentResult(attemptId)
          if (server && server.mindProfile) {
            setProfile(server.mindProfile)
            saveLatestAssessment(user, { type: 'exploring', label: 'Exploration assessment', domain: server.mindProfile.potentialDomains?.[0]?.domain, score: server.mindProfile.potentialDomains?.[0]?.match })
            return
          }
        }
      } catch (e) {
        console.error('fetch exploring result failed', e)
      }

      const responses = JSON.parse(sessionStorage.getItem('exploringResponses') || '{}')
      const mindProfile = generateMindProfile(responses)
      setProfile(mindProfile)
      saveLatestAssessment(user, { type: 'exploring', label: 'Exploration assessment', domain: mindProfile.potentialDomains?.[0]?.domain, score: mindProfile.potentialDomains?.[0]?.match })
    })()
  }, [])

  if (!profile) {
    return (
      <AssessmentLayout onBack={() => navigate('/')}>
        <p className="text-center text-brown-light">Loading your profile...</p>
      </AssessmentLayout>
    )
  }

  const behavioraltrait = [
    {
      name: 'Analytical Thinking',
      score: profile.analyticalThinking,
    },
    {
      name: 'Problem Solving',
      score: profile.problemSolving,
    },
    {
      name: 'Creative Thinking',
      score: profile.creativeThinking,
    },
    {
      name: 'User Thinking',
      score: profile.userThinking,
    },
  ]

  return (
    <AssessmentLayout
      onBack={() => navigate('/')}
      showProgress={false}
    >
      {/* Main card */}
      <div className="rounded-3xl border border-beige-border bg-white p-8 shadow-card sm:p-12 lg:p-16">
        <div className="max-w-3xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-serif text-4xl font-semibold text-brown sm:text-5xl">
              Here's What We Discovered About You
            </h1>
            <p className="mt-4 text-base text-brown-light">
              Based on your responses, here's your unique behavioral profile.
            </p>
          </div>

          {/* Behavioral traits */}
          <div className="mb-12 space-y-6">
            <h2 className="font-serif text-2xl font-semibold text-brown">
              Your Behavioral Profile
            </h2>
            {behavioraltrait.map((trait) => (
              <SkillBar
                key={trait.name}
                skill={trait.name}
                percentage={trait.score}
                size="md"
              />
            ))}
          </div>

          {/* Insights */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-semibold text-brown mb-6">
              Your Strongest Signals
            </h2>
            <div className="space-y-3">
              {profile.insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl border border-beige-border bg-cream-dark p-4"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-journey-green text-journey-green-dark mt-0.5">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <p className="text-base text-brown-light">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mb-12 h-px bg-beige-border" />

          {/* Potential domains */}
          <div>
            <h2 className="font-serif text-2xl font-semibold text-brown mb-6">
              Potential CS Domains
            </h2>
            <div className="space-y-4">
              {profile.potentialDomains.map((domainMatch) => {
                const domain = domains.find((d) => d.name === domainMatch.domain)
                const handleGenerateRoadmap = () => {
                  alert('No backend api found')
                }
                return (
                  <div
                    key={domainMatch.domain}
                    className="rounded-xl border border-beige-border bg-cream-dark p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        {domain && domain.icon && (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-pill text-orange">
                            {<domain.icon className="h-6 w-6" aria-hidden="true" />}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-brown">{domainMatch.domain}</p>
                          <p className="text-xs text-brown-light">Based on your signals</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange">{domainMatch.match}%</p>
                        <p className="text-xs text-brown-light">Match</p>
                      </div>
                    </div>
                    <button
                      onClick={handleGenerateRoadmap}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange to-orange-dark text-white rounded-lg font-semibold hover:shadow-md transition-all duration-200 group"
                    >
                      <Zap className="h-4 w-4" aria-hidden="true" />
                      Generate Roadmap
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Info note */}
          <div className="mt-12 rounded-2xl bg-orange-pill p-6">
            <p className="text-sm text-brown">
              <span className="font-semibold">Note:</span> These are potential matches based on your behavioral signals. This is not a definitive diagnosis, but rather indicators of where your strengths might naturally lead you.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Button
              to="/explore/domain-selection"
              variant="dark"
              size="lg"
              icon={ArrowRight}
              className="flex-1"
            >
              Explore a Domain
            </Button>
            <Button
              to="/dashboard"
              variant="ghost"
              size="lg"
              className="flex-1"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </AssessmentLayout>
  )
}

export default ExploringResults

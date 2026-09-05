import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import Button from '../components/common/Button'
import { Sparkles, ArrowRight, Zap } from 'lucide-react'
import { generateRoadmap, getJourney1Result } from '../api/minervaApi'
import { useAuth } from '../auth/AuthContext'
import { saveLatestAssessment, saveRoadmap } from '../utils/userData'

const extractJourney1Data = (payload) => payload?.career_recommendation ? payload : null

const careerCards = [
  { id: 'development', name: 'Development' },
  { id: 'ui_ux', name: 'UI/UX' },
  { id: 'data', name: 'Data' },
  { id: 'ai', name: 'AI' },
  { id: 'cyber', name: 'Cyber' },
]

const getCareerPercentage = (careerScores, careerId) => {
  const score = Array.isArray(careerScores)
    ? careerScores.find((item) => item?.career_id === careerId)
    : careerScores?.[careerId]
  return Number(typeof score === 'object' ? score?.percentage : score || 0)
}

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
  const [journey1Data, setJourney1Data] = useState(null)
  const [journey1Result, setJourney1Result] = useState(null)
  const [resultError, setResultError] = useState('')

  useEffect(() => {
    ;(async () => {
      const assessmentId = sessionStorage.getItem('journey1AssessmentId')

      if (!assessmentId) {
        setResultError('No Journey 1 assessment result is available yet. Please complete the assessment again.')
        return
      }

      try {
        const server = await getJourney1Result(assessmentId)
        console.log('GetJourney1Result unwrapped response:', server)
        const journey1Results = extractJourney1Data(server)

        if (!journey1Results) {
          throw new Error('Journey 1 response did not include career recommendation data.')
        }

        setJourney1Data(journey1Results)
        setJourney1Result(server)
        sessionStorage.setItem('journey1Result', JSON.stringify(server))
        setResultError('')
        saveLatestAssessment(user, {
          type: 'exploring',
          label: 'Exploration assessment',
          domain: 'exploring',
          score: null,
          source: 'journey1',
          assessmentId,
        })
      } catch (e) {
        console.error('fetch exploring result failed from Journey 1', e)
        setJourney1Data(null)
        setResultError('We could not load your Journey 1 result from the backend. Please try again or start the assessment over.')
      }

    })()
  }, [user])

  if (resultError) {
    return (
      <AssessmentLayout onBack={() => navigate('/explore/assessment')} showProgress={false}>
        <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-card sm:p-12">
          <h1 className="font-serif text-3xl font-semibold text-brown sm:text-4xl">Journey 1 result unavailable</h1>
          <p className="mt-4 text-base text-brown-light">{resultError}</p>
          <div className="mt-8">
            <Button onClick={() => navigate('/explore/assessment')} variant="dark" size="lg">
              Restart the assessment
            </Button>
          </div>
        </div>
      </AssessmentLayout>
    )
  }

  if (!journey1Data) {
    return (
      <AssessmentLayout onBack={() => navigate('/')}>
        <p className="text-center text-brown-light">Loading your Journey 1 results...</p>
      </AssessmentLayout>
    )
  }

  const careerScores = journey1Data.career_recommendation?.deterministic_career_scores || []

  const handleGenerateRoadmap = async (careerMatch) => {
    const realAssessmentId = sessionStorage.getItem('journey1AssessmentId')
    if (!realAssessmentId || !journey1Result) {
      setResultError('Your backend Journey 1 result is not available. Please complete the assessment again.')
      return
    }

    const careerName = careerMatch.id
    const matchScore = Number(careerMatch.percentage)
    const payload = {
      journey: 1,
      weekly_hours: 5,
      journey_output: journey1Result,
      assessmentId: realAssessmentId,
      career: careerName,
      target_role: careerName,
      matchScore,
    }

    try {
      setResultError('')
      const created = await generateRoadmap(payload)
      const raw = created?.result || created || {}
      const responseData = Array.isArray(raw)
        ? raw.find((roadmap) => roadmap?.career === careerName) || {}
        : (typeof raw === 'object' ? raw : {})
      if (Array.isArray(raw) && !responseData.career) {
        throw new Error(`The backend did not return a roadmap for ${careerName}.`)
      }
      const roadmapId = responseData.roadmap_id || responseData.roadmapId || responseData.id || created?.roadmap_id || created?.roadmapId || 'default'

      if (!roadmapId) throw new Error('The backend did not return a valid roadmapId.')

      const savedRoadmap = {
        id: roadmapId,
        domain: responseData.career || responseData.domain || careerName,
        domainId: responseData.domainId || payload.domainId || careerMatch.id,
        matchScore: Number(responseData.matchScore ?? payload.matchScore),
        strengths: responseData.strengths || payload.strengths || [],
        areasToImprove: responseData.areasToImprove || payload.areasToImprove || payload.weak_areas || [],
        curriculum: responseData.curriculum || { phases: responseData.phases || [], weeks: responseData.timeline?.total_duration_weeks || 12 },
        status: 'generated',
        createdAt: new Date().toISOString(),
      }

      saveRoadmap(user, savedRoadmap)
      navigate(`/roadmap-detail/${roadmapId}`, {
        state: {
          ...savedRoadmap,
          returnTo: { pathname: '/explore/assessment/results', state: { fromJourney1: true } },
        },
      })
    } catch (error) {
      console.error('Roadmap generation failed for exploring result', error)
      setResultError('We could not generate your roadmap from the Journey 1 result because the backend rejected the request. Please try again.')
    }
  }

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
              Based on your responses, here's your Journey 1 career analysis.
            </p>
          </div>

          {/* Insights */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-semibold text-brown mb-6">
              Your Strongest Signals
            </h2>
            <div className="space-y-3">
              {(journey1Data.strengths || []).map((strength, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl border border-beige-border bg-cream-dark p-4"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-journey-green text-journey-green-dark mt-0.5">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <p className="text-base text-brown-light">{typeof strength === 'string' ? strength : JSON.stringify(strength)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mb-12 h-px bg-beige-border" />

          <div>
            <h2 className="font-serif text-2xl font-semibold text-brown mb-6">
              Career matches
            </h2>
            <div className="space-y-4">
              {careerCards.map((career) => {
                const percentage = getCareerPercentage(careerScores, career.id)
                return (
                  <div key={career.id} className="rounded-xl border border-beige-border bg-cream-dark p-6">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-brown">{career.name}</p>
                      <p className="font-bold text-orange">{percentage}%</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleGenerateRoadmap({ ...career, percentage })}
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange to-orange-dark text-white rounded-lg font-semibold hover:shadow-md transition-all duration-200 group"
                    >
                      <Zap className="h-4 w-4" aria-hidden="true" />
                      Generate Roadmap
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {journey1Data.weak_areas && (
              <div className="rounded-xl border border-beige-border bg-cream-dark p-5">
                <h2 className="font-serif text-xl font-semibold text-brown">Weak areas</h2>
                <pre className="mt-3 whitespace-pre-wrap text-sm text-brown-light">{JSON.stringify(journey1Data.weak_areas, null, 2)}</pre>
              </div>
            )}
            {journey1Data.skill_gap_analysis && (
              <div className="rounded-xl border border-beige-border bg-cream-dark p-5">
                <h2 className="font-serif text-xl font-semibold text-brown">Skill gap analysis</h2>
                <pre className="mt-3 whitespace-pre-wrap text-sm text-brown-light">{JSON.stringify(journey1Data.skill_gap_analysis, null, 2)}</pre>
              </div>
            )}
          </div>

          {journey1Data.preliminary_current_skill_profile && (
            <div className="mt-6 rounded-xl border border-beige-border bg-cream-dark p-5">
              <h2 className="font-serif text-xl font-semibold text-brown">Current skill profile</h2>
              <pre className="mt-3 whitespace-pre-wrap text-sm text-brown-light">{JSON.stringify(journey1Data.preliminary_current_skill_profile, null, 2)}</pre>
            </div>
          )}

          {journey1Data.recommended_next_step && (
            <div className="mt-6 rounded-xl bg-orange-pill p-5">
              <h2 className="font-serif text-xl font-semibold text-brown">Recommended next step</h2>
              <p className="mt-2 text-brown-light">{typeof journey1Data.recommended_next_step === 'string' ? journey1Data.recommended_next_step : JSON.stringify(journey1Data.recommended_next_step)}</p>
            </div>
          )}

          {/* Info note */}
          <div className="mt-12 rounded-2xl bg-orange-pill p-6">
            <p className="text-sm text-brown">
              <span className="font-semibold">Note:</span> These career scores are calculated from your Journey 1 assessment results.
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

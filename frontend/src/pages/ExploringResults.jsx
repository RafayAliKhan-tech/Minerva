import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import Button from '../components/common/Button'
import { Sparkles, ArrowRight, Zap, Loader, Code2, Palette, BarChart3, Brain, Shield, ArrowUpRight } from 'lucide-react'
import { generateRoadmap, getJourney1Result } from '../api/minervaApi'
import { useAuth } from '../auth/AuthContext'
import { saveLatestAssessment, saveRoadmap } from '../utils/userData'

const extractJourney1Data = (payload) => payload?.career_recommendation ? payload : null
const unwrapRoadmapResponse = (payload) => {
  if (!payload || typeof payload !== 'object') return payload
  if (payload.data && typeof payload.data === 'object') return unwrapRoadmapResponse(payload.data)
  return payload
}

const careerCards = [
  { id: 'development', name: 'Software Development', icon: Code2, accent: 'text-blue-700 bg-blue-50 border-blue-100', description: 'Build products, APIs, and reliable systems that solve real problems.' },
  { id: 'ui_ux', name: 'UI/UX Design', icon: Palette, accent: 'text-pink-700 bg-pink-50 border-pink-100', description: 'Shape clear, useful experiences through research, interaction, and visual craft.' },
  { id: 'data', name: 'Data & Analytics', icon: BarChart3, accent: 'text-emerald-700 bg-emerald-50 border-emerald-100', description: 'Turn raw information into decisions, stories, and measurable outcomes.' },
  { id: 'ai', name: 'AI & Machine Learning', icon: Brain, accent: 'text-orange-700 bg-orange-50 border-orange-100', description: 'Create intelligent systems with data, experimentation, and responsible model thinking.' },
  { id: 'cyber', name: 'Cybersecurity', icon: Shield, accent: 'text-red-700 bg-red-50 border-red-100', description: 'Protect applications and people by thinking like both a builder and an adversary.' },
]

const getCareerPercentage = (careerScores, careerId) => {
  const score = Array.isArray(careerScores)
    ? careerScores.find((item) => item?.career_id === careerId)
    : careerScores?.[careerId]
  return Number(typeof score === 'object' ? score?.percentage : score || 0)
}
const normalizeCareerId = (value) => {
  const normalized = String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
  const aliases = {
    software_development: 'development',
    software_engineering: 'development',
    ui_ux_design: 'ui_ux',
    data_analytics: 'data',
    artificial_intelligence: 'ai',
    machine_learning: 'ai',
    cybersecurity: 'cyber',
    cyber_security: 'cyber',
  }
  return aliases[normalized] || normalized
}
const getRoadmapCareer = (roadmap) => roadmap?.career || roadmap?.domain || roadmap?.target_role || roadmap?.targetRole
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
  const [roadmapError, setRoadmapError] = useState('')
  const [generatingCareer, setGeneratingCareer] = useState('')

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
      setRoadmapError('Your backend Journey 1 result is not available. Please complete the assessment again.')
      return
    }

    const careerName = careerMatch.id
    const matchScore = Number(careerMatch.percentage)
    const payload = {
      journey: 1,
      weekly_hours: 5,
      journey_output: journey1Result,
      career: careerName,
      target_role: careerName,
      use_model: false,
    }

    try {
      setGeneratingCareer(careerName)
      setRoadmapError('')
      const created = await generateRoadmap(payload)
      console.groupCollapsed('[Journey1] Roadmap response')
      console.debug('raw response:', created)
      console.debug('engine version:', created?.engine_version || created?.engineVersion || 'missing')
      console.debug('payload:', JSON.stringify(created, null, 2))
      console.groupEnd()
      const envelope = unwrapRoadmapResponse(created)
      const raw = envelope?.result || envelope || {}
      const returnedRoadmaps = Array.isArray(raw) ? raw : [raw]
      console.debug('[Journey1] Returned roadmap careers:', returnedRoadmaps.map(getRoadmapCareer).filter(Boolean))
      const responseData = Array.isArray(raw)
        ? raw.find((roadmap) => normalizeCareerId(getRoadmapCareer(roadmap)) === normalizeCareerId(careerName)) || {}
        : (typeof raw === 'object' ? raw : {})
      if (Array.isArray(raw) && !getRoadmapCareer(responseData)) {
        throw new Error(`The backend did not return a roadmap for ${careerName}.`)
      }
      const roadmapId = envelope?.roadmap_id || envelope?.roadmapId || envelope?.id || responseData.roadmap_id || responseData.roadmapId || responseData.id

      if (!roadmapId) {
        throw new Error(`The Journey 1 roadmap API did not return a valid roadmap ID. Response: ${JSON.stringify(created)}`)
      }

      const savedRoadmap = {
        id: roadmapId,
        domain: responseData.career || responseData.domain || careerName,
        domainId: responseData.domainId || payload.domainId || careerMatch.id,
        matchScore: Number(responseData.matchScore ?? matchScore),
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
      console.error('Roadmap generation failed for exploring result:', error, error?.response?.data)
      setRoadmapError(error?.response?.data?.message || error?.response?.data?.error || error?.response?.data?.detail || error?.response?.data?.title || error?.message || 'We could not generate your Journey 1 roadmap. Please try again.')
    } finally {
      setGeneratingCareer('')
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
            {roadmapError && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{roadmapError}</p>}
            <div className="grid gap-5 sm:grid-cols-2">
              {careerCards.map((career) => {
                const percentage = getCareerPercentage(careerScores, career.id)
                const Icon = career.icon
                return (
                  <article key={career.id} className="group flex h-full flex-col rounded-2xl border border-beige-border bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
                    <div className="flex items-start justify-between gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${career.accent}`}>
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-brown">{percentage}%</p>
                        <p className="text-xs font-semibold uppercase tracking-wider text-brown-light">match</p>
                      </div>
                    </div>
                    <h3 className="mt-5 font-serif text-2xl font-semibold text-brown">{career.name}</h3>
                    <p className="mt-2 min-h-12 text-sm leading-relaxed text-brown-light">{career.description}</p>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-brown/10"><div className="h-full rounded-full bg-gradient-to-r from-orange to-orange-dark transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }} /></div>
                    <button
                      type="button"
                      onClick={() => handleGenerateRoadmap({ ...career, percentage })}
                      disabled={Boolean(generatingCareer)}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brown px-4 py-3 font-semibold text-white transition-all duration-200 hover:bg-orange hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {generatingCareer === career.id
                        ? <><Loader className="h-4 w-4 animate-spin" aria-hidden="true" /> Generating roadmap...</>
                        : <><Zap className="h-4 w-4" aria-hidden="true" /> Generate Roadmap <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></>}
                    </button>
                      </article>
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

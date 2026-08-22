import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import SkillBar from '../components/assessment/SkillBar'
import Button from '../components/common/Button'
import { ArrowRight } from 'lucide-react'
import { inferResumeProfile, generateResumeResults } from '../data/resumeActivities'
import { readAttemptId, getAssessmentResult } from '../api/assessmentApi'
import { useAuth } from '../auth/AuthContext'
import { saveLatestAssessment } from '../utils/userData'

function ResumeResults() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const resumeFile = useMemo(() => {
    const raw = sessionStorage.getItem('resumeFile')
    return raw ? JSON.parse(raw) : null
  }, [])

  const profile = useMemo(() => inferResumeProfile(resumeFile), [resumeFile])
  const [results, setResults] = useState(null)

  useEffect(() => {
    ;(async () => {
      if (!resumeFile) {
        navigate('/explore/resume')
        return
      }

      try {
        const attemptId = readAttemptId('resume')
        if (attemptId) {
          const server = await getAssessmentResult(attemptId)
          if (server && server.resumeResults) {
            setResults(server.resumeResults)
            saveLatestAssessment(user, { type: 'resume', label: 'Resume readiness assessment', domain: 'Job readiness', score: Math.round(server.resumeResults.scores.reduce((sum, item) => sum + item.score, 0) / server.resumeResults.scores.length) })
            return
          }
        }
      } catch (e) {
        console.error('fetch resume result failed', e)
      }

      const answers = JSON.parse(sessionStorage.getItem('resumeResponses') || '{}')
      const generated = generateResumeResults(profile.id, answers)
      setResults(generated)
      saveLatestAssessment(user, { type: 'resume', label: 'Resume readiness assessment', domain: 'Job readiness', score: Math.round(generated.scores.reduce((sum, item) => sum + item.score, 0) / generated.scores.length) })
    })()
  }, [navigate, profile.id, resumeFile])

  if (!resumeFile) {
    return null
  }

  if (!results) {
    return (
      <AssessmentLayout onBack={() => navigate('/explore/resume/assessment/1')} showProgress={false}>
        <p className="text-center text-brown-light">Loading results...</p>
      </AssessmentLayout>
    )
  }

  return (
    <AssessmentLayout
      onBack={() => navigate('/explore/resume/assessment/1')}
      showProgress={false}
      title="Your Job Readiness"
      subtitle="Review your score, skill gap, and recommended roles based on your resume and assessment."
    >
      <div className="space-y-10">
        <div className="rounded-3xl border border-orange-pill bg-orange-pill/20 p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange">Your job readiness</p>
          <h2 className="mt-4 text-5xl font-bold text-orange">{Math.round(results.scores.reduce((sum, item) => sum + item.score, 0) / results.scores.length)}%</h2>
          <p className="mt-4 text-base text-brown-light">{results.fitMessage}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-journey-green bg-journey-green/10 p-8">
            <h3 className="text-xl font-semibold text-brown mb-6">Your strongest career signals</h3>
            <div className="space-y-3">
              {results.signals.map((signal) => (
                <div key={signal} className="rounded-2xl border border-journey-green bg-white p-4 text-brown">
                  {signal}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-beige-border bg-white p-8">
            <h3 className="text-xl font-semibold text-brown mb-6">Skills you already have</h3>
            <div className="space-y-4">
              {results.skills.map((skill) => (
                <div key={skill} className="rounded-2xl bg-cream-dark p-4 text-brown">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-beige-border bg-white p-8">
          <h3 className="text-xl font-semibold text-brown mb-6">Your current readiness scores</h3>
          <div className="space-y-4">
            {results.scores.map((score) => (
              <SkillBar key={score.name} skill={score.name} percentage={score.score} size="md" />
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-journey-green bg-journey-green/10 p-8">
            <h3 className="text-xl font-semibold text-brown mb-6">You already have</h3>
            <ul className="space-y-3 text-brown-light">
              {results.skills.map((skill) => (
                <li key={skill} className="flex items-center gap-3">
                  <span className="text-orange">✓</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-orange-pill bg-orange-pill/20 p-8">
            <h3 className="text-xl font-semibold text-brown mb-6">You should strengthen</h3>
            <ul className="space-y-3 text-brown-light">
              {results.gap.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-orange">⚠</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-3xl border border-beige-border bg-white p-8">
          <h3 className="text-xl font-semibold text-brown mb-6">Jobs you could target</h3>
          <div className="grid gap-3">
            {results.jobs.map((job) => (
              <div key={job} className="rounded-2xl border border-beige-border bg-cream-dark p-4 text-brown">
                {job}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            size="lg"
            className="flex-1"
          >
            Back to Home
          </Button>
          <Button
            onClick={() => navigate('/explore/resume/career-match')}
            variant="dark"
            size="lg"
            icon={ArrowRight}
            className="flex-1"
          >
            Explore Recommended Jobs →
          </Button>
        </div>
      </div>
    </AssessmentLayout>
  )
}

export default ResumeResults

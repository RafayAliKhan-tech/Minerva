import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import Button from '../components/common/Button'
import { useJourney2Assessment } from '../auth/Journey2AssessmentContext'

function DomainSelection() {
  const navigate = useNavigate()
  const { careers, loadCareers, error, isLoading } = useJourney2Assessment()
  const [selectedCareer, setSelectedCareer] = useState(null)

  useEffect(() => {
    if (!careers.length) loadCareers().catch(() => null)
  }, [careers.length])

  const handleContinue = () => {
    if (!selectedCareer) return

    const careerId = selectedCareer.career_id || selectedCareer.careerId || selectedCareer.id
    sessionStorage.setItem('journey2CareerId', careerId)
    sessionStorage.removeItem('journey2AssessmentId')
    sessionStorage.removeItem('journey2Result')
    sessionStorage.setItem('journey2Responses', '{}')
    navigate(`/explore/domain-assessment/${careerId}`)
  }

  return (
    <AssessmentLayout
      onBack={() => navigate('/')}
      showProgress={false}
      title="What&apos;s the domain in your mind?"
      subtitle="Choose the career path you&apos;re currently interested in. Minerva will test your thinking through real-world challenges."
    >
      <div className="max-w-4xl">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {isLoading && <p className="text-center text-brown-light">Loading careers...</p>}
          {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</p>}
          {!isLoading && !error && careers.map((career) => {
            const careerId = career.career_id || career.careerId || career.id
            const careerName = career.career_name || career.careerName || career.name
            return (
              <button key={careerId} type="button" onClick={() => setSelectedCareer(career)} className={`rounded-2xl border-2 bg-white p-6 text-left transition-all sm:p-7 lg:p-8 ${selectedCareer === career ? 'border-orange bg-orange-pill/50 shadow-md' : 'border-beige-border hover:border-orange/40 hover:shadow-md'}`}>
                <h3 className="font-serif text-lg font-semibold text-brown sm:text-xl">{careerName}</h3>
                <p className="mt-2 text-sm text-brown-light">{careerId}</p>
              </button>
            )
          })}
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-brown-light">
              No domain is selected by default. Pick one to continue.
            </p>
            {!selectedCareer && !error && !isLoading && (
              <p className="mt-3 text-sm text-red-600">Please select a career before continuing.</p>
            )}
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button to="/" variant="ghost" size="lg" className="flex-1">
              Back to Home
            </Button>
            <Button
              onClick={handleContinue}
              variant="dark"
              size="lg"
              disabled={!selectedCareer || isLoading || Boolean(error)}
              className="flex-1"
            >
              Continue →
            </Button>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-orange-pill p-6">
          <p className="text-sm text-brown">
            <span className="font-semibold">Tip:</span> Each domain has its own set of practical activities, so pick the career path you want Minerva to test.
          </p>
        </div>
      </div>
    </AssessmentLayout>
  )
}

export default DomainSelection

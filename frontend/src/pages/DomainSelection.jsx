import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import DomainCard from '../components/assessment/DomainCard'
import Button from '../components/common/Button'
import { domains } from '../data/domainActivities'

function DomainSelection() {
  const navigate = useNavigate()
  const [selectedDomain, setSelectedDomain] = useState(null)

  const handleContinue = () => {
    if (!selectedDomain) return

    sessionStorage.setItem('selectedDomain', selectedDomain)
    sessionStorage.setItem('domainResponses', '{}')
    navigate(`/explore/domain-assessment/${selectedDomain}`)
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
          {domains.map((domain) => {
            const Icon = domain.icon
            return (
              <DomainCard
                key={domain.id}
                icon={Icon}
                name={domain.name}
                description={domain.description}
                isSelectable={true}
                isSelected={selectedDomain === domain.id}
                onClick={() => setSelectedDomain(domain.id)}
              />
            )
          })}
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-brown-light">
              No domain is selected by default. Pick one to continue.
            </p>
            {selectedDomain === null && (
              <p className="mt-3 text-sm text-red-600">Please select a domain before continuing.</p>
            )}
          </div>
          <Button
            onClick={handleContinue}
            variant="dark"
            size="lg"
            disabled={!selectedDomain}
          >
            Continue →
          </Button>
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

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import FileUpload from '../components/assessment/FileUpload'
import Button from '../components/common/Button'
import { ArrowRight } from 'lucide-react'

function ResumeUpload() {
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileSelect = (file) => {
    setSelectedFile(file)
  }

  const handleAnalyze = () => {
    if (selectedFile) {
      // Store file info in session
      sessionStorage.setItem(
        'resumeFile',
        JSON.stringify({
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
        })
      )
      navigate('/explore/resume/analysis')
    }
  }

  return (
    <AssessmentLayout onBack={() => navigate('/')} showProgress={false}>
      <div className="rounded-3xl border border-beige-border bg-white p-8 shadow-card sm:p-12 lg:p-16">
        <div className="max-w-2xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-serif text-4xl font-semibold text-brown sm:text-5xl">
              Let's start with your resume.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-brown-light">
              Upload your resume so Minerva can understand your current skills, experience and career profile.
            </p>
          </div>

          {/* File upload */}
          <div className="mb-8">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>

          {/* Info */}
          <div className="mb-12 rounded-2xl bg-orange-pill p-6">
            <p className="text-sm text-brown">
              <span className="font-semibold">What happens next:</span> We'll analyze your resume
              to identify your skills, projects, education, and experience. Then we'll show you
              career matches and skill gaps.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={handleAnalyze}
              variant="dark"
              size="lg"
              icon={ArrowRight}
              disabled={!selectedFile}
              className="flex-1"
            >
              Analyze My Resume
            </Button>
            <Button to="/" variant="ghost" size="lg" className="flex-1">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </AssessmentLayout>
  )
}

export default ResumeUpload

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import FileUpload from '../components/assessment/FileUpload'
import Button from '../components/common/Button'
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  FileText,
  GitBranch,
  Lightbulb,
  Loader,
  Star,
  Target,
} from 'lucide-react'
import { uploadResume } from '../api/minervaApi'
import { useRoute3Assessment } from '../auth/Route3AssessmentContext'
import { saveResumeFile } from '../utils/userData'
import { useAuth } from '../auth/AuthContext'

function ResumeUpload({ analyzeOnly = false }) {
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { setFile, setUploadResult } = useRoute3Assessment()
  const { user } = useAuth()

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      const result = await uploadResume(formData)
      const resumeFile = {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        analysis: result,
      }
      sessionStorage.setItem('resumeFile', JSON.stringify(resumeFile))
      saveResumeFile(user, resumeFile)

      if (analyzeOnly) {
        navigate('/explore/resume/insights', { state: { analysis: result } })
        return
      }

      setFile(selectedFile)
      setUploadResult(result)
      navigate('/explore/resume/analysis')
    } catch (err) {
      console.error('Resume upload failed:', err)
      setError('Failed to upload resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AssessmentLayout contentClassName="assessment-inner max-w-none">
      <button className="back-link" type="button" onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={16} aria-hidden="true" />
        Back to dashboard
      </button>

      <div className="resume-upload-page">
        <div className="resume-upload-card">
          <div className="journey1-intro-badge">
            <FileText size={16} />
            {analyzeOnly ? 'Resume analysis' : 'Path 3 · Job hunting'}
          </div>
          <h1>{analyzeOnly ? 'Analyze your resume' : "Let's start with your resume."}</h1>
          <p className="resume-upload-lede">
            Upload your resume so Minerva can extract skills, strengths, and improvement areas.
          </p>

          <FileUpload onFileSelect={handleFileSelect} className="resume-file-upload" />

          {error && (
            <div className="auth-form-error" role="alert" style={{ marginTop: '1rem' }}>
              <p>{error}</p>
            </div>
          )}

          <div className="resume-upload-next">
            <Lightbulb size={18} />
            <p>
              <strong>What happens next:</strong>{' '}
              {analyzeOnly
                ? 'We’ll show the findings returned by the resume analyzer.'
                : 'We’ll analyze your resume, then continue into the job-hunting assessment.'}
            </p>
          </div>

          <div className="resume-upload-actions">
            <Button onClick={handleAnalyze} variant="secondary" size="lg" icon={loading ? Loader : ArrowRight} disabled={!selectedFile || loading}>
              {loading
                ? analyzeOnly
                  ? 'Analyzing…'
                  : 'Uploading…'
                : analyzeOnly
                  ? 'Analyze resume'
                  : 'Continue'}
            </Button>
          </div>
        </div>

        <aside className="resume-upload-benefits">
          <h2>Why upload your resume?</h2>
          <div className="resume-benefit-list">
            <div className="resume-benefit">
              <span>
                <Target size={18} />
              </span>
              <div>
                <h3>Resume score</h3>
                <p>See the score calculated from your document.</p>
              </div>
            </div>
            <div className="resume-benefit">
              <span>
                <BarChart3 size={18} />
              </span>
              <div>
                <h3>Identified skills</h3>
                <p>Review skills returned by the analyzer.</p>
              </div>
            </div>
            <div className="resume-benefit">
              <span>
                <Star size={18} />
              </span>
              <div>
                <h3>Strengths</h3>
                <p>See strengths found in your experience.</p>
              </div>
            </div>
            <div className="resume-benefit">
              <span>
                <GitBranch size={18} />
              </span>
              <div>
                <h3>Improvement areas</h3>
                <p>Focus on gaps the analyzer surfaces.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </AssessmentLayout>
  )
}

export default ResumeUpload

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import FileUpload from '../components/assessment/FileUpload'
import Button from '../components/common/Button'
import { ArrowLeft, ArrowRight, BarChart3, FileText, GitBranch, Lightbulb, Loader, Star, Target } from 'lucide-react'
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

      // Store file info in session
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
    <AssessmentLayout showProgress={false} contentClassName="max-w-none">
      <div className="resume-upload-page">
        <div className="resume-upload-card">
          <div className="resume-upload-eyebrow"><FileText size={18} /> Resume Analysis</div>
          <h1>Let's start with your<br className="hidden sm:block" /> resume.</h1>
          <p className="resume-upload-lede">
            Upload your resume so Minerva can identify information contained in the document.
          </p>

          <FileUpload onFileSelect={handleFileSelect} className="resume-file-upload" />

          {error && (
            <div className="resume-upload-error">
              <p>{error}</p>
            </div>
          )}

          <div className="resume-upload-next">
            <div className="resume-upload-next-icon"><Lightbulb size={18} /></div>
            <p><strong>What happens next:</strong> We'll analyze the information in your resume and show the findings returned by the resume analyzer.</p>
          </div>

          <div className="resume-upload-actions">
            <Button to="/" variant="ghost" size="lg" className="resume-back-button" icon={ArrowLeft} iconPosition="left">
              Back to Home
            </Button>
            <Button
              onClick={handleAnalyze}
              variant="secondary"
              size="lg"
              icon={loading ? Loader : ArrowRight}
              disabled={!selectedFile || loading}
              className="resume-analyze-button"
            >
              {loading ? (analyzeOnly ? 'Analyzing...' : 'Uploading...') : 'Analyze My Resume'}
            </Button>
          </div>
        </div>

        <aside className="resume-upload-benefits">
          <h2><span className="resume-benefit-heading-icon"><FileText size={18} /></span>Why upload your resume?</h2>
          <div className="resume-benefit-list">
            <div className="resume-benefit"><span><Target size={19} /></span><div><h3>Resume Score</h3><p>See the score calculated from your resume.</p></div></div>
            <div className="resume-benefit"><span><BarChart3 size={19} /></span><div><h3>Identified Skills</h3><p>Review the skills returned by the analyzer.</p></div></div>
            <div className="resume-benefit"><span><Star size={19} /></span><div><h3>Strengths</h3><p>See the strengths found in your resume.</p></div></div>
            <div className="resume-benefit"><span><GitBranch size={19} /></span><div><h3>Improvement Areas</h3><p>Review the improvement areas returned by the analyzer.</p></div></div>
          </div>
          <div className="resume-benefit-art" aria-hidden="true"><FileText size={116} strokeWidth={1.1} /></div>
        </aside>
      </div>
    </AssessmentLayout>
  )
}

export default ResumeUpload

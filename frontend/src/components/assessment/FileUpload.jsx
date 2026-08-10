import { useRef, useState } from 'react'
import { Upload, File, X } from 'lucide-react'

function FileUpload({ onFileSelect, accept = '.pdf,.docx', maxSize = 5 }) {
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const handleFileValidation = (selectedFile) => {
    setError(null)

    if (!selectedFile) return

    // Check file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or DOCX file')
      return
    }

    // Check file size (in MB)
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    setFile(selectedFile)
    onFileSelect?.(selectedFile)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    
    const droppedFile = e.dataTransfer.files?.[0]
    handleFileValidation(droppedFile)
  }

  const handleFileInput = (e) => {
    const selectedFile = e.target.files?.[0]
    handleFileValidation(selectedFile)
  }

  const handleClear = () => {
    setFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 ${
          isDragActive
            ? 'border-orange bg-orange-pill/30'
            : 'border-beige-border bg-white hover:border-orange/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
          aria-label="Upload file"
        />

        <div className="cursor-pointer p-8 sm:p-10 text-center" onClick={() => fileInputRef.current?.click()}>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-pill text-orange">
            <Upload className="h-7 w-7" aria-hidden="true" />
          </div>
          <h3 className="font-semibold text-brown">Drag and drop your resume here</h3>
          <p className="mt-2 text-sm text-brown-light">or click to browse files</p>
          <p className="mt-3 text-xs text-brown-light/60">
            Supported formats: PDF, DOCX · Max size: {maxSize}MB
          </p>
        </div>
      </div>

      {/* File preview */}
      {file && (
        <div className="flex items-center justify-between rounded-xl border border-beige-border bg-cream-dark p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-pill text-orange">
              <File className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-brown">{file.name}</p>
              <p className="text-xs text-brown-light">
                {(file.size / 1024 / 1024).toFixed(2)}MB
              </p>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="inline-flex items-center justify-center rounded-lg p-2 text-brown-light transition-colors hover:bg-white hover:text-brown"
            aria-label="Remove file"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}
    </div>
  )
}

export default FileUpload

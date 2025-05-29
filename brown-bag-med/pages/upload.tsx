import { useState } from 'react'

export default function UploadPage() {
  const [patientId, setPatientId] = useState<string | null>(null)
  const [files, setFiles] = useState<FileList | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async () => {
    if (!files) return
    setIsUploading(true)

    const formData = new FormData()
    Array.from(files).forEach(file => formData.append('files', file))

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const data = await response.json()
    setPatientId(data.patientId)
    setIsUploading(false)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Upload Your Medications</h1>
      <p>Anonymous and secure — no personal data required.</p>

      <input
        type="file"
        multiple
        accept="image/*,.pdf"
        onChange={e => setFiles(e.target.files)}
      />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>

      {patientId && (
        <div>
          <h3>Upload successful!</h3>
          <p>Bookmark this link to check your report in 48–72 hours:</p>
          <a href={`/report/${patientId}`} target="_blank">
            {`/report/${patientId}`}
          </a>
        </div>
      )}
    </div>
  )
}

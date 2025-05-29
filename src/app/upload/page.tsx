'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './upload.module.css'

export default function UploadPage () {
  const [files, setFiles] = useState<FileList | null>(null)
  const [isAgreed, setIsAgreed] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const router = useRouter()

  // New state for optional health info
  const [healthInfo, setHealthInfo] = useState({
    dateOfBirth: '',
    medicalConditions: '',
    knownAllergies: '',
    additionalComments: ''
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files)
    setUploadMessage('')
  }

  const handleHealthInfoChange = (field: string, value: string) => {
    setHealthInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!files || files.length === 0) {
      setUploadMessage('Please select at least one file to upload.')
      return
    }

    if (!isAgreed) {
      setUploadMessage('Please agree to the anonymous analysis terms.')
      return
    }

    setIsUploading(true)
    setUploadMessage('Uploading your medications...')

    try {
      const formData = new FormData()

      // Add all selected files to FormData
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }

      // Add health information as JSON
      formData.append('healthInfo', JSON.stringify(healthInfo))

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()

      // Redirect to the confirmation page with the patient ID
      router.push(`/confirmation/${result.patientId}`)
    } catch (error) {
      console.error('Upload error:', error)
      setUploadMessage('Upload failed. Please try again.')
      setIsUploading(false)
    }
  }

  const removeFile = (index: number) => {
    if (!files) return

    const fileArray = Array.from(files)
    fileArray.splice(index, 1)

    // Create new FileList-like object
    const dt = new DataTransfer()
    fileArray.forEach(file => dt.items.add(file))
    setFiles(dt.files)
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Upload Your Medications</h1>
          <p className={styles.subtitle}>
            Upload clear photos or PDF files of your medication packages,
            prescriptions, or medication lists for professional analysis.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* File Upload Section */}
          <div className={styles.uploadSection}>
            <label htmlFor='fileInput' className={styles.uploadLabel}>
              <div className={styles.uploadArea}>
                <div className={styles.uploadIcon}>
                  <svg
                    width='48'
                    height='48'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                  >
                    <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                    <polyline points='7,10 12,15 17,10' />
                    <line x1='12' y1='15' x2='12' y2='3' />
                  </svg>
                </div>
                <div className={styles.uploadText}>
                  <span className={styles.uploadPrimary}>
                    Click to upload files
                  </span>
                  <span className={styles.uploadSecondary}>
                    or drag and drop
                  </span>
                </div>
                <p className={styles.uploadHint}>
                  Images (PNG, JPG, JPEG) or PDF files up to 10MB each
                </p>
              </div>
            </label>
            <input
              id='fileInput'
              type='file'
              multiple
              accept='image/*,.pdf'
              onChange={handleFileChange}
              className={styles.fileInput}
            />
          </div>

          {/* Selected Files Display */}
          {files && files.length > 0 && (
            <div className={styles.filesSection}>
              <h3 className={styles.filesTitle}>
                Selected Files ({files.length})
              </h3>
              <div className={styles.filesList}>
                {Array.from(files).map((file, index) => (
                  <div key={index} className={styles.fileItem}>
                    <div className={styles.fileInfo}>
                      <div className={styles.fileIcon}>
                        {file.type.startsWith('image/') ? (
                          <svg
                            width='20'
                            height='20'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                          >
                            <rect
                              x='3'
                              y='3'
                              width='18'
                              height='18'
                              rx='2'
                              ry='2'
                            />
                            <circle cx='8.5' cy='8.5' r='1.5' />
                            <polyline points='21,15 16,10 5,21' />
                          </svg>
                        ) : (
                          <svg
                            width='20'
                            height='20'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                          >
                            <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
                            <polyline points='14,2 14,8 20,8' />
                          </svg>
                        )}
                      </div>
                      <div className={styles.fileDetails}>
                        <span className={styles.fileName}>{file.name}</span>
                        <span className={styles.fileSize}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <button
                      type='button'
                      onClick={() => removeFile(index)}
                      className={styles.removeButton}
                      aria-label='Remove file'
                    >
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                      >
                        <line x1='18' y1='6' x2='6' y2='18' />
                        <line x1='6' y1='6' x2='18' y2='18' />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Health Info Section */}
          <div className={styles.healthInfoSection}>
            <h3 className={styles.healthInfoTitle}>Optional Health Info</h3>
            <p className={styles.healthInfoSubtitle}>
              This information helps our pharmacists provide more accurate
              analysis (all fields are optional)
            </p>

            <div className={styles.healthInfoGrid}>
              {/* Date of Birth */}
              <div className={styles.inputGroup}>
                <label htmlFor='dateOfBirth' className={styles.inputLabel}>
                  Date of Birth
                </label>
                <input
                  id='dateOfBirth'
                  type='date'
                  value={healthInfo.dateOfBirth}
                  onChange={e =>
                    handleHealthInfoChange('dateOfBirth', e.target.value)
                  }
                  className={styles.dateInput}
                />
              </div>

              {/* Medical Conditions */}
              <div className={styles.inputGroup}>
                <label
                  htmlFor='medicalConditions'
                  className={styles.inputLabel}
                >
                  Medical Conditions
                </label>
                <textarea
                  id='medicalConditions'
                  placeholder='e.g. diabetes, hypertension'
                  value={healthInfo.medicalConditions}
                  onChange={e =>
                    handleHealthInfoChange('medicalConditions', e.target.value)
                  }
                  className={styles.textareaInput}
                  rows={3}
                />
              </div>

              {/* Known Allergies */}
              <div className={styles.inputGroup}>
                <label htmlFor='knownAllergies' className={styles.inputLabel}>
                  Known Allergies
                </label>
                <textarea
                  id='knownAllergies'
                  placeholder='e.g. penicillin, lactose'
                  value={healthInfo.knownAllergies}
                  onChange={e =>
                    handleHealthInfoChange('knownAllergies', e.target.value)
                  }
                  className={styles.textareaInput}
                  rows={3}
                />
              </div>

              {/* Additional Comments */}
              <div className={styles.inputGroup}>
                <label
                  htmlFor='additionalComments'
                  className={styles.inputLabel}
                >
                  Additional Comments
                </label>
                <textarea
                  id='additionalComments'
                  placeholder="Anything else you'd like us to know?"
                  value={healthInfo.additionalComments}
                  onChange={e =>
                    handleHealthInfoChange('additionalComments', e.target.value)
                  }
                  className={styles.textareaInput}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className={styles.consentSection}>
            <label className={styles.checkboxLabel}>
              <input
                type='checkbox'
                checked={isAgreed}
                onChange={e => setIsAgreed(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                I agree that my medications will be analyzed anonymously for
                clinical safety
              </span>
            </label>
          </div>

          {/* Upload Message */}
          {uploadMessage && (
            <div className={styles.message}>{uploadMessage}</div>
          )}

          {/* Submit Button */}
          <button
            type='submit'
            disabled={!files || files.length === 0 || !isAgreed || isUploading}
            className={styles.submitButton}
          >
            {isUploading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <span>Uploading...</span>
              </div>
            ) : (
              'Upload for Analysis'
            )}
          </button>
        </form>

        {/* Information Section */}
        <div className={styles.infoSection}>
          <h3 className={styles.infoTitle}>What happens next?</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoNumber}>1</div>
              <p>Your files are uploaded securely and anonymously</p>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoNumber}>2</div>
              <p>Licensed pharmacists review your medications</p>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoNumber}>3</div>
              <p>You receive a detailed safety analysis report</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

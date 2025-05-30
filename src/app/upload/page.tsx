'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CreatableSelect from 'react-select/creatable';
import styles from './upload.module.css'

// Explicit type for react-select options
interface OptionType {
  value: string;
  label: string;
}

export default function UploadPage () {
  const [files, setFiles] = useState<FileList | null>(null)
  const [isAgreed, setIsAgreed] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const router = useRouter()

  // New state for optional health info
  const [healthInfo, setHealthInfo] = useState({
    dateOfBirth: '',
    medicalConditions: [], // array of strings
    knownAllergies: '',
    additionalComments: '',
    gender: ''
  })

  // Use useState to generate a stable, client-only ID for react-select
  const [medicalConditionsId] = useState(() => `react-select-${Math.random().toString(36).slice(2)}`);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files)
    setUploadMessage('')
  }

  const handleHealthInfoChange = (field: string, value: string | string[]) => {
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

      // Prepare health info for submission
      let healthInfoToSend = { ...healthInfo }

      // Convert dateOfBirth to ISO format if valid DD.MM.YYYY
      if (healthInfo.dateOfBirth && /^\d{2}\.\d{2}\.\d{4}$/.test(healthInfo.dateOfBirth)) {
        const [day, month, year] = healthInfo.dateOfBirth.split('.')
        healthInfoToSend.dateOfBirth = `${year}-${month}-${day}`
      }

      // If needed, convert array to string for backend
      if (Array.isArray(healthInfo.medicalConditions)) {
        healthInfoToSend.medicalConditions = healthInfo.medicalConditions.filter(Boolean)
      }

      formData.append('healthInfo', JSON.stringify(healthInfoToSend))

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
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
              className={`${styles.fileInput} text-black bg-white placeholder-gray-500 border border-gray-300 p-2 w-full rounded`}
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
          <div className={styles.healthInfoSection + " bg-white/80"}>
            <h3 className={styles.healthInfoTitle}> Basic Informations</h3>
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
                  type='text'
                  inputMode='numeric'
                  pattern='\d{2}\.\d{2}\.\d{4}'
                  placeholder='DD.MM.YYYY'
                  value={healthInfo.dateOfBirth}
                  onChange={e => handleHealthInfoChange('dateOfBirth', e.target.value)}
                  className={styles.dateInput + ' w-full'}
                />
                <span className="date-format-note">Format: DD.MM.YYYY</span>
              </div>

              {/* Medical Conditions */}
              <div className={styles.inputGroup} style={{ position: 'relative', zIndex: 20 }}>
                <label htmlFor={medicalConditionsId} className={styles.inputLabel}>
                  Medical Conditions
                </label>
                <CreatableSelect<OptionType, true>
                  inputId={medicalConditionsId}
                  key={medicalConditionsId}
                  isMulti
                  placeholder="e.g. diabetes, hypertension..."
                  options={[
                    { value: 'Hypertension', label: 'Hypertension' },
                    { value: 'Diabetes', label: 'Diabetes' },
                    { value: 'Asthma', label: 'Asthma' },
                    { value: 'COPD', label: 'COPD' },
                    { value: 'Heart Disease', label: 'Heart Disease' },
                    { value: 'Cancer', label: 'Cancer' },
                    { value: 'Thyroid Disorder', label: 'Thyroid Disorder' },
                    { value: 'Arthritis', label: 'Arthritis' },
                    { value: 'Depression', label: 'Depression' },
                    { value: 'Anxiety', label: 'Anxiety' },
                  ]}
                  value={Array.isArray(healthInfo.medicalConditions)
                    ? healthInfo.medicalConditions.filter(Boolean).map((c) => ({ value: c, label: c }))
                    : []}
                  onChange={(selected) =>
                    handleHealthInfoChange(
                      'medicalConditions',
                      Array.isArray(selected)
                        ? selected.filter((opt): opt is OptionType => !!opt && typeof opt.value === 'string').map(opt => opt.value)
                        : []
                    )
                  }
                  classNamePrefix="react-select"
                  menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                  menuPosition="fixed"
                  styles={{
                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                    option: base => ({ ...base, color: '#000', backgroundColor: '#fff' }),
                    menu: base => ({ ...base, backgroundColor: '#fff' }),
                    multiValueRemove: base => ({ ...base, display: 'none' }), // Remove the small empty square/icon
                  }}
                  isClearable
                  aria-label="Medical Conditions"
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
                  onChange={e => handleHealthInfoChange('knownAllergies', e.target.value)}
                  className="bg-white text-black placeholder-gray-500 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                  onChange={e => handleHealthInfoChange('additionalComments', e.target.value)}
                  className="bg-white text-black placeholder-gray-500 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={3}
                />
              </div>

              {/* Gender Selection */}
              <div className={styles.inputGroup}>
                <label htmlFor="gender" className={styles.inputLabel}>
                  Gender
                </label>
                <select
                  id="gender"
                  value={healthInfo.gender || ''}
                  onChange={e => handleHealthInfoChange('gender', e.target.value)}
                  className="dateInput" // uses same styling as other inputs
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className={styles.agreementSection}>
            <label className={styles.agreementLabel}>
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={e => setIsAgreed(e.target.checked)}
                className={styles.agreementCheckbox}
              />
              <span className={styles.agreementText}>
                I agree to the{' '}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.agreementLink}
                >
                  terms of anonymous analysis
                </a>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className={`${styles.submitButton} ${
              isUploading ? styles.uploading : ''
            }`}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Medications'}
          </button>

          {/* Upload Message */}
          {uploadMessage && (
            <p className={styles.uploadMessage}>{uploadMessage}</p>
          )}
        </form>
      </div>
    </div>
  )
}

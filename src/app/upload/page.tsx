'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CreatableSelect from 'react-select/creatable';
import styles from './upload.module.css'

// Explicit type for react-select options
interface OptionType {
  value: string;
  label: string;
}

export default function UploadPage () {
  // Change files state to an array of File
  const [medications, setMedications] = useState<File[]>([]);
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
    gender: '',
    medicationNotes: '' // <-- add this field for free-text medication entry
  })

  // Use useState to generate a stable, client-only ID for react-select
  const [medicalConditionsId] = useState(() => `react-select-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    console.log("Landing page mounted");
  }, []);

  // Update handleFileChange to append files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setMedications((prev) => [...prev, ...newFiles]);
    setUploadMessage('');
  };

  const handleHealthInfoChange = (field: string, value: string | string[]) => {
    setHealthInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (medications.length === 0) {
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
      medications.forEach((file) => formData.append('files', file))

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

  // Add removeMedication and clearAllMedications
  const removeMedication = (index: number) => {
    setMedications((prev) => prev.filter((_, i) => i !== index));
  };
  const clearAllMedications = () => {
    setMedications([]);
  };

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

          {/* Uploaded Medications List */}
          {medications.length > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {medications.map((file, idx) => (
                <div key={idx} className="flex items-center bg-gray-50 rounded p-2 shadow-sm">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded mr-3 border"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded mr-3">
                      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="24" height="24" rx="4"/><text x="16" y="22" textAnchor="middle" fontSize="10" fill="#333">PDF</text></svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-xs font-medium truncate">{file.name}</div>
                    <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <button type="button" onClick={() => removeMedication(idx)} className="ml-2 text-red-500 hover:text-red-700 text-lg font-bold">×</button>
                </div>
              ))}
              <button type="button" onClick={clearAllMedications} className="col-span-full mt-2 text-xs text-gray-600 underline hover:text-red-600">Clear All</button>
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

              {/* Free-text Medication Entry */}
              <div className={styles.inputGroup}>
                <label htmlFor="medicationNotes" className="block text-sm font-medium text-black mb-1">
                  Write your medications (optional)
                </label>
                <textarea
                  id="medicationNotes"
                  name="medicationNotes"
                  rows={4}
                  placeholder="e.g., Metformin 500mg, taken twice daily"
                  className="w-full p-2 border border-gray-300 rounded-md text-black placeholder-gray-500 mb-4"
                  value={healthInfo.medicationNotes ?? ''}
                  onChange={e => handleHealthInfoChange('medicationNotes', e.target.value)}
                />
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

          {/* Submit Button and Follow-up Link in vertical flex container */}
          <div className="flex flex-col items-center">
            <button
              type='submit'
              className={`${styles.submitButton} ${isUploading ? styles.uploading : ''}`}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Medications'}
            </button>
          </div>
          <div className="mt-6 text-left">
            <a
              id="followup-link"
              href="/follow-up"
              className="block text-sm text-blue-600 hover:text-blue-800 border border-red-500 bg-yellow-100"
              style={{ display: 'inline-block', padding: '2px 8px', background: '#fff' }}
            >
              &larr; Have a question about your report?
            </a>
          </div>

          {/* Upload Message */}
          {uploadMessage && (
            <p className={styles.uploadMessage}>{uploadMessage}</p>
          )}
        </form>
      </div>
    </div>
  )
}

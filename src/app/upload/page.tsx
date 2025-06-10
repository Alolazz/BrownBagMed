'use client'

import { useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable';
import Link from 'next/link';
import Image from 'next/image'
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

  // --- Date of Birth Formatting and Validation ---
  const [dobError, setDobError] = useState<string>('');
  const [medicationNotesError, setMedicationNotesError] = useState<string>('');
  // Add state for medicalConditionsError
  const [medicalConditionsError, setMedicalConditionsError] = useState<string>('');

  // Helper: Format input as DD.MM.YY or DD.MM.YYYY with dots
  function formatGermanDateInput(raw: string): string {
    // Remove all non-digits
    const digits = raw.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0,2)}.${digits.slice(2)}`;
    if (digits.length <= 6) return `${digits.slice(0,2)}.${digits.slice(2,4)}.${digits.slice(4)}`;
    // 8 digits: DDMMYYYY
    return `${digits.slice(0,2)}.${digits.slice(2,4)}.${digits.slice(4,8)}`;
  }

  // Helper: Validate DD.MM.YYYY (or DD.MM.YY)
  function isValidGermanDate(date: string): boolean {
    // Accept DD.MM.YYYY or DD.MM.YY
    if (!/^\d{2}\.\d{2}\.(\d{2}|\d{4})$/.test(date)) return false;
    const [d, m, y] = date.split('.');
    const day = parseInt(d, 10);
    const month = parseInt(m, 10);
    let year = parseInt(y, 10);
    if (y.length === 2) {
      // Assume 19xx for > 30, else 20xx
      year += year > 30 ? 1900 : 2000;
    }
    const dt = new Date(year, month - 1, day);
    return (
      dt.getFullYear() === year &&
      dt.getMonth() === month - 1 &&
      dt.getDate() === day
    );
  }

  // Enhanced handler for date input
  const handleDateOfBirthChange = (raw: string) => {
    const formatted = formatGermanDateInput(raw);
    setHealthInfo(prev => ({ ...prev, dateOfBirth: formatted }));
    setDobError(''); // Clear error on change
  };

  useEffect(() => {
    // console.log("Landing page mounted"); // Remove debug log for production
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

  // Add dynamic error message logic for all required fields
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let hasError = false;

    // Validate date of birth (required)
    if (!healthInfo.dateOfBirth) {
        setDobError('This field is required.');
        hasError = true;
    } else if (!/^\d{2}\.\d{2}\.\d{4}$/.test(healthInfo.dateOfBirth) || !isValidGermanDate(healthInfo.dateOfBirth)) {
        setDobError('Please enter a valid date in DD.MM.YYYY format.');
        hasError = true;
    } else {
        setDobError('');
    }

    // Validate medicationNotes (required)
    if (!healthInfo.medicationNotes || healthInfo.medicationNotes.trim() === '') {
        setMedicationNotesError('This field is required.');
        hasError = true;
    } else {
        setMedicationNotesError('');
    }

    // Validate known allergies (required)
    if (!healthInfo.knownAllergies || healthInfo.knownAllergies.trim() === '') {
        setUploadMessage('Please enter your known allergies.');
        hasError = true;
    } 

    // Validate additional comments (required)
    if (!healthInfo.additionalComments || healthInfo.additionalComments.trim() === '') {
        setUploadMessage('Please enter any additional comments.');
        hasError = true;
    } 

    // Validate gender (required)
    if (!healthInfo.gender) {
        setUploadMessage('Please select your gender.');
        hasError = true;
    } 

    // Validate medicalConditions (required)
    if (!healthInfo.medicalConditions || healthInfo.medicalConditions.length === 0) {
        setMedicalConditionsError('This field is required.');
        hasError = true;
    } else {
        setMedicalConditionsError('');
    }

    if (hasError) {
        setUploadMessage('Please fill in all required fields.');
        return;
    }

    if (medications.length === 0) {
        setUploadMessage('Please select at least one file to upload.')
        return
    }

    if (!isAgreed) {
        setUploadMessage('Please agree to the anonymous analysis terms.')
        return
    }

    // Validate date of birth if provided
    if (healthInfo.dateOfBirth) {
      if (!/^\d{2}\.\d{2}\.\d{4}$/.test(healthInfo.dateOfBirth) || !isValidGermanDate(healthInfo.dateOfBirth)) {
        setDobError('Please enter a valid date in DD.MM.YYYY format.');
        setUploadMessage('');
        return;
      }
    }

    setIsUploading(true);
    setUploadMessage('Uploading your medications...')
    try {
      const formData = new FormData();
      medications.forEach((file) => formData.append('files', file));
      formData.append('healthInfo', JSON.stringify(healthInfo));

      const response = await fetch('/api/uploadReport', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        window.location.href = `/uploads/${result.patientId}`;
      } else {
        setUploadMessage(result.error || 'Upload failed. Please try again.');
      }
    } catch (error) {
      setUploadMessage(error instanceof Error ? error.message : 'Upload failed. Please try again.');
      setIsUploading(false);
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
      {/* Brown Bag Med Title with Link */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <Link href="/" aria-label="Back to Home">
          <h1 className={styles.mainTitle} style={{ cursor: 'pointer', marginBottom: 0 }}>
            Brown Bag Med
          </h1>
        </Link>
      </div>

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
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded mr-3 border"
                      unoptimized
                      loading="lazy"
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
          <div className={styles.healthInfoSection} style={{ background: '#ffffff' }}>
            <h3 className={styles.healthInfoTitle}> Patient Information</h3>
            <p className={styles.healthInfoSubtitle}>
              This information helps our pharmacists provide more accurate
              analysis and recommendations.
            </p>

            <div className={styles.healthInfoGrid}>
              {/* Date of Birth */}
              <div className={styles.inputGroup}>
                <label htmlFor='dateOfBirth' className={styles.inputLabel}>
                  Date of Birth <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <input
                  id='dateOfBirth'
                  type='text'
                  inputMode='numeric'
                  pattern='\d{2}\.\d{2}\.\d{4}'
                  placeholder='DD.MM.YYYY'
                  value={healthInfo.dateOfBirth}
                  onChange={e => handleDateOfBirthChange(e.target.value)}
                  maxLength={10}
                  className={
                    styles.dateInput +
                    ' w-full' +
                    (dobError ? ' border-red-500 focus:ring-red-500 focus:border-red-500' : '')
                  }
                  aria-invalid={!!dobError}
                  aria-describedby={dobError ? 'dob-error' : undefined}
                />
                {/* Remove inline error message and display it dynamically */}
                <span className="date-format-note">Format: DD.MM.YYYY</span>
                {/* Add dynamic error message for 'Date of Birth' field */}
                {dobError && <span id="dob-error" className="text-xs text-red-600">{dobError}</span>}
              </div>

              {/* Medical Conditions */}
              <div className={styles.inputGroup}>
                <label htmlFor={medicalConditionsId} className={styles.inputLabel}>
                  Medical Conditions <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <div className={dobError ? 'border border-red-500 rounded' : ''}>
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
                      multiValueRemove: base => ({ ...base, display: 'none' }),
                    }}
                    isClearable
                    aria-label="Medical Conditions"
                  />
                </div>
                {/* Add dynamic error message for 'Medical Conditions' field */}
                {medicalConditionsError && <span id="medicalConditions-error" className="text-xs text-red-600">{medicalConditionsError}</span>}
              </div>

              {/* Known Allergies */}
              <div className={styles.inputGroup}>
                <label htmlFor='knownAllergies' className={styles.inputLabel}>
                  Known Allergies <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <textarea
                  id='knownAllergies'
                  placeholder='e.g. penicillin, lactose'
                  value={healthInfo.knownAllergies}
                  onChange={e => handleHealthInfoChange('knownAllergies', e.target.value)}
                  className={
                    'bg-white text-black placeholder-gray-500 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400' +
                    (!healthInfo.knownAllergies ? ' border-red-500 focus:ring-red-500 focus:border-red-500' : '')
                  }
                  rows={3}
                  aria-invalid={!healthInfo.knownAllergies}
                  aria-describedby={!healthInfo.knownAllergies ? 'knownAllergies-error' : undefined}
                />
                {/* Add dynamic error message for 'Known Allergies' field */}
                {!healthInfo.knownAllergies && <span id="knownAllergies-error" className="text-xs text-red-600">This field is required.</span>}
              </div>

              {/* Additional Comments */}
              <div className={styles.inputGroup}>
                <label htmlFor='additionalComments' className={styles.inputLabel}>
                  Additional Comments <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <textarea
                  id='additionalComments'
                  placeholder="Anything else you'd like us to know?"
                  value={healthInfo.additionalComments}
                  onChange={e => handleHealthInfoChange('additionalComments', e.target.value)}
                  className={
                    'bg-white text-black placeholder-gray-500 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400' +
                    (!healthInfo.additionalComments ? ' border-red-500 focus:ring-red-500 focus:border-red-500' : '')
                  }
                  rows={3}
                  aria-invalid={!healthInfo.additionalComments}
                  aria-describedby={!healthInfo.additionalComments ? 'additionalComments-error' : undefined}
                />
                {/* Add dynamic error message for 'Additional Comments' field */}
                {!healthInfo.additionalComments && <span id="additionalComments-error" className="text-xs text-red-600">This field is required.</span>}
              </div>

              {/* Gender Selection */}
              <div className={styles.inputGroup}>
                <label htmlFor="gender" className={styles.inputLabel}>
                  Gender <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <select
                  id="gender"
                  value={healthInfo.gender || ''}
                  onChange={e => handleHealthInfoChange('gender', e.target.value)}
                  className={
                    'dateInput' + (!healthInfo.gender ? ' border-red-500 focus:ring-red-500 focus:border-red-500' : '')
                  }
                  aria-invalid={!healthInfo.gender}
                  aria-describedby={!healthInfo.gender ? 'gender-error' : undefined}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {/* Add dynamic error message for 'Gender' field */}
                {!healthInfo.gender && <span id="gender-error" className="text-xs text-red-600">This field is required.</span>}
              </div>

              {/* Free-text Medication Entry */}
              <div className={styles.inputGroup}>
                <label htmlFor="medicationNotes" className={styles.inputLabel}>
                  Write your medications <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="medicationNotes"
                  name="medicationNotes"
                  rows={4}
                  placeholder="e.g., Metformin 500mg, taken twice daily"
                  className={
                    "w-full p-2 border border-gray-300 rounded-md text-black placeholder-gray-500 mb-4" +
                    (medicationNotesError ? ' border-red-500 focus:ring-red-500 focus:border-red-500' : '')
                  }
                  value={healthInfo.medicationNotes ?? ''}
                  onChange={e => handleHealthInfoChange('medicationNotes', e.target.value)}
                  aria-invalid={!!medicationNotesError}
                  aria-describedby={medicationNotesError ? 'medicationNotes-error' : undefined}
                />
                {/* Add dynamic error message for 'Write your medications' field */}
                {medicationNotesError && <span id="medicationNotes-error" className="text-xs text-red-600">{medicationNotesError}</span>}
              </div>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className={styles.agreementSection}>
            <label className={
              styles.agreementLabel + (!isAgreed && uploadMessage === 'Please agree to the anonymous analysis terms.' ? ' text-red-600' : '')
            }>
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={e => setIsAgreed(e.target.checked)}
                className={
                  styles.agreementCheckbox + (!isAgreed && uploadMessage === 'Please agree to the anonymous analysis terms.' ? ' border-red-500 ring-2 ring-red-500' : '')
                }
                aria-invalid={!isAgreed && uploadMessage === 'Please agree to the anonymous analysis terms.'}
                aria-describedby={!isAgreed && uploadMessage === 'Please agree to the anonymous analysis terms.' ? 'agreement-error' : undefined}
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
            {!isAgreed && uploadMessage === 'Please agree to the anonymous analysis terms.' && (
              <span id="agreement-error" className="text-xs text-red-600">You must agree to the terms.</span>
            )}
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

          {/* Upload Message */}
          {uploadMessage && (
            <p className={styles.uploadMessage}>{uploadMessage}</p>
          )}
        </form>
      </div>
    </div>
  )
}

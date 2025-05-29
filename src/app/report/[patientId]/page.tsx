'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './report.module.css'

interface PatientMetadata {
  patientId: string
  uploadTimestamp: string
  filesCount: number
  files: Array<{
    fileName: string
    originalName: string
    size: number
    type: string
  }>
  healthInfo: {
    dateOfBirth: string | null
    medicalConditions: string | null
    knownAllergies: string | null
    additionalComments: string | null
  } | null
  status: string
  analysisStatus: string
}

export default function ReportPage () {
  const params = useParams()
  const patientId = params.patientId as string
  const [metadata, setMetadata] = useState<PatientMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (patientId) {
      fetchPatientData()
    }
  }, [patientId])

  const fetchPatientData = async () => {
    try {
      const response = await fetch(`/api/patient/${patientId}`)
      if (response.ok) {
        const data = await response.json()
        setMetadata(data)
      } else {
        setError('Patient data not found')
      }
    } catch (err) {
      setError('Failed to load patient data')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>Loading your report...</p>
        </div>
      </div>
    )
  }

  if (error || !metadata) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <h1>Report Not Found</h1>
          <p>{error || 'Unable to load patient data'}</p>
          <a href='/upload' className={styles.backButton}>
            Start New Upload
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Medication Analysis Report</h1>
        <div className={styles.patientInfo}>
          <span className={styles.patientId}>
            Patient ID: {metadata.patientId}
          </span>
          <span className={styles.uploadDate}>
            Uploaded: {formatDate(metadata.uploadTimestamp)}
          </span>
        </div>
      </div>

      <div className={styles.statusCard}>
        <div className={styles.statusHeader}>
          <h2>Analysis Status</h2>
          <span
            className={`${styles.statusBadge} ${
              styles[metadata.analysisStatus]
            }`}
          >
            {metadata.analysisStatus.charAt(0).toUpperCase() +
              metadata.analysisStatus.slice(1)}
          </span>
        </div>
        <p className={styles.statusDescription}>
          {metadata.analysisStatus === 'pending'
            ? 'Your medication images are being reviewed by our licensed pharmacists. You will receive your detailed analysis report within 24-48 hours.'
            : 'Analysis complete! Your report is ready for download.'}
        </p>
      </div>

      <div className={styles.filesCard}>
        <h2>Uploaded Files ({metadata.filesCount})</h2>
        <div className={styles.filesList}>
          {metadata.files.map((file, index) => (
            <div key={index} className={styles.fileItem}>
              <div className={styles.fileIcon}>
                {file.type.includes('image') ? '🖼️' : '📄'}
              </div>
              <div className={styles.fileDetails}>
                <span className={styles.fileName}>{file.originalName}</span>
                <span className={styles.fileSize}>
                  {formatFileSize(file.size)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {metadata.healthInfo && (
        <div className={styles.healthCard}>
          <h2>Health Information Provided</h2>
          <div className={styles.healthGrid}>
            {metadata.healthInfo.dateOfBirth && (
              <div className={styles.healthItem}>
                <label>Date of Birth:</label>
                <span>{metadata.healthInfo.dateOfBirth}</span>
              </div>
            )}
            {metadata.healthInfo.medicalConditions && (
              <div className={styles.healthItem}>
                <label>Medical Conditions:</label>
                <span>{metadata.healthInfo.medicalConditions}</span>
              </div>
            )}
            {metadata.healthInfo.knownAllergies && (
              <div className={styles.healthItem}>
                <label>Known Allergies:</label>
                <span>{metadata.healthInfo.knownAllergies}</span>
              </div>
            )}
            {metadata.healthInfo.additionalComments && (
              <div className={styles.healthItem}>
                <label>Additional Comments:</label>
                <span>{metadata.healthInfo.additionalComments}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.actionsCard}>
        <h2>Next Steps</h2>
        <div className={styles.actionButtons}>
          <button
            className={styles.primaryButton}
            disabled={metadata.analysisStatus === 'pending'}
          >
            {metadata.analysisStatus === 'pending'
              ? 'Analysis in Progress...'
              : 'Download Report ($29.99)'}
          </button>
          <button className={styles.secondaryButton}>Contact Pharmacist</button>
        </div>
        <p className={styles.disclaimer}>
          * Payment will be processed only after your analysis is complete.
          You'll receive an email notification when your report is ready.
        </p>
      </div>

      <div className={styles.footer}>
        <a href='/upload' className={styles.backLink}>
          ← Start New Analysis
        </a>
      </div>
    </div>
  )
}

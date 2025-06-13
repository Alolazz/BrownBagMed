'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import styles from './confirmation.module.css'

interface PatientInfo {
  name: string
  age: number
  conditions: string[]
}

interface UploadedFile {
  name: string
  url: string
}

export default function ConfirmationPage() {
  const params = useParams()
  const patientId = params.patientId as string
  const [reportReady, setReportReady] = useState<null | boolean>(null)
  const [checking, setChecking] = useState(true)
  const [copied, setCopied] = useState(false)
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const pathname = usePathname()

  // Build the full URL for copy
  const fullUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${pathname}`
    : pathname

  useEffect(() => {
    if (!patientId) return
    setChecking(true)

    // Fetch report status
    fetch(`/api/checkReportReady?patientId=${encodeURIComponent(patientId)}`)
      .then(res => res.json())
      .then(data => {
        setReportReady(!!data.exists)
        setChecking(false)
      })
      .catch(() => {
        setReportReady(null)
        setChecking(false)
      })

    // Fetch patient information and uploaded files
    fetch(`/api/getPatientInfo?patientId=${encodeURIComponent(patientId)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPatientInfo(data.patientInfo)
          setUploadedFiles(data.uploadedFiles)
        } else {
          console.error('Error fetching patient data:', data.error)
          setPatientInfo(null)
          setUploadedFiles([])
        }
      })
      .catch((error) => {
        console.error('Error fetching patient information:', error)
        setPatientInfo(null)
        setUploadedFiles([])
      })
  }, [patientId])

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <main className={styles.confirmationBg}>
      <div className={styles.confirmationCard}>
        <div className={styles.iconWrapper}>
          <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="var(--success-color, #22c55e)">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M8 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className={styles.title}>Upload Successful!</h1>
        <p className={styles.subtitle}>
          Thank you for submitting your information. Your patient ID is:
        </p>
        <div className={styles.patientId}>{patientId}</div>

        <div className={styles.content}>
          {checking ? (
            <p className={styles.message}>Checking report status...</p>
          ) : reportReady ? (
            <p className={styles.message}>Your report is ready!</p>
          ) : (
            <p className={styles.message}>Your report is not ready yet.</p>
          )}

          {patientInfo && (
            <div className={styles.patientInfo}>
              <h2>Patient Information</h2>
              {patientInfo.name && <p><strong>Name:</strong> {patientInfo.name}</p>}
              {patientInfo.age && <p><strong>Age:</strong> {patientInfo.age}</p>}
              {patientInfo.conditions && patientInfo.conditions.length > 0 && (
                <p><strong>Medical Conditions:</strong> {patientInfo.conditions.join(', ')}</p>
              )}
              <p><strong>Patient ID:</strong> {patientId}</p>
            </div>
          )}

          <div className={styles.uploadedFiles}>
            <h2>Uploaded Files</h2>
            {uploadedFiles.length > 0 ? (
              <ul>
                {uploadedFiles.map((file, index) => (
                  <li key={index}>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      {file.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No files were uploaded or files are still processing.</p>
            )}
          </div>

          <div style={{ width: '100%', marginTop: 24 }}>
            <textarea
              ref={textareaRef}
              className={styles.copyTextarea}
              value={fullUrl}
              readOnly
              rows={2}
              aria-label="Page link"
              onFocus={e => e.target.select()}
              style={{ marginBottom: 8 }}
            />
            <button
              onClick={handleCopy}
              className={styles.reportButton}
              type="button"
              style={{ marginBottom: 4 }}
            >
              Copy Link
              {copied && (
                <span className="animate-fade-in-out" style={{ marginLeft: 8, fontSize: 13, color: '#2563eb' }}>
                  Link copied!
                </span>
              )}
            </button>
            <div style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>
              <span role="img" aria-label="tip">📎</span> Tip: Save this link or check back within 24–72 hours.
            </div>
          </div>
        </div>

        <Link href="/" className={styles.homeBtn}>
          Back to Home
        </Link>
      </div>
    </main>
  )
}

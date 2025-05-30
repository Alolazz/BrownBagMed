'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, usePathname } from 'next/navigation'
import styles from './confirmation.module.css'

export default function ConfirmationPage() {
  const params = useParams()
  const patientId = params.patientId as string
  const [reportReady, setReportReady] = useState<null | boolean>(null)
  const [checking, setChecking] = useState(true)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const pathname = usePathname()

  // Build the full URL for copy
  const fullUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${pathname}`
    : pathname

  useEffect(() => {
    if (!patientId) return
    setChecking(true)
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
  }, [patientId])

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Thank you for your submission!</h1>
          {checking ? (
            <p className={styles.message}>Checking report status...</p>
          ) : reportReady ? (
            <>
              <p className={styles.message}>
                <span role="img" aria-label="ready">✅</span> Your medication analysis is ready. Click below to download your report.
              </p>
              <a
                href={`/uploads/${patientId}/report.pdf`}
                className={styles.reportButton}
                download
              >
                <span role="img" aria-label="download">🔽</span> Download Report PDF
              </a>
            </>
          ) : (
            <>
              <p className={styles.message}>
                <span role="img" aria-label="waiting">⏳</span> Your report is being prepared. Please check again in 24–72 hours.
              </p>
            </>
          )}
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
      </div>
    </div>
  )
}

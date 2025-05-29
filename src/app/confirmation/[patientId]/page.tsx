'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import styles from './confirmation.module.css'

export default function ConfirmationPage () {
  const params = useParams()
  const patientId = params.patientId as string

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Success Icon */}
          <div className={styles.iconContainer}>
            <svg
              className={styles.successIcon}
              width='64'
              height='64'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <circle cx='12' cy='12' r='10' />
              <polyline points='9,12 12,15 23,4' />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className={styles.title}>Upload Successful!</h1>

          <p className={styles.message}>
            Your medication files have been uploaded successfully and are being
            analyzed by our licensed pharmacists.
          </p>

          <p className={styles.submessage}>
            You can now view your analysis report or bookmark it for later
            reference.
          </p>

          {/* Action Button */}
          <Link href={`/report/${patientId}`} className={styles.reportButton}>
            Go to My Report
          </Link>

          {/* Additional Info */}
          <div className={styles.infoBox}>
            <p className={styles.infoText}>
              <strong>Patient ID:</strong> {patientId}
            </p>
            <p className={styles.infoSubtext}>
              Save this ID to access your report later
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

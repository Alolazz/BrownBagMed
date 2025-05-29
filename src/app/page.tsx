import styles from './page.module.css'

export default function Home () {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Medication Analysis & Management
            </h1>
            <p className={styles.heroSubtitle}>
              We identify potential drug interactions, dosage issues, and more
              for better medication safety.
            </p>
            <a href='/upload'>
              <button className={styles.ctaButton}>Upload Medications</button>
            </a>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.medBagSvg}>
              <svg
                width='300'
                height='300'
                viewBox='0 0 300 300'
                xmlns='http://www.w3.org/2000/svg'
              >
                {/* Brown paper bag */}
                <rect
                  x='50'
                  y='80'
                  width='200'
                  height='180'
                  fill='#8B4513'
                  rx='8'
                />

                {/* Bag top fold */}
                <rect
                  x='40'
                  y='60'
                  width='220'
                  height='40'
                  fill='#D2B48C'
                  rx='8'
                />
                <rect
                  x='130'
                  y='70'
                  width='40'
                  height='8'
                  fill='#8B4513'
                  rx='4'
                />

                {/* Pills coming out */}
                <ellipse cx='120' cy='50' rx='15' ry='8' fill='#FF6B6B' />
                <ellipse cx='150' cy='40' rx='15' ry='8' fill='#4ECDC4' />
                <ellipse cx='180' cy='55' rx='15' ry='8' fill='#45B7D1' />

                {/* Pill bottle */}
                <rect
                  x='80'
                  y='100'
                  width='30'
                  height='60'
                  fill='#FFFFFF'
                  rx='4'
                />
                <rect
                  x='75'
                  y='95'
                  width='40'
                  height='15'
                  fill='#FF6B6B'
                  rx='7'
                />
                <text
                  x='95'
                  y='135'
                  fontFamily='Arial'
                  fontSize='8'
                  textAnchor='middle'
                  fill='#333'
                >
                  RX
                </text>

                {/* Blister pack */}
                <rect
                  x='140'
                  y='120'
                  width='60'
                  height='40'
                  fill='#E8E8E8'
                  rx='4'
                />
                <circle cx='155' cy='135' r='6' fill='#4ECDC4' />
                <circle cx='170' cy='135' r='6' fill='#4ECDC4' />
                <circle cx='185' cy='135' r='6' fill='#FFD93D' />
                <circle cx='155' cy='150' r='6' fill='#FFD93D' />
                <circle cx='170' cy='150' r='6' fill='#FF6B6B' />
                <circle cx='185' cy='150' r='6' fill='#FF6B6B' />

                {/* More pills in bag */}
                <circle cx='90' cy='180' r='8' fill='#45B7D1' />
                <circle cx='110' cy='200' r='8' fill='#FFD93D' />
                <circle cx='170' cy='190' r='8' fill='#4ECDC4' />
                <circle cx='190' cy='210' r='8' fill='#FF6B6B' />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.featuresTitle}>Why Brown Bag Med?</h2>

          <div className={styles.featuresGrid}>
            {/* Feature 1: Interaction Check */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg
                  width='48'
                  height='48'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M9 12l2 2 4-4' />
                  <path d='M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.5 0 4.74 1.02 6.36 2.64' />
                  <path d='M21 3l-6 6' />
                  <path d='M15 3h6v6' />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Interaction Check</h3>
              <p className={styles.featureDescription}>
                We examine your medications for potential interactions.
              </p>
            </div>

            {/* Feature 2: Dose Evaluation */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg
                  width='48'
                  height='48'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <rect x='3' y='3' width='18' height='18' rx='2' />
                  <path d='M9 9h6v6H9z' />
                  <path d='M9 1v6' />
                  <path d='M15 1v6' />
                  <path d='M9 17v6' />
                  <path d='M15 17v6' />
                  <path d='M1 9h6' />
                  <path d='M17 9h6' />
                  <path d='M1 15h6' />
                  <path d='M17 15h6' />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Dose Evaluation</h3>
              <p className={styles.featureDescription}>
                We assess your prescriptions to ensure correct dosing.
              </p>
            </div>

            {/* Feature 3: Comprehensive Report */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg
                  width='48'
                  height='48'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
                  <polyline points='14,2 14,8 20,8' />
                  <line x1='16' y1='13' x2='8' y2='13' />
                  <line x1='16' y1='17' x2='8' y2='17' />
                  <polyline points='10,9 9,9 8,9' />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Comprehensive Report</h3>
              <p className={styles.featureDescription}>
                Receive a detailed PDF summarizing an analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            GDPR-compliant • No personal data collected • Anonymous analysis
          </p>
        </div>
      </footer>
    </div>
  )
}

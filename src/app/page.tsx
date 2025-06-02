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

      {/* Pricing Link Section */}
      <div style={{ textAlign: 'center', margin: '32px 0 0 0' }}>
        <a
          href="/pricing"
          style={{
            color: '#2563eb',
            fontWeight: 600,
            fontSize: 18,
            textDecoration: 'underline',
            display: 'inline-block',
            marginTop: 8,
            letterSpacing: '0.01em',
            transition: 'color 0.2s',
          }}
        >
          See our Pricing Plans &rarr;
        </a>
      </div>

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
                We help you make sense of your medications — what they’re for, how they interact, and whether they’re still needed.
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

      {/* Clinical Excellence Section */}
      <section className={styles.trustSection}>
        <div className={styles.trustContainer}>
          <h2 className={styles.trustTitle}>Clinical Excellence</h2>

          <div className={styles.trustGrid}>
            {/* Licensed Medication Experts */}
            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>
                {/* UserCheckIcon */}
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M16 11l2 2 4-4"/></svg>
              </div>
              <h3 className={styles.trustCardTitle}>Licensed Medication Experts</h3>
              <p className={styles.trustCardDescription}>
                Your medications are carefully reviewed by certified pharmacists with AMTS training, ensuring safe and structured analysis backed by clinical expertise.
              </p>
            </div>
            {/* German AMTS Standards */}
            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>
                {/* ShieldCheckIcon */}
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
              </div>
              <h3 className={styles.trustCardTitle}>German AMTS Standards</h3>
              <p className={styles.trustCardDescription}>
                We follow Arzneimitteltherapiesicherheit (AMTS) principles — Germany’s gold standard for medication safety and drug interaction checks.
              </p>
            </div>
            {/* Reviewed & Delivered Fast */}
            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>
                {/* ClockIcon */}
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <h3 className={styles.trustCardTitle}>Reviewed &amp; Delivered Fast</h3>
              <p className={styles.trustCardDescription}>
                We deliver your medication review within 72 hours. Fast, accurate, and personally tailored for you.
              </p>
            </div>
            {/* Privacy by Design */}
            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>
                {/* LockClosedIcon */}
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><circle cx="12" cy="16" r="1"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h3 className={styles.trustCardTitle}>Privacy by Design</h3>
              <p className={styles.trustCardDescription}>
                We never store personal data. All uploads are anonymous and GDPR-compliant.
              </p>
            </div>
            {/* Trust & Credentials */}
            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>
                {/* BadgeCheckIcon */}
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 3l2.09 6.26L21 9.27l-5 4.87L17.18 21 12 17.27 6.82 21 8 14.14l-5-4.87 6.91-1.01z"/><path d="M9 12l2 2 4-4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className={styles.trustCardTitle}>Trust &amp; Credentials</h3>
              <p className={styles.trustCardDescription}>
                Our team is led by a licensed pharmacist and certified healthcare professional in the EU/EEA/CH, with more than 15 years of clinical and pharmaceutical experience. Credibility and expertise you can trust.
              </p>
            </div>
            {/* Multilingual Support */}
            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>
                {/* GlobeIcon */}
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/></svg>
              </div>
              <h3 className={styles.trustCardTitle}>Multilingual Support</h3>
              <p className={styles.trustCardDescription}>
                Available in English, German, and Arabic — because better medication safety should be accessible to everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className="mt-2 text-sm text-gray-500">
            {/* Disclaimer moved to Terms & Conditions page */}
          </div>
          <div style={{ marginTop: 12, fontSize: 14 }}>
            <a href="/privacy" style={{ color: '#2563eb', marginRight: 18 }}>Privacy Policy</a>
            <a href="/terms" style={{ color: '#2563eb', marginRight: 18 }}>Terms &amp; Conditions</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

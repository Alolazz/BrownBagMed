import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'

export default function Home () {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Brown Bag Med
            </h1>
            <h1 className="text-center font-normal text-xl md:text-2xl text-blue-900 mb-2" style={{letterSpacing: '-1px'}}>
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
            <Image
              src="/logo.webp"
              alt="Brown Bag Med Logo"
              width={380}
              height={180}
              className="mx-auto mb-4"
              style={{ maxWidth: 380, height: 'auto' }}
              priority
              loading="eager"
              quality={90}
              placeholder="empty"
            />
          </div>
        </div>
      </section>

      {/* Follow-up Link Section */}
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <a
          href="/follow-up"
          className="text-sm underline text-blue-600 hover:text-blue-800 text-center block"
          style={{ margin: '16px auto', maxWidth: 320 }}
        >
          Have a question about your report?
        </a>
      </div>

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

      {/* How It Works Section */}
      <section className={styles.features} style={{ background: '#f8fafc', paddingTop: 0 }}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.featuresTitle}>How It Works</h2>
          <div className={styles.featuresGrid}>
            {/* Card 1: Upload Anonymously */}
            <Link href="/upload" passHref legacyBehavior>
              <div className={styles.featureCard} style={{ cursor: 'pointer' }} tabIndex={0} role="button" aria-label="Go to Upload Medications page">
                <div className={styles.featureIcon}>
                  {/* Upload Icon */}
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 16V4"/><path d="M8 8l4-4 4 4"/><rect x="4" y="20" width="16" height="2" rx="1"/></svg>
                </div>
                <h3 className={styles.featureTitle}>Upload Medications</h3>
                <p className={styles.featureDescription}>
                  Securely upload medication images — no personal info required.
                </p>
              </div>
            </Link>
            {/* Card 2: Professional Review */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                {/* Search Icon */}
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="6"/><path d="M21 21l-3.5-3.5"/></svg>
              </div>
              <h3 className={styles.featureTitle}>Professional Review</h3>
              <p className={styles.featureDescription}>
                Our pharmacists check for interactions, dosing, and safety issues.
              </p>
            </div>
            {/* Card 3: Results in 48 Hours */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                {/* FileCheck Icon */}
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 12l2 2 4-4"/></svg>
              </div>
              <h3 className={styles.featureTitle}>Results in 48 Hours</h3>
              <p className={styles.featureDescription}>
                Receive a personalized PDF report within 2 working days.
              </p>
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

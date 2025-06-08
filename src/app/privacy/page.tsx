import Link from 'next/link';
import styles from './PrivacyPolicyPage.module.css';

export default function PrivacyPolicyPage() {
  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem', backgroundColor: '#ffffff' }}>
      <section className={styles.privacyPolicy}>
        <h1>
          <Link href="/" style={{ color: '#1e40af', textDecoration: 'none' }}>
            Privacy Policy for Brown Bag Med
          </Link>
        </h1>
        <p><a href="/pricing" style={{ color: '#1e40af', textDecoration: 'none' }}>Pricing Plan</a></p>
        <p>Last updated: June 2025</p>

        <h2>1. Introduction</h2>
        <p>Welcome to Brown Bag Med. Your privacy is important to us. This Privacy Policy explains how we collect, use, and safeguard your information when you use our services, including our website at <a href="https://brownbagmed.eu" target="_blank" rel="noopener noreferrer">https://brownbagmed.eu</a>.</p>

        <h2>2. Who We Are</h2>
        <p>Brown Bag Med is a healthcare service offering structured medication reviews by licensed pharmacists.</p>
        <p>You can contact us at:</p>
        <ul>
          <li>✉️ Email: <a href="mailto:contact@brownbagmed.eu">contact@brownbagmed.eu</a></li>
        </ul>

        <h2>3. What Information We Collect</h2>
        <h3>a. Information You Provide</h3>
        <ul>
          <li>Uploaded medication images and PDFs</li>
          <li>Health information provided through forms (e.g. age, gender, medical conditions)</li>
        </ul>
        <h3>b. Automatically Collected Information</h3>
        <p>We may automatically collect certain information through cookies, analytics tools (e.g. Google Analytics), or server logs:</p>
        <ul>
          <li>IP address</li>
          <li>Browser and device type</li>
          <li>Operating system</li>
          <li>Pages visited and referral source</li>
          <li>Time spent on site</li>
        </ul>
        <p>This helps us understand how users interact with the site and improve the service.</p>

        <h2>4. How We Use Your Information</h2>
        <ul>
          <li>To provide and improve the medication review service</li>
          <li>To contact you with the report or follow-up information</li>
          <li>To comply with legal obligations</li>
        </ul>
        <p>We do not sell your personal data.</p>

        <h2>5. Sharing of Information</h2>
        <p>We may share your data only:</p>
        <ul>
          <li>With service providers (e.g. hosting, analytics, cloud storage like Vercel Blob)</li>
          <li>If required by law</li>
        </ul>

        <h2>6. Data Storage and Security</h2>
        <ul>
          <li>Files are stored in a secure, access-controlled environment (e.g. Vercel Blob)</li>
          <li>Access to personal health data is limited to authorized personnel</li>
          <li>All data transmission is encrypted via HTTPS</li>
        </ul>

        <h2>7. Cookies and Analytics</h2>
        <p>We use cookies and analytics tools such as Google Analytics to measure traffic and usage trends.</p>
        <p>You can opt out of Google Analytics by visiting: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">https://tools.google.com/dlpage/gaoptout</a></p>

        <h2>8. Data Retention</h2>
        <p>Uploaded reports and metadata are kept only as long as necessary to deliver the service.</p>
        <p>You may request deletion of your data at any time.</p>

        <h2>9. Your Rights (GDPR)</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your data</li>
          <li>Request correction or deletion</li>
          <li>Restrict or object to processing</li>
          <li>Data portability</li>
        </ul>
        <p>To exercise these rights, contact: <a href="mailto:privacy@brownbagmed.eu">privacy@brownbagmed.eu</a></p>

        <h2>10. Third-Party Services</h2>
        <p>We may link to or use services provided by Google, Vercel, GitHub, or similar platforms. These providers may collect technical data as part of their standard operations. See their respective privacy policies for more information.</p>

        <h2>11. Changes to This Policy</h2>
        <p>We may update this policy from time to time. The latest version will always be posted on our website.</p>

        <p>By using our site and services, you agree to the terms of this privacy policy.</p>
      </section>
    </main>
  );
}

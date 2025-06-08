import Link from 'next/link';
import styles from './TermsPage.module.css';

export default function TermsPage() {
  return (
    <main className={styles.termsContainer}>
      <h1>
        <Link href="/" style={{ color: '#1e40af', textDecoration: 'none' }}>
          Terms and Conditions for Brown Bag Med
        </Link>
      </h1>
      <p><strong>Effective Date:</strong> 08.06.2025</p>

      <p>Welcome to <Link href="/" style={{ color: '#1e40af', textDecoration: 'underline' }}>Brown Bag Med</Link>. These Terms and Conditions ("Terms") govern your use of our website ("Site") and services ("Services"). By accessing or using our Site or Services, you agree to be bound by these Terms. If you do not agree, please do not use our Site or Services.</p>

      <h2>1. Use of Services</h2>
      <p><strong>1.1</strong> You must be at least 18 years old or have parental consent to use our Services.</p>
      <p><strong>1.2</strong> You agree to provide accurate and complete information when using our Services, including when submitting medication information for review.</p>
      <p><strong>1.3</strong> You are responsible for maintaining the confidentiality of any access credentials or personal information shared with Brown Bag Med.</p>

      <h2>2. Medical Disclaimer</h2>
      <p><strong>2.1</strong> Brown Bag Med does not provide medical advice. The Services are intended for informational and educational purposes only.</p>
      <p><strong>2.2</strong> Always consult a qualified healthcare provider before making any changes to your medications, treatments, or healthcare routines.</p>

      <h2>3. Privacy</h2>
      <p><strong>3.1</strong> Your use of our Services is subject to our Privacy Policy, which describes how we collect, use, and protect your data in compliance with GDPR.</p>

      <h2>4. Intellectual Property</h2>
      <p><strong>4.1</strong> All content on the Site, including but not limited to text, graphics, logos, and software, is the property of Brown Bag Med or its licensors.</p>
      <p><strong>4.2</strong> You may not reproduce, distribute, or create derivative works from our content without explicit permission.</p>

      <h2>5. User Conduct</h2>
      <p><strong>5.1</strong> You agree not to use our Site or Services to:</p>
      <ul>
        <li>Violate any laws or regulations;</li>
        <li>Submit false or misleading information;</li>
        <li>Upload viruses or malicious code;</li>
        <li>Harass or harm other users or staff.</li>
      </ul>

      <h2>6. Limitation of Liability</h2>
      <p><strong>6.1</strong> Brown Bag Med shall not be liable for any indirect, incidental, or consequential damages arising out of your use of our Services.</p>
      <p><strong>6.2</strong> We do not guarantee uninterrupted or error-free operation of the Site.</p>

      <h2>7. Modifications</h2>
      <p><strong>7.1</strong> We reserve the right to modify these Terms at any time. Updates will be posted on this page with a revised effective date.</p>
      <p><strong>7.2</strong> Continued use of the Services after any such updates constitutes your acceptance of the revised Terms.</p>

      <h2>8. Termination</h2>
      <p><strong>8.1</strong> We may suspend or terminate your access to the Services at any time, with or without notice, for conduct that violates these Terms.</p>

      <h2>9. Governing Law</h2>
      <p><strong>9.1</strong> These Terms are governed by and construed in accordance with the laws of Germany, without regard to its conflict of laws principles.</p>

      <h2>10. Contact</h2>
      <p><strong>10.1</strong> For questions or concerns regarding these Terms, please contact us at: <a href="mailto:info@brownbagmed.eu">info@brownbagmed.eu</a></p>
    </main>
  );
}

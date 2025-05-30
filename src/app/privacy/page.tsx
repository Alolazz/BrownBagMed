export default function PrivacyPolicyPage() {
  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#1e40af', marginBottom: '1.5rem' }}>Privacy Policy</h1>
      <div style={{ fontSize: '1.1rem', color: '#222', lineHeight: 1.7 }}>
        <strong>Last updated: 2025-05-30</strong>
        <p style={{ marginTop: 16 }}>
          Brown Bag Med (“we”, “us”) operates a medication review service that is fully anonymous and GDPR-compliant.<br />
          <ul style={{ margin: '1rem 0 1.5rem 1.5rem', padding: 0 }}>
            <li><b>No personal data</b> (name, email, address) is collected; all uploads are anonymous.</li>
            <li><b>Files & metadata</b> (DOB, conditions, allergies, comments) are stored only in <code>/uploads/patient_&lt;id&gt;/</code>.</li>
            <li>We retain uploads for a maximum of <b>90 days</b>, then <b>automatically delete</b> them via our daily cleanup job.</li>
            <li>You have the right to <b>request deletion</b> at any time by contacting us at <a href="mailto:privacy@brownbagmed.com">privacy@brownbagmed.com</a>.</li>
            <li>We use minimal cookies only for session management and do not track you across other sites.</li>
            <li>For any questions, reach out: <a href="mailto:privacy@brownbagmed.com">privacy@brownbagmed.com</a>.</li>
          </ul>
        </p>
      </div>
    </main>
  );
}

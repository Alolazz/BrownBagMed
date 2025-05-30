export default function TermsOfServicePage() {
  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#1e40af', marginBottom: '1.5rem' }}>Terms of Service</h1>
      <div style={{ fontSize: '1.1rem', color: '#222', lineHeight: 1.7 }}>
        <strong>Last updated: 2025-05-30</strong>
        <ol style={{ margin: '1rem 0 1.5rem 1.5rem', padding: 0 }}>
          <li><b>Service</b><br />Brown Bag Med provides professional medication analysis. You remain entirely anonymous.</li>
          <li><b>Payment</b><br />Reports cost €129. Payment via Stripe, PayPal, or Bitcoin is required before download.</li>
          <li><b>No Medical Advice</b><br />Our reports are informational only and do not replace professional medical consultation.</li>
          <li><b>Limitation of Liability</b><br />To the extent permitted by law, Brown Bag Med is not liable for any damages arising from use of our service.</li>
          <li><b>Changes</b><br />We may update these terms; continued use constitutes acceptance. Notifications will be posted on this page.</li>
        </ol>
      </div>
    </main>
  );
}

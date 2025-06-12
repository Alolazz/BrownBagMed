import React from 'react';
import Link from 'next/link';
import styles from './TooManyMedications.module.css';

const TooManyMedicationsArticle = () => {
  return (
    <div className={styles.articleContainer}>
      <h1>5 Signs You Might Be Taking Too Many Medications</h1>
      <p>
        As we age or manage chronic conditions, the number of medications we take can gradually increase. While each prescription may have a valid purpose, combining multiple drugs — known as polypharmacy — can come with serious risks. Here are five key signs that you may be taking too many medications, and what you can do to stay safe.
      </p>

      <h2>1. You’re Experiencing New or Unexplained Symptoms</h2>
      <p>
        If you’ve recently added a new medication and now feel dizzy, tired, confused, or have an upset stomach, it might be more than just aging. Adverse drug reactions are often mistaken for new health conditions, when in fact they may be caused by your current medication combination.
      </p>
      <p><strong>Tip:</strong> Keep a symptom journal and bring it to your next doctor or pharmacist visit.</p>

      <h2>2. You’re Seeing Multiple Doctors Who Don’t Communicate</h2>
      <p>
        It’s common to have a general practitioner, a cardiologist, an endocrinologist, and more. But if each specialist prescribes medications without full visibility into your treatment plan, there’s a higher risk of duplicate therapies or dangerous interactions.
      </p>
      <p><strong>Tip:</strong> Share a complete, updated medication list with every healthcare provider you see.</p>

      <h2>3. You Take More Than 5 Medications Per Day</h2>
      <p>
        According to the British Journal of General Practice, patients taking 5–9 medications are twice as likely to experience an adverse drug reaction. Those on 10 or more have three times the risk. It’s not just the quantity, but the interaction between drugs that creates problems.
      </p>
      <p><strong>Tip:</strong> A pharmacist-led medication review (like Brown Bag Med) can help spot unnecessary or conflicting prescriptions.</p>

      <h2>4. You’ve Been Taking the Same Medications for Years Without Review</h2>
      <p>
        Just because something worked in the past doesn’t mean it’s still needed today. Long-term medications may become unnecessary, less effective, or harmful over time.
      </p>
      <p><strong>Tip:</strong> Ask your pharmacist: &quot;Do I still need all of these?&quot;</p>

      <h2>5. You Struggle to Keep Track of What to Take and When</h2>
      <p>
        Managing many medications can be overwhelming. If you skip doses, double up, or get confused by instructions, the risk of harm increases.
      </p>
      <p><strong>Tip:</strong> Use a daily pill organizer or ask your pharmacist to simplify your regimen if possible.</p>

      <h2>What You Can Do</h2>
      <ul>
        <li>✅ Book a structured medication review</li>
        <li>✅ Keep your medication list updated</li>
        <li>✅ Ask questions — even if you think they’re obvious</li>
        <li>✅ Involve a caregiver or family member</li>
      </ul>

      <p>
        Remember: Medication safety starts with awareness. If you recognize any of these signs, take action — a short review today could prevent a serious problem tomorrow.
      </p>

      <p><strong>Need help understanding your medications?</strong></p>
      <p><Link href="/upload" legacyBehavior>
  <a style={{ textDecoration: 'underline', color: '#2563eb', fontWeight: 'bold' }}>Start medication review at Brown Bag Med</a>
</Link></p>
    </div>
  );
};

export default TooManyMedicationsArticle;

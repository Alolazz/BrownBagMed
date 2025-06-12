'use client';

import { useState } from 'react';

export default function FAQPage() {
  const faqs = [
    {
      question: "What happens after I upload my medications?",
      answer: "After you upload your medications, our pharmacist securely reviews them. You’ll receive a personalized report with insights and recommendations within 72 hours."
    },
    {
      question: "How do I know if I’m taking too many medications?",
      answer: "If you're taking 4 or more medications regularly, especially from multiple doctors, a medication review is strongly recommended."
    },
    {
      question: "Can my medications be harmful together?",
      answer: "Yes. Some drug combinations can increase the risk of side effects or reduce effectiveness. We help identify these risks."
    },
    {
      question: "Why do I need a medication check?",
      answer: "To stay safe, avoid hospital visits, and ensure every medication you take is truly needed and dosed correctly."
    }
  ];

  return (
    <section style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '28px', fontWeight: 'bold' }}>Frequently Asked Questions</h1>
      {faqs.map((faq, index) => (
        <Accordion key={index} question={faq.question} answer={faq.answer} />
      ))}
    </section>
  );
}

function Accordion({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '10px',
          background: '#f9f9f9',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        {question}
      </button>
      {isOpen && (
        <div style={{ padding: '10px', background: '#fff', borderTop: '1px solid #ddd' }}>
          {answer}
        </div>
      )}
    </div>
  );
}

import Link from 'next/link';

export default function BlogPage() {
  const articles = [
    {
      title: "5 Signs You Might Be Taking Too Many Medications",
      description: "Learn how to recognize when your medication list is too long — and what to do about it.",
      link: "/blog/too-many-medications"
    },
    {
      title: "What to Do if You Don’t Understand Your Medications",
      description: "Confused by names, doses, or schedules? Here's how to make sense of your prescriptions.",
      link: "/blog/understand-medications"
    },
    {
      title: "How Pharmacists Can Help Prevent Medication Side Effects",
      description: "Discover how a professional review can reduce risk and improve your treatment safety.",
      link: "/blog/prevent-side-effects"
    },
    {
      title: "Your Doctor Prescribed a New Drug – Should You Be Worried?",
      description: "A checklist to help you ask the right questions when you're given something new.",
      link: "/blog/new-drug-checklist"
    }
  ];

  return (
    <section style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '28px', fontWeight: 'bold' }}>Blog & Articles</h1>
      <div style={{ display: 'grid', gap: '20px' }}>
        {articles.map((article, index) => (
          <div key={index} style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '15px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>{article.title}</h2>
            <p style={{ marginBottom: '15px' }}>{article.description}</p>
            <Link href={article.link} passHref>
              <button style={{ padding: '10px 15px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Read more
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

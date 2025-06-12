import Link from 'next/link';
import styles from './Blog.module.css';

const BlogPage = () => {
  return (
    <div className={styles.blogContainer}>
      <h1>Blog</h1>
      <ul>
        <li>
          <h2>5 Signs You Might Be Taking Too Many Medications</h2>
          <p>Learn about the risks of polypharmacy and how to stay safe.</p>
          <Link href="/blog/too-many-medications">Read more</Link>
        </li>
        <li>
          <h2>What to Do if You Don’t Understand Your Medications</h2>
          <p>Confused by names, doses, or schedules? Here&apos;s how to make sense of your prescriptions.</p>
          <Link href="/blog/understand-medications">Read more</Link>
        </li>
        <li>
          <h2>How Pharmacists Can Help Prevent Medication Side Effects</h2>
          <p>Discover how a professional review can reduce risk and improve your treatment safety.</p>
          <Link href="/blog/prevent-side-effects">Read more</Link>
        </li>
        <li>
          <h2>Your Doctor Prescribed a New Drug – Should You Be Worried?</h2>
          <p>A checklist to help you ask the right questions when you&apos;re given something new.</p>
          <Link href="/blog/new-drug-checklist">Read more</Link>
        </li>
      </ul>
    </div>
  );
};

export default BlogPage;

"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "../upload/upload.module.css";

export default function FollowUpPage() {
  const [form, setForm] = useState({ patientId: "", dob: "", question: "", consent: false });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked = type === "checkbox" ? (target as HTMLInputElement).checked : undefined;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!form.patientId.trim() || !form.dob.trim() || !form.question.trim() || !form.consent) {
      setError("All fields are required and consent must be given.");
      return;
    }
    try {
      const res = await fetch("/api/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setSuccess(true);
      else setError("There was a problem submitting your question.");
    } catch {
      setError("There was a problem submitting your question.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}> Follow-Up Form</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className={styles.form}
          aria-label="Follow-Up Question Form"
        >
          <div className={styles.inputGroup}>
            <label htmlFor="reportId" className="text-gray-700 text-sm font-medium">
              Report ID
            </label>
            <input
              id="reportId"
              name="reportId"
              type="text"
              placeholder="e.g., report_123"
              value={form.reportId}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring focus:border-blue-400"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="dob" className="text-gray-700 text-sm font-medium">
              Date of Birth
            </label>
            <input
              id="dob"
              name="dob"
              type="text"
              placeholder="DD.MM.YYYY"
              value={form.dob}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="question" className="text-gray-700 text-sm font-medium">
              Question
            </label>
            <textarea
              id="question"
              name="question"
              placeholder="Type your follow-up question here..."
              value={form.question}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 min-h-[100px] focus:outline-none focus:ring focus:border-blue-400"
              required
            />
          </div>
          <div className={styles.agreementSection}>
            <label className={styles.agreementLabel}>
              <input
                id="consent"
                name="consent"
                type="checkbox"
                checked={form.consent}
                onChange={handleChange}
                className={styles.agreementCheckbox}
                required
              />
              <span className={styles.agreementText}>
                I consent to sharing this information to ask a follow-up question about my report.
              </span>
            </label>
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={success}
          >
            Submit Question
          </button>
          {success && (
            <div className="mt-4 text-green-700 text-center text-base font-medium bg-green-50 border border-green-200 rounded p-4">
              Thank you! Your question has been submitted successfully.
            </div>
          )}
        </form>
        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="text-blue-700 hover:text-blue-900 underline text-sm px-4 py-2 rounded transition"
            aria-label="Back to Home"
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

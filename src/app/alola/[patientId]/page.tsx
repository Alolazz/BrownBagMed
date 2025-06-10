"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import styles from "../../upload/upload.module.css";

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params?.patientId as string | undefined;
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchFiles() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/alola/listFiles?patientId=${patientId}`);
        if (!res.ok) throw new Error("Could not load files");
        const data = await res.json();
        setFiles(data.files || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error loading files");
      }
      setLoading(false);
    }
    if (patientId) fetchFiles();
  }, [patientId]);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setError("");
    setUploading(true);
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Please select a report.pdf file.");
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientId", patientId || "");

    try {
      const res = await fetch("/api/alola/uploadReport", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (res.ok) {
        setMessage("File uploaded successfully.");
        setFiles((prev) => [...prev, file.name]);
      } else {
        setError(result.error || "Upload failed.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed.");
    }
    setUploading(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Patient Files</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <ul>
            {files.map((file, idx) => (
              <li key={idx}>{file}</li>
            ))}
          </ul>
        )}

        <form onSubmit={handleUpload} className={styles.form}>
          <label htmlFor="fileInput" className={styles.uploadLabel}>
            Upload a report.pdf file
          </label>
          <input
            id="fileInput"
            type="file"
            ref={fileInputRef}
            className={styles.fileInput}
          />
          <button type="submit" className={styles.submitButton} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {message && <p className={styles.success}>{message}</p>}
      </div>
    </div>
  );
}

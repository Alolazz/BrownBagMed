"use client"
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params?.patientId;
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
      } catch (e: any) {
        setError(e.message || "Error loading files");
      }
      setLoading(false);
    }
    if (patientId) fetchFiles();
  }, [patientId]);

  async function handleUpload(e: React.FormEvent) {
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
    formData.append("report", file);
    try {
      const res = await fetch(`/api/alola/uploadReport?patientId=${patientId}`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      setMessage("Report uploaded successfully!");
      // Refresh file list
      const data = await res.json();
      setFiles(data.files || []);
    } catch (e: any) {
      setError(e.message || "Upload failed");
    }
    setUploading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 flex flex-col items-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Patient {patientId}</h1>
        <div className="bg-white rounded shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Files</h2>
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {files.length === 0 && <li className="py-2 text-gray-500">No files found.</li>}
              {files.map((filename) => (
                <li key={filename} className="flex items-center justify-between py-2">
                  <span className="truncate mr-2">{filename}</span>
                  <a
                    href={`/api/alola/download?patientId=${patientId}&filename=${encodeURIComponent(filename)}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    download
                  >
                    Download
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <form onSubmit={handleUpload} className="bg-white rounded shadow p-4 flex flex-col gap-3">
          <label className="font-semibold">Upload New report.pdf</label>
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            className="border rounded px-2 py-1"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Report"}
          </button>
          {message && <div className="text-center text-green-600 text-sm mt-2">{message}</div>}
          {error && <div className="text-center text-red-600 text-sm mt-2">{error}</div>}
        </form>
      </div>
    </main>
  );
}

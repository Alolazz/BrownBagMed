"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import styles from "../../upload/upload.module.css";
import LogoutButton from "../LogoutButton";

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params?.patientId as string | undefined;
  const [fileData, setFileData] = useState<{ name: string; url: string; uploadedAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchFiles() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/alola/listFiles?patientId=${patientId}`);
        if (!res.ok) throw new Error("Could not load files");
        const data = await res.json();
        setFileData(data.fileData || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error loading files");
      }
      setLoading(false);
    }
    async function fetchPatientInfo() {
      if (!patientId) return;
      try {
        const res = await fetch(`/api/getPatientInfo?patientId=${patientId}`);
        const data = await res.json();
        if (data.success) setPatientInfo(data.patient);
      } catch {}
    }
    if (patientId) {
      fetchFiles();
      fetchPatientInfo();
    }
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
        // Refresh file list after successful upload
        const filesRes = await fetch(`/api/alola/listFiles?patientId=${patientId}`);
        const filesData = await filesRes.json();
        setFileData(filesData.fileData || []);
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
        <div className="flex justify-between items-center mb-4">
          <h1 className={styles.title}>Patient Files: {patientId}</h1>
          <div className="flex space-x-3">
            <button 
              onClick={() => window.history.back()} 
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-gray-800"
            >
              Back to Dashboard
            </button>
            <LogoutButton />
          </div>
        </div>
        {loading ? (
          <p className="text-center py-4">Loading patient files...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <div>
            {fileData.length === 0 ? (
              <p>No files found for this patient.</p>
            ) : (
              <ul className="list-disc pl-5 mb-4">
                {fileData.map((file, idx) => (
                  <li key={idx} className="mb-2">
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {file.name}
                    </a>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(file.uploadedAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Patient Info Boxes */}
        {patientInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-1">Medical Condition(s)</h3>
              <div className="text-gray-900 text-sm whitespace-pre-line min-h-[32px]">{Array.isArray(patientInfo.conditions) ? patientInfo.conditions.join(', ') : patientInfo.conditions || '-'}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-1">Known Allergies</h3>
              <div className="text-gray-900 text-sm whitespace-pre-line min-h-[32px]">{patientInfo.allergies || '-'}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-1">Additional Information</h3>
              <div className="text-gray-900 text-sm whitespace-pre-line min-h-[32px]">{patientInfo.comments || '-'}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-1">Write Your Medications</h3>
              <div className="text-gray-900 text-sm whitespace-pre-line min-h-[32px]">{patientInfo.medications || '-'}</div>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Upload Report</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload a report file that will be stored with this patient&apos;s information.
          </p>
          
          <form onSubmit={handleUpload} className="flex flex-col space-y-4">
            <div>
              <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700 mb-1">
                Select Report File
              </label>
              <input
                id="fileInput"
                type="file"
                ref={fileInputRef}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2"
                accept=".pdf,.png,.jpg,.jpeg"
              />
            </div>
            
            <div>
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload Report"}
              </button>
            </div>
          </form>
          
          {message && <p className="mt-2 text-green-600">{message}</p>}
        </div>
      </div>
    </div>
  );
}

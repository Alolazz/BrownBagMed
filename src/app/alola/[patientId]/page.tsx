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
  // Payment-related states
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  
  // Use a more specific type for patientInfo
  const [patientInfo, setPatientInfo] = useState<{
    id: string;
    dateOfBirth?: string;
    gender?: string;
    conditions?: string[] | string;
    allergies?: string;
    comments?: string;
    medications?: string;
    uploadedAt?: string;
    reportReady?: boolean;
    paymentConfirmed?: boolean;
    reportUrl?: string;
    requiredPlanType?: string;
    paid?: boolean;
    paymentId?: string;
    paymentAmount?: number;
    paymentCurrency?: string;
    paymentDate?: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to check payment status and fetch patient info
  async function fetchPatientInfo() {
    if (!patientId) return;
    try {
      const res = await fetch(`/api/getPatientInfo?patientId=${patientId}`);
      const data = await res.json();
      if (data.success) setPatientInfo(data.patient);
    } catch {}
  }

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
    
    if (patientId) {
      fetchFiles();
      fetchPatientInfo();
    }
  }, [patientId]);

  // Add effect to check payment status periodically
  useEffect(() => {
    // Only check if we have initiated a payment but it's not confirmed yet
    if (paymentUrl && patientInfo && !patientInfo.paymentConfirmed) {
      const interval = setInterval(async () => {
        await fetchPatientInfo();
      }, 30000); // Check every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [paymentUrl, patientInfo, patientId]);

  // Pricing tiers with fixed payment URLs
  const paymentPlans = {
    basic: {
      name: "Quick Check",
      price: "€59",
      url: "https://nowpayments.io/payment/?iid=4616546662"
    },
    standard: {
      name: "In-Depth Analysis",
      price: "€99",
      url: "https://nowpayments.io/payment/?iid=5146587257"
    },
    premium: {
      name: "Custom Consultation",
      price: "€149",
      url: "https://nowpayments.io/payment/?iid=6107793181"
    }
  };
  
  // Enhanced payment status check function
  const getPaymentStatus = () => {
    if (!patientInfo) return 'loading';
    if (patientInfo.paymentConfirmed) return 'confirmed';
    if (paymentUrl) return 'pending';
    if (patientInfo.requiredPlanType) return 'ready';
    return 'awaiting';
  };

  // Function to get the appropriate payment plan
  const getPaymentPlan = () => {
    if (!patientInfo || !patientInfo.requiredPlanType) return null;
    const planType = patientInfo.requiredPlanType as keyof typeof paymentPlans;
    return paymentPlans[planType] || null;
  };

  async function handlePaymentRequest() {
    setPaymentLoading(true);
    setError("");
    
    try {
      if (!patientInfo || !patientInfo.requiredPlanType) {
        throw new Error("Required payment plan not determined yet");
      }
      
      // Get the required plan details from patient's record
      const requiredPlan = patientInfo.requiredPlanType as keyof typeof paymentPlans;
      const plan = paymentPlans[requiredPlan];
      
      if (!plan) {
        throw new Error(`Invalid plan type: ${patientInfo.requiredPlanType}`);
      }
      
      // Record the payment request in our database
      const response = await fetch('/api/recordPaymentPlan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId,
          planType: requiredPlan,
          planName: plan.name,
          planPrice: plan.price
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Use the fixed payment URL for the selected plan
        setPaymentUrl(plan.url);
        setMessage(`Payment link for ${plan.name} (${plan.price}) generated successfully`);
      } else if (data.alreadyPaid) {
        setMessage("Payment already confirmed. Your report is available.");
        // Refresh patient info to get the latest status
        await fetchPatientInfo();
      } else {
        throw new Error(data.error || 'Failed to create payment link');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Payment initialization failed");
    } finally {
      setPaymentLoading(false);
    }
  }

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
          {error && <p className="mt-2 text-red-600">{error}</p>}
        </div>

        {/* Payment Section with Enhanced Status Display */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Payment Information</h3>
            {patientInfo?.paymentConfirmed && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
                Paid
              </span>
            )}
          </div>
          
          {patientInfo?.paymentConfirmed ? (
            <div>
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Payment Confirmed</span>
                </div>
                <p className="mt-1 text-sm">
                  Thank you for your payment of {patientInfo.paymentAmount} {patientInfo.paymentCurrency || 'EUR'}.
                  You can now access your medical report.
                </p>
              </div>
              
              {patientInfo?.reportUrl ? (
                <div className="mt-4">
                  <a 
                    href={patientInfo.reportUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    View Your Medical Report
                  </a>
                </div>
              ) : patientInfo?.reportReady ? (
                <div className="mt-4">
                  <a 
                    href="#report-section" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    View Report Files
                  </a>
                </div>
              ) : (
                <p className="text-sm text-gray-600 mt-2">
                  Your report is being prepared and will be available soon.
                </p>
              )}
              
              {/* Payment receipt details */}
              {patientInfo.paymentId && (
                <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
                  <h4 className="font-medium mb-2">Payment Receipt</h4>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-gray-600">Payment ID:</span>
                    <span>{patientInfo.paymentId}</span>
                    <span className="text-gray-600">Amount:</span>
                    <span>{patientInfo.paymentAmount} {patientInfo.paymentCurrency || 'EUR'}</span>
                    <span className="text-gray-600">Date:</span>
                    <span>{new Date(patientInfo.paymentDate || '').toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                {(() => {
                  const status = getPaymentStatus();
                  switch(status) {
                    case 'loading': return 'Loading payment information...';
                    case 'awaiting': return 'Your medication review is being analyzed to determine the appropriate service plan.';
                    case 'ready': return `Based on your medication review, the ${patientInfo?.requiredPlanType} plan is required.`;
                    case 'pending': return 'Your payment is being processed. This page will automatically update when the payment is confirmed.';
                    default: return 'Please select a payment plan to continue.';
                  }
                })()}
              </p>
              
              {!paymentUrl && patientInfo?.requiredPlanType && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Required Service Plan</h4>
                  
                  {/* Display the required plan */}
                  {patientInfo.requiredPlanType && (
                    <div className="border border-blue-600 bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="font-medium">
                        {getPaymentPlan()?.name || 'Plan not found'}
                      </div>
                      <div className="text-lg text-green-700 font-bold">
                        {getPaymentPlan()?.price || 'Price not available'}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Payment methods: BTC, ETH, LTC, USDT and many other cryptocurrencies
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <button 
                      onClick={handlePaymentRequest} 
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                      disabled={paymentLoading || !patientInfo?.requiredPlanType}
                    >
                      {paymentLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating Payment Link...
                        </>
                      ) : (
                        `Pay ${getPaymentPlan()?.price || '€0'} with Cryptocurrency`
                      )}
                    </button>
                  </div>
                </div>
              )}

              {paymentUrl && (
                <div className="mt-4 p-4 border border-yellow-400 bg-yellow-50 rounded-lg">
                  <p className="mb-3 font-medium">Your payment link is ready:</p>
                  <a 
                    href={paymentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Complete Your Payment
                  </a>
                  <p className="mt-3 text-sm text-gray-600">
                    After completing your payment, your report will be available immediately.
                    This page will automatically check for payment status updates.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

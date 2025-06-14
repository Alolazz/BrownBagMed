'use client';

import { useState, useEffect } from 'react';
import SetRequiredPlan from './SetRequiredPlan';

interface Patient {
  id: string;
  folderName: string;
  dateOfBirth?: string;
  reportReady?: boolean;
  paid?: boolean;
  paymentConfirmed?: boolean;
  requiredPlanType?: string;
  uploadedAt?: string;
  paymentAmount?: number;
  paymentCurrency?: string;
  paymentDate?: string;
}

interface AdminPaymentDashboardProps {
  adminToken?: string;
}

export default function AdminPaymentDashboard({ adminToken }: AdminPaymentDashboardProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, [page, adminToken]);

  async function fetchPatients() {
    setLoading(true);
    setError(null);
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }
      
      const response = await fetch(`/api/admin/patients?page=${page}&limit=10`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPatients(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        throw new Error(data.error || 'Failed to fetch patients');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }
  
  function formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }
  
  function getPaymentStatusBadge(patient: Patient) {
    if (patient.paymentConfirmed) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Paid
        </span>
      );
    } else if (patient.requiredPlanType) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Awaiting Payment
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          No Plan Set
        </span>
      );
    }
  }

  function getPlanTypeBadge(planType?: string) {
    if (!planType) return null;
    
    const planColors: Record<string, string> = {
      basic: 'bg-blue-100 text-blue-800',
      standard: 'bg-purple-100 text-purple-800',
      premium: 'bg-indigo-100 text-indigo-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${planColors[planType] || 'bg-gray-100 text-gray-800'}`}>
        {planType.charAt(0).toUpperCase() + planType.slice(1)}
      </span>
    );
  }
  
  function togglePatientExpansion(patientId: string) {
    if (expandedPatient === patientId) {
      setExpandedPatient(null);
    } else {
      setExpandedPatient(patientId);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Payment Management Dashboard</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Plan</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                      No patients found
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <React.Fragment key={patient.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{patient.folderName}</div>
                          <div className="text-xs text-gray-500">{patient.id}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(patient.uploadedAt)}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {patient.reportReady ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Ready
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Not Ready
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getPlanTypeBadge(patient.requiredPlanType)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getPaymentStatusBadge(patient)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => togglePatientExpansion(patient.id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            {expandedPatient === patient.id ? 'Hide Details' : 'Show Details'}
                          </button>
                          <a
                            href={`/alola/${patient.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                      
                      {/* Expanded details */}
                      {expandedPatient === patient.id && (
                        <tr>
                          <td colSpan={6}>
                            <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Payment Details */}
                                <div>
                                  <h4 className="text-md font-semibold mb-2">Payment Details</h4>
                                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <dt className="text-gray-600">Status:</dt>
                                    <dd>{patient.paymentConfirmed ? 'Paid' : 'Not Paid'}</dd>
                                    
                                    <dt className="text-gray-600">Required Plan:</dt>
                                    <dd>{patient.requiredPlanType || 'Not Set'}</dd>
                                    
                                    {patient.paymentConfirmed && (
                                      <>
                                        <dt className="text-gray-600">Amount:</dt>
                                        <dd>{patient.paymentAmount} {patient.paymentCurrency || 'EUR'}</dd>
                                        
                                        <dt className="text-gray-600">Payment Date:</dt>
                                        <dd>{formatDate(patient.paymentDate)}</dd>
                                      </>
                                    )}
                                  </dl>
                                </div>
                                
                                {/* Set Required Plan */}
                                <div>
                                  <h4 className="text-md font-semibold mb-2">Set Required Plan</h4>
                                  <SetRequiredPlan 
                                    patientId={patient.id} 
                                    currentPlan={patient.requiredPlanType}
                                    onSuccess={fetchPatients}
                                  />
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

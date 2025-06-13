import React from "react";
import prisma, { Patient } from "@/app/models/patient";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function AlolaDashboard() {
  // For server-side logging only, won't expose to client
  console.log("Starting Alola Dashboard render");
  console.log("DATABASE_URL type:", typeof process.env.DATABASE_URL);
  console.log("DATABASE_URL prefix:", process.env.DATABASE_URL?.substring(0, 12) + "...");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  
  let patients: Patient[] = [];
  let error = null;
  let databaseInfo = null;

  try {
    console.log("Attempting to query patients...");
    patients = await prisma.patient.findMany({
      orderBy: { uploadedAt: "desc" },
    });
    console.log("Query successful, patient count:", patients.length);
    
    // Get database connection info for debugging
    const databaseType = process.env.DATABASE_URL?.startsWith('file:') ? 'SQLite' : 'PostgreSQL';
    databaseInfo = `Connected to ${databaseType} database`;
  } catch (err) {
    console.error("Database error:", err);
    error = 'Could not load patients. Database may be unavailable.';
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Alola Dashboard</h1>
          <LogoutButton />
        </div>
        {databaseInfo && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded mb-4 text-xs">
            {databaseInfo} • Environment: {process.env.NODE_ENV || 'development'}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">ID</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Date of Birth</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Conditions</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Allergies</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Comments</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Medications</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Uploaded At</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Paid</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Report Ready</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(!patients || patients.length === 0) && (
                <tr>
                  <td colSpan={10} className="px-4 py-4 text-center text-gray-500">
                    {error ? "Database unavailable." : "No patients found."}
                  </td>
                </tr>
              )}
              {patients && patients.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 break-all max-w-[120px] md:max-w-[200px]">{p.id}</td>
                  <td className="px-4 py-2">{p.dateOfBirth || "-"}</td>
                  <td className="px-4 py-2 max-w-[120px] md:max-w-[200px] truncate" title={p.conditions || "-"}>{p.conditions || "-"}</td>
                  <td className="px-4 py-2 max-w-[120px] md:max-w-[200px] truncate" title={p.allergies || "-"}>{p.allergies || "-"}</td>
                  <td className="px-4 py-2 max-w-[120px] md:max-w-[200px] truncate" title={p.comments || "-"}>{p.comments || "-"}</td>
                  <td className="px-4 py-2 max-w-[120px] md:max-w-[200px] truncate" title={p.medications || "-"}>{p.medications || "-"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{new Date(p.uploadedAt).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <span className={p.paid ? "text-green-600" : "text-gray-400"}>{p.paid ? "Yes" : "No"}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={p.reportReady ? "text-green-600" : "text-gray-400"}>{p.reportReady ? "Yes" : "No"}</span>
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/alola/${p.id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                    >
                      View Files
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

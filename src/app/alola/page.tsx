import React from "react";
import prisma from "@/app/models/patient";
import Link from "next/link";

export default async function AlolaDashboard() {
  // Fetch all patients from Prisma
  const patients = await prisma.patient.findMany({
    orderBy: { uploadedAt: "desc" }
  });

  return (
    <main className="min-h-screen bg-gray-50 p-4 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Alola Dashboard</h1>
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">ID</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Date of Birth</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Conditions</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Allergies</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Comments</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Uploaded At</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Paid</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Report Ready</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patients.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-4 text-center text-gray-500">
                    No patients found.
                  </td>
                </tr>
              )}
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 break-all max-w-[120px] md:max-w-[200px]">{p.id}</td>
                  <td className="px-4 py-2">{p.dateOfBirth || "-"}</td>
                  <td className="px-4 py-2 max-w-[120px] md:max-w-[200px] truncate" title={p.conditions || "-"}>{p.conditions || "-"}</td>
                  <td className="px-4 py-2 max-w-[120px] md:max-w-[200px] truncate" title={p.allergies || "-"}>{p.allergies || "-"}</td>
                  <td className="px-4 py-2 max-w-[120px] md:max-w-[200px] truncate" title={p.comments || "-"}>{p.comments || "-"}</td>
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

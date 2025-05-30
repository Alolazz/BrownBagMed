import React from "react";
import { useSearchParams } from "next/navigation";
import { BITCOIN_ADDRESS, BITCOIN_QR } from "./bitcoin";

export default function ReportPage({ params }: { params: { patientId: string } }) {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const { patientId } = params;

  if (status === "paid") {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Your Report is Ready</h1>
        <a
          href={`/uploads/${patientId}/report.pdf`}
          download
          className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition"
        >
          Download Report (PDF)
        </a>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Pay to Access Report</h1>
      <div className="w-full max-w-sm space-y-6">
        {/* Stripe Checkout */}
        <form action="/api/payment/create-session" method="POST">
          <input type="hidden" name="patientId" value={patientId} />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition mb-2"
          >
            Pay with Card (Stripe €129)
          </button>
        </form>
        {/* Bitcoin */}
        <div className="bg-white rounded shadow p-4 flex flex-col items-center">
          <div className="mb-2 font-semibold">Pay with Bitcoin</div>
          <img src={BITCOIN_QR} alt="Bitcoin QR" className="w-32 h-32 mb-2" />
          <div className="text-xs break-all text-gray-700">{BITCOIN_ADDRESS}</div>
          <div className="mt-2 text-xs text-gray-500">Send exactly 0.0025 BTC</div>
        </div>
      </div>
    </main>
  );
}

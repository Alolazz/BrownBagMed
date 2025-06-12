import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medication Review Received | Brown Bag Med",
  description:
    "Thank you! Your medications have been submitted. A pharmacist will review them and you’ll receive a detailed report soon.",
};

export default function UploadConfirmationPage() {
  return (
    <main
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#2563eb",
            marginBottom: 16,
          }}
        >
          Upload Confirmation
        </h1>
        <p style={{ fontSize: 18, color: "#222" }}>
          Your files have been uploaded successfully.
        </p>
      </div>
    </main>
  );
}

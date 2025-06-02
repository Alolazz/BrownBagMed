import React from 'react';

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms &amp; Conditions</h1>
      {/* ...other terms content... */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Disclaimer</h2>
        <p className="text-gray-700">
          Brown Bag Med provides medication analysis services for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your physician or pharmacist before making any changes to your medication.
        </p>
      </section>
    </div>
  );
}

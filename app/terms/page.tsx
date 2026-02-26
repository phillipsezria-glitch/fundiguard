"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By using FundiGuard.ke, you agree to these terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">2. User Responsibilities</h2>
            <p className="text-gray-600">
              Users must provide accurate information, comply with laws, and treat other users respectfully.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Escrow & Payments</h2>
            <p className="text-gray-600">
              All payments are processed through M-Pesa and held in escrow until job completion is verified.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Dispute Resolution</h2>
            <p className="text-gray-600">
              Disputes will be resolved through our platform's dispute resolution system within 48 hours.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Changes to Terms</h2>
            <p className="text-gray-600">
              We may update these terms at any time. Continued use constitutes acceptance.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

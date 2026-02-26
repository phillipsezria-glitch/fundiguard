"use client";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Information Collection</h2>
            <p className="text-gray-600">
              We collect information you provide directly, such as phone number, email, and profile details needed to connect service providers with clients.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Information</h2>
            <p className="text-gray-600">
              Your information is used to provide services, process payments via M-Pesa, manage escrow, and improve platform security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Protection</h2>
            <p className="text-gray-600">
              We protect your data through encryption, secure servers, and compliance with Kenyan data protection regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Contact Us</h2>
            <p className="text-gray-600">
              Questions about privacy? Contact: <a href="mailto:privacy@fundiguard.ke" className="text-green-600 hover:underline">privacy@fundiguard.ke</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

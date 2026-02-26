"use client";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-2">📧 Email</h3>
            <p className="text-gray-600">
              <a href="mailto:support@fundiguard.ke" className="text-green-600 hover:underline">support@fundiguard.ke</a>
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-2">🏢 Address</h3>
            <p className="text-gray-600">Nairobi, Kenya</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-2">⏱️ Response Time</h3>
            <p className="text-gray-600">We typically respond within 24 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

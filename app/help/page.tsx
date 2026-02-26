"use client";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Help & Support</h1>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-2">📧 Email Support</h3>
            <p className="text-gray-600">
              <a href="mailto:support@fundiguard.ke" className="text-green-600 hover:underline">support@fundiguard.ke</a>
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-2">❓ Common Issues</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Can't log in? Check your email verification</li>
              <li>Payment failed? Ensure M-Pesa balance is sufficient</li>
              <li>Dispute on job? Use our 48-hour resolution system</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-2">🔒 Security</h3>
            <p className="text-gray-600">
              We take security seriously. If you notice suspicious activity, report it immediately to support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

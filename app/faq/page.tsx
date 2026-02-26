"use client";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">How do I book a professional?</h3>
            <p className="text-gray-600">Sign up, post a job, receive bids, and book your preferred professional.</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">How are payments secured?</h3>
            <p className="text-gray-600">All payments are held in escrow until the job is completed and verified.</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">How do I become a registered professional?</h3>
            <p className="text-gray-600">Sign up as a pro, verify your identity, and complete your profile.</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600">We accept M-Pesa for all transactions in Kenya.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

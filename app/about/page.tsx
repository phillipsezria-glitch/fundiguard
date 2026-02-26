"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">About FundiGuard.ke</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To make quality home services safe, affordable, and accessible for all Kenyans through verified professionals and secure payments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">Why FundiGuard?</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>✓ Verified professionals with ratings and reviews</li>
              <li>✓ Escrow protection - pay only when done</li>
              <li>✓ Insurance coverage for jobs</li>
              <li>✓ 48-hour dispute resolution</li>
              <li>✓ M-Pesa integration for easy payments</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Values</h2>
            <p className="text-gray-600">
              Trust, transparency, and quality. We believe in connecting skilled professionals with people who need them, safely and fairly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-600">
              Email: <a href="mailto:info@fundiguard.ke" className="text-green-600 hover:underline">info@fundiguard.ke</a><br/>
              Phone: +254 (coming soon)
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

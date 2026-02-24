"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />

      <section style={{ background: "linear-gradient(135deg, #003320, #005A2C)", padding: "60px 0 40px" }}>
        <div className="container">
          <h1 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "2.5rem", color: "white", marginBottom: 8 }}>
            Privacy Policy
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem" }}>Last updated: February 2026</p>
        </div>
      </section>

      <section style={{ padding: "60px 0", background: "var(--white)" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ lineHeight: 1.8, color: "var(--text)" }}>
            <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.5rem", marginBottom: 16, marginTop: 32 }}>
              1. Information We Collect
            </h2>
            <p style={{ marginBottom: 16 }}>
              We collect the following information to provide and improve our services:
            </p>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li><strong>Account Information:</strong> Name, phone number, email, location, profile photo</li>
              <li><strong>Payment Information:</strong> M-Pesa phone number and transaction history (not stored directly)</li>
              <li><strong>Job Information:</strong> Job descriptions, photos, budget, location, completion status</li>
              <li><strong>Communication:</strong> Messages, ratings, and reviews between clients and fundis</li>
              <li><strong>Device Information:</strong> Browser type, IP address, device type for security and analytics</li>
            </ul>

            <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.5rem", marginBottom: 16, marginTop: 32 }}>
              2. How We Use Your Information
            </h2>
            <p style={{ marginBottom: 16 }}>
              We use collected information to:
            </p>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li>Facilitate job matching between clients and fundis</li>
              <li>Process M-Pesa payments and manage escrow</li>
              <li>Verify user identity and conduct background checks</li>
              <li>Resolve disputes within 48 hours</li>
              <li>Send service notifications and promotional offers</li>
              <li>Improve the Platform through analytics and feedback</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.5rem", marginBottom: 16, marginTop: 32 }}>
              3. Data Sharing
            </h2>
            <p style={{ marginBottom: 16 }}>
              Your information is shared only when necessary:
            </p>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li><strong>With Fundis/Clients:</strong> Name, phone, location, photos (as needed for job matching)</li>
              <li><strong>With Safaricom:</strong> Phone number for M-Pesa verification only</li>
              <li><strong>With DCI:</strong> ID number for background check verification</li>
              <li><strong>With Insurance Partner:</strong> Job details if insurance is purchased</li>
              <li><strong>Legal Requirements:</strong> We may disclose data if required by law enforcement</li>
            </ul>

            <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.5rem", marginBottom: 16, marginTop: 32 }}>
              4. Data Security
            </h2>
            <p style={{ marginBottom: 16 }}>
              We protect your data using:
            </p>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li>SSL encryption for all data in transit</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls limiting staff to necessary information only</li>
              <li>Two-factor authentication via OTP for account access</li>
            </ul>
            <p style={{ marginBottom: 16 }}>
              However, no system is 100% secure. We are not responsible for unauthorized access due to user error, 
              phishing, or browser extensions.
            </p>

            <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.5rem", marginBottom: 16, marginTop: 32 }}>
              5. Your Rights
            </h2>
            <p style={{ marginBottom: 16 }}>
              You have the right to:
            </p>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li>Access your personal data at any time</li>
              <li>Request corrections to inaccurate information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt-out of marketing communications</li>
              <li>Obtain a copy of your data in machine-readable format</li>
            </ul>

            <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.5rem", marginBottom: 16, marginTop: 32 }}>
              6. Cookies
            </h2>
            <p style={{ marginBottom: 16 }}>
              We use cookies and local storage to:
            </p>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li>Keep you logged in across sessions</li>
              <li>Remember your preferences (language, theme)</li>
              <li>Track usage patterns to improve the app</li>
            </ul>
            <p style={{ marginBottom: 16 }}>
              You can disable cookies in your browser settings, but this may affect functionality.
            </p>

            <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.5rem", marginBottom: 16, marginTop: 32 }}>
              7. Third-Party Links
            </h2>
            <p style={{ marginBottom: 16 }}>
              Our Platform may contain links to external sites. We are not responsible for their privacy practices. 
              Please review their privacy policies before submitting personal information.
            </p>

            <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.5rem", marginBottom: 16, marginTop: 32 }}>
              8. Contact Us
            </h2>
            <p style={{ marginBottom: 32 }}>
              For privacy concerns, contact us at: <strong>privacy@fundiguard.ke</strong>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

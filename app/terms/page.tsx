"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />

      <section style={{ background: "linear-gradient(135deg, #003320, #005A2C)", padding: "60px 0 40px" }}>
        <div className="container">
          <h1 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "2.5rem", color: "white", marginBottom: 8 }}>
            Terms & Conditions
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem" }}>Last updated: February 2026</p>
        </div>
      </section>

      <section style={{ padding: "60px 0", background: "var(--white)" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ lineHeight: 1.8, color: "var(--text)" }}>
            <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.5rem", marginBottom: 16, marginTop: 32 }}>
              1. Acceptance of Terms
            </h2>
            <p style={{ marginBottom: 16 }}>
              By accessing and using FundiGuard.ke ("the Platform"), you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.5rem", marginBottom: 16, marginTop: 32 }}>
              2. Use of Platform
            </h2>
            <p style={{ marginBottom: 16 }}>
              You agree to use the Platform only for lawful purposes and in a way that does not infringe upon the rights 
              of others or restrict their use and enjoyment of the Platform. Prohibited behavior includes:
            </p>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li>Harassing or causing distress to any person</li>
              <li>Offending, insulting, or intimidating others based on gender, sexual orientation, race, or religion</li>
              <li>Attempting to gain unauthorized access to the Platform</li>
              <li>Transmitting viruses or malicious code</li>
              <li>Posting false or misleading information</li>
            </ul>

            <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.5rem", marginBottom: 16, marginTop: 32 }}>
              3. M-Pesa Escrow
            </h2>
            <p style={{ marginBottom: 16 }}>
              Funds paid via M-Pesa are held in escrow until the client approves the work. The Platform acts as a 
              neutral third party. Disputes over payment are resolved within 48 hours. By using the Platform, you 
              agree to accept the outcome of our dispute resolution process.
            </p>

            <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.5rem", marginBottom: 16, marginTop: 32 }}>
              4. User Responsibilities
            </h2>
            <p style={{ marginBottom: 16 }}>
              You are responsible for all activity on your account. You agree to:
            </p>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li>Provide accurate and complete information when registering</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Notify us immediately of unauthorized access</li>
              <li>Disclose any conflicts of interest (e.g., being related to a fundi you're booking)</li>
            </ul>

            <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.5rem", marginBottom: 16, marginTop: 32 }}>
              5. Job Insurance
            </h2>
            <p style={{ marginBottom: 16 }}>
              Optional job insurance covers damage up to KSh 250,000 per claim. Insurance does not cover:
            </p>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li>Negligence on the client's part</li>
              <li>Risks disclosed before work began</li>
              <li>Wear and tear or existing damage</li>
              <li>Work not performed by verified fundis on the Platform</li>
            </ul>

            <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.5rem", marginBottom: 16, marginTop: 32 }}>
              6. Limitation of Liability
            </h2>
            <p style={{ marginBottom: 16 }}>
              The Platform is provided "as-is" without warranties of any kind. We are not liable for:
            </p>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li>Quality of work performed by fundis</li>
              <li>Disputes between clients and fundis (except for escrow distribution)</li>
              <li>Unauthorized use of your account</li>
              <li>Service interruptions or data loss</li>
            </ul>

            <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.5rem", marginBottom: 16, marginTop: 32 }}>
              7. Termination
            </h2>
            <p style={{ marginBottom: 16 }}>
              We reserve the right to terminate or suspend your account if you:
            </p>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li>Violate these terms</li>
              <li>Engage in fraudulent activity</li>
              <li>Harass other users</li>
              <li>Repeatedly cancel jobs without legitimate reason</li>
            </ul>

            <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.5rem", marginBottom: 16, marginTop: 32 }}>
              8. Changes to Terms
            </h2>
            <p style={{ marginBottom: 32 }}>
              We reserve the right to update these terms at any time. Continued use of the Platform constitutes 
              acceptance of updated terms. We will notify users of significant changes via email or in-app notification.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

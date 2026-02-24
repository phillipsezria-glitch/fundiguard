"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import Button from "../components/ui/Button";

export default function SupportPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Header />

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #003320, #00C853)", padding: "80px 0", textAlign: "center" }}>
        <div className="container">
          <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(2rem,5vw,3.5rem)", color: "white", marginBottom: 16, lineHeight: 1.1 }}>
            We're Here to Help
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.9)", marginBottom: 32, maxWidth: 700, margin: "0 auto 32px" }}>
            Get answers, resolve issues, and learn how to make the most of FundiGuard.ke
          </p>
        </div>
      </section>

      {/* Support Options */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, marginBottom: 60 }}>
            {[
              { icon: "💬", title: "Live Chat", desc: "Chat with our support team in real-time", action: "Chat Now" },
              { icon: "📧", title: "Email Support", desc: "Send us a detailed message anytime", action: "support@fundiguard.ke" },
              { icon: "📱", title: "Phone Support", desc: "Call us during business hours", action: "+254 720 XXX XXX" },
              { icon: "📚", title: "Help Center", desc: "Browse FAQs and guides", action: "Browse Articles" },
            ].map((option, idx) => (
              <div key={idx} style={{ background: "white", borderRadius: 16, padding: "32px 24px", textAlign: "center", border: "1px solid #eee" }}>
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>{option.icon}</div>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>{option.title}</h3>
                <p style={{ color: "var(--text-secondary)", marginBottom: 20, fontSize: "0.9rem" }}>{option.desc}</p>
                <Button variant="primary" size="sm">
                  {option.action}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "var(--green-light)", padding: "80px 0" }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "2rem", textAlign: "center", marginBottom: 60 }}>
            Common Questions
          </h2>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { q: "How do I post a job?", a: "Click 'Post a Job' from the menu, fill in job details, select a location, and add photos. That's it!" },
              { q: "How do I get hired as a professional?", a: "Sign up, complete verification (ID + police clearance), record a skill video, and start receiving job notifications." },
              { q: "Is payment secure?", a: "Yes. We use escrow - money is held until the job is completed and approved by the client." },
              { q: "What if there's a dispute?", a: "Both parties can file evidence. Our team reviews and makes a fair decision within 24-48 hours." },
            ].map((faq, idx) => (
              <details
                key={idx}
                style={{
                  background: "white",
                  borderRadius: 12,
                  padding: "20px",
                  cursor: "pointer",
                  border: "1px solid #ddd",
                }}
              >
                <summary style={{ fontFamily: "Poppins", fontWeight: 700, outline: "none", cursor: "pointer" }}>
                  {faq.q}
                </summary>
                <p style={{ marginTop: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

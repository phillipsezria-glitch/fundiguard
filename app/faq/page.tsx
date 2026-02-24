"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does FundiGuard work?",
      answer: "Browse verified fundis or post a job. Choose your pro based on ratings and portfolio. Pay via M-Pesa into escrow (we hold it safely). Fundi completes work and uploads photos. You review and release payment. If there's an issue, we resolve it within 48 hours."
    },
    {
      question: "What is M-Pesa Escrow?",
      answer: "Your payment is held securely by us (not the fundi) until you approve the work. This protects both clients and fundis. Money is released only when you confirm the job is done satisfactorily, or disputed items are resolved."
    },
    {
      question: "What if the fundi doesn't show up?",
      answer: "Contact us immediately via the app. We'll attempt to reach the fundi. If they don't respond within 1 hour, we refund your escrow in full. You can then rebook with another pro."
    },
    {
      question: "Is job insurance worth it?",
      answer: "Job insurance (from KSh 99) covers damage up to KSh 250,000. It's recommended for high-value jobs (renovations, electrical work) or if you're worried about accidents. It doesn't cover negligence or pre-existing damage."
    },
    {
      question: "How do I become a verified fundi?",
      answer: "Sign up on FundiGuard, provide your ID, and submit to a police clearance check via DCI. You'll get a ✓ verified badge within 3-5 business days. This builds trust and gets you more bookings."
    },
    {
      question: "What happens if there's a dispute?",
      answer: "If you disagree with a fundi about payment, open a dispute on the app with photo evidence. Our team reviews both sides and makes a decision within 48 hours. We're fair and transparent."
    },
    {
      question: "Can I cancel a booking?",
      answer: "Yes, but timing matters. Cancel more than 24 hours before: Full refund. Cancel within 24 hours: 80% refund. Fundi has already started: Contact us to discuss (usually 50% refund). No-show by fundi: Full refund + credit."
    },
    {
      question: "How do ratings work?",
      answer: "After job completion, both client and fundi rate each other (1-5 stars) and leave reviews. Fundis with 4.5+ stars and 20+ reviews appear higher in search results. Low ratings (below 3 stars) after multiple jobs may result in account review."
    },
    {
      question: "Is my data safe?",
      answer: "Yes. We use SSL encryption, regular security audits, and never share your phone number with fundis until a booking is confirmed. We don't store M-Pesa credentials—Safaricom handles that securely."
    },
    {
      question: "What if a fundi charges extra on-site?",
      answer: "Always agree on pricing before the job starts (use our job posting form). If a fundi demands extra payment, refuse and file a dispute immediately with the app. We'll side with you if pricing wasn't discussed."
    },
    {
      question: "How quickly do fundis respond?",
      answer: "Verified, online fundis typically respond within 15-30 minutes if they're available. You'll see their status (online/offline) and response time on their profile before booking."
    },
    {
      question: "Can I request a specific fundi?",
      answer: "Yes! If you've worked with a fundi before and loved them, you can search for them by name or ID and book directly. Returning customers often get loyalty discounts."
    }
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />

      <section style={{ background: "linear-gradient(135deg, #003320, #005A2C)", padding: "60px 0 40px" }}>
        <div className="container">
          <h1 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "2.5rem", color: "white", marginBottom: 8 }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem" }}>Everything you need to know about FundiGuard</p>
        </div>
      </section>

      <section style={{ padding: "60px 0", background: "var(--white)" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ display: "grid", gap: 0 }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  borderBottom: "1px solid var(--border)",
                  padding: "24px 0",
                }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <h3 style={{
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    color: "var(--text)",
                    margin: 0,
                  }}>
                    {faq.question}
                  </h3>
                  <span style={{
                    fontSize: "1.5rem",
                    color: "var(--green)",
                    transition: "transform 0.3s ease",
                    transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                    flexShrink: 0,
                    marginLeft: 16,
                  }}>
                    ▼
                  </span>
                </button>
                {openIndex === i && (
                  <p style={{
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                    marginTop: 12,
                    marginBottom: 0,
                    fontSize: "0.95rem",
                  }}>
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 60,
            padding: "32px 24px",
            background: "var(--green-light)",
            borderRadius: 16,
            textAlign: "center",
          }}>
            <h3 style={{
              fontFamily: "Poppins",
              fontWeight: 700,
              fontSize: "1.2rem",
              color: "var(--green-dark)",
              marginBottom: 8,
            }}>
              Still have questions?
            </h3>
            <p style={{
              color: "var(--green-dark)",
              marginBottom: 16,
            }}>
              Contact our support team at <strong>support@fundiguard.ke</strong> or use the chat on the app.
            </p>
            <p style={{
              color: "var(--green-dark)",
              fontSize: "0.9rem",
            }}>
              Response time: Usually within 2 hours (9 AM - 6 PM EAT)
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

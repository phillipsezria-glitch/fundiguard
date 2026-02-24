"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/ui/Button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    type: "general",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to an API
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", subject: "", type: "general", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  const contactMethods = [
    {
      icon: "📧",
      title: "Email",
      contact: "support@fundiguard.ke",
      desc: "Response within 2 hours (business hours)",
      color: "#E3F2FD"
    },
    {
      icon: "💬",
      title: "Live Chat",
      contact: "In-app support",
      desc: "Available 9 AM - 6 PM EAT, weekdays",
      color: "#FFF8E1"
    },
    {
      icon: "📱",
      title: "WhatsApp",
      contact: "+254 700 123 456",
      desc: "Quick replies on WhatsApp Business",
      color: "#E8F5E9"
    },
    {
      icon: "☎️",
      title: "Phone",
      contact: "+254 20 XXXX XXXX",
      desc: "Monday - Friday, 9 AM - 6 PM EAT",
      color: "#FBE9E7"
    },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />

      <section style={{ background: "linear-gradient(135deg, #003320, #005A2C)", padding: "60px 0 40px" }}>
        <div className="container">
          <h1 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "2.5rem", color: "white", marginBottom: 8 }}>
            Contact Us
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem" }}>We'd love to hear from you. Get in touch with our team.</p>
        </div>
      </section>

      <section style={{ padding: "60px 0", background: "var(--white)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 60 }}>
            {contactMethods.map((method) => (
              <div
                key={method.title}
                style={{
                  background: method.color,
                  borderRadius: 16,
                  padding: "24px",
                  textAlign: "center",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{method.icon}</div>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1rem", marginBottom: 6 }}>
                  {method.title}
                </h3>
                <p style={{ color: "var(--text)", fontWeight: 600, fontSize: "0.9rem", marginBottom: 8, margin: 0 }}>
                  {method.contact}
                </p>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem", margin: 0 }}>
                  {method.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "2rem", marginBottom: 8, textAlign: "center" }}>
              Send us a Message
            </h2>
            <p style={{ color: "var(--text-secondary)", textAlign: "center", marginBottom: 32 }}>
              Fill out the form below and we'll get back to you as soon as possible
            </p>

            {submitted && (
              <div style={{
                background: "var(--green-light)",
                color: "var(--green-dark)",
                padding: "16px 20px",
                borderRadius: 12,
                marginBottom: 24,
                textAlign: "center",
                fontWeight: 600,
              }}>
                ✅ Thank you! We've received your message. We'll respond within 2 hours.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "2px solid var(--border)",
                    outline: "none",
                    fontSize: "0.95rem",
                    fontFamily: "Inter",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <input
                  type="email"
                  placeholder="Your Email *"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "2px solid var(--border)",
                    outline: "none",
                    fontSize: "0.95rem",
                    fontFamily: "Inter",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "2px solid var(--border)",
                    outline: "none",
                    fontSize: "0.95rem",
                    fontFamily: "Inter",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "2px solid var(--border)",
                    outline: "none",
                    fontSize: "0.95rem",
                    fontFamily: "Inter",
                    background: "white",
                    cursor: "pointer",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                >
                  <option value="general">General Inquiry</option>
                  <option value="bug">Report a Bug</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Subject *"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "2px solid var(--border)",
                  outline: "none",
                  fontSize: "0.95rem",
                  fontFamily: "Inter",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />

              <textarea
                placeholder="Your Message *"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "2px solid var(--border)",
                  outline: "none",
                  fontSize: "0.95rem",
                  fontFamily: "Inter",
                  resize: "vertical",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />

              <Button variant="primary" size="lg" fullWidth type="submit">
                Send Message
              </Button>
            </form>

            <div style={{
              marginTop: 48,
              padding: "24px",
              background: "var(--bg)",
              borderRadius: 12,
              textAlign: "center",
            }}>
              <p style={{ color: "var(--text-secondary)", marginBottom: 12 }}>
                <strong>Expected Response Time:</strong>
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ color: "var(--green)", fontWeight: 700, marginBottom: 4 }}>⚡ During Business Hours</div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text)" }}>2 hours response time</div>
                </div>
                <div>
                  <div style={{ color: "var(--orange)", fontWeight: 700, marginBottom: 4 }}>🌙 After Hours</div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text)" }}>Next business day</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

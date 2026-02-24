"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

export default function SupportPage() {
  const categories = [
    {
      icon: "❓",
      title: "Help Center",
      desc: "Browse guides, FAQs, and troubleshooting",
      href: "/help",
      color: "#E3F2FD"
    },
    {
      icon: "💬",
      title: "Contact Us",
      desc: "Email, chat, or call our support team",
      href: "/contact",
      color: "#FFF8E1"
    },
    {
      icon: "📋",
      title: "FAQ",
      desc: "Answers to common questions",
      href: "/faq",
      color: "#FBE9E7"
    },
    {
      icon: "🔒",
      title: "Privacy Policy",
      desc: "How we protect your data",
      href: "/privacy",
      color: "#E8F5E9"
    },
    {
      icon: "📜",
      title: "Terms of Service",
      desc: "Our terms and conditions",
      href: "/terms",
      color: "#F3E5F5"
    },
    {
      icon: "🐛",
      title: "Report a Problem",
      desc: "Tell us about bugs or issues",
      href: "/contact?subject=bug",
      color: "#FFE0E0"
    },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />

      <section style={{ background: "linear-gradient(135deg, #003320, #005A2C)", padding: "80px 0 60px" }}>
        <div className="container">
          <h1 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "2.8rem", color: "white", marginBottom: 12 }}>
            Support & Help
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem", maxWidth: 600 }}>
            We're here to help. Find answers, contact our team, or explore our policies.
          </p>
        </div>
      </section>

      <section style={{ padding: "80px 0", background: "var(--white)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {categories.map((cat, i) => (
              <Link key={cat.title} href={cat.href} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    background: cat.color,
                    borderRadius: 16,
                    padding: "32px 24px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    border: "1px solid  rgba(0,0,0,0.05)",
                    animation: `fadeInUp 0.6s ease-out ${i * 0.08}s both`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-lg)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{cat.icon}</div>
                  <h3 style={{
                    fontFamily: "Poppins",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "var(--text)",
                    marginBottom: 8,
                  }}>
                    {cat.title}
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0 }}>
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 0", background: "var(--bg)" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 className="section-title">Quick Navigation</h2>
            <p className="section-subtitle">Get help in seconds</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {[
              { emoji: "🔧", label: "Troubleshooting", desc: "Fix common issues", href: "/help" },
              { emoji: "👤", label: "Profile Help", desc: "Manage your account", href: "/help" },
              { emoji: "💰", label: "Payments", desc: "M-Pesa & escrow questions", href: "/help" },
              { emoji: "⭐", label: "Ratings", desc: "How ratings work", href: "/faq" },
              { emoji: "📱", label: "Mobile App", desc: "App installation & features", href: "/help" },
              { emoji: "🛡️", label: "Safety", desc: "Protect yourself", href: "/help" },
            ].map((item, i) => (
              <Link key={item.label} href={item.href} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    background: "var(--white)",
                    borderRadius: 12,
                    padding: "20px 16px",
                    textAlign: "center",
                    boxShadow: "var(--shadow)",
                    animation: `fadeInUp 0.6s ease-out ${i * 0.08}s both`,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-lg)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow)";
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: 8 }}>{item.emoji}</div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: 4 }}>{item.label}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 0", background: "var(--white)" }}>
        <div className="container" style={{ maxWidth: 800, textAlign: "center" }}>
          <h2 className="section-title">Still Need Help?</h2>
          <p className="section-subtitle" style={{ marginBottom: 32 }}>
            Our support team is available Monday to Friday, 9 AM - 6 PM EAT
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{
              background: "var(--green)",
              color: "white",
              padding: "14px 36px",
              borderRadius: 10,
              fontWeight: 600,
              display: "inline-block",
              textDecoration: "none",
            }}>
              💬 Contact Support
            </Link>
            <Link href="/help" style={{
              background: "transparent",
              color: "var(--green)",
              border: "2px solid var(--green)",
              padding: "14px 36px",
              borderRadius: 10,
              fontWeight: 600,
              display: "inline-block",
              textDecoration: "none",
            }}>
              📚 Browse Help Center
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

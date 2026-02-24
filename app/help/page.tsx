"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

export default function HelpPage() {
  const [selectedCategory, setSelectedCategory] = useState("getting-started");

  const categories = {
    "getting-started": {
      title: "Getting Started",
      icon: "🚀",
      articles: [
        { title: "Creating Your Account", slug: "create-account" },
        { title: "Verifying Your Identity", slug: "verify-identity" },
        { title: "Setting Up Your Profile", slug: "profile-setup" },
        { title: "Downloading the Mobile App", slug: "mobile-app" },
      ]
    },
    "for-clients": {
      title: "For Clients",
      icon: "🏠",
      articles: [
        { title: "How to Post a Job", slug: "post-job" },
        { title: "Browsing & Hiring Fundis", slug: "browse-fundis" },
        { title: "Understanding Escrow", slug: "escrow-explained" },
        { title: "Job Insurance Guide", slug: "insurance-guide" },
        { title: "Ratings & Reviews", slug: "ratings" },
      ]
    },
    "for-fundis": {
      title: "For Fundis (Pros)",
      icon: "🔧",
      articles: [
        { title: "Professional Profile Setup", slug: "pro-profile" },
        { title: "Getting DCI Verified", slug: "dci-verification" },
        { title: "Responding to Job Bids", slug: "bidding" },
        { title: "Managing Your Earnings", slug: "earnings" },
        { title: "Building Your Reputation", slug: "reputation" },
      ]
    },
    "payments": {
      title: "Payments & Escrow",
      icon: "💰",
      articles: [
        { title: "M-Pesa Payment Guide", slug: "mpesa" },
        { title: "How Escrow Works", slug: "escrow" },
        { title: "Releasing Payment", slug: "release-payment" },
        { title: "Refunds & Cancellations", slug: "refunds" },
        { title: "Fee Structure", slug: "fees" },
      ]
    },
    "disputes": {
      title: "Disputes & Safety",
      icon: "⚖️",
      articles: [
        { title: "Opening a Dispute", slug: "open-dispute" },
        { title: "Dispute Resolution Process", slug: "dispute-process" },
        { title: "Safety Tips", slug: "safety-tips" },
        { title: "Reporting Inappropriate Behavior", slug: "report-behavior" },
      ]
    },
    "technical": {
      title: "Technical Support",
      icon: "🛠️",
      articles: [
        { title: "App Won't Load", slug: "app-not-loading" },
        { title: "Can't Login", slug: "cant-login" },
        { title: "Photo Upload Issues", slug: "photo-upload" },
        { title: "Connectivity Problems", slug: "connectivity" },
      ]
    }
  };

  const currentCategory = categories[selectedCategory as keyof typeof categories];

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />

      <section style={{ background: "linear-gradient(135deg, #003320, #005A2C)", padding: "60px 0 40px" }}>
        <div className="container">
          <h1 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "2.5rem", color: "white", marginBottom: 8 }}>
            Help Center
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem" }}>Find guides and answers to common questions</p>
        </div>
      </section>

      <section style={{ padding: "60px 0", background: "var(--white)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 40 }}>
            {/* Sidebar */}
            <div>
              <h3 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 16, fontSize: "0.95rem", textTransform: "uppercase", color: "var(--text-secondary)" }}>
                Categories
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(categories).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: selectedCategory === key ? "var(--green-light)" : "transparent",
                      color: selectedCategory === key ? "var(--green-dark)" : "var(--text)",
                      cursor: "pointer",
                      textAlign: "left",
                      fontWeight: selectedCategory === key ? 600 : 500,
                      fontSize: "0.95rem",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedCategory !== key) {
                        (e.currentTarget as HTMLButtonElement).style.background = "var(--bg)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCategory !== key) {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      }
                    }}
                  >
                    {cat.icon} {cat.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div>
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{currentCategory.icon}</div>
                <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.8rem", marginBottom: 8 }}>
                  {currentCategory.title}
                </h2>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {currentCategory.articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/help/${article.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        padding: "16px 20px",
                        borderRadius: 12,
                        background: "var(--bg)",
                        border: "1px solid var(--border)",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--green)";
                        (e.currentTarget as HTMLDivElement).style.background = "var(--green-light)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                        (e.currentTarget as HTMLDivElement).style.background = "var(--bg)";
                      }}
                    >
                      <span style={{ fontWeight: 500, color: "var(--text)" }}>📖 {article.title}</span>
                      <span style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>

              <div style={{
                marginTop: 48,
                padding: "24px",
                background: "#E3F2FD",
                borderLeft: "4px solid #1565C0",
                borderRadius: 8,
              }}>
                <strong>💡 Tip:</strong> Use the search function in the app or search bar to find articles quickly.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 0", background: "var(--bg)" }}>
        <div className="container" style={{ maxWidth: 600, textAlign: "center" }}>
          <h3 className="section-title">Didn't Find Your Answer?</h3>
          <p className="section-subtitle" style={{ marginBottom: 24 }}>
            Our support team is here to help
          </p>
          <Link href="/contact" style={{
            background: "var(--green)",
            color: "white",
            padding: "12px 32px",
            borderRadius: 10,
            fontWeight: 600,
            display: "inline-block",
            textDecoration: "none",
          }}>
            Contact Support
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

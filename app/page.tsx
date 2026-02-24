"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Link from "next/link";
import Button from "./components/ui/Button";
import StatusPill from "./components/ui/StatusPill";
import RatingStars from "./components/ui/RatingStars";
import FundiCard from "./components/ui/FundiCard";
import ServiceCategoryCard from "./components/ui/ServiceCategoryCard";
import TrustBar from "./components/ui/TrustBar";

const categories = [
  { icon: "🔧", name: "Plumbing & Water", count: "234+", color: "#E3F2FD" },
  { icon: "⚡", name: "Electrical & Wiring", count: "189+", color: "#FFF8E1" },
  { icon: "🪚", name: "Carpentry & Furniture", count: "156+", color: "#FBE9E7" },
  { icon: "🎨", name: "Painting & Decor", count: "203+", color: "#F3E5F5" },
  { icon: "🧹", name: "Cleaning & Mama Fua", count: "412+", color: "#E8F5E9" },
  { icon: "📺", name: "Appliance Repair", count: "178+", color: "#E3F2FD" },
  { icon: "🚗", name: "Auto & Boda Mechanics", count: "95+", color: "#FFF3E0" },
  { icon: "📚", name: "Home Tutors", count: "321+", color: "#E8F5E9" },
  { icon: "💇", name: "Beauty & Salon", count: "267+", color: "#FCE4EC" },
  { icon: "🌿", name: "Gardening & Pest Control", count: "144+", color: "#F1F8E9" },
  { icon: "👶", name: "Caregivers", count: "89+", color: "#FFF8E1" },
  { icon: "🎉", name: "Events & Other", count: "220+", color: "#EDE7F6" },
];

const liveJobs = [
  { title: "Fix leaking kitchen pipe", location: "South C, Nairobi", budget: "KSh 2,500", time: "2 mins ago", category: "Plumbing", urgent: true },
  { title: "Paint 3-bedroom house", location: "Westlands, Nairobi", budget: "KSh 35,000", time: "15 mins ago", category: "Painting", urgent: false },
  { title: "Iron wiring installation", location: "Kasarani, Nairobi", budget: "KSh 8,000", time: "22 mins ago", category: "Electrical", urgent: false },
  { title: "Deep clean apartment", location: "Rongai, Nairobi", budget: "KSh 4,500", time: "45 mins ago", category: "Cleaning", urgent: true },
  { title: "Math tutor – Form 3", location: "Kilimani, Nairobi", budget: "KSh 600/hr", time: "1 hr ago", category: "Tutoring", urgent: false },
];

const testimonials = [
  {
    name: "Grace Wanjiru",
    location: "South C, Nairobi",
    rating: 5,
    text: "The plumber arrived in 30 minutes. Job done perfectly. The escrow really gave me peace of mind — I only released payment after seeing the photos!",
    job: "Fixed burst pipe",
    avatar: "GW",
    avatarBg: "#00C853",
  },
  {
    name: "Brian Otieno",
    location: "Westlands, Nairobi",
    rating: 5,
    text: "Best platform in Kenya. I've used Balozy before but FundiGuard is way more trustworthy. The fundi had a police clearance verified badge. Chapeau!",
    job: "Electrical rewiring",
    avatar: "BO",
    avatarBg: "#FF6D00",
  },
  {
    name: "Sarah Kamau",
    location: "Rongai, Nairobi",
    rating: 5,
    text: "Mama Fua came same day, did an incredible job, and the photo proof feature meant I could check the work before releasing payment. 10/10!",
    job: "Deep house cleaning",
    avatar: "SK",
    avatarBg: "#9C27B0",
  },
];

const trustItems = [
  { icon: "🔒", title: "M-Pesa Escrow", desc: "Money held safely until job approved" },
  { icon: "🛡️", title: "Job Insurance", desc: "From KSh 99 — we cover damage" },
  { icon: "✅", title: "DCI Verified Pros", desc: "ID + police clearance checked" },
  { icon: "⏱️", title: "48hr Resolution", desc: "Disputes resolved fast" },
];

const howItWorks = [
  { step: "01", title: "Post or Browse", desc: "Search fundis near you OR post your job in 2 minutes with budget & photos.", icon: "🔍" },
  { step: "02", title: "Choose Your Pro", desc: "Review verified profiles, ratings, portfolios & hire the best match.", icon: "👤" },
  { step: "03", title: "Pay Into Escrow", desc: "Pay via M-Pesa. Money is held securely — not released until you approve.", icon: "💰" },
  { step: "04", title: "Approve & Done!", desc: "Fundi completes job, uploads photos. You review & release payment. Sorted!", icon: "✅" },
];

export default function Home() {
  const [displayJobs, setDisplayJobs] = useState(liveJobs);
  const [stats, setStats] = useState({
    fundis: 2400,
    jobs: 18500,
    escrow: 340,
  });

  // Animate stats on load
  useEffect(() => {
    const intervals = [
      setInterval(() => setStats(s => ({ ...s, fundis: Math.min(s.fundis + 15, 2890) })), 150),
      setInterval(() => setStats(s => ({ ...s, jobs: Math.min(s.jobs + 280, 21200) })), 150),
      setInterval(() => setStats(s => ({ ...s, escrow: Math.min(s.escrow + 8, 450) })), 150),
    ];
    return () => intervals.forEach(i => clearInterval(i));
  }, []);

  // Simulate live jobs appearing
  useEffect(() => {
    const jobTitles = [
      "Repair ceiling leaks", "Install new fence", "Kitchen cabinet refacing",
      "Bathroom renovation", "Wire home cinema", "DSTV installation",
    ];
    const locations = ["Karen, Nairobi", "Runda, Nairobi", "Parklands, Nairobi", "Lavington, Nairobi"];
    const budgets = ["KSh 3,200", "KSh 12,500", "KSh 18,000", "KSh 5,800", "KSh 15,000"];

    const interval = setInterval(() => {
      const newJob = {
        title: jobTitles[Math.floor(Math.random() * jobTitles.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        budget: budgets[Math.floor(Math.random() * budgets.length)],
        time: "just now",
        category: ["Plumbing", "Carpentry", "Electrical", "General"][Math.floor(Math.random() * 4)],
        urgent: Math.random() > 0.7,
      };
      setDisplayJobs(jobs => [newJob, ...jobs.slice(0, 4)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />

      {/* HERO */}
      <section style={{
        minHeight: "90vh",
        background: "linear-gradient(135deg, #003320 0%, #005A2C 30%, #1A1A1A 100%)",
        display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background decoration circles */}
        <div style={{
          position: "absolute", top: -100, right: -100,
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,200,83,0.15) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: -80, left: -80,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,109,0,0.12) 0%, transparent 70%)",
        }} />

        <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "80px 20px" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,200,83,0.15)", border: "1px solid rgba(0,200,83,0.3)",
            borderRadius: 40, padding: "6px 18px", marginBottom: 28,
            color: "#00E676", fontSize: "0.85rem", fontWeight: 600,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00E676", display: "inline-block" }} />
            🇰🇪 Kenya&apos;s #1 Trusted Fundi Platform
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "Poppins", fontWeight: 800,
            fontSize: "clamp(2rem, 6vw, 4rem)",
            color: "white", lineHeight: 1.1, marginBottom: 16,
          }}>
            Fundi Anakuja.<br />
            <span style={{ color: "#00C853" }}>Kazi Inafanyika.</span><br />
            <span style={{ fontSize: "0.8em", color: "#FF6D00" }}>Au Tunarekebisha Bure.</span>
          </h1>

          <p style={{ color: "#B0BEC5", fontSize: "1.15rem", marginBottom: 40, maxWidth: 560, margin: "0 auto 40px" }}>
            Book verified plumbers, electricians, cleaners & 200+ other fundis — with M-Pesa escrow & job insurance for total peace of mind.
          </p>

          {/* Search bar */}
          <div style={{
            background: "white", borderRadius: 16, padding: "8px 8px 8px 20px",
            display: "flex", alignItems: "center", gap: 8,
            maxWidth: 640, margin: "0 auto 32px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            <span style={{ fontSize: "1.2rem" }}>🔍</span>
            <input
              type="text"
              placeholder='I need a plumber in South C...'
              style={{
                flex: 1, border: "none", outline: "none", fontSize: "1rem",
                fontFamily: "Inter", color: "#212121", background: "transparent",
              }}
            />
            <span style={{ color: "#9E9E9E", padding: "0 8px" }}>|</span>
            <span style={{ fontSize: "1rem" }}>📍</span>
            <input
              type="text"
              placeholder="Location"
              style={{
                width: 120, border: "none", outline: "none", fontSize: "0.9rem",
                fontFamily: "Inter", color: "#212121", background: "transparent",
              }}
            />
            <Link href="/browse-jobs" className="btn-primary" style={{ borderRadius: 12, whiteSpace: "nowrap" }}>
              Find Fundi
            </Link>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
            <Link href="/post-job" className="btn-secondary" style={{
              color: "#FF6D00", borderColor: "#FF6D00",
              padding: "12px 28px",
            }}>
              📋 Post a Job Free
            </Link>
            <Link href="/for-pros" style={{
              color: "#B0BEC5", fontSize: "0.95rem", fontWeight: 500,
              display: "flex", alignItems: "center", gap: 6, padding: "12px 0",
            }}>
              Are you a fundi? Join Free →
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { num: stats.fundis.toLocaleString() + "+", label: "Verified Fundis" },
              { num: stats.jobs.toLocaleString() + "+", label: "Jobs Completed" },
              { num: "4.9★", label: "Average Rating" },
              { num: "KSh " + stats.escrow + "M+", label: "Escrow Processed" },
            ].map(s => (
              <div key={s.num} style={{ textAlign: "center", animation: "fadeInUp 0.6s ease-out" }}>
                <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.5rem", color: "#00C853" }}>{s.num}</div>
                <div style={{ color: "#9E9E9E", fontSize: "0.82rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
        <section style={{ background: "var(--white)", borderBottom: "1px solid var(--border)" }}>
          <div className="container" style={{ padding: "0 20px" }}>
            <TrustBar />
          </div>
        </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "80px 0", background: "var(--bg)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 className="section-title">How FundiGuard Works</h2>
            <p className="section-subtitle">Book a fundi in 4 easy steps — safe, fast, insured</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {howItWorks.map((step, i) => (
              <div
                key={step.step}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both`,
                }}
              >
                <div style={{
                  background: "var(--white)", borderRadius: 16, padding: "32px 24px",
                  textAlign: "center", position: "relative", overflow: "hidden",
                  boxShadow: "var(--shadow)",
                  borderTop: "4px solid var(--green)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-lg)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow)";
                }}
                >
                  <div style={{
                    position: "absolute", top: -10, right: -10,
                    fontFamily: "Poppins", fontWeight: 800, fontSize: "4rem",
                    color: "rgba(0,200,83,0.07)", lineHeight: 1,
                  }}>{step.step}</div>
                  <div style={{ fontSize: "2.5rem", marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>{step.icon}</div>
                  <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.05rem", marginBottom: 10 }}>
                    {step.step}. {step.title}
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>{step.desc}</p>
                  {i < howItWorks.length - 1 && (
                    <div style={{
                      position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)",
                      fontSize: "1.2rem", color: "var(--green)", zIndex: 10,
                    }} className="hide-mobile">→</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: "80px 0", background: "var(--white)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 className="section-title">Browse Service Categories</h2>
            <p className="section-subtitle">From plumbing to tutoring — 200+ services across Nairobi</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16 }}>
              {categories.map((cat, i) => (
                <div
                  key={cat.name}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${i * 0.05}s both`,
                  }}
                >
                  <ServiceCategoryCard
                    icon={cat.icon}
                    name={cat.name}
                    count={parseInt(cat.count)}
                    onClick={() => window.location.href = `/browse?category=${encodeURIComponent(cat.name)}`}
                    // @ts-ignore: allow style prop for now
                    style={{ background: cat.color }}
                  />
                </div>
              ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/browse-jobs" className="btn-primary" style={{ padding: "14px 40px" }}>
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* LIVE JOBS */}
      <section style={{ padding: "80px 0", background: "var(--bg)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ animation: "pulse-ring 2s infinite", display: "inline-block", color: "#FF3D00" }}>🔴</span> Live Jobs Near You
              </h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>Real jobs posted right now in Nairobi</p>
            </div>
            <Link href="/browse-jobs" style={{ color: "var(--green)", fontWeight: 600, fontSize: "0.9rem" }}>View all jobs →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {displayJobs.map((job, i) => (
                <div
                  key={i}
                  style={{
                    animation: `slideInUp 0.5s ease-out ${i * 0.1}s both`,
                  }}
                >
                  <FundiCard
                    id={String(i)}
                    name={job.title}
                    skill={job.category}
                    location={job.location}
                    price={typeof job.budget === 'string' && job.budget.match(/\d+/) ? parseInt(job.budget.replace(/[^\d]/g, "")) : 0}
                    verified={true}
                    online={job.urgent}
                    rating={4.9}
                    ratingCount={[45, 78, 92, 56, 123][i] || 65}
                    photo={undefined}
                    onClick={() => window.location.href = '/browse-jobs'}
                  />
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "80px 0", background: "var(--white)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 className="section-title">Real Jobs. Real Results.</h2>
            <p className="section-subtitle">What Nairobians are saying about FundiGuard</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              {testimonials.map((t, i) => (
                <div
                  key={t.name}
                  className="card"
                  style={{
                    padding: "28px 24px",
                    animation: `fadeInUp 0.6s ease-out ${i * 0.15}s both`,
                    transition: "all 0.3s ease",
                    cursor: "pointer",
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
                  <RatingStars score={t.rating} count={1} />
                  <p style={{ color: "var(--text)", lineHeight: 1.7, marginBottom: 20, fontSize: "0.95rem" }}>
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: t.avatarBg, color: "white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: "0.95rem",
                    }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{t.name}</div>
                      <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>📍 {t.location} • {t.job}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{
        padding: "80px 20px",
        background: "linear-gradient(135deg, #003320, #00C853 50%, #FF6D00)",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(1.8rem, 5vw, 3rem)",
            color: "white", marginBottom: 16,
          }}>
            Ready to Book Your First Fundi?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.1rem", marginBottom: 36 }}>
            Join 50,000+ Kenyan households who book with peace of mind. <br />
            First booking? Get insurance free for 30 days.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/browse-jobs" style={{
              background: "white", color: "var(--green)", padding: "14px 36px",
              borderRadius: 10, fontWeight: 700, fontSize: "1rem",
              display: "inline-flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}>
              🔍 Find a Fundi Now
            </Link>
            <Link href="/post-job" style={{
              background: "rgba(255,255,255,0.15)", color: "white",
              padding: "14px 36px", borderRadius: 10,
              fontWeight: 600, fontSize: "1rem",
              border: "2px solid rgba(255,255,255,0.4)",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              📋 Post a Job
            </Link>
          </div>

          {/* PWA install hint */}
          <div style={{
            marginTop: 40, background: "rgba(255,255,255,0.12)",
            borderRadius: 12, padding: "16px 24px",
            display: "inline-flex", alignItems: "center", gap: 12, color: "white",
          }}>
            <span style={{ fontSize: "1.5rem" }}>📱</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Install on your phone — works offline!</div>
              <div style={{ fontSize: "0.78rem", opacity: 0.8 }}>Tap ⬆ Share → Add to Home Screen in Safari/Chrome</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

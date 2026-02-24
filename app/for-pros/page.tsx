"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import Button from "../components/ui/Button";
import StatusPill from "../components/ui/StatusPill";

const benefits = [
    { icon: "💰", title: "Get Paid Fast", desc: "Payment released within 24hrs of job approval via M-Pesa B2C. No more chasing clients." },
    { icon: "📱", title: "Jobs Come to You", desc: "Receive job notifications on your phone. Accept or decline from anywhere." },
    { icon: "🔒", title: "Protected by Escrow", desc: "Client pays before you start. No risk of non-payment — ever." },
    { icon: "🏆", title: "Build Your Reputation", desc: "Verified profile, ratings and portfolio make you the go-to professional in your area." },
    { icon: "📈", title: "Grow Your Business", desc: "Premium and Featured plans put you at the top of search results." },
    { icon: "🛡️", title: "Full Support", desc: "Our team backs you up in any dispute. You deserve to be paid for good work." },
];

const verifySteps = [
    { step: "01", icon: "📝", title: "Create Account", desc: "Sign up with your phone number. Takes 2 minutes." },
    { step: "02", icon: "🪪", title: "Upload Your ID", desc: "Government ID + National ID copy. Processed in 24hrs." },
    { step: "03", icon: "🔒", title: "Police Clearance", desc: "Upload DCI Police Clearance Certificate (valid within 1 year)." },
    { step: "04", icon: "🎬", title: "Skill Video", desc: "Record a 60-second video showing your skill. Our team reviews it." },
    { step: "05", icon: "✅", title: "Get Verified!", desc: "Approved fundis get a green verified badge and start receiving jobs immediately." },
];

const plans = [
    { name: "Basic", price: "499", features: ["10 leads/month", "Standard listing", "Email support", "Basic analytics"], badge: "", color: "#E3F2FD", accent: "#1565C0" },
    { name: "Premium", price: "999", features: ["Unlimited leads", "Featured listing", "Priority support", "Full analytics", "Push notifications"], badge: "⭐ Most Popular", color: "#E8F5E9", accent: "#2E7D32" },
    { name: "Featured", price: "1,999", features: ["Everything in Premium", "#1 search placement", "FundiGuard Approved badge", "Monthly promo feature", "Dedicated manager"], badge: "🚀 Max Visibility", color: "#FFF3E0", accent: "#E65100" },
];

const testimonials = [
    { name: "James Mwangi", skill: "Plumber", text: "FundiGuard changed my life. I now earn KSh 120,000/month — up from KSh 30,000. No more chasing clients or unpaid jobs.", earnings: "KSh 120k/mo", avatar: "JM", bg: "#1565C0" },
    { name: "Mercy Achieng", skill: "Electrician", text: "The escrow system is the best. Clients pay before I start. Payment always comes on time via M-Pesa. I never go home empty handed.", earnings: "KSh 95k/mo", avatar: "MA", bg: "#6A1B9A" },
    { name: "Peter Njoroge", skill: "Painter", text: "I got 312 jobs in 8 months through FundiGuard. My rating is 4.9 and clients refer me to their neighbours. Business is booming!", earnings: "KSh 75k/mo", avatar: "PN", bg: "#BF360C" },
];

export default function ForProsPage() {
    return (
        <div style={{ minHeight: "100vh" }}>
            <Header />

            {/* Hero */}
            <section style={{ background: "linear-gradient(135deg, #1A1A1A, #333)", padding: "80px 0", textAlign: "center" }}>
                <div className="container">
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,200,83,0.15)", border: "1px solid rgba(0,200,83,0.3)", borderRadius: 40, padding: "6px 18px", marginBottom: 24, color: "#00E676", fontSize: "0.85rem", fontWeight: 600 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00E676", display: "inline-block" }} />
                        2,400+ Pros already earning on FundiGuard
                    </div>
                    <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(1.8rem,5vw,3.2rem)", color: "white", marginBottom: 16, lineHeight: 1.1 }}>
                        Earn More. Work Smarter.<br />
                        <span style={{ color: "#00C853" }}>Get Paid on Time. Every Time.</span>
                    </h1>
                    <p style={{ color: "#B0BEC5", fontSize: "1.1rem", maxWidth: 560, margin: "0 auto 40px" }}>
                        Join Kenya&apos;s fastest-growing platform for skilled professionals. Plumbers, electricians, cleaners, tutors — all welcome.
                    </p>
                    <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/auth?tab=signup">
                            <Button variant="primary" size="lg">
                                🔧 Join as a Pro — Free
                            </Button>
                        </Link>
                        <a href="#how-it-works" style={{
                            color: "#B0BEC5", fontSize: "0.95rem", fontWeight: 500,
                            display: "flex", alignItems: "center", gap: 6, padding: "14px 0",
                        }}>How it works ↓</a>
                    </div>
                    {/* Earnings showcase */}
                    <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap", marginTop: 52 }}>
                        {[["KSh 120k", "Top earner this month"], ["2,400+", "Verified pros"], ["4.8★", "Avg pro rating"], ["24hrs", "Payment release"]].map(([num, label]) => (
                            <div key={label} style={{ textAlign: "center" }}>
                                <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.5rem", color: "#00C853" }}>{num}</div>
                                <div style={{ color: "#9E9E9E", fontSize: "0.8rem" }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section style={{ padding: "80px 0", background: "var(--white)" }}>
                <div className="container">
                    <h2 className="section-title" style={{ textAlign: "center" }}>Why Top Fundis Choose Us</h2>
                    <p className="section-subtitle" style={{ textAlign: "center" }}>Everything you need to run a professional business</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, marginTop: 40 }}>
                        {benefits.map(b => (
                            <div key={b.title} className="card" style={{ padding: "28px 24px" }}>
                                <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>{b.icon}</div>
                                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 8 }}>{b.title}</h3>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Verification steps */}
            <section id="how-it-works" style={{ padding: "80px 0", background: "var(--bg)" }}>
                <div className="container">
                    <h2 className="section-title" style={{ textAlign: "center" }}>Get Verified in 24 Hours</h2>
                    <p className="section-subtitle" style={{ textAlign: "center" }}>Fast, simple, professional</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20, marginTop: 40 }}>
                        {verifySteps.map((s, i) => (
                            <div key={s.step} style={{ textAlign: "center", position: "relative" }}>
                                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "1.8rem" }}>{s.icon}</div>
                                <div style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--green)", fontSize: "0.82rem", marginBottom: 4 }}>STEP {s.step}</div>
                                <div style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 8 }}>{s.title}</div>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.6 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pro testimonials */}
            <section style={{ padding: "80px 0", background: "var(--white)" }}>
                <div className="container">
                    <h2 className="section-title" style={{ textAlign: "center" }}>What Our Pros Say</h2>
                    <p className="section-subtitle" style={{ textAlign: "center" }}>Real stories from Nairobi&apos;s best fundis</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginTop: 40 }}>
                        {testimonials.map(t => (
                            <div key={t.name} className="card" style={{ padding: "28px 24px" }}>
                                <div className="stars" style={{ fontSize: "1rem", marginBottom: 12 }}>⭐⭐⭐⭐⭐</div>
                                <p style={{ color: "var(--text)", lineHeight: 1.7, marginBottom: 20, fontSize: "0.95rem" }}>&ldquo;{t.text}&rdquo;</p>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: t.bg, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem" }}>{t.avatar}</div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{t.name}</div>
                                        <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>{t.skill}</div>
                                    </div>
                                    <div style={{ marginLeft: "auto", background: "var(--green-light)", borderRadius: 8, padding: "6px 12px", textAlign: "center" }}>
                                        <div style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--green)", fontSize: "0.95rem" }}>{t.earnings}</div>
                                        <div style={{ fontSize: "0.68rem", color: "var(--green-dark)" }}>Avg monthly</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Subscription plans */}
            <section id="plans" style={{ padding: "80px 0", background: "var(--bg)" }}>
                <div className="container">
                    <h2 className="section-title" style={{ textAlign: "center" }}>Choose Your Plan</h2>
                    <p className="section-subtitle" style={{ textAlign: "center" }}>Start free. Upgrade when ready.</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, maxWidth: 860, margin: "40px auto 0" }}>
                        {plans.map(plan => (
                            <div key={plan.name} style={{
                                background: plan.color, borderRadius: 20, padding: "32px 28px",
                                border: `2px solid ${plan.badge ? plan.accent : "transparent"}`,
                                position: "relative",
                            }}>
                                {plan.badge && (
                                    <StatusPill type={plan.badge.includes("Most Popular") ? "success" : "urgent"} label={plan.badge} />
                                )}
                                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.2rem", marginBottom: 4 }}>{plan.name}</h3>
                                <div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "2.2rem", color: plan.accent, marginBottom: 20 }}>
                                    KSh {plan.price}<span style={{ fontSize: "0.8rem", fontWeight: 400, color: "var(--text-secondary)" }}>/mo</span>
                                </div>
                                <ul style={{ listStyle: "none", marginBottom: 24 }}>
                                    {plan.features.map(f => (
                                        <li key={f} style={{ display: "flex", gap: 8, marginBottom: 10, fontSize: "0.88rem" }}>
                                            <span style={{ color: plan.accent, fontWeight: 700 }}>✓</span> {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/auth?tab=signup">
                                    <Button variant="primary" size="md" fullWidth style={{ background: plan.accent }}>
                                        Get Started →
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section style={{ padding: "80px 20px", background: "linear-gradient(135deg, #003320, #00C853)", textAlign: "center" }}>
                <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(1.6rem,4vw,2.5rem)", color: "white", marginBottom: 16 }}>
                    Ready to Earn More?
                </h2>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1rem", marginBottom: 32 }}>
                    Join 2,400+ verified fundis who are building better businesses on FundiGuard.
                </p>
                <Link href="/auth?tab=signup">
                    <Button variant="primary" size="lg">
                        🔧 Join Free Today
                    </Button>
                </Link>
            </section>

            <Footer />
        </div>
    );
}

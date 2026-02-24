"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import StatusPill from "../components/ui/StatusPill";
import Button from "../components/ui/Button";

const plans = [
    { name: "Basic Cover", price: "99", icon: "🛡️", color: "#E3F2FD", accent: "#1565C0", features: ["Up to KSh 5,000 coverage", "1 job per claim", "Damage to property", "24hr claim process", "Email support"], recommended: false },
    { name: "Full Cover", price: "299", icon: "🔰", color: "#E8F5E9", accent: "#2E7D32", features: ["Up to KSh 50,000 coverage", "Unlimited claims", "Damage + theft", "Replacement fundi free", "Priority 4hr support", "Refund if job fails"], recommended: true },
];

const faqs = [
    { q: "What does FundiGuard Insurance cover?", a: "Our insurance covers damage to your property during the job, theft of valuables, and unsatisfactory work. If the fundi damages your item, we pay you up to KSh 50,000 (Full Cover) or send a replacement fundi free of charge." },
    { q: "How do I make a claim?", a: "Go to the Dispute Center, upload your before/after photos and describe what went wrong. Our team reviews within 4 hours (Full Cover) or 24 hours (Basic). Valid claims are paid via M-Pesa immediately." },
    { q: "Is insurance per job or monthly?", a: "Insurance is per-job. You add it when booking a fundi. Basic Cover is KSh 99 per job, Full Cover is KSh 299 per job. You only pay when you need it." },
    { q: "Do all fundis need to be verified for insurance to apply?", a: "Yes. Insurance only applies to jobs booked through FundiGuard with a DCI Verified fundi. This is another reason to always use verified pros on our platform." },
];

const partners = [
    { name: "Jubilee Insurance", logo: "🏛️" },
    { name: "Britam", logo: "🔷" },
    { name: "Resolution Insurance", logo: "⚖️" },
];

export default function InsurancePage() {
    return (
        <div style={{ minHeight: "100vh" }}>
            <Header />

            {/* Hero */}
            <section style={{ background: "linear-gradient(135deg, #003320, #005A2C)", padding: "64px 0", textAlign: "center" }}>
                <div className="container">
                    <div style={{ fontSize: "4rem", marginBottom: 20 }}>🛡️</div>
                    <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(1.6rem,5vw,3rem)", color: "white", marginBottom: 16 }}>
                        Job Insurance — From KSh 99
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.1rem", maxWidth: 560, margin: "0 auto 32px" }}>
                        If a fundi damages your property or the job goes wrong, we pay you or send a replacement fundi — completely free.
                    </p>
                    <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
                        {[
                            ["🇰🇪", "Kenyan market insurance"],
                            ["⚡", "4hr claims resolution"],
                            ["💰", "Paid via M-Pesa"],
                        ].map(([icon, label]) => (
                            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.85)", fontSize: "0.9rem" }}>
                                <span>{icon}</span>{label}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section style={{ padding: "64px 0", background: "var(--white)" }}>
                <div className="container">
                    <h2 className="section-title" style={{ textAlign: "center" }}>How Insurance Works</h2>
                    <p className="section-subtitle" style={{ textAlign: "center" }}>Simple, fast, Kenyan</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, marginTop: 32 }}>
                        {[
                            { step: "1", icon: "📋", title: "Add at Booking", desc: "Tick 'Add Insurance' when posting your job. Pay KSh 99 or 299." },
                            { step: "2", icon: "⚡", title: "Fundi Completes Job", desc: "Your verified fundi does the work as normal." },
                            { step: "3", icon: "😟", title: "Something Goes Wrong?", desc: "Raise a dispute with photos within 48 hrs of job completion." },
                            { step: "4", icon: "💰", title: "We Pay You", desc: "Valid claims get M-Pesa refund or free replacement within 4 hrs." },
                        ].map(item => (
                            <div key={item.step} style={{ textAlign: "center", padding: "24px 16px" }}>
                                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "1.6rem" }}>{item.icon}</div>
                                <div style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 8 }}>{item.step}. {item.title}</div>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section style={{ padding: "64px 0", background: "var(--bg)" }}>
                <div className="container">
                    <h2 className="section-title" style={{ textAlign: "center" }}>Choose Your Cover</h2>
                    <p className="section-subtitle" style={{ textAlign: "center" }}>Add to any job at checkout</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 640, margin: "32px auto 0" }}>
                        {plans.map(plan => (
                            <div key={plan.name} style={{
                                background: plan.color, borderRadius: 20, padding: "32px 28px",
                                border: `2px solid ${plan.recommended ? plan.accent : "transparent"}`,
                                position: "relative",
                            }}>
                                {plan.recommended && (
                                    <StatusPill type="success" label="⭐ Most Popular" />
                                )}
                                <div style={{ fontSize: "3rem", marginBottom: 12 }}>{plan.icon}</div>
                                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.2rem", marginBottom: 4 }}>{plan.name}</h3>
                                <div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "2.5rem", color: plan.accent, marginBottom: 20 }}>
                                    KSh {plan.price}<span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 400 }}>/job</span>
                                </div>
                                <ul style={{ listStyle: "none", marginBottom: 24 }}>
                                    {plan.features.map(f => (
                                        <li key={f} style={{ display: "flex", gap: 8, marginBottom: 10, fontSize: "0.88rem" }}>
                                            <span style={{ color: plan.accent, fontWeight: 700 }}>✓</span> {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/post-job">
                                    <Button variant="primary" size="md" fullWidth style={{ background: plan.accent }}>
                                        Add to Job →
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partners */}
            <section style={{ padding: "48px 0", background: "var(--white)", textAlign: "center" }}>
                <div className="container">
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: 24, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                        Insurance powered by trusted Kenyan partners
                    </p>
                    <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
                        {partners.map(p => (
                            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-secondary)", fontWeight: 600 }}>
                                <span style={{ fontSize: "2rem" }}>{p.logo}</span>
                                <span>{p.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section style={{ padding: "64px 0", background: "var(--bg)" }}>
                <div className="container" style={{ maxWidth: 720 }}>
                    <h2 className="section-title" style={{ textAlign: "center" }}>Frequently Asked Questions</h2>
                    <div style={{ marginTop: 32 }}>
                        {faqs.map((faq, i) => (
                            <div key={i} style={{ background: "var(--white)", borderRadius: 12, padding: "20px 24px", marginBottom: 12 }}>
                                <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 10, color: "var(--green-dark)" }}>Q: {faq.q}</div>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: "center", marginTop: 40 }}>
                        <Link href="/post-job">
                            <Button variant="primary" size="lg">
                                Book a Fundi with Insurance →
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

"use client";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import FundiCard from "../../components/ui/FundiCard";
import RatingStars from "../../components/ui/RatingStars";
import Button from "../../components/ui/Button";
import StatusPill from "../../components/ui/StatusPill";
import Modal from "../../components/ui/Modal";

const portfolio = [
    { before: "🔧 Burst pipe", after: "✅ Fixed & sealed", category: "Plumbing" },
    { before: "💧 Leaking tap", after: "✅ New fitting installed", category: "Plumbing" },
    { before: "🔴 Clogged drain", after: "✅ Fully unblocked", category: "Plumbing" },
    { before: "📿 Old water heater", after: "✅ New heater fitted", category: "Plumbing" },
];

const reviews = [
    { name: "Grace Wanjiru", rating: 5, date: "Feb 15, 2026", text: "James fixed our burst pipe in under an hour. Very professional, clean work. Highly recommend!", avatar: "GW", bg: "#1565C0" },
    { name: "Peter Kamau", rating: 5, date: "Feb 10, 2026", text: "Excellent service. He arrived on time and the quality of work was outstanding. Will call again.", avatar: "PK", bg: "#2E7D32" },
    { name: "Amina Said", rating: 4, date: "Jan 28, 2026", text: "Good work overall. Took slightly longer than quoted but quality was great.", avatar: "AS", bg: "#6A1B9A" },
    { name: "David Ochieng", rating: 5, date: "Jan 20, 2026", text: "Best plumber in South C! Has fixed issues for us 3 times now. Always reliable.", avatar: "DO", bg: "#E65100" },
];

export default function ProProfilePage({ params }: { params: { id: string } }) {
    const [activeTab, setActiveTab] = useState("portfolio");
    const [showPayModal, setShowPayModal] = useState(false);

    return (
        <div style={{ minHeight: "100vh" }}>
            <Header />

            {/* Profile Hero */}
            <section style={{ background: "linear-gradient(135deg, #003320, #005A2C)", padding: "48px 0 80px" }}>
                <div className="container">
                    <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
                        {/* Avatar */}
                        <FundiCard
                            id={params.id}
                            name="James Mwangi"
                            skill="Master Plumber"
                            location="South C, Nairobi"
                            price={1800}
                            verified={true}
                            online={true}
                            rating={4.9}
                            ratingCount={214}
                            photo={undefined}
                            onClick={() => setShowPayModal(true)}
                        />

                        <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
                                <h1 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.8rem", color: "white" }}>
                                    James Mwangi
                                </h1>
                                <span style={{ background: "rgba(0,200,83,0.2)", color: "#00E676", border: "1px solid rgba(0,200,83,0.3)", borderRadius: 6, padding: "3px 12px", fontSize: "0.8rem", fontWeight: 600 }}>
                                    ✓ DCI Verified
                                </span>
                                <span style={{ background: "rgba(255,109,0,0.2)", color: "#FFAB40", border: "1px solid rgba(255,109,0,0.3)", borderRadius: 6, padding: "3px 12px", fontSize: "0.8rem", fontWeight: 600 }}>
                                    🏆 Top Rated
                                </span>
                            </div>
                            <div style={{ color: "rgba(255,255,255,0.7)", marginBottom: 16, fontSize: "1rem" }}>
                                Master Plumber • South C, Nairobi
                            </div>
                            <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 12 }}>
                                {[
                                    ["⭐", "4.9", "214 reviews"],
                                    ["🛠️", "312", "jobs done"],
                                    ["📅", "4 yrs", "experience"],
                                    ["⚡", "~30 min", "response time"],
                                ].map(([icon, num, label]) => (
                                    <div key={label} style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: "0.85rem" }}>{icon}</div>
                                        <div style={{ color: "white", fontFamily: "Poppins", fontWeight: 700, fontSize: "1.1rem" }}>{num}</div>
                                        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem" }}>{label}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {["Leak Repair", "Pipe Fitting", "Water Heaters", "Drain Unblocking", "Bathroom Fitting"].map(tag => (
                                    <span key={tag} style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", fontSize: "0.78rem", padding: "4px 12px", borderRadius: 20 }}>{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* Book CTA */}
                        <div style={{
                            background: "var(--white)", borderRadius: 16, padding: "24px",
                            minWidth: 220, boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                        }}>
                            <div style={{ textAlign: "center", marginBottom: 16 }}>
                                <div style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>Starting from</div>
                                <div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "2rem", color: "var(--green)" }}>KSh 1,800</div>
                                <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>per job</div>
                            </div>
                            <Button variant="primary" size="lg" fullWidth onClick={() => setShowPayModal(true)}>
                                📅 Book James Now
                            </Button>
                            <div style={{ textAlign: "center", marginTop: 10, fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                                🟢 Available today • Responds fast
                            </div>
                            <div style={{ marginTop: 12, padding: "10px", background: "var(--green-light)", borderRadius: 8, fontSize: "0.78rem", color: "var(--green-dark)", textAlign: "center" }}>
                                🛡️ Insurance available for this job
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <div className="container" style={{ padding: "0 20px", marginTop: -32, marginBottom: 60 }}>
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                    {/* Tabs */}
                    <div style={{ display: "flex", borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
                        {[["portfolio", "📸 Portfolio"], ["reviews", "⭐ Reviews"], ["about", "👤 About"], ["availability", "📅 Availability"]].map(([key, label]) => (
                            <button key={key} onClick={() => setActiveTab(key)} style={{
                                padding: "16px 24px", border: "none", background: "none",
                                fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", whiteSpace: "nowrap",
                                color: activeTab === key ? "var(--green)" : "var(--text-secondary)",
                                borderBottom: activeTab === key ? "3px solid var(--green)" : "3px solid transparent",
                                transition: "all 0.2s",
                            }}>{label}</button>
                        ))}
                    </div>

                    <div style={{ padding: "32px" }}>
                        {/* Portfolio */}
                        {activeTab === "portfolio" && (
                            <div>
                                <h2 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 8 }}>Before & After Work</h2>
                                <p style={{ color: "var(--text-secondary)", marginBottom: 24, fontSize: "0.9rem" }}>All photos verified by FundiGuard platform</p>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                                    {portfolio.map((item, i) => (
                                        <div key={i} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
                                            <div style={{
                                                background: "linear-gradient(135deg, #ffebee, #fce4ec)",
                                                padding: "20px", textAlign: "center", fontSize: "2rem",
                                            }}>
                                                {item.before}
                                                <div style={{ fontSize: "0.75rem", color: "#c62828", fontWeight: 600, marginTop: 6 }}>BEFORE</div>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "8px 0", background: "#f5f5f5" }}>
                                                <span style={{ fontSize: "1.2rem" }}>⬇️</span>
                                            </div>
                                            <div style={{
                                                background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
                                                padding: "20px", textAlign: "center", fontSize: "2rem",
                                            }}>
                                                {item.after}
                                                <div style={{ fontSize: "0.75rem", color: "#2e7d32", fontWeight: 600, marginTop: 6 }}>AFTER</div>
                                            </div>
                                            <div style={{ padding: "10px 16px", background: "white" }}>
                                                <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{item.category}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        {activeTab === "reviews" && (
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                                    <div>
                                        <h2 style={{ fontFamily: "Poppins", fontWeight: 700 }}>Customer Reviews</h2>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                                            <RatingStars score={4.9} count={214} />
                                        </div>
                                    </div>
                                    {/* Rating breakdown */}
                                    <div style={{ minWidth: 200 }}>
                                        {[[5, 89], [4, 8], [3, 2], [2, 1], [1, 0]].map(([star, pct]) => (
                                            <div key={star} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                                <span style={{ fontSize: "0.8rem", width: 16 }}>{star}★</span>
                                                <div className="progress-bar" style={{ flex: 1 }}>
                                                    <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                                                </div>
                                                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", width: 28 }}>{pct}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: "grid", gap: 16 }}>
                                    {reviews.map((r, i) => (
                                        <div key={i} style={{ padding: "20px 24px", border: "1px solid var(--border)", borderRadius: 12 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: r.bg, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem" }}>{r.avatar}</div>
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>{r.name}</div>
                                                        <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{r.date}</div>
                                                    </div>
                                                </div>
                                                <RatingStars score={r.rating} count={1} />
                                            </div>
                                            <p style={{ color: "var(--text)", fontSize: "0.9rem", lineHeight: 1.6 }}>{r.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* About */}
                        {activeTab === "about" && (
                            <div>
                                <h2 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 20 }}>About James</h2>
                                <p style={{ color: "var(--text)", lineHeight: 1.8, marginBottom: 24 }}>
                                    I am a professional master plumber with over 4 years of experience in residential and commercial plumbing in Nairobi.
                                    I specialize in pipe installation, leak repairs, water heater fitting, bathroom renovation, and drain unblocking.
                                    I hold a valid plumbing certificate from Kenya National Qualifications Authority (KNQA).
                                </p>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                                    {[
                                        { icon: "🪪", label: "ID Verified", val: "KE ID #••••••3421" },
                                        { icon: "🔒", label: "Police Clearance", val: "Valid until Dec 2026" },
                                        { icon: "📜", label: "Certificate", val: "KNQA Plumbing Level 3" },
                                        { icon: "📱", label: "Response time", val: "~30 minutes avg" },
                                    ].map(item => (
                                        <div key={item.label} style={{ padding: "16px", borderRadius: 12, background: "var(--bg)", border: "1px solid var(--border)" }}>
                                            <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>{item.icon}</div>
                                            <div style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: 4 }}>{item.label}</div>
                                            <div style={{ color: "var(--green-dark)", fontSize: "0.82rem" }}>{item.val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Availability */}
                        {activeTab === "availability" && (
                            <div>
                                <h2 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 20 }}>Availability Calendar</h2>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, maxWidth: 400 }}>
                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                                        <div key={d} style={{ textAlign: "center", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", padding: "8px 0" }}>{d}</div>
                                    ))}
                                    {Array.from({ length: 28 }, (_, i) => i + 1).map(day => {
                                        const available = ![3, 7, 14, 21].includes(day);
                                        return (
                                            <div key={day} style={{
                                                textAlign: "center", padding: "10px 0", borderRadius: 8, fontSize: "0.85rem",
                                                background: day === 20 ? "var(--green)" : available ? "var(--green-light)" : "var(--border)",
                                                color: day === 20 ? "white" : available ? "var(--green-dark)" : "var(--text-secondary)",
                                                fontWeight: day === 20 ? 700 : 400, cursor: available ? "pointer" : "default",
                                            }}>{day}</div>
                                        );
                                    })}
                                </div>
                                <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
                                    {[["var(--green-light)", "var(--green-dark)", "Available"], ["var(--border)", "var(--text-secondary)", "Booked"]].map(([bg, color, label]) => (
                                        <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem" }}>
                                            <div style={{ width: 14, height: 14, borderRadius: 3, background: bg as string }} />
                                            <span style={{ color: color as string }}>{label}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="primary" size="lg" style={{ marginTop: 24 }} onClick={() => setShowPayModal(true)}>
                                    Book for Today →
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPayModal && (
                <Modal isOpen={showPayModal} onClose={() => setShowPayModal(false)} title="Confirm Booking" size="md">
                    <div style={{ background: "var(--bg)", borderRadius: 10, padding: 16, marginBottom: 20 }}>
                        <div style={{ fontWeight: 600, marginBottom: 10 }}>James Mwangi — Plumber</div>
                        {[["Service fee", "KSh 1,800"], ["Platform fee (18%)", "KSh 324"], ["Insurance (optional)", "KSh 199"]].map(([l, v]) => (
                            <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", marginBottom: 6 }}>
                                <span style={{ color: "var(--text-secondary)" }}>{l}</span><span>{v}</span>
                            </div>
                        ))}
                        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                            <span>Total Escrow</span><span style={{ color: "var(--green)" }}>KSh 2,323</span>
                        </div>
                    </div>
                    <div style={{ background: "#1A1A1A", borderRadius: 10, padding: 16, color: "white", textAlign: "center", marginBottom: 20 }}>
                        <div style={{ fontSize: "0.85rem", color: "#9E9E9E", marginBottom: 6 }}>M-Pesa STK Push to</div>
                        <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.2rem" }}>+254 7XX XXX XXX</div>
                        <div style={{ fontSize: "0.78rem", color: "#616161", marginTop: 6 }}>Enter PIN on your phone when prompted</div>
                    </div>
                    <Button variant="primary" size="lg" fullWidth onClick={() => window.location.href = "/post-job"}>
                        🔒 Pay KSh 2,323 via M-Pesa
                    </Button>
                    <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 12 }}>
                        Money held in escrow. Released only after you approve.
                    </p>
                </Modal>
            )}

            <Footer />
        </div>
    );
}

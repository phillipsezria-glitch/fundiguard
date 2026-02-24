"use client";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import Button from "../components/ui/Button";
import StatusPill from "../components/ui/StatusPill";
import { useAuthProtected } from "../lib/useAuthProtected";

const leads = [
    { id: 1, title: "Fix leaking kitchen pipe", client: "Grace W.", location: "South C", budget: 2500, time: "5 mins ago", urgent: true },
    { id: 2, title: "Bathroom pipe replacement", client: "John K.", location: "Westlands", budget: 4500, time: "23 mins ago", urgent: false },
    { id: 3, title: "Water tank installation", client: "Amina S.", location: "Kilimani", budget: 9000, time: "1 hr ago", urgent: false },
];

const weeklyData = [40, 65, 55, 80, 72, 90, 68];
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ProDashboardPage() {
    useAuthProtected(); // Protect this route
    
    const [activeTab, setActiveTab] = useState("leads");

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
            <Header />

            <div className="container" style={{ padding: "32px 20px 60px" }}>
                {/* Pro header */}
                <div style={{
                    background: "linear-gradient(135deg, #1A1A1A, #333)",
                    borderRadius: 20, padding: "28px 32px", marginBottom: 32,
                    display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20,
                }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#1565C0", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Poppins", fontWeight: 700, fontSize: "1.3rem", border: "3px solid rgba(255,255,255,0.2)" }}>JM</div>
                        <div>
                            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>Pro Dashboard</div>
                            <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.3rem", color: "white" }}>James Mwangi</div>
                            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                                <StatusPill type="verified" label="✓ Verified" />
                                <StatusPill type="online" label="🟢 Online" />
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}>Subscription</div>
                        <div style={{ fontFamily: "Poppins", fontWeight: 700, color: "#FFAB40", fontSize: "1.1rem" }}>⭐ Premium Plan</div>
                        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>Renews Mar 20, 2026</div>
                    </div>
                </div>

                {/* Earnings Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 32 }}>
                    {[
                        { label: "This Month", value: "KSh 84,200", icon: "💰", color: "#E8F5E9", text: "#2E7D32", sub: "+12% vs last month" },
                        { label: "Jobs Completed", value: "23", icon: "✅", color: "#E3F2FD", text: "#1565C0", sub: "This month" },
                        { label: "Rating", value: "4.9 ★", icon: "⭐", color: "#FFF8E1", text: "#F57F17", sub: "214 reviews" },
                        { label: "Pending Leads", value: "3", icon: "🔔", color: "#FFF3E0", text: "#E65100", sub: "Reply fast!" },
                    ].map(stat => (
                        <div key={stat.label} style={{ background: stat.color, borderRadius: 16, padding: "20px", border: `1px solid ${stat.text}22` }}>
                            <div style={{ fontSize: "1.6rem", marginBottom: 4 }}>{stat.icon}</div>
                            <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.3rem", color: stat.text }}>{stat.value}</div>
                            <div style={{ fontSize: "0.78rem", color: stat.text, opacity: 0.8, marginBottom: 2 }}>{stat.label}</div>
                            <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>{stat.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Earnings Chart */}
                <div className="card" style={{ padding: "24px", marginBottom: 28 }}>
                    <h3 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 20 }}>📈 Weekly Earnings (KSh)</h3>
                    <div style={{ display: "flex", gap: 8, height: 100, alignItems: "flex-end" }}>
                        {weeklyData.map((h, i) => (
                            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                                <div style={{
                                    height: `${h}%`, width: "100%", borderRadius: "6px 6px 0 0",
                                    background: i === 5 ? "var(--orange)" : "var(--green)",
                                    minHeight: 8, transition: "height 0.4s ease",
                                }} />
                                <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>{weekDays[i]}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: 12, fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                        Best day: Saturday (KSh 18,000) • 🔥 Trending up
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", marginBottom: 24 }}>
                    {[["leads", "🔔 New Leads"], ["calendar", "📅 Calendar"], ["subscription", "💎 Subscription"]].map(([key, label]) => (
                        <button key={key} onClick={() => setActiveTab(key)} style={{
                            padding: "12px 20px", border: "none", background: "none", cursor: "pointer",
                            fontWeight: 600, fontSize: "0.88rem",
                            color: activeTab === key ? "var(--green)" : "var(--text-secondary)",
                            borderBottom: activeTab === key ? "3px solid var(--green)" : "3px solid transparent",
                        }}>{label}</button>
                    ))}
                </div>

                {/* New Leads */}
                {activeTab === "leads" && (
                    <div style={{ display: "grid", gap: 16 }}>
                        {leads.map(lead => (
                            <div key={lead.id} className="card" style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                                        <h3 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: "0.95rem" }}>{lead.title}</h3>
                                        {lead.urgent && <StatusPill type="urgent" label="🔥 Urgent" />}
                                    </div>
                                    <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                                        👤 {lead.client} • 📍 {lead.location} • ⏰ {lead.time}
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--green)" }}>KSh {lead.budget.toLocaleString()}</div>
                                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>budget</div>
                                    </div>
                                    <Button variant="primary" size="md">Accept</Button>
                                    <Button variant="secondary" size="sm">Decline</Button>
                                </div>
                            </div>
                        ))}
                        {leads.length === 0 && (
                            <div style={{ textAlign: "center", padding: "60px 20px" }}>
                                <div style={{ fontSize: "3rem", marginBottom: 12 }}>📭</div>
                                <p style={{ color: "var(--text-secondary)" }}>No new leads right now. Make sure you&apos;re online!</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Calendar */}
                {activeTab === "calendar" && (
                    <div className="card" style={{ padding: 28 }}>
                        <h3 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 20 }}>February 2026</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, maxWidth: 420 }}>
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                                <div key={d} style={{ textAlign: "center", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", padding: "8px 0" }}>{d}</div>
                            ))}
                            {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                                <div key={day} style={{
                                    textAlign: "center", padding: "10px 0", borderRadius: 8, fontSize: "0.85rem",
                                    background: [15, 16, 20, 21].includes(day) ? "var(--orange)" : day === 20 ? "var(--green)" : "var(--bg)",
                                    color: [15, 16, 20, 21].includes(day) ? "white" : "var(--text)",
                                    fontWeight: [15, 16, 20, 21].includes(day) ? 700 : 400,
                                    position: "relative",
                                }}>
                                    {day}
                                    {[15, 16, 20, 21].includes(day) && <div style={{ fontSize: "0.5rem", marginTop: 2 }}>Booked</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Subscription */}
                {activeTab === "subscription" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
                        {[
                            { name: "Basic", price: "499", color: "#E3F2FD", badge: "", current: false, features: ["Up to 10 leads/month", "Basic profile listing", "Email support", "Standard placement"] },
                            { name: "Premium", price: "999", color: "#E8F5E9", badge: "⭐ Your Plan", current: true, features: ["Unlimited leads", "Featured listing", "Priority support", "Performance analytics", "Push notifications"] },
                            { name: "Featured", price: "1,999", color: "#FFF3E0", badge: "🚀 Top Position", current: false, features: ["Everything in Premium", "#1 search placement", "FundiGuard Approved badge", "Monthly promotional feature", "Dedicated account manager"] },
                        ].map(plan => (
                            <div key={plan.name} style={{
                                background: plan.color, borderRadius: 16, padding: "24px",
                                border: plan.current ? "2px solid var(--green)" : "1px solid var(--border)",
                                position: "relative",
                            }}>
                                {plan.badge && (
                                    <span style={{
                                        position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                                        background: plan.current ? "var(--green)" : "var(--orange)",
                                        color: "white", padding: "3px 16px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700, whiteSpace: "nowrap",
                                    }}>{plan.badge}</span>
                                )}
                                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.1rem", marginBottom: 4 }}>{plan.name}</h3>
                                <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "2rem", color: "var(--green)", marginBottom: 16 }}>
                                    KSh {plan.price}<span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 400 }}>/mo</span>
                                </div>
                                <ul style={{ listStyle: "none", marginBottom: 20 }}>
                                    {plan.features.map(f => (
                                        <li key={f} style={{ fontSize: "0.85rem", marginBottom: 8, display: "flex", gap: 8 }}>
                                            <span style={{ color: "var(--green)" }}>✓</span> {f}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    variant={plan.current ? "secondary" : "primary"}
                                    size="md"
                                    fullWidth
                                    disabled={plan.current}
                                >
                                    {plan.current ? "Current Plan" : "Upgrade →"}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

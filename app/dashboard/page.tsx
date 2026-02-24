"use client";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import Button from "../components/ui/Button";
import StatusPill from "../components/ui/StatusPill";
import RatingStars from "../components/ui/RatingStars";
import Modal from "../components/ui/Modal";

const activeJobs = [
    { id: 1, title: "Fix leaking kitchen pipe", fundi: "James Mwangi", status: "in_progress", progress: 60, amount: 2500, date: "Feb 20, 2026", category: "Plumbing", fundiAvatar: "JM", avatarBg: "#1565C0" },
    { id: 2, title: "Paint living room", fundi: "Peter Njoroge", status: "awaiting_approval", progress: 100, amount: 8500, date: "Feb 19, 2026", category: "Painting", fundiAvatar: "PN", avatarBg: "#BF360C" },
    { id: 3, title: "Install CCTV cameras", fundi: "Mercy Achieng", status: "scheduled", progress: 10, amount: 12000, date: "Feb 22, 2026", category: "Electrical", fundiAvatar: "MA", avatarBg: "#6A1B9A" },
];

const pastJobs = [
    { id: 4, title: "Deep clean apartment", fundi: "Fatuma Hassan", status: "completed", amount: 4500, date: "Feb 15, 2026", rating: 5 },
    { id: 5, title: "Fix broken door hinge", fundi: "David Ochieng", status: "completed", amount: 1200, date: "Feb 10, 2026", rating: 4 },
    { id: 6, title: "Pest control treatment", fundi: "Raymond Otieno", status: "completed", amount: 3500, date: "Jan 28, 2026", rating: 5 },
];

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
    scheduled: { bg: "#E3F2FD", color: "#1565C0", label: "📅 Scheduled" },
    in_progress: { bg: "#FFF8E1", color: "#F57F17", label: "⚡ In Progress" },
    awaiting_approval: { bg: "#FFF3E0", color: "#E65100", label: "⏳ Awaiting Approval" },
    completed: { bg: "#E8F5E9", color: "#2E7D32", label: "✅ Completed" },
};

export default function DashboardPage() {
    const [tab, setTab] = useState("active");
    const [showReleaseModal, setShowReleaseModal] = useState(false);

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
            <Header />

            <div className="container" style={{ padding: "32px 20px 60px" }}>
                {/* Welcome banner */}
                <div style={{
                    background: "linear-gradient(135deg, #003320, #00C853)",
                    borderRadius: 20, padding: "28px 32px", marginBottom: 32,
                    display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20,
                }}>
                    <div>
                        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", marginBottom: 4 }}>Welcome back 👋</div>
                        <h1 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.6rem", color: "white", marginBottom: 6 }}>Grace Wanjiru</h1>
                        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>📍 South C, Nairobi • Member since Jan 2026</div>
                    </div>
                    <Link href="/post-job" style={{
                        background: "white", color: "var(--green)", padding: "12px 28px",
                        borderRadius: 10, fontWeight: 700, display: "inline-block",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.2)", whiteSpace: "nowrap",
                    }}>
                        + Post New Job
                    </Link>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
                    {[
                        { label: "Total Jobs Posted", value: "9", icon: "📋", color: "#E3F2FD", text: "#1565C0" },
                        { label: "Jobs Completed", value: "6", icon: "✅", color: "#E8F5E9", text: "#2E7D32" },
                        { label: "Total Spent", value: "KSh 42K", icon: "💰", color: "#FFF3E0", text: "#E65100" },
                        { label: "Avg Rating Given", value: "4.8 ★", icon: "⭐", color: "#FFF8E1", text: "#F57F17" },
                    ].map(stat => (
                        <div key={stat.label} style={{ background: stat.color, borderRadius: 16, padding: "20px", border: `1px solid ${stat.text}22` }}>
                            <div style={{ fontSize: "1.8rem", marginBottom: 4 }}>{stat.icon}</div>
                            <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.4rem", color: stat.text }}>{stat.value}</div>
                            <div style={{ fontSize: "0.8rem", color: stat.text, opacity: 0.7 }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", marginBottom: 24 }}>
                    {[["active", "⚡ Active Jobs"], ["past", "✅ Past Jobs"], ["saved", "❤️ Saved Fundis"]].map(([key, label]) => (
                        <button key={key} onClick={() => setTab(key)} style={{
                            padding: "12px 20px", border: "none", background: "none", cursor: "pointer",
                            fontWeight: 600, fontSize: "0.88rem",
                            color: tab === key ? "var(--green)" : "var(--text-secondary)",
                            borderBottom: tab === key ? "3px solid var(--green)" : "3px solid transparent",
                            transition: "all 0.2s",
                        }}>{label}</button>
                    ))}
                </div>

                {/* Active Jobs */}
                {tab === "active" && (
                    <div style={{ display: "grid", gap: 16 }}>
                        {activeJobs.map(job => (
                            <div key={job.id} className="card" style={{ padding: "24px", overflow: "hidden" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: job.avatarBg, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>{job.fundiAvatar}</div>
                                        <div>
                                            <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1rem", marginBottom: 4 }}>{job.title}</h3>
                                            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Fundi: <strong>{job.fundi}</strong> • {job.date}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                        <span style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--green)" }}>KSh {job.amount.toLocaleString()}</span>
                                            <StatusPill
                                                type={job.status === "in_progress" ? "pending" : job.status === "awaiting_approval" ? "urgent" : job.status === "scheduled" ? "success" : "verified"}
                                                label={statusColors[job.status].label}
                                            />
                                    </div>
                                </div>
                                {/* Progress bar */}
                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Job progress</span>
                                        <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{job.progress}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-bar-fill" style={{ width: `${job.progress}%` }} />
                                    </div>
                                </div>
                                {/* Actions */}
                                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                    {job.status === "awaiting_approval" && (
                                        <Button variant="primary" size="md" onClick={() => setShowReleaseModal(true)}>
                                            ✅ Approve & Release Payment
                                        </Button>
                                    )}
                                    <Button variant="secondary" size="sm">
                                        📞 Contact Fundi
                                    </Button>
                                    <Link href="/dispute">
                                        <Button variant="danger" size="sm">
                                            ⚠️ Raise Dispute
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Past Jobs */}
                {tab === "past" && (
                    <div style={{ display: "grid", gap: 12 }}>
                        {pastJobs.map(job => (
                            <div key={job.id} className="card" style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                                <div>
                                    <h3 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: "0.95rem", marginBottom: 4 }}>{job.title}</h3>
                                    <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{job.fundi} • {job.date}</div>
                                    <RatingStars score={job.rating} size="sm" />
                                </div>
                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                    <span style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--green)" }}>KSh {job.amount.toLocaleString()}</span>
                                    <StatusPill type="success" label="✅ Completed" />
                                    <Button variant="primary" size="sm">
                                        Rebook
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Saved Fundis */}
                {tab === "saved" && (
                    <div style={{ textAlign: "center", padding: "60px 20px" }}>
                        <div style={{ fontSize: "4rem", marginBottom: 16 }}>❤️</div>
                        <h3 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 8 }}>No saved fundis yet</h3>
                        <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>When you find a fundi you love, save them for quick rebooking.</p>
                        <Link href="/browse">
                            <Button variant="primary" size="md" fullWidth>Browse Fundis →</Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Release Payment Modal */}
            <Modal isOpen={showReleaseModal} onClose={() => setShowReleaseModal(false)} title="Release Payment">
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div style={{ fontSize: "3rem", marginBottom: 12 }}>💰</div>
                    <h2 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 8 }}>Release Payment?</h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>KSh 8,500 will be released to Peter Njoroge. This confirms the job was done satisfactorily.</p>
                </div>
                <div style={{ background: "var(--green-light)", borderRadius: 10, padding: "14px", marginBottom: 20, fontSize: "0.85rem", color: "var(--green-dark)" }}>
                    ✅ By releasing, you confirm: job completed, quality acceptable, photos verified.
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <Button variant="secondary" size="md" onClick={() => setShowReleaseModal(false)} fullWidth>Cancel</Button>
                    <Button variant="primary" size="md" onClick={() => setShowReleaseModal(false)} fullWidth>✅ Release KSh 8,500</Button>
                </div>
            </Modal>

            <Footer />
        </div>
    );
}

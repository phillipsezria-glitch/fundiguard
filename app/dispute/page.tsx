"use client";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import Button from "../components/ui/Button";
import StatusPill from "../components/ui/StatusPill";

const steps = ["Open Dispute", "Upload Evidence", "Review by Team", "Resolution"];

export default function DisputePage() {
    const [submitted, setSubmitted] = useState(false);
    const [type, setType] = useState("");

    if (submitted) {
        return (
            <div style={{ minHeight: "100vh" }}>
                <Header />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh", padding: 40 }}>
                    <div style={{ textAlign: "center", maxWidth: 480 }}>
                        <div style={{ fontSize: "4rem", marginBottom: 16 }}>⚖️</div>
                        <h1 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.6rem", marginBottom: 12 }}>Dispute #FG-2026-0814 Opened</h1>
                        <p style={{ color: "var(--text-secondary)", marginBottom: 28, lineHeight: 1.7 }}>
                            Your case has been submitted. Our resolution team will review your evidence and respond within 48 hours. We take all disputes very seriously.
                        </p>
                        <div style={{ background: "var(--green-light)", borderRadius: 12, padding: 20, marginBottom: 28, textAlign: "left" }}>
                            <div style={{ fontWeight: 700, color: "var(--green-dark)", marginBottom: 10 }}>✅ What happens next:</div>
                            {["Your dispute is reviewed by our team (within 48hrs)", "Payment is frozen — no one receives it yet", "Both sides may be asked for more evidence", "Decision is final and enforced by the platform"].map((item, i) => (
                                <div key={i} style={{ fontSize: "0.85rem", marginBottom: 6 }}>• {item}</div>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                            <Link href="/dashboard">
                                <Button variant="primary" size="md">Track Case</Button>
                            </Link>
                            <Link href="/">
                                <Button variant="secondary" size="md">Go Home</Button>
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh" }}>
            <Header />

            {/* Hero */}
            <section style={{ background: "linear-gradient(135deg, #B71C1C, #E53935)", padding: "48px 0", textAlign: "center" }}>
                <div className="container">
                    <div style={{ fontSize: "3rem", marginBottom: 12 }}>⚖️</div>
                    <h1 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "clamp(1.5rem,4vw,2.2rem)", color: "white", marginBottom: 8 }}>
                        Dispute Center
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem", maxWidth: 480, margin: "0 auto" }}>
                        Not happy with a job? Raise a dispute. Our team resolves all cases within 48 hours.
                    </p>
                </div>
            </section>

            {/* Progress tracker */}
            <section style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "24px 0" }}>
                <div className="container">
                    <div style={{ display: "flex", justifyContent: "center", maxWidth: 600, margin: "0 auto" }}>
                        {steps.map((s, i) => (
                            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                    {i > 0 && <div style={{ flex: 1, height: 2, background: i <= 1 ? "var(--green)" : "var(--border)" }} />}
                                    <div style={{
                                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                                        background: i === 0 ? "var(--green)" : i === 1 ? "var(--orange)" : "var(--border)",
                                        color: i < 2 ? "white" : "var(--text-secondary)",
                                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700,
                                    }}>{i < 1 ? "✓" : i + 1}</div>
                                    {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: "var(--border)" }} />}
                                </div>
                                <div style={{ fontSize: "0.7rem", color: i === 1 ? "var(--orange)" : "var(--text-secondary)", marginTop: 6, fontWeight: i === 1 ? 700 : 400, textAlign: "center" }}>{s}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form */}
            <div className="container" style={{ padding: "40px 20px 60px" }}>
                <div style={{ maxWidth: 640, margin: "0 auto" }}>
                    <div className="card" style={{ padding: "32px" }}>
                        <h2 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 24 }}>Open a Dispute</h2>

                        {/* Job reference */}
                        <div style={{ background: "var(--bg)", borderRadius: 10, padding: "16px 20px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Paint living room — Peter Njoroge</div>
                                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Job #FG-1024 • Feb 19, 2026 • KSh 8,500 in escrow</div>
                            </div>
                            <StatusPill type="pending" label="⏳ In Escrow" />
                        </div>

                        {/* Dispute type */}
                        <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 12 }}>What went wrong? *</label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 24 }}>
                            {[
                                ["quality", "🔴 Poor quality work"],
                                ["incomplete", "⚠️ Job not completed"],
                                ["damage", "💥 Property damaged"],
                                ["noshow", "🚫 Fundi no-show"],
                                ["overcharge", "💰 Overcharged me"],
                                ["other", "❓ Other issue"],
                            ].map(([key, label]) => (
                                <button key={key} onClick={() => setType(key)} style={{
                                    padding: "12px", borderRadius: 10, border: "2px solid",
                                    borderColor: type === key ? "#E53935" : "var(--border)",
                                    background: type === key ? "#FFEBEE" : "white",
                                    cursor: "pointer", textAlign: "left", fontSize: "0.85rem", fontWeight: 500,
                                    transition: "all 0.2s",
                                }}>{label}</button>
                            ))}
                        </div>

                        {/* Description */}
                        <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Describe the issue *</label>
                        <textarea placeholder="Tell us exactly what went wrong. Be as specific as possible — this helps us resolve faster." rows={4}
                            style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.95rem", outline: "none", fontFamily: "Inter", marginBottom: 20, resize: "vertical" }} />

                        {/* Photo upload */}
                        <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Upload Evidence Photos *</label>
                        <div style={{
                            border: "2px dashed #E53935", borderRadius: 10, padding: "32px", textAlign: "center",
                            cursor: "pointer", marginBottom: 24, background: "#FFEBEE22",
                        }}>
                            <div style={{ fontSize: "2rem", marginBottom: 8 }}>📸</div>
                            <div style={{ fontWeight: 500, marginBottom: 4 }}>Drop photos here or tap to upload</div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Before/after photos, screenshots of conversation, etc.</div>
                        </div>

                        {/* Desired resolution */}
                        <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>What resolution do you want? *</label>
                        <select style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", outline: "none", fontFamily: "Inter", background: "white", marginBottom: 24 }}>
                            <option>Full refund to M-Pesa</option>
                            <option>Partial refund</option>
                            <option>Send a replacement fundi to fix it</option>
                            <option>I just want it documented</option>
                        </select>

                        {/* Warning */}
                        <div style={{ background: "#FFF8E1", border: "1px solid #FFD54F", borderRadius: 10, padding: "14px 16px", marginBottom: 24, fontSize: "0.85rem" }}>
                            ⚠️ <strong>Important:</strong> Submitting a false dispute is a violation of our Terms and may result in account suspension. Please only escalate genuine issues.
                        </div>

                        <Button variant="danger" size="lg" fullWidth onClick={() => setSubmitted(true)} style={{ marginBottom: 8 }}>
                            ⚖️ Submit Dispute
                        </Button>
                        <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 14 }}>
                            Our team reviews all disputes within 48 hours. Payment remains frozen until resolved.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

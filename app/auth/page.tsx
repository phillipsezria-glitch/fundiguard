"use client";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import Button from "../components/ui/Button";

export default function AuthPage() {
    const [tab, setTab] = useState<"login" | "signup">("login");
    const [role, setRole] = useState<"client" | "pro">("client");
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newInputs = [...otpInputs];
        newInputs[index] = value;
        setOtpInputs(newInputs);
        
        // Auto-focus to next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
            nextInput?.focus();
        }
        
        // Update otp state when all filled
        if (newInputs.every(v => v)) {
            setOtp(newInputs.join(""));
        }
    };

    const handleOtpBackspace = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otpInputs[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
            prevInput?.focus();
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
            <Header />

            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
                <div style={{ width: "100%", maxWidth: 440 }}>
                    {/* Logo */}
                    <div style={{ textAlign: "center", marginBottom: 32 }}>
                        <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, #00C853, #FF6D00)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L3 7V13C3 17.97 6.9 22.57 12 24C17.1 22.57 21 17.97 21 13V7L12 2Z" fill="white" />
                                <path d="M9 12H15M12 9V15" stroke="#00C853" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h1 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.5rem" }}>FundiGuard<span style={{ color: "var(--green)" }}>.ke</span></h1>
                    </div>

                    <div className="card" style={{ padding: "32px 28px" }}>
                        {/* Tabs */}
                        <div style={{ display: "flex", background: "var(--bg)", borderRadius: 10, padding: 4, marginBottom: 28 }}>
                            {([["login", "Login"], ["signup", "Create Account"]] as const).map(([key, label]) => (
                                <button key={key} onClick={() => { setTab(key); setStep(1); }} style={{
                                    flex: 1, padding: "10px", border: "none", borderRadius: 8, cursor: "pointer",
                                    fontWeight: 600, fontSize: "0.9rem", transition: "all 0.2s",
                                    background: tab === key ? "white" : "transparent",
                                    color: tab === key ? "var(--green)" : "var(--text-secondary)",
                                    boxShadow: tab === key ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                                }}>{label}</button>
                            ))}
                        </div>

                        {/* Signup: Role selector */}
                        {tab === "signup" && step === 1 && (
                            <div>
                                <h2 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 6, fontSize: "1.1rem" }}>Join as...</h2>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: 20 }}>Choose your account type</p>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
                                    {([["client", "🏠", "I Need a Fundi", "Hire vetted professionals for your home"], ["pro", "🔧", "I Am a Fundi", "Get jobs, grow your business"]] as const).map(([key, icon, label, desc]) => (
                                        <button key={key} onClick={() => setRole(key)} style={{
                                            padding: "20px 14px", borderRadius: 12, border: "2px solid",
                                            borderColor: role === key ? "var(--green)" : "var(--border)",
                                            background: role === key ? "var(--green-light)" : "white",
                                            cursor: "pointer", textAlign: "center", transition: "all 0.2s",
                                        }}>
                                            <div style={{ fontSize: "2rem", marginBottom: 8 }}>{icon}</div>
                                            <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 4 }}>{label}</div>
                                            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{desc}</div>
                                        </button>
                                    ))}
                                </div>
                                <Button variant="primary" size="md" fullWidth onClick={() => setStep(2)}>
                                    Continue as {role === "client" ? "Client" : "Pro"} →
                                </Button>
                            </div>
                        )}

                        {/* Phone entry */}
                        {(tab === "login" || (tab === "signup" && step === 2)) && step !== 3 && (
                            <div>
                                <h2 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 6, fontSize: "1.1rem" }}>
                                    {tab === "login" ? "Welcome back! 👋" : `Sign up as a ${role === "client" ? "Client" : "Pro"} 🇰🇪`}
                                </h2>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: 24 }}>
                                    {tab === "login" ? "Enter your phone number to login" : "Enter your Safaricom number"}
                                </p>

                                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Phone Number (M-Pesa)</label>
                                <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
                                    <div style={{ background: "var(--bg)", padding: "12px 14px", borderRight: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: 600, color: "var(--text)", display: "flex", alignItems: "center" }}>
                                        🇰🇪 +254
                                    </div>
                                    <input value={phone} onChange={e => setPhone(e.target.value)}
                                        placeholder="7XX XXX XXX" type="tel"
                                        style={{ flex: 1, padding: "12px 16px", border: "none", outline: "none", fontSize: "1rem", fontFamily: "Inter" }} />
                                </div>

                                {tab === "signup" && (
                                    <>
                                        <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Full Name</label>
                                        <input placeholder="Grace Wanjiru" style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", outline: "none", marginBottom: 16, fontFamily: "Inter" }} />
                                        <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Email Address</label>
                                        <input placeholder="grace@example.com" type="email" style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", outline: "none", marginBottom: 16, fontFamily: "Inter" }} />
                                    </>
                                )}

                                <Button variant="primary" size="md" fullWidth onClick={() => setStep(3)} style={{ marginBottom: 16 }}>
                                    📱 Send OTP Code
                                </Button>

                                <div style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                                    Or continue with
                                </div>
                                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                                    {[["G", "#4285F4", "Google"], ["f", "#1877F2", "Facebook"]].map(([icon, bg, label]) => (
                                        <Button key={label} variant="secondary" size="md" fullWidth>
                                            <span style={{ color: bg as string, fontWeight: 700 }}>{icon} {label}</span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* OTP Verify */}
                        {step === 3 && (
                            <div>
                                <h2 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 6, fontSize: "1.1rem" }}>Enter OTP Code 🔒</h2>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: 24 }}>
                                    We sent a 6-digit code to <strong>+254 {phone || "7XX XXX XXX"}</strong>
                                </p>
                                <div style={{ display: "flex", gap: 8, marginBottom: 24, maxWidth: 300, margin: "0 auto 24px" }}>
                                    {Array(6).fill(0).map((_, i) => (
                                        <input 
                                            key={i} 
                                            id={`otp-${i}`}
                                            maxLength={1} 
                                            type="text"
                                            inputMode="numeric"
                                            value={otpInputs[i]}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleOtpBackspace(i, e)}
                                            style={{
                                                flex: 1, width: 44, height: 44, padding: "8px", borderRadius: 8, border: "2px solid var(--border)", outline: "none",
                                                textAlign: "center", fontSize: "1.2rem", fontWeight: 700, fontFamily: "Poppins",
                                                transition: "all 0.2s",
                                                borderColor: otpInputs[i] ? "var(--green)" : "var(--border)",
                                                backgroundColor: otpInputs[i] ? "var(--green-light)" : "white",
                                            }} 
                                            onFocus={(e) => {
                                                e.target.style.borderColor = "var(--green)";
                                                e.target.style.boxShadow = "0 0 0 3px rgba(0,200,83,0.1)";
                                            }}
                                            onBlur={(e) => {
                                                if (!otpInputs[i]) {
                                                    e.target.style.borderColor = "var(--border)";
                                                    e.target.style.boxShadow = "none";
                                                }
                                            }}
                                        />
                                    ))}
                                </div>
                                <Link href={role === "pro" ? "/pro-dashboard" : "/dashboard"}>
                                    <Button variant="primary" size="md" fullWidth disabled={otp.length !== 6}>
                                        ✅ Verify & Enter
                                    </Button>
                                </Link>
                                <div style={{ textAlign: "center", marginTop: 16, fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                                    Didn&apos;t get it? <button style={{ background: "none", border: "none", color: "var(--green)", fontWeight: 600, cursor: "pointer" }}>Resend in 0:45</button>
                                </div>
                            </div>
                        )}

                        {/* Footer note */}
                        {step !== 3 && (
                            <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 20 }}>
                                By continuing, you agree to our{" "}
                                <Link href="/terms" style={{ color: "var(--green)" }}>Terms</Link> &{" "}
                                <Link href="/privacy" style={{ color: "var(--green)" }}>Privacy Policy</Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

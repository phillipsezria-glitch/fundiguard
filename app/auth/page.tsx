"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import Button from "../components/ui/Button";
import { api, auth as authStorage } from "../lib/api";

export default function AuthPage() {
    const router = useRouter();
    const [tab, setTab] = useState<"login" | "signup">("login");
    const [role, setRole] = useState<"client" | "pro">("client");
    const [step, setStep] = useState(1); // 1: role, 2: phone/details, 3: password/otp
    
    // Form state
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [otp, setOtp] = useState("");
    const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);
    
    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newInputs = [...otpInputs];
        newInputs[index] = value;
        setOtpInputs(newInputs);
        
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
            nextInput?.focus();
        }
        
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

    // Phone validation for Kenya
    const formatPhoneNumber = (phoneStr: string) => {
        const cleaned = phoneStr.replace(/\D/g, '');
        if (cleaned.startsWith('254')) return cleaned;
        if (cleaned.startsWith('0')) return '254' + cleaned.slice(1);
        return '254' + cleaned;
    };

    const validatePhone = (p: string) => {
        const formatted = formatPhoneNumber(p);
        return formatted.length === 12 && formatted.startsWith('254');
    };

    // Handle login/signup with password
    const handlePasswordAuth = async () => {
        setError("");
        setLoading(true);
        
        try {
            if (!validatePhone(phone)) {
                throw new Error('Invalid phone number. Use format: 7XXXXXXXX');
            }

            if (tab === "login") {
                if (!password) throw new Error('Password required');
                
                const response = await api.auth.login({
                    phone_number: formatPhoneNumber(phone),
                    password,
                });
                
                authStorage.setToken(response.token);
                authStorage.setUser(response.user);
                router.push(response.user.role === 'pro' ? '/pro-dashboard' : '/dashboard');
            } else {
                // Signup
                if (!fullName.trim()) throw new Error('Full name required');
                if (!password) throw new Error('Password required');
                if (password.length < 8) throw new Error('Password must be at least 8 characters');
                
                const response = await api.auth.register({
                    phone_number: formatPhoneNumber(phone),
                    password,
                    full_name: fullName,
                    role,
                });
                
                authStorage.setToken(response.token);
                authStorage.setUser(response.user);
                router.push(response.user.role === 'pro' ? '/pro-dashboard' : '/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP request
    const handleRequestOTP = async () => {
        setError("");
        setMessage("");
        setLoading(true);
        
        try {
            if (!validatePhone(phone)) {
                throw new Error('Invalid phone number');
            }
            
            if (tab === "signup" && !fullName.trim()) {
                throw new Error('Full name required');
            }
            
            await api.auth.requestOTP({
                phone_number: formatPhoneNumber(phone),
                action: tab === "login" ? "login" : "register",
            });
            
            setMessage('OTP sent! Check SMS or console (dev mode)');
            setStep(3);
        } catch (err: any) {
            setError(err.message || 'Failed to request OTP');
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP verification
    const handleVerifyOTP = async () => {
        setError("");
        setLoading(true);
        
        try {
            if (otp.length !== 6) {
                throw new Error('Enter complete OTP code');
            }
            
            const response = await api.auth.verifyOTP({
                phone_number: formatPhoneNumber(phone),
                otp_code: otp,
                action: tab === "login" ? "login" : "register",
                full_name: tab === "signup" ? fullName : undefined,
                role: tab === "signup" ? role : undefined,
            });
            
            authStorage.setToken(response.token);
            authStorage.setUser(response.user);
            router.push(response.user.role === 'pro' ? '/pro-dashboard' : '/dashboard');
        } catch (err: any) {
            setError(err.message || 'OTP verification failed');
        } finally {
            setLoading(false);
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
                                <button key={key} onClick={() => { setTab(key); setStep(1); setError(""); }} style={{
                                    flex: 1, padding: "10px", border: "none", borderRadius: 8, cursor: "pointer",
                                    fontWeight: 600, fontSize: "0.9rem", transition: "all 0.2s",
                                    background: tab === key ? "white" : "transparent",
                                    color: tab === key ? "var(--green)" : "var(--text-secondary)",
                                    boxShadow: tab === key ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                                }}>{label}</button>
                            ))}
                        </div>

                        {/* Error/Success messages */}
                        {error && <div style={{ padding: 12, borderRadius: 8, background: "#ffebee", color: "#c62828", marginBottom: 16, fontSize: "0.88rem" }}>⚠️ {error}</div>}
                        {message && <div style={{ padding: 12, borderRadius: 8, background: "#e8f5e9", color: "#2e7d32", marginBottom: 16, fontSize: "0.88rem" }}>✓ {message}</div>}

                        {/* Signup: Role selector */}
                        {tab === "signup" && step === 1 && (
                            <div>
                                <h2 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 6, fontSize: "1.1rem" }}>Join as...</h2>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: 20 }}>Choose your account type</p>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
                                    {([["client", "🏠", "I Need a Fundi", "Hire vetted professionals"], ["pro", "🔧", "I Am a Fundi", "Get jobs & earn"]] as const).map(([key, icon, label, desc]) => (
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

                        {/* Phone & Details entry */}
                        {(tab === "login" || (tab === "signup" && step === 2)) && step !== 3 && (
                            <div>
                                <h2 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 6, fontSize: "1.1rem" }}>
                                    {tab === "login" ? "Welcome back! 👋" : `Sign up as a ${role === "client" ? "Client" : "Pro"}`}
                                </h2>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: 24 }}>
                                    {tab === "login" ? "Login to your account" : "Create your account"}
                                </p>

                                {/* Phone */}
                                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Phone Number</label>
                                <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
                                    <div style={{ background: "var(--bg)", padding: "12px 14px", borderRight: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: 600 }}>
                                        🇰🇪 +254
                                    </div>
                                    <input value={phone} onChange={e => setPhone(e.target.value)}
                                        placeholder="7XX XXX XXX" type="tel"
                                        style={{ flex: 1, padding: "12px 16px", border: "none", outline: "none", fontSize: "1rem" }} />
                                </div>

                                {/* Signup fields */}
                                {tab === "signup" && (
                                    <>
                                        <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Full Name</label>
                                        <input value={fullName} onChange={e => setFullName(e.target.value)}
                                            placeholder="Grace Wanjiru" 
                                            style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", outline: "none", marginBottom: 16 }} />
                                    </>
                                )}

                                {/* Password field */}
                                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Password</label>
                                <input value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••" type="password"
                                    style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", outline: "none", marginBottom: 16 }} />
                                {tab === "signup" && <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: 16 }}>Minimum 8 characters</p>}

                                <Button variant="primary" size="md" fullWidth onClick={handlePasswordAuth} disabled={loading}>
                                    {loading ? "Processing..." : (tab === "login" ? "🔓 Login" : "✅ Create Account")}
                                </Button>

                                {tab === "signup" && (
                                    <>
                                        <div style={{ textAlign: "center", margin: "16px 0 12px", color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                                            Or use OTP instead
                                        </div>
                                        <Button variant="secondary" size="md" fullWidth onClick={handleRequestOTP} disabled={loading}>
                                            📱 Send OTP Code
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}

                        {/* OTP Verify */}
                        {step === 3 && (
                            <div>
                                <h2 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 6, fontSize: "1.1rem" }}>Enter OTP Code 🔒</h2>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: 24 }}>
                                    We sent a 6-digit code to <strong>+254 {phone.replace(/\D/g, '').slice(-9)}</strong>
                                </p>
                                <div style={{ display: "flex", gap: 8, marginBottom: 24, justifyContent: "center" }}>
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
                                                width: 44, height: 44, padding: "8px", borderRadius: 8, border: "2px solid var(--border)", outline: "none",
                                                textAlign: "center", fontSize: "1.2rem", fontWeight: 700,
                                                transition: "all 0.2s",
                                                borderColor: otpInputs[i] ? "var(--green)" : "var(--border)",
                                                backgroundColor: otpInputs[i] ? "var(--green-light)" : "white",
                                            }} 
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = "var(--green)";
                                                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,200,83,0.1)";
                                            }}
                                            onBlur={(e) => {
                                                const idx = parseInt(e.currentTarget.id.split('-')[1], 10);
                                                if (!otpInputs[idx]) {
                                                    e.currentTarget.style.borderColor = "var(--border)";
                                                    e.currentTarget.style.boxShadow = "none";
                                                }
                                            }}
                                        />
                                    ))}
                                </div>
                                <Button variant="primary" size="md" fullWidth onClick={handleVerifyOTP} disabled={otp.length !== 6 || loading}>
                                    {loading ? "Verifying..." : "✅ Verify & Continue"}
                                </Button>
                                <button onClick={() => setStep(2)} style={{ background: "none", border: "none", color: "var(--green)", cursor: "pointer", marginTop: 16, width: "100%", fontWeight: 600 }}>
                                    ← Back
                                </button>
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

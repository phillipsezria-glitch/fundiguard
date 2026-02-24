"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import PhotoUploader from "../components/PhotoUploader";
import Button from "../components/ui/Button";
import LocationPicker from "../components/LocationPicker";
import { api, auth } from "@/app/lib/api";
import { useAuthProtected } from "@/app/lib/useAuthProtected";

const steps = ["Job Details", "Location & Time", "Review & Pay"];

const categories = [
    { icon: "🔧", name: "Plumbing & Water" },
    { icon: "⚡", name: "Electrical & Wiring" },
    { icon: "🪚", name: "Carpentry & Furniture" },
    { icon: "🎨", name: "Painting & Decor" },
    { icon: "🧹", name: "Cleaning & Mama Fua" },
    { icon: "📺", name: "Appliance Repair" },
    { icon: "🚗", name: "Auto & Boda Mechanics" },
    { icon: "📚", name: "Home Tutors" },
    { icon: "💇", name: "Beauty & Salon" },
    { icon: "🌿", name: "Gardening & Pest Control" },
    { icon: "👶", name: "Caregivers" },
    { icon: "🎉", name: "Events & Other" },
];

export default function PostJobPage() {
    useAuthProtected(); // Protect this route
    
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedPhotos, setUploadedPhotos] = useState<Array<{ url: string; path: string }>>([]);
    const [form, setForm] = useState({
        category: "",
        title: "",
        description: "",
        budget: "",
        urgency: "normal",
        location: "",
        lat: null as number | null,
        lng: null as number | null,
        date: "",
        time: "",
        addInsurance: false,
        phone: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleNext = async () => {
        if (step < 2) {
            setStep(step + 1);
        } else {
            // Submit job
            setIsLoading(true);
            try {
                const token = auth.getToken();
                if (!token) {
                    alert("Please log in to post a job");
                    router.push("/auth");
                    return;
                }

                const jobData = {
                    title: form.title,
                    description: form.description,
                    category: form.category,
                    budget: parseInt(form.budget || "0"),
                    location: form.location,
                    urgency: form.urgency,
                    photos: uploadedPhotos.map(p => p.url), // Send photo URLs
                    ...(form.lat && form.lng && { latitude: form.lat, longitude: form.lng }),
                };

                await api.jobs.create(token, jobData);
                setSubmitted(true);
            } catch (error: any) {
                alert(error.message || "Failed to post job");
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (submitted) {
        return (
            <div style={{ minHeight: "100vh" }}>
                <Header />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh", padding: "40px 20px" }}>
                    <div style={{ textAlign: "center", maxWidth: 480 }}>
                        <div style={{ fontSize: "5rem", marginBottom: 20 }}>🎉</div>
                        <h1 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.8rem", marginBottom: 12 }}>Job Posted!</h1>
                        <p style={{ color: "var(--text-secondary)", marginBottom: 32, fontSize: "1rem", lineHeight: 1.6 }}>
                            Your job has been posted. You&apos;ll receive bidshown from verified fundis within minutes. Your payment is held securely in escrow.
                        </p>
                        <div style={{ background: "var(--green-light)", borderRadius: 12, padding: "20px 24px", marginBottom: 32, textAlign: "left" }}>
                            <div style={{ fontWeight: 700, color: "var(--green-dark)", marginBottom: 8 }}>✅ What happens next:</div>
                            {["Fundis nearby are notified instantly", "You\u2019ll get 3-5 bids in ~15 minutes", "Compare profiles, ratings & prices", "Pay via M-Pesa — fully escrowed"].map((item, i) => (
                                <div key={i} style={{ fontSize: "0.88rem", color: "var(--text)", marginBottom: 6 }}>• {item}</div>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                            <Link href="/dashboard" className="btn-primary" style={{ padding: "12px 28px" }}>View My Jobs</Link>
                            <Link href="/" className="btn-secondary" style={{ padding: "12px 28px" }}>Back to Home</Link>
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
            <section style={{ background: "linear-gradient(135deg, #003320, #005A2C)", padding: "40px 0 60px" }}>
                <div className="container" style={{ textAlign: "center" }}>
                    <h1 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "clamp(1.5rem,4vw,2.2rem)", color: "white", marginBottom: 8 }}>
                        Post a Job
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: 32 }}>Takes 2 minutes — fundis will bid within 15 minutes</p>

                    {/* Step indicator */}
                    <div style={{ display: "flex", justifyContent: "center", gap: 0, maxWidth: 480, margin: "0 auto" }}>
                        {steps.map((s, i) => (
                            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                    {i > 0 && <div style={{ flex: 1, height: 2, background: i <= step ? "var(--green)" : "rgba(255,255,255,0.3)" }} />}
                                    <div style={{
                                        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                                        background: i < step ? "var(--green)" : i === step ? "var(--orange)" : "rgba(255,255,255,0.3)",
                                        color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                                        fontWeight: 700, fontSize: "0.9rem",
                                    }}>
                                        {i < step ? "✓" : i + 1}
                                    </div>
                                    {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? "var(--green)" : "rgba(255,255,255,0.3)" }} />}
                                </div>
                                <div style={{ fontSize: "0.72rem", color: i === step ? "white" : "rgba(255,255,255,0.5)", marginTop: 6, fontWeight: i === step ? 600 : 400 }}>
                                    {s}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="container" style={{ padding: "0 20px", marginTop: -24, marginBottom: 60 }}>
                <div style={{ maxWidth: 640, margin: "0 auto" }}>
                    <div className="card" style={{ padding: "36px 32px" }}>

                        {/* Step 1 */}
                        {step === 0 && (
                            <div>
                                <h2 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 24 }}>📋 Job Details</h2>

                                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Service Category *</label>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
                                    {categories.map(cat => (
                                        <button key={cat.name} onClick={() => setForm({ ...form, category: cat.name })} style={{
                                            padding: "10px 8px", borderRadius: 10, border: "2px solid",
                                            borderColor: form.category === cat.name ? "var(--green)" : "var(--border)",
                                            background: form.category === cat.name ? "var(--green-light)" : "var(--white)",
                                            cursor: "pointer", textAlign: "center", transition: "all 0.2s",
                                        }}>
                                            <div style={{ fontSize: "1.4rem" }}>{cat.icon}</div>
                                            <div style={{ fontSize: "0.7rem", fontWeight: 500, marginTop: 4, color: "var(--text)" }}>{cat.name}</div>
                                        </button>
                                    ))}
                                </div>

                                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Job Title *</label>
                                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                                    placeholder="e.g. Fix leaking kitchen pipe"
                                    style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", marginBottom: 20, outline: "none", fontFamily: "Inter" }} />

                                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Description *</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder="Describe the job in detail. What needs to be fixed? Any existing damage?"
                                    rows={4}
                                    style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.95rem", marginBottom: 20, outline: "none", fontFamily: "Inter", resize: "vertical" }} />

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                                    <div>
                                        <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Budget (KSh) *</label>
                                        <input value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}
                                            placeholder="e.g. 2500"
                                            type="number"
                                            style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", outline: "none", fontFamily: "Inter" }} />
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Urgency</label>
                                        <select value={form.urgency} onChange={e => setForm({ ...form, urgency: e.target.value })}
                                            style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", outline: "none", fontFamily: "Inter", background: "white" }}>
                                            <option value="normal">Normal (today)</option>
                                            <option value="urgent">🔥 Urgent (ASAP)</option>
                                            <option value="flexible">Flexible</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Photo upload */}
                                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Upload Photos (optional)</label>
                                <PhotoUploader 
                                    maxFiles={5}
                                    maxFileSize={10 * 1024 * 1024}
                                    onPhotosSelected={(photos) => setUploadedPhotos(photos)}
                                />
                            </div>
                        )}

                        {/* Step 2 */}
                        {step === 1 && (
                            <div>
                                <h2 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 24 }}>📍 Location & Time</h2>

                                {/* Interactive Location Picker Map */}
                                <LocationPicker
                                    value={form.location}
                                    onChange={(location) => setForm({ ...form, location })}
                                    onCoordinatesChange={(coords) => {
                                        if (coords) {
                                            setForm({ ...form, lat: coords.lat, lng: coords.lng });
                                        }
                                    }}
                                />

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24, marginTop: 24 }}>
                                    <div>
                                        <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Preferred Date *</label>
                                        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                                            style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", outline: "none", fontFamily: "Inter" }} />
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Preferred Time</label>
                                        <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                                            style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", outline: "none", background: "white" }}>
                                            <option>Morning (7am–12pm)</option>
                                            <option>Afternoon (12pm–5pm)</option>
                                            <option>Evening (5pm–8pm)</option>
                                            <option>Anytime</option>
                                        </select>
                                    </div>
                                </div>

                                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Your Phone (M-Pesa number) *</label>
                                <div style={{ position: "relative" }}>
                                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: "0.9rem", color: "var(--text-secondary)" }}>+254</span>
                                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                        placeholder="7XX XXX XXX"
                                        style={{ width: "100%", padding: "12px 16px 12px 56px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", outline: "none", fontFamily: "Inter" }} />
                                </div>
                            </div>
                        )}

                        {/* Step 3 Review */}
                        {step === 2 && (
                            <div>
                                <h2 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 24 }}>💳 Review & Pay</h2>

                                <div style={{ background: "var(--bg)", borderRadius: 12, padding: 20, marginBottom: 24 }}>
                                    <h3 style={{ fontFamily: "Poppins", fontWeight: 600, marginBottom: 16, fontSize: "0.95rem" }}>Job Summary</h3>
                                    {[
                                        ["Service", form.category || "—"],
                                        ["Title", form.title || "—"],
                                        ["Location", form.location || "—"],
                                        ["Date", form.date || "—"],
                                        ["Budget", form.budget ? `KSh ${parseInt(form.budget).toLocaleString()}` : "—"],
                                        ["Urgency", form.urgency],
                                    ].map(([label, val]) => (
                                        <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: "0.9rem" }}>
                                            <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                                            <span style={{ fontWeight: 500 }}>{val}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Insurance add-on */}
                                <div style={{
                                    border: `2px solid ${form.addInsurance ? "var(--green)" : "var(--border)"}`,
                                    borderRadius: 12, padding: "16px 20px", marginBottom: 24, cursor: "pointer",
                                    background: form.addInsurance ? "var(--green-light)" : "var(--white)",
                                    transition: "all 0.2s",
                                }} onClick={() => setForm({ ...form, addInsurance: !form.addInsurance })}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 4 }}>🛡️ Add Job Insurance</div>
                                            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>Coverage up to KSh 50,000 if job goes wrong</div>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ fontWeight: 700, color: "var(--green)" }}>+ KSh 199</div>
                                            <div style={{
                                                width: 22, height: 22, borderRadius: 4,
                                                background: form.addInsurance ? "var(--green)" : "transparent",
                                                border: "2px solid var(--green)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                color: "white", fontSize: "0.8rem", marginTop: 4, marginLeft: "auto",
                                            }}>{form.addInsurance ? "✓" : ""}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment breakdown */}
                                <div style={{ background: "#1A1A1A", borderRadius: 12, padding: 20, marginBottom: 24, color: "white" }}>
                                    <div style={{ fontWeight: 600, marginBottom: 16, color: "#9E9E9E", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: 1 }}>
                                        Escrow Payment via M-Pesa
                                    </div>
                                    {[
                                        ["Job Budget", form.budget ? `KSh ${parseInt(form.budget).toLocaleString()}` : "KSh 0"],
                                        ["Platform Fee (18%)", form.budget ? `KSh ${Math.round(parseInt(form.budget) * 0.18).toLocaleString()}` : "KSh 0"],
                                        ["Insurance (optional)", form.addInsurance ? "KSh 199" : "KSh 0"],
                                    ].map(([label, val]) => (
                                        <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: "0.9rem" }}>
                                            <span style={{ color: "#9E9E9E" }}>{label}</span>
                                            <span>{val}</span>
                                        </div>
                                    ))}
                                    <div style={{ borderTop: "1px solid #333", paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ fontFamily: "Poppins", fontWeight: 700 }}>Total Escrow</span>
                                        <span style={{ fontFamily: "Poppins", fontWeight: 700, color: "#00C853", fontSize: "1.1rem" }}>
                                            {form.budget
                                                ? `KSh ${(parseInt(form.budget) * 1.18 + (form.addInsurance ? 199 : 0)).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                                                : "KSh 0"}
                                        </span>
                                    </div>
                                    <div style={{ marginTop: 12, fontSize: "0.78rem", color: "#757575" }}>
                                        💡 Money is held securely. Released to fundi only after you approve the job with photos.
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div style={{ display: "flex", gap: 12 }}>
                            {step > 0 && (
                                <Button 
                                    variant="secondary" 
                                    size="md" 
                                    onClick={() => setStep(step - 1)}
                                    disabled={isLoading}
                                >
                                    ← Back
                                </Button>
                            )}
                            <Button 
                                variant="primary" 
                                size="lg" 
                                fullWidth 
                                onClick={handleNext}
                                disabled={isLoading}
                            >
                                {isLoading ? "Processing..." : step === 2 ? "🔒 Pay via M-Pesa & Post Job" : "Continue →"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

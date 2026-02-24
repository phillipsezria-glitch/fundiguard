import Link from "next/link";

const footerLinks = {
    "Company": [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
        { label: "Press", href: "/press" },
    ],
    "Services": [
        { label: "Browse Fundis", href: "/browse" },
        { label: "Post a Job", href: "/post-job" },
        { label: "Job Insurance", href: "/insurance" },
        { label: "Dispute Center", href: "/dispute" },
    ],
    "For Pros": [
        { label: "Become a Pro", href: "/for-pros" },
        { label: "Pro Dashboard", href: "/pro-dashboard" },
        { label: "Subscription Plans", href: "/for-pros#plans" },
        { label: "Verification Process", href: "/for-pros#verify" },
    ],
    "Support": [
        { label: "Support Center", href: "/support" },
        { label: "Help Center", href: "/help" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact Us", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
    ],
};

const socialLinks = [
    { label: "Facebook", href: "#", icon: "f" },
    { label: "Twitter/X", href: "#", icon: "𝕏" },
    { label: "Instagram", href: "#", icon: "📸" },
    { label: "TikTok", href: "#", icon: "♪" },
    { label: "WhatsApp", href: "#", icon: "💬" },
];

export default function Footer() {
    return (
        <footer style={{
            background: "#1A1A1A",
            color: "#E0E0E0",
            marginTop: 80,
        }}>
            {/* Main footer content */}
            <div className="container" style={{ paddingTop: 60, paddingBottom: 40 }}>
                {/* Top row */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: 40,
                    marginBottom: 48,
                }}>
                    {/* Brand */}
                    <div style={{ gridColumn: "span 1" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 10,
                                background: "linear-gradient(135deg, #00C853, #FF6D00)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L3 7V13C3 17.97 6.9 22.57 12 24C17.1 22.57 21 17.97 21 13V7L12 2Z" fill="white" fillOpacity="0.9" />
                                    <path d="M9 12H15M12 9V15" stroke="#00C853" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.1rem", color: "white" }}>
                                FundiGuard<span style={{ color: "#00C853" }}>.ke</span>
                            </span>
                        </div>
                        <p style={{ fontSize: "0.88rem", color: "#9E9E9E", lineHeight: 1.7, marginBottom: 20 }}>
                            Kenya's most trusted on-demand services marketplace. Book with confidence.
                        </p>
                        {/* Social */}
                        <div style={{ display: "flex", gap: 10 }}>
                            {socialLinks.map(s => (
                                <a key={s.label} href={s.href} title={s.label} style={{
                                    width: 36, height: 36, borderRadius: 8,
                                    background: "#2A2A2A", display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "0.85rem", color: "#BDBDBD", transition: "all 0.2s",
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = "#00C853"; e.currentTarget.style.color = "white"; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "#2A2A2A"; e.currentTarget.style.color = "#BDBDBD"; }}
                                >{s.icon}</a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([section, links]) => (
                        <div key={section}>
                            <h4 style={{ color: "white", fontFamily: "Poppins", fontWeight: 600, fontSize: "0.9rem", marginBottom: 16 }}>
                                {section}
                            </h4>
                            <ul style={{ listStyle: "none" }}>
                                {links.map(l => (
                                    <li key={l.href} style={{ marginBottom: 10 }}>
                                        <Link href={l.href} style={{
                                            color: "#9E9E9E", fontSize: "0.85rem", transition: "color 0.2s",
                                        }}
                                            onMouseEnter={e => (e.currentTarget.style.color = "#00C853")}
                                            onMouseLeave={e => (e.currentTarget.style.color = "#9E9E9E")}
                                        >{l.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Trust badges */}
                <div style={{
                    display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center",
                    padding: "20px 0", borderTop: "1px solid #2A2A2A", borderBottom: "1px solid #2A2A2A",
                    marginBottom: 24,
                }}>
                    {[
                        "🔒 Secured by M-Pesa",
                        "🛡️ Job Insurance Available",
                        "✅ DCI + ID Verified Pros",
                        "⚖️ Kenya Data Protection Act Compliant",
                        "🏆 100% Escrow Protected",
                    ].map(badge => (
                        <span key={badge} style={{
                            background: "#2A2A2A", borderRadius: 6, padding: "6px 14px",
                            fontSize: "0.78rem", color: "#BDBDBD", fontWeight: 500,
                        }}>{badge}</span>
                    ))}
                </div>

                {/* Bottom row */}
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <p style={{ fontSize: "0.82rem", color: "#616161" }}>
                        © 2026 FundiGuard.ke — All rights reserved. Nairobi, Kenya 🇰🇪
                    </p>
                    <div style={{ display: "flex", gap: 20 }}>
                        {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(t => (
                            <Link key={t} href="#" style={{ fontSize: "0.82rem", color: "#616161", transition: "color 0.2s" }}
                                onMouseEnter={e => (e.currentTarget.style.color = "#00C853")}
                                onMouseLeave={e => (e.currentTarget.style.color = "#616161")}
                            >{t}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

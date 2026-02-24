"use client";
import { useState } from "react";
import Link from "next/link";

const navLinks = [
    { href: "/browse", label: "Browse Services" },
    { href: "/post-job", label: "Post a Job" },
    { href: "/for-pros", label: "For Pros" },
    { href: "/insurance", label: "Insurance" },
    { href: "/support", label: "Support" },
];

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [lang, setLang] = useState<"EN" | "SW">("EN");

    return (
        <header style={{
            position: "sticky", top: 0, zIndex: 100,
            background: "var(--white)",
            boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
            borderBottom: "1px solid var(--border)",
        }}>
            <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
                {/* Logo */}
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
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
                    <div>
                        <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)", lineHeight: 1.1 }}>
                            FundiGuard<span style={{ color: "var(--green)" }}>.ke</span>
                        </div>
                        <div style={{ fontSize: "0.6rem", color: "var(--text-secondary)", letterSpacing: 1 }}>BOOK WITH CONFIDENCE</div>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hide-mobile" style={{ display: "flex", gap: 4 }}>
                    {navLinks.map(l => (
                        <Link key={l.href} href={l.href} style={{
                            padding: "8px 16px", borderRadius: 8, fontWeight: 500, fontSize: "0.9rem",
                            color: "var(--text)", transition: "all 0.2s",
                        }}
                            onMouseEnter={e => (e.currentTarget.style.background = "var(--green-light)")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >{l.label}</Link>
                    ))}
                </nav>

                {/* Right side */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Language toggle */}
                    <button
                        onClick={() => setLang(lang === "EN" ? "SW" : "EN")}
                        style={{
                            background: "var(--green-light)", border: "none", borderRadius: 6,
                            padding: "5px 12px", fontWeight: 600, fontSize: "0.8rem", color: "var(--green-dark)",
                            cursor: "pointer",
                        }}
                    >{lang === "EN" ? "🇰🇪 SW" : "🇺🇸 EN"}</button>

                    {/* Login */}
                    <Link href="/auth" className="hide-mobile" style={{
                        padding: "8px 18px", borderRadius: 8, fontWeight: 600, fontSize: "0.9rem",
                        color: "var(--text)", border: "1px solid var(--border)",
                    }}>Login</Link>

                    {/* Signup */}
                    <Link href="/auth?tab=signup" className="btn-primary hide-mobile" style={{ padding: "8px 20px", fontSize: "0.9rem" }}>
                        Get Started
                    </Link>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{ background: "none", border: "none", padding: 8, display: "none" }}
                        className="show-mobile"
                        aria-label="Toggle menu"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2">
                            {menuOpen
                                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                                : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                            }
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div style={{
                    background: "var(--white)", borderTop: "1px solid var(--border)",
                    padding: "16px 20px 24px",
                }}>
                    {navLinks.map(l => (
                        <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
                            display: "block", padding: "12px 0", fontWeight: 500,
                            borderBottom: "1px solid var(--border)", color: "var(--text)",
                        }}>{l.label}</Link>
                    ))}
                    <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                        <Link href="/auth" className="btn-secondary" style={{ flex: 1, justifyContent: "center", padding: "10px 0" }}>Login</Link>
                        <Link href="/auth?tab=signup" className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "10px 0" }}>Sign Up</Link>
                    </div>
                </div>
            )}

            <style jsx>{`
        @media (max-width: 768px) {
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none; }
          nav { display: flex !important; }
        }
      `}</style>
        </header>
    );
}

"use client";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import FundiCard from "../components/ui/FundiCard";
import Button from "../components/ui/Button";
import StatusPill from "../components/ui/StatusPill";
import RatingStars from "../components/ui/RatingStars";

const fundis = [
    { id: 1, name: "James Mwangi", skill: "Master Plumber", rating: 4.9, reviews: 214, location: "South C", price: 1800, verified: true, online: true, jobs: 312, avatar: "JM", avatarBg: "#1565C0", insurance: true, badge: "Top Rated" },
    { id: 2, name: "Mercy Achieng", skill: "Electrical Engineer", rating: 4.8, reviews: 187, location: "Westlands", price: 2500, verified: true, online: true, jobs: 198, avatar: "MA", avatarBg: "#6A1B9A", insurance: true, badge: "Pro" },
    { id: 3, name: "Peter Njoroge", skill: "Painter & Decorator", rating: 4.9, reviews: 302, location: "Kasarani", price: 1500, verified: true, online: false, jobs: 445, avatar: "PN", avatarBg: "#BF360C", insurance: false, badge: "Top Rated" },
    { id: 4, name: "Fatuma Hassan", skill: "Cleaning Specialist", rating: 5.0, reviews: 98, location: "Kilimani", price: 2200, verified: true, online: true, jobs: 132, avatar: "FH", avatarBg: "#2E7D32", insurance: true, badge: "New" },
    { id: 5, name: "David Ochieng", skill: "Carpenter & Furniture", rating: 4.7, reviews: 156, location: "Rongai", price: 2000, verified: true, online: false, jobs: 223, avatar: "DO", avatarBg: "#E65100", insurance: true, badge: "Pro" },
    { id: 6, name: "Grace Wambui", skill: "Home Tutor – Math/Sci", rating: 4.9, reviews: 89, location: "Langata", price: 600, verified: true, online: true, jobs: 87, avatar: "GW", avatarBg: "#00695C", insurance: false, badge: "Pro" },
    { id: 7, name: "Ali Salim", skill: "Auto Mechanic", rating: 4.8, reviews: 134, location: "Industrial Area", price: 1200, verified: true, online: true, jobs: 178, avatar: "AS", avatarBg: "#37474F", insurance: true, badge: "Pro" },
    { id: 8, name: "Esther Kamau", skill: "Caregiver & Nanny", rating: 5.0, reviews: 67, location: "Karen", price: 800, verified: true, online: false, jobs: 54, avatar: "EK", avatarBg: "#880E4F", insurance: true, badge: "Verified" },
    { id: 9, name: "Raymond Otieno", skill: "Pest Control Expert", rating: 4.6, reviews: 112, location: "Embakasi", price: 3500, verified: true, online: true, jobs: 201, avatar: "RO", avatarBg: "#1B5E20", insurance: true, badge: "Pro" },
];

const categories = ["All", "Plumbing", "Electrical", "Painting", "Cleaning", "Carpentry", "Tutoring", "Mechanics", "Caregiving", "Pest Control"];

export default function BrowsePage() {
    const [selectedCat, setSelectedCat] = useState("All");
    const [priceFilter, setPriceFilter] = useState("All");
    const [insuranceOnly, setInsuranceOnly] = useState(false);
    const [onlineOnly, setOnlineOnly] = useState(false);
    const [sortBy, setSortBy] = useState("rating");

    const filtered = fundis.filter(f => {
        if (selectedCat !== "All" && f.skill.toLowerCase().indexOf(selectedCat.toLowerCase()) === -1) return false;
        if (insuranceOnly && !f.insurance) return false;
        if (onlineOnly && !f.online) return false;
        return true;
    }).sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "price_low") return a.price - b.price;
        if (sortBy === "price_high") return b.price - a.price;
        return b.reviews - a.reviews;
    });

    return (
        <div style={{ minHeight: "100vh" }}>
            <Header />

            {/* Page Header */}
            <section style={{ background: "linear-gradient(135deg, #003320, #005A2C)", padding: "40px 0 0" }}>
                <div className="container">
                    <div style={{ marginBottom: 24 }}>
                        <h1 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "clamp(1.5rem,4vw,2.2rem)", color: "white", marginBottom: 8 }}>
                            Find a Verified Fundi
                        </h1>
                        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem" }}>
                            {filtered.length} fundis available in Nairobi right now
                        </p>
                    </div>

                    {/* Category tabs */}
                    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 0 }}>
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setSelectedCat(cat)} style={{
                                padding: "8px 20px", borderRadius: "8px 8px 0 0", border: "none",
                                fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", whiteSpace: "nowrap",
                                background: selectedCat === cat ? "var(--white)" : "rgba(255,255,255,0.1)",
                                color: selectedCat === cat ? "var(--green)" : "rgba(255,255,255,0.8)",
                                transition: "all 0.2s",
                            }}>{cat}</button>
                        ))}
                    </div>
                </div>
            </section>

            <div className="container" style={{ padding: "32px 20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24, alignItems: "start" }}>

                    {/* Filters sidebar */}
                    <aside className="hide-mobile" style={{
                        background: "var(--white)", borderRadius: 16, padding: "24px",
                        boxShadow: "var(--shadow)", position: "sticky", top: 20, height: "fit-content",
                    }}>
                        <h3 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 24, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
                            🔧 Filters
                        </h3>

                        {/* Sort */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ fontWeight: 600, fontSize: "0.85rem", display: "block", marginBottom: 10 }}>Sort By</label>
                            {[["rating", "⭐ Top Rated"], ["price_low", "💰 Price: Low→High"], ["price_high", "💰 Price: High→Low"], ["reviews", "💬 Most Reviews"]].map(([val, label]) => (
                                <label key={val} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: "0.88rem" }}>
                                    <input type="radio" name="sort" checked={sortBy === val} onChange={() => setSortBy(val)} style={{ accentColor: "var(--green)" }} />
                                    {label}
                                </label>
                            ))}
                        </div>

                        {/* Toggles */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ fontWeight: 600, fontSize: "0.85rem", display: "block", marginBottom: 10 }}>Quick Filters</label>
                            {(
                                [
                                    { val: insuranceOnly, setter: setInsuranceOnly, label: "🛡️ Insurance Ready Only" },
                                    { val: onlineOnly, setter: setOnlineOnly, label: "🟢 Online Now Only" },
                                ] as const
                            ).map(({ val, setter, label }, i) => (
                                <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, cursor: "pointer" }}>
                                    <div onClick={() => setter(!val)} style={{
                                        width: 44, height: 24, borderRadius: 12,
                                        background: val ? "var(--green)" : "#BDBDBD",
                                        position: "relative", cursor: "pointer", transition: "all 0.2s",
                                    }}>
                                        <div style={{
                                            position: "absolute", width: 18, height: 18, borderRadius: "50%", background: "white",
                                            top: 3, left: val ? 23 : 3, transition: "all 0.2s",
                                        }} />
                                    </div>
                                    <span style={{ fontSize: "0.85rem" }}>{label}</span>
                                </label>
                            ))}
                        </div>

                        {/* Price range */}
                        <div>
                            <label style={{ fontWeight: 600, fontSize: "0.85rem", display: "block", marginBottom: 10 }}>Budget (per job)</label>
                            {["All", "Under KSh 2,000", "KSh 2,000–5,000", "KSh 5,000–15,000", "KSh 15,000+"].map(p => (
                                <label key={p} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: "0.85rem" }}>
                                    <input type="radio" name="price" checked={priceFilter === p} onChange={() => setPriceFilter(p)} style={{ accentColor: "var(--green)" }} />
                                    {p}
                                </label>
                            ))}
                        </div>
                    </aside>

                    {/* Results */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                                Showing <strong>{filtered.length}</strong> fundis
                            </p>
                            <Link href="/post-job">
                                <Button variant="primary" size="sm">
                                    + Post Your Job
                                </Button>
                            </Link>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                            {filtered.map(fundi => (
                                <FundiCard
                                    key={fundi.id}
                                    id={String(fundi.id)}
                                    name={fundi.name}
                                    skill={fundi.skill}
                                    location={fundi.location}
                                    price={fundi.price}
                                    verified={fundi.verified}
                                    online={fundi.online}
                                    rating={fundi.rating}
                                    ratingCount={fundi.reviews}
                                    photo={undefined}
                                    onClick={() => window.location.href = `/pro/${fundi.id}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import Button from "../components/ui/Button";
import StatusPill from "../components/ui/StatusPill";
import RatingStars from "../components/ui/RatingStars";
import Modal from "../components/ui/Modal";
import BidsList from "../components/BidsList";
import { api } from "../lib/api";

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  status: string;
  created_at: string;
  professional?: {
    id: string;
    full_name: string;
  };
}

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  scheduled: { bg: "#E3F2FD", color: "#1565C0", label: "📅 Scheduled" },
  in_progress: { bg: "#FFF8E1", color: "#F57F17", label: "⚡ In Progress" },
  awaiting_approval: { bg: "#FFF3E0", color: "#E65100", label: "⏳ Awaiting Approval" },
  completed: { bg: "#E8F5E9", color: "#2E7D32", label: "✅ Completed" },
};

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  
  const [tab, setTab] = useState("active");
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push("/auth");
      return;
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !user) return;
      
      try {
        setLoading(true);
        const token = await getToken();

        if (!token) {
          router.push("/auth");
          return;
        }

        // Fetch user's jobs from Supabase via backend
        const jobsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!jobsResponse.ok) {
          throw new Error("Failed to load jobs");
        }

        const jobsData = await jobsResponse.json();
        setJobs(jobsData.data || []);

        // Fetch user profile from backend
        const profileResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserProfile(profileData.user);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, user, getToken, router]);

  const activeJobs = jobs.filter((j) => !["completed", "cancelled"].includes(j.status));
  const pastJobs = jobs.filter((j) => j.status === "completed");

  if (!isLoaded || loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Header />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>⏳</div>
          <p style={{ color: "var(--text-secondary)" }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <Header />
        <div className="container" style={{ padding: "32px 20px", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>❌</div>
          <h2 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 8 }}>Error Loading Dashboard</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Header />

      <div className="container" style={{ padding: "32px 20px 60px" }}>
        {/* Welcome banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #003320, #00C853)",
            borderRadius: 20,
            padding: "28px 32px",
            marginBottom: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", marginBottom: 4 }}>Welcome back 👋</div>
            <h1 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.6rem", color: "white", marginBottom: 6 }}>
              {userProfile?.full_name || user?.fullName || "User"}
            </h1>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>📍 {userProfile?.location || "Kenya"} • Member since {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : "2026"}</div>
          </div>
          <Link href="/post-job" style={{ textDecoration: "none" }}>
            <Button variant="primary" style={{ background: "white", color: "var(--green)" }}>
              + Post New Job
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total Jobs Posted", value: jobs.length.toString(), icon: "📋", color: "#E3F2FD", text: "#1565C0" },
            { label: "Jobs Completed", value: pastJobs.length.toString(), icon: "✅", color: "#E8F5E9", text: "#2E7D32" },
            { label: "Total Spent", value: `KSh ${jobs.reduce((sum, j) => sum + j.budget, 0).toLocaleString()}`, icon: "💰", color: "#FFF3E0", text: "#E65100" },
            { label: "Active Jobs", value: activeJobs.length.toString(), icon: "⚡", color: "#FFF8E1", text: "#F57F17" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: stat.color, borderRadius: 16, padding: "20px", border: `1px solid ${stat.text}22` }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 4 }}>{stat.icon}</div>
              <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.4rem", color: stat.text }}>{stat.value}</div>
              <div style={{ fontSize: "0.8rem", color: stat.text, opacity: 0.7 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", marginBottom: 24 }}>
          {[
            ["active", "⚡ Active Jobs"],
            ["past", "✅ Past Jobs"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                padding: "12px 20px",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.88rem",
                color: tab === key ? "var(--green)" : "var(--text-secondary)",
                borderBottom: tab === key ? "3px solid var(--green)" : "3px solid transparent",
                transition: "all 0.2s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Active Jobs */}
        {tab === "active" && (
          <div style={{ display: "grid", gap: 16 }}>
            {activeJobs.length === 0 ? (
              <div className="card" style={{ padding: "60px 24px", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>📭</div>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 8 }}>No active jobs</h3>
                <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>You don't have any active jobs yet. Post one to get started!</p>
                <Link href="/post-job">
                  <Button variant="primary" size="md">
                    + Post New Job
                  </Button>
                </Link>
              </div>
            ) : (
              activeJobs.map((job) => (
                <div key={job.id}>
                  <div className="card" style={{ padding: "24px", overflow: "hidden" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                      <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flex: 1 }}>
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            background: "#1565C0",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            flexShrink: 0,
                            fontSize: "0.8rem",
                          }}
                        >
                          {job.professional?.full_name?.substring(0, 2).toUpperCase() || "JOB"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1rem", marginBottom: 4 }}>{job.title}</h3>
                          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                            {job.professional?.full_name || "Waiting for bids"} ({job.category}) • {new Date(job.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--green)" }}>KSh {job.budget.toLocaleString()}</span>
                        <StatusPill type="pending" label={statusColors[job.status]?.label || job.status} />
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                      {job.status === "awaiting_approval" && (
                        <Button variant="primary" size="md" onClick={() => setShowReleaseModal(true)}>
                          ✅ Approve & Release Payment
                        </Button>
                      )}
                      <Button variant="secondary" size="sm">
                        📞 Contact Professional
                      </Button>
                      <Link href="/dispute">
                        <Button variant="danger" size="sm">
                          ⚠️ Raise Dispute
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Past Jobs */}
        {tab === "past" && (
          <div style={{ display: "grid", gap: 12 }}>
            {pastJobs.length === 0 ? (
              <div className="card" style={{ padding: "60px 24px", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>📚</div>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 8 }}>No completed jobs yet</h3>
                <p style={{ color: "var(--text-secondary)" }}>Your completed jobs will appear here.</p>
              </div>
            ) : (
              pastJobs.map((job) => (
                <div key={job.id} className="card" style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h3 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: "0.95rem", marginBottom: 4 }}>{job.title}</h3>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                      {job.professional?.full_name || "Professional"} • {new Date(job.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--green)" }}>KSh {job.budget.toLocaleString()}</span>
                    <StatusPill type="success" label="✅ Completed" />
                    <Button variant="primary" size="sm">
                      Rebook
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Release Payment Modal */}
      <Modal isOpen={showReleaseModal} onClose={() => setShowReleaseModal(false)} title="Release Payment">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>💰</div>
          <h2 style={{ fontFamily: "Poppins", fontWeight: 700, marginBottom: 8 }}>Release Payment?</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>This confirms the job was done satisfactorily.</p>
        </div>
        <div style={{ background: "var(--green-light)", borderRadius: 10, padding: "14px", marginBottom: 20, fontSize: "0.85rem", color: "var(--green-dark)" }}>
          ✅ By releasing, you confirm: job completed, quality acceptable, photos verified.
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Button variant="secondary" size="md" onClick={() => setShowReleaseModal(false)} fullWidth>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={() => setShowReleaseModal(false)} fullWidth>
            ✅ Release Payment
          </Button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}

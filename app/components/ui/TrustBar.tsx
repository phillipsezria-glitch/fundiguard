export default function TrustBar() {
  const items = [
    { icon: "🔒", label: "M-Pesa Escrow" },
    { icon: "🛡️", label: "Job Insurance" },
    { icon: "✅", label: "DCI Verified" },
    { icon: "⏱", label: "48hr Disputes" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "20px",
        padding: "24px",
        background: "linear-gradient(135deg, var(--green-light) 0%, var(--orange-light) 100%)",
        borderRadius: "var(--radius)",
        marginBottom: "32px",
      }}
    >
      {items.map((item, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{item.icon}</div>
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--text)",
            }}
          >
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}

interface ServiceCategoryCardProps {
  icon: string;
  name: string;
  count: number;
  onClick?: () => void;
}

export default function ServiceCategoryCard({
  icon,
  name,
  count,
  onClick,
}: ServiceCategoryCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "20px",
        background: "white",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        boxShadow: "var(--shadow)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-lg)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow)";
      }}
    >
      <div style={{ fontSize: "2.5rem" }}>{icon}</div>
      <div>
        <h3 style={{ fontFamily: "Poppins", fontWeight: 600, margin: "0 0 6px 0" }}>
          {name}
        </h3>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          {count}+ fundis
        </p>
      </div>
    </div>
  );
}

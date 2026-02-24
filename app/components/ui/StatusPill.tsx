interface StatusPillProps {
  type: "verified" | "online" | "urgent" | "success" | "pending";
  label: string;
  icon?: string;
}

const statusConfig = {
  verified: { bg: "var(--green-light)", color: "var(--green-dark)", icon: "✅" },
  online: { bg: "#E3F2FD", color: "#1976D2", icon: "🟢" },
  urgent: { bg: "var(--orange-light)", color: "var(--orange-dark)", icon: "⚡" },
  success: { bg: "#E8F5E9", color: "#2E7D32", icon: "✨" },
  pending: { bg: "#F3E5F5", color: "#6A1B9A", icon: "⏳" },
};

export default function StatusPill({ type, label, icon }: StatusPillProps) {
  const config = statusConfig[type];
  const displayIcon = icon || config.icon;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        background: config.bg,
        color: config.color,
        borderRadius: "var(--radius)",
        fontSize: "0.8rem",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {displayIcon} {label}
    </span>
  );
}

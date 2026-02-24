interface RatingStarsProps {
  score: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (score: number) => void;
}

export default function RatingStars({
  score,
  count,
  size = "md",
  interactive = false,
  onRate,
}: RatingStarsProps) {
  const sizeMap = { sm: 16, md: 20, lg: 28 };
  const starSize = sizeMap[size];

  const roundedScore = Math.round(score * 10) / 10;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ display: "flex", gap: 4 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => interactive && onRate?.(star)}
            style={{
              fontSize: starSize,
              cursor: interactive ? "pointer" : "default",
              opacity: star <= roundedScore ? 1 : 0.3,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => {
              if (interactive) {
                (e.currentTarget as HTMLSpanElement).style.transform = "scale(1.2)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLSpanElement).style.transform = "scale(1)";
            }}
          >
            ⭐
          </span>
        ))}
      </div>
      <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text)" }}>
        {roundedScore}
        {count ? ` (${count})` : ""}
      </span>
    </div>
  );
}

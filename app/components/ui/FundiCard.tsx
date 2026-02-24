import RatingStars from "./RatingStars";
import StatusPill from "./StatusPill";
import Button from "./Button";

interface FundiCardProps {
  id: string;
  name: string;
  skill: string;
  photo?: string;
  verified?: boolean;
  rating?: number;
  ratingCount?: number;
  location: string;
  price: number;
  online?: boolean;
  onClick?: () => void;
}

export default function FundiCard({
  id,
  name,
  skill,
  photo,
  verified = false,
  rating = 4.5,
  ratingCount = 0,
  location,
  price,
  online = false,
  onClick,
}: FundiCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "white",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        boxShadow: "var(--shadow)",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-lg)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow)";
      }}
    >
      {/* Photo */}
      <div
        style={{
          width: "100%",
          height: "180px",
          background: photo ? `url(${photo})` : "linear-gradient(135deg, var(--green) 0%, var(--orange) 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {verified && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "var(--green)",
              color: "white",
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              fontWeight: 700,
            }}
          >
            ✓
          </div>
        )}
        {online && (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
            }}
          >
            <StatusPill type="online" label="Online" icon="🟢" />
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "16px" }}>
        <div style={{ marginBottom: 12 }}>
          <h3
            style={{
              fontFamily: "Poppins",
              fontWeight: 600,
              margin: "0 0 4px 0",
              fontSize: "1rem",
            }}
          >
            {name}
          </h3>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            {skill}
          </p>
        </div>

        {/* Rating */}
        <div style={{ marginBottom: 12 }}>
          <RatingStars score={rating} count={ratingCount} size="sm" />
        </div>

        {/* Location */}
        <p style={{ margin: "0 0 12px 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          📍 {location}
        </p>

        {/* Price & CTA */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 12,
            borderTop: "1px solid var(--border)",
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              From
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--green)",
              }}
            >
              KSh {price.toLocaleString()}
            </p>
          </div>
          <Button variant="primary" size="sm">
            Book
          </Button>
        </div>
      </div>
    </div>
  );
}

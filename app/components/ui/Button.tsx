import type { ReactNode } from "react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  children,
  onClick,
  className = "",
  style,
  type = "button",
  fullWidth = false,
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    fontFamily: "Poppins",
    fontWeight: 600,
    borderRadius: "var(--radius)",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    width: fullWidth ? "100%" : "auto",
  };

  const sizeStyles = {
    sm: { padding: "8px 16px", fontSize: "0.875rem" },
    md: { padding: "12px 24px", fontSize: "1rem" },
    lg: { padding: "16px 32px", fontSize: "1.125rem" },
  };

  const variantStyles = {
    primary: {
      background: disabled ? "#BDBDBD" : "var(--green)",
      color: "white",
      ":hover": { background: disabled ? "#BDBDBD" : "var(--green-dark)" },
    },
    secondary: {
      background: "transparent",
      color: "var(--orange)",
      border: "2px solid var(--orange)",
      ":hover": { background: "var(--orange-light)" },
    },
    danger: {
      background: disabled ? "#BDBDBD" : "var(--danger)",
      color: "white",
      ":hover": { background: disabled ? "#BDBDBD" : "#E53935" },
    },
  };

  const finalStyle = {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={finalStyle}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
      }}
    >
      {children}
    </button>
  );
}

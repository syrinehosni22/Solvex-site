import { useState } from "react";

// ─── PageHeader ────────────────────────────────────────────────────────────────
export function PageHeader({ icon, title, subtitle, actions }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      gap: 12, marginBottom: 24, flexWrap: "wrap",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        {icon && (
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: "rgba(10,22,132,0.15)",
            border: "1px solid rgba(10,22,132,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, flexShrink: 0,
          }}>{icon}</div>
        )}
        <div style={{ minWidth: 0 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2 }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#666", fontFamily: "'DM Sans', sans-serif", whiteSpace: "normal" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {actions}
        </div>
      )}
    </div>
  );
}

// ─── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 18, color = "#fff" }) {
  return (
    <span style={{
      display: "inline-block",
      width: size, height: size,
      border: `2px solid rgba(255,255,255,0.2)`,
      borderTopColor: color,
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
      flexShrink: 0,
    }} />
  );
}

// ─── Button ────────────────────────────────────────────────────────────────────
export function Button({ children, variant = "primary", onClick, disabled, type = "button", style = {}, fullWidth }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    padding: "9px 14px", borderRadius: 10, border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 800, fontSize: 12,
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.18s",
    opacity: disabled ? 0.5 : 1,
    whiteSpace: "nowrap",
    width: fullWidth ? "100%" : undefined,
    ...style,
  };
  const variants = {
    primary: { background: "var(--color-primary, #0A1684)", color: "#fff" },
    ghost:   { background: "rgba(255,255,255,0.07)", color: "#cfd2da", border: "1px solid rgba(255,255,255,0.1)" },
    danger:  { background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" },
    outline: { background: "transparent", color: "var(--color-primary, #0A1684)", border: "1px solid rgba(10,22,132,0.4)" },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  );
}

// ─── Field ─────────────────────────────────────────────────────────────────────
export function Field({ label, hint, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 800, color: "#8e95a3", letterSpacing: 0.8, textTransform: "uppercase" }}>
        {label}
        {hint && <span style={{ color: "#555", fontWeight: 400, textTransform: "none", letterSpacing: 0, marginLeft: 6 }}>— {hint}</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.28)",
  color: "#fff",
  outline: "none",
  fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  resize: "vertical",
  boxSizing: "border-box",
  transition: "border 0.15s",
};

// ─── Input ─────────────────────────────────────────────────────────────────────
export function Input({ value, onChange, type = "text", placeholder, onFocus, onBlur, autoComplete, error }) {
  const [focused, setFocused] = useState(false);
  const isDateLike = ["date", "time", "datetime-local", "month", "week"].includes(type);
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onFocus={() => { setFocused(true); onFocus?.(); }}
      onBlur={() => { setFocused(false); onBlur?.(); }}
      style={{
        ...inputStyle,
        ...(isDateLike ? { colorScheme: "dark" } : {}),
        border: focused
          ? "1px solid rgba(10,22,132,0.6)"
          : error
            ? "1px solid rgba(239,68,68,0.6)"
            : inputStyle.border,
      }}
    />
  );
}

// ─── Textarea ──────────────────────────────────────────────────────────────────
export function Textarea({ value, onChange, placeholder, rows = 4, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputStyle,
        border: focused
          ? "1px solid rgba(10,22,132,0.6)"
          : error
            ? "1px solid rgba(239,68,68,0.6)"
            : inputStyle.border,
      }}
    />
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.09)",
      borderRadius: 16,
      padding: "18px 16px",
      minWidth: 0,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── SectionHeading ────────────────────────────────────────────────────────────
export function SectionHeading({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: "#fff" }}>{title}</h3>
      {subtitle && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#666" }}>{subtitle}</p>}
    </div>
  );
}

// ─── Alert ─────────────────────────────────────────────────────────────────────
export function Alert({ type = "error", children }) {
  const colors = {
    error:   { bg: "rgba(239,68,68,0.10)",  border: "rgba(239,68,68,0.25)",  text: "#f87171" },
    success: { bg: "rgba(34,197,94,0.10)",  border: "rgba(34,197,94,0.30)",  text: "#4ade80" },
    info:    { bg: "rgba(10,22,132,0.10)",  border: "rgba(10,22,132,0.30)",  text: "#818cf8" },
  };
  const c = colors[type] || colors.error;
  const icons = { error: "⚠️", success: "✓", info: "ℹ️" };
  return (
    <div style={{
      padding: "10px 14px", borderRadius: 10,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      fontSize: 13, fontWeight: 600,
      display: "flex", alignItems: "flex-start", gap: 8,
      marginBottom: 14,
    }}>
      <span style={{ flexShrink: 0 }}>{icons[type]}</span>
      <span>{children}</span>
    </div>
  );
}

// ─── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ children, color = "var(--color-primary, #0A1684)" }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px",
      borderRadius: 5, fontSize: 11, fontWeight: 700,
      background: `${color}22`, color,
      border: `1px solid ${color}44`,
      letterSpacing: 0.3,
      maxWidth: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

// ─── Divider ───────────────────────────────────────────────────────────────────
export function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
      {label && <span style={{ color: "#444", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
    </div>
  );
}

// ─── ListItem ──────────────────────────────────────────────────────────────────
export function ListItem({ children, onClick, active }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "11px 12px",
        borderRadius: 12,
        border: active ? "1px solid rgba(10,22,132,0.35)" : "1px solid rgba(255,255,255,0.07)",
        background: active ? "rgba(10,22,132,0.08)" : "rgba(0,0,0,0.18)",
        display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center",
        marginBottom: 8,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.15s",
        minWidth: 0,
      }}
    >
      {children}
    </div>
  );
}

// ─── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ icon = "📭", title, message }) {
  return (
    <div style={{ textAlign: "center", padding: "36px 16px", color: "#555" }}>
      <div style={{ fontSize: 34, marginBottom: 12 }}>{icon}</div>
      {title && <div style={{ fontWeight: 800, fontSize: 14, color: "#777", marginBottom: 6 }}>{title}</div>}
      {message && <div style={{ fontSize: 12 }}>{message}</div>}
    </div>
  );
}
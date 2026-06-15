export function PageHeader({ icon, title, subtitle, actions }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      gap: 16, marginBottom: 28, flexWrap: "wrap",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {icon && (
          <div style={{
            width: 46, height: 46, borderRadius: 12,
            background: "rgba(245,91,31,0.12)",
            border: "1px solid rgba(245,91,31,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, flexShrink: 0,
          }}>{icon}</div>
        )}
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ margin: "3px 0 0", fontSize: 13, color: "#666", fontFamily: "'DM Sans', sans-serif" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          {actions}
        </div>
      )}
    </div>
  );
}

import { useIntersect } from "./hooks";

export default function ServiceRow({ service, index, t, onContact, id }) {
  const [ref, visible] = useIntersect();
  const isEven = index % 2 === 0;
  const accent = service.color || "var(--color-primary, #0A1684)";
  const number = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={ref}
      id={id}
      className="service-row"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 60,
        alignItems: "start",
        marginBottom: 90,
        scrollMarginTop: 130,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(40px)",
        transition: "all 0.8s ease",
      }}
    >
      {/* Image */}
      <div style={{ order: isEven ? 1 : 2, position: "relative" }}>
        <div
          style={{
            borderRadius: 20, overflow: "hidden", position: "relative",
            height: 480,
            background: service.image
              ? `url(${service.image}) center/cover no-repeat`
              : "linear-gradient(135deg,#1a1a25,#2a2a35)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {!service.image && (
            <span style={{ fontSize: 96, opacity: 0.9 }}>{service.icon}</span>
          )}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(18,19,21,0.15), rgba(18,19,21,0.35))",
          }} />
        </div>
        <div style={{
          position: "absolute", top: -22, left: isEven ? -22 : "auto", right: isEven ? "auto" : -22,
          background: accent, borderRadius: 14, width: 76, height: 76,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 12px 40px ${accent}55`,
        }}>
          <span style={{ color: "#fff", fontFamily: "'DM Sans',sans-serif", fontWeight: 900, fontSize: 24 }}>{number}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ order: isEven ? 2 : 1 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 14,
          color: accent, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700,
          letterSpacing: 3, textTransform: "uppercase",
        }}>
          <span style={{ fontSize: 28 }}>{service.icon}</span>
          {t("services.serviceLabel")} {number}
        </div>
        <h3 style={{
          fontFamily: "'DM Sans',sans-serif", fontWeight: 900, fontSize: "clamp(22px,2.4vw,30px)",
          color: "var(--color-dark, #121315)", marginBottom: 16, lineHeight: 1.2,
        }}>{service.title}</h3>
        <p style={{
          color: "#666", fontFamily: "'DM Sans',sans-serif", fontSize: 15,
          lineHeight: 1.8, marginBottom: 24,
        }}>{service.desc}</p>

        {Array.isArray(service.features) && service.features.length > 0 && (
          <div className="service-features-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
            {service.features.map((f, fi) => (
              <div key={fi} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", background: accent,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1,
                }}>
                  <span style={{ color: "#fff", fontSize: 12 }}>✓</span>
                </div>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14, color: "var(--color-dark, #121315)" }}>{f}</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onContact}
          style={{
            background: "transparent", color: "var(--color-dark, #121315)", border: "2px solid var(--color-dark, #121315)",
            padding: "13px 30px", borderRadius: 4, fontWeight: 700, cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif", fontSize: 14, display: "inline-flex",
            alignItems: "center", gap: 10, transition: "all 0.3s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = accent; e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--color-dark, #121315)"; e.currentTarget.style.color = "var(--color-dark, #121315)"; }}
        >
          {t("services.contactCta")} <span>→</span>
        </button>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useIntersect } from "./hooks";
import { useApiList } from "./apiHooks";
import { loc } from "./helpers";
import SectionTitle from "./SectionTitle";

function truncate(text, max = 110) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trim() + "…" : text;
}

function IconDisplay({ icon, size = 30 }) {
  if (icon && (icon.startsWith("/uploads/") || icon.startsWith("http"))) {
    return <img src={icon} alt="" style={{ width: size, height: size, objectFit: "contain", display: "block" }} />;
  }
  return <span style={{ fontSize: size * 0.9, lineHeight: 1 }}>{icon || "⚙️"}</span>;
}

export default function ServicesSection() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const apiServices = useApiList("/api/services", null);
  const [ref, visible] = useIntersect();
  const [hovered, setHovered] = useState(null);

  const services = apiServices
    ? apiServices.map(s => ({ ...s, title: loc(s, "title", lang), desc: loc(s, "desc", lang) }))
    : t("services.items", { returnObjects: true });

  const count = services.length || 1;
  let desktopCols;
  if (count <= 1) desktopCols = 1;
  else if (count === 2) desktopCols = 2;
  else if (count === 4) desktopCols = 2;
  else desktopCols = 3;
  const tabletCols = count <= 1 ? 1 : 2;

  return (
    <section id="services" ref={ref} className="section-padding" style={{ padding: "100px 0", background: "#f8f8f8", overflow: "hidden", position: "relative" }}>
      <div className="services-deco-circle" style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(245,91,31,0.05)" }} />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)", transition: "all 0.7s" }}>
          <SectionTitle tag={t("services.tag")} title={t("services.title")} center />
          <p className="services-subtitle" style={{ textAlign: "center", color: "#666", fontFamily: "'DM Sans',sans-serif", fontSize: 16, lineHeight: 1.8, maxWidth: 720, margin: "-16px auto 0" }}>
            {t("services.subtitle")}
          </p>
        </div>
        <style>{`
          .services-grid { grid-template-columns: repeat(${desktopCols}, 1fr); }
          @media (max-width: 900px) { .services-grid { grid-template-columns: repeat(${tabletCols}, 1fr) !important; } }
          @media (max-width: 560px) {
            .services-grid { grid-template-columns: 1fr !important; gap: 16px !important; margin-top: 36px !important; }
            .service-card { padding: 24px 20px !important; }
            .services-deco-circle { width: 200px !important; height: 200px !important; top: -40px !important; right: -40px !important; }
            .services-subtitle { font-size: 14px !important; padding: 0 8px; }
          }
          @media (max-width: 380px) {
            .service-card { padding: 20px 16px !important; }
          }
        `}</style>
        <div className="services-grid" style={{ display: "grid", gap: 24, marginTop: 56 }}>
          {services.map((s, i) => (
            <div key={i} className="service-card"
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              style={{
                background: "#fff", borderRadius: 16, padding: "36px 32px",
                boxShadow: hovered === i ? "0 20px 60px rgba(0,0,0,0.1)" : "0 4px 24px rgba(0,0,0,0.05)",
                transform: visible ? (hovered === i ? "translateY(-6px)" : "translateY(0)") : "translateY(40px)",
                opacity: visible ? 1 : 0, transitionDelay: `${i * 0.08 + 0.1}s`,
                transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                minWidth: 0, overflow: "hidden",
              }}
            >
              <div style={{ marginBottom: 24 }}>
                <IconDisplay icon={s.icon} size={64} />
              </div>
              <Link to={`/services#service-${i + 1}`} style={{ textDecoration: "none" }}>
                <h3 style={{ fontSize: 19, fontWeight: 800, marginBottom: 12, color: "var(--color-dark, #121315)", fontFamily: "'DM Sans',sans-serif", wordBreak: "break-word" }}>{s.title}</h3>
              </Link>
              <p style={{ color: "#666", fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.7, marginBottom: 20, wordBreak: "break-word" }}>{truncate(s.desc)}</p>
              <Link to={`/services#service-${i + 1}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--color-primary, #0A1684)", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                {t("services.learnMore")} <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
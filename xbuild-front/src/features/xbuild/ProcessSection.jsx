import { useTranslation } from "react-i18next";
import { useIntersect } from "./hooks";
import { useApiList } from "./apiHooks";
import { loc } from "./helpers";
import SectionTitle from "./SectionTitle";

export default function ProcessSection() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [ref, visible] = useIntersect();

  const apiSteps = useApiList("/api/process", null);
  const staticSteps = t("process.items", { returnObjects: true });

  const steps = apiSteps && apiSteps.length > 0
    ? apiSteps.map(s => ({ ...s, title: loc(s, "title", lang), desc: loc(s, "desc", lang) }))
    : staticSteps;

  return (
    <section id="process" ref={ref} className="section-padding" style={{ padding: "100px 0", background: "#f8f8f8", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -100, left: -100, width: 320, height: 320, borderRadius: "50%", background: "rgba(245,91,31,0.05)" }} />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px" }}>

        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 70px", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)", transition: "all 0.7s" }}>
          <SectionTitle tag={t("process.tag")} title={t("process.title")} center />
          <p style={{ color: "#666", fontFamily: "'DM Sans',sans-serif", fontSize: 16, lineHeight: 1.8, marginTop: -16 }}>
            {t("process.description")}
          </p>
        </div>

        <div className="process-steps-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 28, position: "relative" }}>
          {/* connecting line (desktop only) */}
          <div className="process-line" style={{ position: "absolute", top: 36, left: "10%", right: "10%", height: 2, background: "repeating-linear-gradient(to right, rgba(245,91,31,0.3) 0 10px, transparent 10px 20px)", zIndex: 0 }} />

          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                position: "relative", zIndex: 1, background: "#fff", borderRadius: 16, padding: "32px 24px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)",
                transition: `all 0.6s ${i * 0.12}s`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14, background: "rgba(245,91,31,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
                }}>{step.icon || "⚙️"}</div>
                <span style={{
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 900, fontSize: 36,
                  color: "rgba(18,19,21,0.08)", lineHeight: 1,
                }}>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 18, color: "var(--color-dark, #121315)", marginBottom: 10 }}>{step.title}</h3>
              <p style={{ color: "#666", fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.7 }}>{step.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
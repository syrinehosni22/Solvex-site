import { useTranslation } from "react-i18next";
import { useIntersect } from "./hooks";
import { loc } from "./helpers";
import SectionTitle from "./SectionTitle";

function IconDisplay({ icon, size = 24 }) {
  if (icon && (icon.startsWith("/uploads/") || icon.startsWith("http"))) {
    return <img src={icon} alt="" style={{ width: size, height: size, objectFit: "contain", display: "block" }} />;
  }
  return <span style={{ fontSize: size * 0.9, lineHeight: 1 }}>{icon || "⭐"}</span>;
}

function scrollTo(id) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function AboutSection({ info }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [ref, visible] = useIntersect();
  const [whyRef, whyVisible] = useIntersect();

  const highlights = (info.aboutHighlights && info.aboutHighlights.length > 0)
    ? info.aboutHighlights.map(h => ({ icon: h.icon, title: loc(h, "title", lang), subtitle: loc(h, "subtitle", lang) }))
    : t("about.highlights", { returnObjects: true });

  const whyItems = (info.whyItems && info.whyItems.length > 0)
    ? info.whyItems.map(it => ({ icon: it.icon, title: loc(it, "title", lang), desc: loc(it, "desc", lang) }))
    : t("whyChooseUs.items", { returnObjects: true });

  const aboutTag     = loc(info, "aboutTag",     lang) || t("about.tag");
  const aboutTitle   = loc(info, "aboutTitle",   lang) || t("about.title");
  const awardTitle   = loc(info, "awardTitle",   lang) || t("about.awardTitle");
  const awardSub     = loc(info, "awardSub",     lang) || t("about.awardSub");
  const consultTitle = loc(info, "consultTitle", lang) || t("about.consultTitle");
  const consultCta   = loc(info, "consultCta",   lang) || t("about.consultCta");
  const whyTag       = loc(info, "whyTag",       lang) || t("whyChooseUs.tag");
  const whyTitle     = loc(info, "whyTitle",     lang) || t("whyChooseUs.title");
  const whyDesc      = loc(info, "whyDesc",      lang) || t("whyChooseUs.description");
  const whyImage     = info.whyImage || info.statsImage || "";

  return (
    <>
      {/* ===== À propos ===== */}
      <section id="about" ref={ref} className="section-padding" style={{ padding: "100px 0", background: "#fff", backgroundImage: "radial-gradient(ellipse at 80% 50%, rgba(245,91,31,0.04) 0%, transparent 60%)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px" }}>
          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

            <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(-40px)", transition: "all 0.8s" }}>
              <SectionTitle tag={aboutTag} title={aboutTitle} />
              <p style={{ color: "#666", fontFamily: "'DM Sans',sans-serif", fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
                {loc(info, "about", lang)}
              </p>
              <div className="about-highlights-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 36 }}>
                {highlights.map((h, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(245,91,31,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <IconDisplay icon={h.icon} size={22} />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 16, color: "var(--color-dark, #121315)", marginBottom: 4 }}>{h.title}</h4>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#666" }}>{h.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", marginBottom: 24 }}>
                <button onClick={() => scrollTo("#services")} style={{ background: "var(--color-primary, #0A1684)", color: "#fff", border: "none", padding: "14px 32px", borderRadius: 4, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  {t("about.exploreMore")}
                </button>
                <a href={`tel:${info.phone}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--color-dark, #121315)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📞</div>
                  <div>
                    <p style={{ color: "var(--color-primary, #0A1684)", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{t("about.callLabel")}</p>
                    <h4 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 16, color: "var(--color-dark, #121315)" }}>{info.phone}</h4>
                  </div>
                </a>
              </div>
              <div style={{ background: "rgba(245,91,31,0.06)", border: "1px solid rgba(245,91,31,0.15)", borderRadius: 12, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 15, color: "var(--color-dark, #121315)", margin: 0 }}>{consultTitle}</p>
                <button onClick={() => scrollTo("#contact")} style={{ background: "var(--color-dark, #121315)", color: "#fff", border: "none", padding: "10px 22px", borderRadius: 4, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13, whiteSpace: "nowrap" }}>
                  {consultCta}
                </button>
              </div>
            </div>

            <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(40px)", transition: "all 0.8s 0.2s", position: "relative" }}>
              <div style={{ borderRadius: 16, overflow: "hidden", position: "relative", height: 440, background: "linear-gradient(135deg,var(--color-dark, #121315),#1e2023)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {info.aboutImage
                  ? <img src={info.aboutImage} alt="About" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                  : <div style={{ textAlign: "center" }}><div style={{ fontSize: 80 }}>🏗️</div><p style={{ color: "#666", fontFamily: "'DM Sans',sans-serif", marginTop: 16 }}>{t("about.industrialLabel")}</p></div>
                }
    
              </div>
              <div style={{ position: "absolute", top: -20, left: -20, background: "var(--color-primary, #0A1684)", borderRadius: 12, padding: "16px 20px", boxShadow: "0 12px 40px rgba(245,91,31,0.3)", zIndex: 2 }}>
                <div style={{ color: "#fff", fontFamily: "'DM Sans',sans-serif", fontWeight: 900, fontSize: 32, lineHeight: 1 }}>{info.yearsExperience}</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'DM Sans',sans-serif", fontSize: 12, marginTop: 4 }}>{t("hero.stats.experience")}</div>
              </div>
              
            </div>

          </div>
        </div>
      </section>

      {/* ===== Pourquoi nous choisir ===== */}
      <section id="why-choose-us" ref={whyRef} className="section-padding" style={{ padding: "100px 0", background: "#f8f8f8", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -100, left: -100, width: 360, height: 360, borderRadius: "50%", background: "rgba(245,91,31,0.05)" }} />
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px" }}>
          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

            <div style={{ opacity: whyVisible ? 1 : 0, transform: whyVisible ? "none" : "translateX(-40px)", transition: "all 0.8s", position: "relative" }}>
              <div style={{ borderRadius: 16, overflow: "hidden", position: "relative", height: 420, background: whyImage ? "none" : "linear-gradient(135deg,#1a1a25,#2a2a35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {whyImage
                  ? <img src={whyImage} alt="Why choose us" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                  : <>
                      <div style={{ position: "absolute", inset: 0, opacity: 0.08 }}>
                        <svg width="100%" height="100%"><defs><pattern id="whyGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--color-primary, #0A1684)" strokeWidth="0.5" /></pattern></defs><rect width="100%" height="100%" fill="url(#whyGrid)" /></svg>
                      </div>
                      <div style={{ textAlign: "center" }}><div style={{ fontSize: 80 }}>⚙️</div><p style={{ color: "#666", fontFamily: "'DM Sans',sans-serif", marginTop: 16 }}>{t("whyChooseUs.imageLabel")}</p></div>
                    </>
                }
              </div>
              <div style={{ position: "absolute", top: -20, right: -20, background: "var(--color-dark, #121315)", borderRadius: 12, padding: "16px 20px", boxShadow: "0 12px 40px rgba(0,0,0,0.25)", zIndex: 2 }}>
                <div style={{ color: "var(--color-primary, #0A1684)", fontFamily: "'DM Sans',sans-serif", fontWeight: 900, fontSize: 32, lineHeight: 1 }}>{info.yearsExperience}+</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'DM Sans',sans-serif", fontSize: 12, marginTop: 4 }}>{t("hero.stats.experience")}</div>
              </div>
            </div>

            <div style={{ opacity: whyVisible ? 1 : 0, transform: whyVisible ? "none" : "translateX(40px)", transition: "all 0.8s 0.2s" }}>
              <SectionTitle tag={whyTag} title={whyTitle} />
              <p style={{ color: "#666", fontFamily: "'DM Sans',sans-serif", fontSize: 16, lineHeight: 1.8, marginBottom: 36 }}>{whyDesc}</p>
              {whyItems.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 20, marginBottom: i < whyItems.length - 1 ? 28 : 0 }}>
                  <div style={{ width: 56, height: 56, flexShrink: 0, borderRadius: 12, background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <IconDisplay icon={item.icon} size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 17, color: "var(--color-dark, #121315)", marginBottom: 6 }}>{item.title}</h4>
                    <p style={{ color: "#666", fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
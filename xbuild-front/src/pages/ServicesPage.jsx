import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useInfo, useApiList } from "../features/xbuild/apiHooks";
import { loc } from "../features/xbuild/helpers";
import GlobalStyles from "../features/xbuild/GlobalStyles";
import Navbar from "../features/xbuild/Navbar";
import Footer from "../features/xbuild/Footer";
import BackToTop from "../features/xbuild/BackToTop";
import SectionTitle from "../features/xbuild/SectionTitle";
import ServiceRow from "../features/xbuild/ServicesRow";

export default function ServicesPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const info = useInfo();
  const navigate = useNavigate();
  const location = useLocation();
  const apiServices = useApiList("/api/services", null);

  const services = apiServices
    ? apiServices.map(s => ({
        ...s,
        title: loc(s, "title", lang),
        desc: loc(s, "desc", lang),
        features: s[`features_${lang}`] || s.features || null,
      }))
    : t("services.items", { returnObjects: true });

  const goToContact = () => navigate("/#contact");

  // Scroll to anchored service when arriving via "#service-N"
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 150);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash]);

  return (
    <>
      <GlobalStyles />
      <Navbar active="#services" info={info} />

      {/* Page header */}
      <section style={{ background: "var(--color-dark, #121315)", paddingTop: 160, paddingBottom: 70, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.06 }}>
          <svg width="100%" height="100%"><defs><pattern id="servicesHeaderGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--color-primary, #0A1684)" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#servicesHeaderGrid)"/></svg>
        </div>
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(245,91,31,0.10)" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <h1 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 900, fontSize: "clamp(32px,5vw,52px)", color: "#fff", marginBottom: 14 }}>
            {t("services.title")}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#aaa" }}>
            <Link to="/" style={{ color: "#aaa", textDecoration: "none" }}>{t("nav.home")}</Link>
            <span style={{ color: "var(--color-primary, #0A1684)" }}>›</span>
            <span style={{ color: "var(--color-primary, #0A1684)" }}>{t("nav.services")}</span>
          </div>
        </div>
      </section>

      {/* Services content */}
      <section className="section-padding" style={{ padding: "100px 0", background: "#fff", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(245,91,31,0.05)" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

          {/* Intro */}
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 80px" }}>
            <SectionTitle tag={t("services.tag")} title={t("services.title")} center />
            <p style={{ color: "#666", fontFamily: "'DM Sans',sans-serif", fontSize: 16, lineHeight: 1.8, marginTop: -16 }}>
              {t("services.subtitle")}
            </p>
          </div>

          {/* Rows */}
          {services.map((s, i) => (
            <ServiceRow key={i} service={s} index={i} t={t} onContact={goToContact} id={`service-${i + 1}`} />
          ))}

          {/* CTA banner */}
          <div style={{ background: "linear-gradient(135deg,var(--color-dark, #121315),#1e2023)", borderRadius: 24, padding: "60px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -60, left: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(245,91,31,0.12)" }} />
            <div style={{ position: "absolute", bottom: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(245,91,31,0.08)" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h3 style={{
                fontFamily: "'DM Sans',sans-serif", fontWeight: 900, fontSize: "clamp(24px,3vw,38px)",
                color: "#fff", marginBottom: 16, maxWidth: 640, marginLeft: "auto", marginRight: "auto",
              }}>{t("services.ctaBanner.title")}</h3>
              <p style={{
                color: "#aaa", fontFamily: "'DM Sans',sans-serif", fontSize: 15, lineHeight: 1.8,
                maxWidth: 560, margin: "0 auto 32px",
              }}>{t("services.ctaBanner.desc")}</p>
              <button
                onClick={goToContact}
                style={{
                  background: "var(--color-primary, #0A1684)", color: "#fff", border: "none", padding: "15px 36px",
                  borderRadius: 4, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14, display: "inline-flex", alignItems: "center", gap: 10,
                  transition: "transform 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
              >
                {t("services.ctaBanner.button")} <span>→</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      <Footer info={info} />
      <BackToTop />
    </>
  );
}
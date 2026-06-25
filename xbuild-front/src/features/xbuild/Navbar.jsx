import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_LINKS_KEYS } from "./data";
import { loc } from "./helpers";
import LanguageSwitcher from "../../i18n/LanguageSwitcher";
import Logo from "./Logo";

const STYLE = `
  .nb-topbar { display: flex; }
  .nb-desktop-nav { display: flex; }
  .nb-actions-desktop { display: flex; }
  .nb-hamburger { display: none; }

  @media (max-width: 1000px) {
    .nb-topbar { display: none; }
    .nb-desktop-nav { display: none !important; }
    .nb-actions-desktop { display: none !important; }
    .nb-hamburger { display: flex !important; }
    .navbar-white-panel { width: 70% !important; padding-left: 12px !important; }
    .navbar-accent { width: calc(70% + 10px) !important; }
    .navbar-white-panel button { white-space: nowrap; overflow: hidden; max-width: 100%; }
  }
`;

export default function Navbar({ active, info }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const NAV_LINKS = NAV_LINKS_KEYS.map(l => ({ ...l, label: t(`nav.${l.key}`) }));

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close dropdown on scroll
  useEffect(() => {
    const fn = () => { if (mobileOpen) setMobileOpen(false); };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [mobileOpen]);

  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = (href) => {
    if (location.pathname !== "/") {
      navigate(`/${href}`);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  const phoneHref = info.phone ? `tel:${info.phone.replace(/\s+/g, "")}` : "#";
  const emailHref = info.email ? `mailto:${info.email}` : "#";

  const socials = [
    { label: "f",  key: "socialFacebook", href: info.socialFacebook },
    { label: "𝕏",  key: "socialTwitter",  href: info.socialTwitter  },
    { label: "▶",  key: "socialYoutube",  href: info.socialYoutube  },
    { label: "in", key: "socialLinkedin", href: info.socialLinkedin },
  ].filter(s => info[`${s.key}Active`] !== false);

  const mobileDropdown = mobileOpen ? createPortal(
    <div style={{
      position: "fixed", top: 72, left: 0, right: 0, zIndex: 9995,
      background: "var(--color-dark, #121315)",
      padding: "16px 20px 24px",
      display: "flex", flexDirection: "column", gap: 0,
      borderTop: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
      overflowY: "auto", maxHeight: "calc(100vh - 72px)",
    }}>
      {NAV_LINKS.map(link => (
        <button key={link.key} onClick={() => scrollTo(link.href)} style={{
          background: "none", border: "none", color: "#e8e8ec", textAlign: "left",
          fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14,
          letterSpacing: 1, textTransform: "uppercase", cursor: "pointer",
          padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}>{link.label}</button>
      ))}

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
        {info.phone && (
          <a href={phoneHref} style={{
            display: "flex", alignItems: "center", gap: 8,
            color: "#b0b4c0", fontFamily: "'DM Sans',sans-serif",
            fontSize: 13, fontWeight: 600, textDecoration: "none",
          }}>
            <span>📞</span> {info.phone}
          </a>
        )}
        {info.email && (
          <a href={emailHref} style={{
            display: "flex", alignItems: "center", gap: 8,
            color: "#b0b4c0", fontFamily: "'DM Sans',sans-serif",
            fontSize: 13, fontWeight: 600, textDecoration: "none",
          }}>
            <span>✉️</span> {info.email}
          </a>
        )}
      </div>

      <div style={{ marginTop: 16 }}><LanguageSwitcher dark={true} /></div>

      <a href="/admin" style={{
        marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        color: "#555b6e", fontFamily: "'DM Sans',sans-serif", fontSize: 12,
        fontWeight: 700, textDecoration: "none", letterSpacing: 1, textTransform: "uppercase",
        borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14,
      }}>
        <span style={{ fontSize: 13 }}>🔒</span> {t("sidebar.admin")} ↗
      </a>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <style>{STYLE}</style>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <div style={{
        position: "fixed", top: 0, right: 0, width: 320, height: "100%",
        background: "#fff", zIndex: 9998,
        transform: sidebarOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
        padding: 32, boxShadow: "-4px 0 40px rgba(0,0,0,0.15)", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <Logo info={info} dark={false} size="md" />
          <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#121315" }}>✕</button>
        </div>
        <p style={{ color: "#666", lineHeight: 1.7, marginBottom: 32, fontFamily: "'DM Sans',sans-serif" }}>{loc(info, "footerAbout", lang)}</p>
        <h4 style={{ fontFamily: "'DM Sans',sans-serif", marginBottom: 16, color: "#121315" }}>{t("sidebar.contactInfo")}</h4>
        {[
          { icon: "📍", text: info.address },
          { icon: "✉️", text: info.email },
          { icon: "⏰", text: info.workingHours },
          { icon: "📞", text: info.phone },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ color: "#666", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>{item.text}</span>
          </div>
        ))}
        {socials.length > 0 && (
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            {socials.map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer" style={{ width: 36, height: 36, borderRadius: "50%", background: "#f4f4f4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#121315", textDecoration: "none" }}>{s.label}</a>
            ))}
          </div>
        )}
        <a href="/admin" style={{ marginTop: 24, display: "block", textAlign: "center", color: "#999", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, textDecoration: "none", letterSpacing: 1, textTransform: "uppercase" }}>
          {t("sidebar.admin")} ↗
        </a>
      </div>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9997 }} />}

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: "var(--color-dark, #121315)",
        transition: "box-shadow 0.3s",
        boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.45)" : "none",
      }}>
        {/* ── TOP BAR ── desktop only ───────────────────────────────────────── */}
        <div className="nb-topbar" style={{
          height: 36,
          background: "rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          alignItems: "center", justifyContent: "flex-end",
          paddingRight: 24, gap: 24,
        }}>
          {info.phone && (
            <a href={phoneHref} style={{ color: "#b0b4c0", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "#b0b4c0"}
            >
              <span style={{ fontSize: 11 }}>📞</span> {info.phone}
            </a>
          )}
          {info.email && (
            <a href={emailHref} style={{ color: "#b0b4c0", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "#b0b4c0"}
            >
              <span style={{ fontSize: 11 }}>✉️</span> {info.email}
            </a>
          )}
          <span style={{ width: 1, height: 16, background: "rgba(255,255,255,0.12)" }} />
          <LanguageSwitcher dark={true} />
        </div>

        {/* ── MAIN NAV BAR ─────────────────────────────────────────────────── */}
        <div style={{ position: "relative", height: 72 }}>
          {/* Blue accent */}
          <div className="navbar-accent" style={{
            position: "absolute", top: 0, left: 0, height: 72, width: "calc(26% + 10px)",
            background: "var(--color-primary)",
            clipPath: "polygon(0 0, 100% 0, calc(100% - 70px) 100%, 0 100%)",
            zIndex: 0,
          }} />
          {/* White diagonal logo panel */}
          <div className="navbar-white-panel" style={{
            position: "absolute", top: 0, left: 0, height: 72, width: "22%",
            background: "#fff",
            backgroundImage: "repeating-linear-gradient(135deg, rgba(0,0,0,0.025) 0px, rgba(0,0,0,0.025) 1px, transparent 1px, transparent 14px)",
            clipPath: "polygon(0 0, 100% 0, calc(100% - 70px) 100%, 0 100%)",
            display: "flex", alignItems: "center", paddingLeft: 32,
            overflow: "hidden", zIndex: 1,
          }}>
            <button onClick={() => scrollTo("#home")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0, whiteSpace: "nowrap" }}>
              <Logo info={info} dark={false} size="md" />
            </button>
          </div>

          {/* Desktop nav links — centered */}
          <nav className="nb-desktop-nav" style={{
            position: "absolute", left: 0, right: 0, top: 0, height: 72,
            zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center",
            gap: "clamp(12px, 2vw, 32px)", pointerEvents: "none",
          }}>
            {NAV_LINKS.map(link => (
              <button key={link.key} onClick={() => scrollTo(link.href)} style={{
                pointerEvents: "auto", background: "none", border: "none",
                color: active === link.href ? "var(--color-primary)" : "#e8e8ec",
                fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
                fontSize: "clamp(10px, 1vw, 13px)",
                letterSpacing: "clamp(0.4px, 0.06vw, 1px)",
                textTransform: "uppercase", cursor: "pointer",
                transition: "color 0.2s", padding: "4px 0",
                borderBottom: active === link.href ? "2px solid var(--color-primary)" : "2px solid transparent",
                whiteSpace: "nowrap",
              }}>{link.label}</button>
            ))}
          </nav>

          {/* Right-side actions */}
          <div style={{
            position: "absolute", right: 24, top: 0, height: 72, zIndex: 4,
            display: "flex", alignItems: "center", gap: "clamp(6px, 1vw, 12px)",
          }}>
            <div className="nb-actions-desktop" style={{ gap: "clamp(6px, 1vw, 12px)", alignItems: "center" }}>
              <button onClick={() => setSidebarOpen(true)} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", width: 40, height: 40, borderRadius: 8, cursor: "pointer", fontSize: 16, flexShrink: 0 }}>☰</button>
            </div>
            <button className="nb-hamburger" onClick={() => setMobileOpen(o => !o)} style={{ background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer", alignItems: "center", justifyContent: "center" }}>☰</button>
          </div>
        </div>
      </header>

      {/* ── MOBILE DROPDOWN — rendered at document.body via portal ─────────── */}
      {mobileDropdown}
    </>
  );
}
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_LINKS_KEYS } from "./data";
import { loc } from "./helpers";
import LanguageSwitcher from "../../i18n/LanguageSwitcher";
import Logo from "./Logo";

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

  // Social links filtered by active toggle
  const socials = [
    { label:"f", key:"socialFacebook", href: info.socialFacebook },
    { label:"𝕏", key:"socialTwitter",  href: info.socialTwitter },
    { label:"▶", key:"socialYoutube",  href: info.socialYoutube },
    { label:"in",key:"socialLinkedin", href: info.socialLinkedin },
  ].filter(s => info[`${s.key}Active`] !== false);

  return (
    <>
      {/* Sidebar */}
      <div style={{ position:"fixed", top:0, right:0, width:320, height:"100%", background:"#fff", zIndex:9998, transform: sidebarOpen?"translateX(0)":"translateX(100%)", transition:"transform 0.4s cubic-bezier(0.4,0,0.2,1)", padding:32, boxShadow:"-4px 0 40px rgba(0,0,0,0.15)", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 }}>
          <Logo info={info} dark={false} size="md" />
          <button onClick={() => setSidebarOpen(false)} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"var(--color-dark, #121315)" }}>✕</button>
        </div>
        <p style={{ color:"#666", lineHeight:1.7, marginBottom:32, fontFamily:"'DM Sans',sans-serif" }}>{loc(info, "footerAbout", lang)}</p>
        <h4 style={{ fontFamily:"'DM Sans',sans-serif", marginBottom:16, color:"var(--color-dark, #121315)" }}>{t("sidebar.contactInfo")}</h4>
        {[{icon:"📍",text:info.address},{icon:"✉️",text:info.email},{icon:"⏰",text:info.workingHours},{icon:"📞",text:info.phone}].map((item, i) => (
          <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:16 }}>
            <span style={{ fontSize:18 }}>{item.icon}</span>
            <span style={{ color:"#666", fontFamily:"'DM Sans',sans-serif", fontSize:14 }}>{item.text}</span>
          </div>
        ))}
        <a href={phoneHref} style={{ marginTop:24, background:"var(--color-primary, #0A1684)", color:"#fff", border:"none", padding:"12px 28px", borderRadius:4, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", width:"100%", display:"block", textAlign:"center", textDecoration:"none" }}>
          📞 {info.phone || t("sidebar.getQuote")}
        </a>
        {socials.length > 0 && (
          <div style={{ display:"flex", gap:12, marginTop:24 }}>
            {socials.map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer" style={{ width:36, height:36, borderRadius:"50%", background:"#f4f4f4", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"var(--color-dark, #121315)", textDecoration:"none" }}>{s.label}</a>
            ))}
          </div>
        )}
      </div>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:9997 }} />}

      {/* Header */}
      <header style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, background: scrolled?"var(--color-dark, #121315)":"transparent", transition:"background 0.3s, box-shadow 0.3s", boxShadow: scrolled?"0 2px 20px rgba(0,0,0,0.3)":"none" }}>
        {!scrolled && (
          <div className="topbar-desktop" style={{ background:"var(--color-primary, #0A1684)", padding:"8px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", gap:24, alignItems:"center" }}>
              <span style={{ color:"#fff", fontSize:13, fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:6 }}>📍 {info.address}</span>
              <span style={{ color:"#fff", fontSize:13, fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:6 }}>✉️ {info.email}</span>
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              {socials.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer" style={{ width:26, height:26, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff", textDecoration:"none" }}>{s.label}</a>
              ))}
            </div>
          </div>
        )}
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:80 }}>
          <button onClick={() => scrollTo("#home")} style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}>
            <Logo info={info} dark size="md" />
          </button>
          <nav style={{ display:"flex", gap:32, alignItems:"center" }} className="desktop-nav">
            {NAV_LINKS.map(link => (
              <button key={link.key} onClick={() => scrollTo(link.href)} style={{ background:"none", border:"none", color: active===link.href?"var(--color-primary, #0A1684)":"#fff", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, cursor:"pointer", transition:"color 0.2s", padding:"4px 0", borderBottom: active===link.href?"2px solid var(--color-primary, #0A1684)":"2px solid transparent" }}>{link.label}</button>
            ))}
          </nav>
          <div className="navbar-actions" style={{ display:"flex", gap:12, alignItems:"center" }}>
            <LanguageSwitcher dark={true} />
            <a href={phoneHref} style={{ background:"var(--color-primary, #0A1684)", color:"#fff", border:"none", padding:"10px 24px", borderRadius:4, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:14, textDecoration:"none", display:"flex", alignItems:"center", gap:6 }} className="get-quote-btn">
              📞 {info.phone || t("navbar.getQuote")}
            </a>
            <a href="/admin" style={{ background:"rgba(255,255,255,0.10)", color:"#fff", border:"1px solid rgba(255,255,255,0.12)", padding:"10px 16px", borderRadius:4, fontWeight:800, fontFamily:"'DM Sans',sans-serif", fontSize:14, textDecoration:"none" }} className="admin-btn">{t("navbar.admin")}</a>
            <button onClick={() => setSidebarOpen(true)} style={{ background:"rgba(255,255,255,0.1)", border:"none", color:"#fff", width:44, height:44, borderRadius:4, cursor:"pointer", fontSize:20 }} className="sidebar-btn">☰</button>
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(o => !o)} style={{ background:"none", border:"none", color:"#fff", fontSize:24, cursor:"pointer", display:"none" }}>☰</button>
          </div>
        </div>
        {mobileOpen && (
          <div style={{ background:"var(--color-dark, #121315)", padding:"16px 24px", display:"flex", flexDirection:"column", gap:12 }}>
            {NAV_LINKS.map(link => (
              <button key={link.key} onClick={() => scrollTo(link.href)} style={{ background:"none", border:"none", color:"#fff", textAlign:"left", fontFamily:"'DM Sans',sans-serif", fontSize:16, cursor:"pointer", padding:"8px 0", borderBottom:"1px solid #333" }}>{link.label}</button>
            ))}
            <div style={{ paddingTop:8 }}><LanguageSwitcher dark={true} /></div>
            <a href={phoneHref} style={{ marginTop:4, background:"var(--color-primary, #0A1684)", color:"#fff", padding:"12px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontWeight:800, textAlign:"center", textDecoration:"none" }}>
              📞 {info.phone || t("navbar.getQuote")}
            </a>
            <a href="/admin" style={{ marginTop:4, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", color:"#fff", padding:"10px 12px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontWeight:800, textDecoration:"none" }}>{t("navbar.admin")}</a>
          </div>
        )}
      </header>
    </>
  );
}
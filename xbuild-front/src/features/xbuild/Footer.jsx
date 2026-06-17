import { useTranslation } from "react-i18next";
import { loc } from "./helpers";
import Logo from "./Logo";

export default function Footer({ info }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const scrollTo = (href) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  const quickLinks = [
    { label: t("footer.links.about"),   href: "#about" },
    { label: t("footer.links.contact"), href: "#contact" },
    { label: t("footer.links.blog"),    href: "#news" },
    { label: t("footer.links.faq"),     href: "#" },
  ];
  const serviceLinks = [
    { label: t("footer.links.construction"), href: "#services" },
    { label: t("footer.links.renovation"),   href: "#services" },
    { label: t("footer.links.materials"),    href: "#services" },
    { label: t("footer.links.management"),   href: "#process" },
  ];

  const socials = [
    { label:"f",  key:"socialFacebook", href: info.socialFacebook },
    { label:"𝕏",  key:"socialTwitter",  href: info.socialTwitter },
    { label:"▶",  key:"socialYoutube",  href: info.socialYoutube },
    { label:"in", key:"socialLinkedin", href: info.socialLinkedin },
  ].filter(s => info[`${s.key}Active`] !== false);

  // Use dedicated footer logo if set, otherwise fall back to main logo
  const footerLogoInfo = info.footerLogoImage
    ? { ...info, logoImage: info.footerLogoImage }
    : info;

  return (
    <footer style={{ background:"var(--color-dark, #121315)", color:"#fff", padding:0 }}>

      {/* ── LOGO HERO BAR — matches screenshot ───────────────────────────── */}
      <div style={{ position:"relative", background:"var(--color-dark, #121315)", overflow:"hidden" }}>
        {/* Subtle texture overlay */}
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:"repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 20px)",
          pointerEvents:"none",
        }} />

        {/* Logo centered */}
        <div style={{ position:"relative", zIndex:2, display:"flex", alignItems:"center", justifyContent:"center", padding:"52px 24px 100px" }}>
          <button onClick={() => scrollTo("#home")} style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}>
            {info.footerLogoImage ? (
              <img
                src={info.footerLogoImage}
                alt={info.companyName || "Logo"}
                style={{ height:88, width:"auto", maxWidth:400, objectFit:"contain", display:"block" }}
              />
            ) : info.logoImage ? (
              <img
                src={info.logoImage}
                alt={info.companyName || "Logo"}
                style={{ height:88, width:"auto", maxWidth:400, objectFit:"contain", display:"block" }}
              />
            ) : (
              <Logo info={info} dark={true} size="lg" />
            )}
          </button>
        </div>

        {/* White chevron / inverted V pointing up — exactly like screenshot */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0, height:80,
          overflow:"hidden", zIndex:1,
        }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width:"100%", height:"100%", display:"block" }}>
            {/* White filled chevron pointing up */}
            <polygon points="0,80 720,0 1440,80" fill="rgba(255,255,255,0.06)" />
            <polyline points="0,80 720,0 1440,80" fill="none" stroke="#fff" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* ── CONTACT INFO ROW ──────────────────────────────────────────────── */}
      <div style={{ background:"rgba(255,255,255,0.02)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"0 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div className="footer-contact-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:0 }}>
            {[
              { icon:"📍", label: t("contact.location"), value: info.address },
              { icon:"✉️", label: t("contact.email"),    value: info.email },
              { icon:"📞", label: t("contact.phone"),    value: info.phone },
            ].map((item, i) => (
              <div key={i} style={{ display:"flex", gap:16, alignItems:"center", padding:"28px 24px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div style={{ width:48, height:48, borderRadius:"50%", background:"var(--color-primary)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{item.icon}</div>
                <div style={{ minWidth:0 }}>
                  <p style={{ color:"rgba(255,255,255,0.35)", fontFamily:"'DM Sans',sans-serif", fontSize:11, margin:0, textTransform:"uppercase", letterSpacing:1 }}>{item.label}</p>
                  <h4 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, margin:"4px 0 0", color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.value}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER CONTENT ───────────────────────────────────────────── */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"60px 24px" }}>
        <div className="footer-bottom-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48 }}>
          <div>
            <h5 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:18, marginBottom:20 }}>{t("footer.aboutTitle")}</h5>
            <p style={{ color:"#666", fontFamily:"'DM Sans',sans-serif", fontSize:14, lineHeight:1.8, marginBottom:24 }}>{loc(info,"footerAbout",lang)}</p>
            {socials.length > 0 && (
              <div style={{ display:"flex", gap:10 }}>
                {socials.map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noreferrer"
                    style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", textDecoration:"none" }}
                    onMouseEnter={e => e.currentTarget.style.background="var(--color-primary)"}
                    onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.06)"}
                  >{s.label}</a>
                ))}
              </div>
            )}
          </div>

          {[{ title: t("footer.quickLinks"), links: quickLinks }, { title: t("footer.ourServices"), links: serviceLinks }].map((col, ci) => (
            <div key={ci}>
              <h5 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:18, marginBottom:20 }}>{col.title}</h5>
              <ul style={{ listStyle:"none", padding:0, margin:0 }}>
                {col.links.map((link, li) => (
                  <li key={li} style={{ marginBottom:12 }}>
                    <button onClick={() => scrollTo(link.href)}
                      style={{ background:"none", border:"none", color:"#666", fontFamily:"'DM Sans',sans-serif", fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", gap:8, transition:"color 0.2s", padding:0 }}
                      onMouseEnter={e => e.currentTarget.style.color="var(--color-primary)"}
                      onMouseLeave={e => e.currentTarget.style.color="#666"}
                    ><span style={{ color:"var(--color-primary)", fontSize:10 }}>»</span> {link.label}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h5 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:18, marginBottom:20 }}>{t("footer.newsletter")}</h5>
            <p style={{ color:"#666", fontFamily:"'DM Sans',sans-serif", fontSize:14, lineHeight:1.7, marginBottom:20 }}>{t("footer.newsletterDesc", { company: info.companyName })}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <input placeholder={t("footer.emailPlaceholder")} type="email" style={{ padding:"12px 16px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:14, outline:"none" }} />
              <button style={{ background:"var(--color-primary)", color:"#fff", border:"none", padding:"12px 20px", borderRadius:6, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:14 }}>{t("footer.subscribe")}</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── COPYRIGHT ─────────────────────────────────────────────────────── */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"24px", textAlign:"center" }}>
        <p style={{ color:"#555", fontFamily:"'DM Sans',sans-serif", fontSize:14, margin:0 }}>
          {t("footer.copyright")}{" "}
          <button onClick={() => scrollTo("#home")} style={{ color:"var(--color-primary)", background:"none", border:"none", cursor:"pointer", fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>{info.companyName}</button>
        </p>
      </div>

      <style>{`
        @media (max-width: 1000px) {
          .footer-contact-grid { grid-template-columns: 1fr !important; }
          .footer-contact-grid > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 20px 16px !important; }
          .footer-bottom-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </footer>
  );
}
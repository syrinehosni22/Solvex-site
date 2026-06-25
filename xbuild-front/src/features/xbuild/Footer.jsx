import { useTranslation } from "react-i18next";
import { loc } from "./helpers";
import Logo from "./Logo";
import { useApiList } from "./apiHooks";

export default function Footer({ info }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const scrollTo = (href) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  const services = useApiList("/api/services", []);

  const quickLinks = [
    { label: t("footer.links.about"),    href: "#about" },
    { label: t("footer.links.contact"),  href: "#contact" },
    { label: t("footer.links.services"), href: "#services" },
  ];
  const serviceLinks = services.length > 0
    ? services.map(s => ({ label: s[`title_${lang}`] || s.title_fr || s.title || "", href: "#services" }))
    : [
        { label: t("footer.links.construction"), href: "#services" },
        { label: t("footer.links.renovation"),   href: "#services" },
        { label: t("footer.links.materials"),    href: "#services" },
        { label: t("footer.links.management"),   href: "#process" },
      ];

  const socials = [
    {
      key: "socialFacebook", href: info.socialFacebook, color: "#1877F2",
      icon: (
        <svg viewBox="0 0 36 36" width="36" height="36">
          <circle cx="18" cy="18" r="18" fill="#1877F2"/>
          <text x="20" y="26" textAnchor="middle" fill="#fff" fontFamily="Georgia, serif" fontWeight="900" fontSize="22">f</text>
        </svg>
      ),
    },
    {
      key: "socialTwitter", href: info.socialTwitter, color: "#000",
      icon: (
        <svg viewBox="0 0 36 36" width="36" height="36">
          <circle cx="18" cy="18" r="18" fill="#000"/>
          <path d="M20.5 10h2.8l-6 6.8 7 9.2H20l-4.3-5.7-5 5.7H8l6.4-7.3L7.8 10h5.5l3.9 5.2zm-1 13.5 1.2 1.5H22l-6.3-8.3-1.2-1.5H13l6.5 8.3z" fill="#fff"/>
        </svg>
      ),
    },
    {
      key: "socialYoutube", href: info.socialYoutube, color: "#FF0000",
      icon: (
        <svg viewBox="0 0 36 36" width="36" height="36">
          <circle cx="18" cy="18" r="18" fill="#FF0000"/>
          <rect x="7" y="12" width="22" height="12" rx="3" fill="#fff"/>
          <polygon points="15,14.5 15,21.5 23,18" fill="#FF0000"/>
        </svg>
      ),
    },
    {
      key: "socialLinkedin", href: info.socialLinkedin, color: "#0A66C2",
      icon: (
        <svg viewBox="0 0 36 36" width="36" height="36">
          <circle cx="18" cy="18" r="18" fill="#0A66C2"/>
          <circle cx="12" cy="12" r="2" fill="#fff"/>
          <rect x="10" y="15" width="4" height="12" rx="1" fill="#fff"/>
          <rect x="17" y="15" width="4" height="12" rx="1" fill="#fff"/>
          <path d="M21 19.5c0-2 1-3 2.5-3s2.5 1 2.5 3V27h4v-7.5c0-4-2-6-5-6-1.5 0-3 .8-4 2V15h-4v12h4z" fill="#fff"/>
        </svg>
      ),
    },
    {
      key: "whatsapp",
      href: info.phone ? `https://wa.me/${info.phone.replace(/[\s\+\-().]/g, "")}` : null,
      color: "#25D366",
      alwaysShow: true,
      icon: (
        <svg viewBox="0 0 36 36" width="36" height="36">
          <path d="M18 1C8.611 1 1 8.611 1 18c0 3.231.875 6.254 2.401 8.845L1 35l8.385-2.368A16.938 16.938 0 0018 35c9.389 0 17-7.611 17-17S27.389 1 18 1z" fill="#fff"/>
          <path d="M18 3.5C9.992 3.5 3.5 9.992 3.5 18c0 2.94.84 5.686 2.296 8.012l.284.46-1.544 5.63 5.79-1.517.445.263A14.46 14.46 0 0018 32.5c8.008 0 14.5-6.492 14.5-14.5S26.008 3.5 18 3.5z" fill="#4CAF50"/>
          <path d="M18 5C10.82 5 5 10.82 5 18c0 2.768.838 5.34 2.274 7.48l.237.354-1.27 4.637 4.76-1.247.368.22A12.94 12.94 0 0018 31c7.18 0 13-5.82 13-13S25.18 5 18 5z" fill="#4CAF50" opacity="0"/>
          <path d="M18 5.5C11.096 5.5 5.5 11.096 5.5 18c0 2.696.84 5.197 2.27 7.254l-1.42 5.18 5.305-1.39A12.45 12.45 0 0018 30.5c6.904 0 12.5-5.596 12.5-12.5S24.904 5.5 18 5.5z" fill="#43A047"/>
          <path d="M18 6C11.373 6 6 11.373 6 18c0 2.658.84 5.12 2.267 7.14L6.8 30.2l5.21-1.367A11.95 11.95 0 0018 30c6.627 0 12-5.373 12-12S24.627 6 18 6z" fill="#4CAF50"/>
          <path d="M13.5 11.5c-.4-1-.7-1-.9-1H11.8c-.3 0-.8.1-1.2.6-.4.4-1.6 1.6-1.6 3.8s1.6 4.4 1.8 4.7c.2.3 3.1 4.9 7.6 6.7 3.8 1.5 4.5 1.2 5.3 1.1.8-.1 2.6-1.1 3-2.1.4-1 .4-1.9.3-2.1-.1-.2-.4-.3-.8-.5-.4-.2-2.6-1.3-3-1.4-.4-.1-.6-.2-.9.2-.3.4-1.1 1.4-1.3 1.7-.2.3-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.6.1-.2 0-.5-.1-.7-.1-.2-.9-2.2-1.3-3z" fill="#fff"/>
        </svg>
      ),
    },
  ].filter(s => s.alwaysShow ? !!s.href : info[`${s.key}Active`] !== false);

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
        <div className="footer-bottom-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:48 }}>
          <div>
            <h5 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:18, marginBottom:20 }}>{t("footer.aboutTitle")}</h5>
            <p style={{ color:"#666", fontFamily:"'DM Sans',sans-serif", fontSize:14, lineHeight:1.8, marginBottom:24 }}>{loc(info,"footerAbout",lang)}</p>
            {socials.length > 0 && (
              <div style={{ display:"flex", gap:10 }}>
                {socials.map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noreferrer"
                    style={{ display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", transition:"transform 0.2s, opacity 0.2s", borderRadius:"50%", overflow:"hidden" }}
                    onMouseEnter={e => { e.currentTarget.style.transform="scale(1.12)"; e.currentTarget.style.opacity="0.85"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.opacity="1"; }}
                  >{s.icon}</a>
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
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

  return (
    <footer style={{ background:"var(--color-dark, #121315)", color:"#fff", padding:"80px 0 0" }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 24px 60px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <div className="footer-top-grid" style={{ display:"grid", gridTemplateColumns:"auto 1fr 1fr 1fr", gap:40, alignItems:"center" }}>
          <Logo info={info} dark size="md" onClick={() => scrollTo("#home")} />
          {[
            { icon:"📍", label: t("contact.location"), value: info.address },
            { icon:"✉️", label: t("contact.email"),    value: info.email },
            { icon:"📞", label: t("contact.phone"),    value: info.phone },
          ].map((item, i) => (
            <div key={i} style={{ display:"flex", gap:16, alignItems:"center" }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:"var(--color-primary, #0A1684)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{item.icon}</div>
              <div>
                <p style={{ color:"#666", fontFamily:"'DM Sans',sans-serif", fontSize:12, margin:0 }}>{item.label}</p>
                <h4 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:15, margin:"4px 0 0" }}>{item.value}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

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
                    onMouseEnter={e => e.currentTarget.style.background="var(--color-primary, #0A1684)"}
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
                      onMouseEnter={e => e.currentTarget.style.color="var(--color-primary, #0A1684)"}
                      onMouseLeave={e => e.currentTarget.style.color="#666"}
                    ><span style={{ color:"var(--color-primary, #0A1684)", fontSize:10 }}>»</span> {link.label}</button>
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
              <button style={{ background:"var(--color-primary, #0A1684)", color:"#fff", border:"none", padding:"12px 20px", borderRadius:6, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:14 }}>{t("footer.subscribe")}</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"24px", textAlign:"center" }}>
        <p style={{ color:"#555", fontFamily:"'DM Sans',sans-serif", fontSize:14, margin:0 }}>
          {t("footer.copyright")}{" "}
          <button onClick={() => scrollTo("#home")} style={{ color:"var(--color-primary, #0A1684)", background:"none", border:"none", cursor:"pointer", fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>{info.companyName}</button>
        </p>
      </div>
    </footer>
  );
}

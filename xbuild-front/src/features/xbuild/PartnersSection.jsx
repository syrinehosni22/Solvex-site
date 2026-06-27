import { useTranslation } from "react-i18next";

export default function PartnersSection({ info = {} }) {
  const { t } = useTranslation();
  const partners = (info.partners && info.partners.length > 0) ? info.partners : null;
  if (!partners) return null;
  const items = [...partners, ...partners];

  return (
    <section style={{ padding: "72px 0 64px", background: "#f8f8f8", borderTop: "1px solid #eee", borderBottom: "1px solid #eee" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <span style={{ display: "inline-block", background: "var(--color-primary)", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", padding: "6px 18px", borderRadius: 20, marginBottom: 16 }}>
          {t("partners.tag", "Partenaires")}
        </span>
        <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 900, fontSize: "clamp(26px,4vw,38px)", color: "#121315", margin: 0 }}>
          {t("partners.title", "Nos Partenaires")}
        </h2>
      </div>

      <div style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", animation: "marquee 28s linear infinite", width: "max-content", alignItems: "center" }}>
          {items.map((partner, i) => {
            const name = typeof partner === "string" ? partner : partner.name;
            const logo = typeof partner === "string" ? null : partner.logo;
            const link = typeof partner === "string" ? null : partner.link;
            const inner = (
              <>
                {logo && <img src={logo} alt={name} style={{ height: 56, maxWidth: 130, objectFit: "contain", filter: "grayscale(100%) opacity(0.55)", transition: "filter 0.3s" }} />}
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, color: "#999", fontSize: 18, letterSpacing: 1, whiteSpace: "nowrap", transition: "color 0.2s", textTransform: "uppercase" }}>{name}</span>
              </>
            );
            const commonStyle = { padding: "0 40px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0, textDecoration: "none" };
            const hover = e => { const img = e.currentTarget.querySelector("img"); const span = e.currentTarget.querySelector("span"); if (img) img.style.filter = "grayscale(0%) opacity(1)"; if (span) span.style.color = "var(--color-primary, #0A1684)"; };
            const unhover = e => { const img = e.currentTarget.querySelector("img"); const span = e.currentTarget.querySelector("span"); if (img) img.style.filter = "grayscale(100%) opacity(0.55)"; if (span) span.style.color = "#999"; };
            return link
              ? <a key={i} href={link && !link.startsWith('http') ? 'https://' + link : link} target="_blank" rel="noreferrer" style={{ ...commonStyle, cursor: "pointer" }} onMouseEnter={hover} onMouseLeave={unhover}>{inner}</a>
              : <div key={i} style={{ ...commonStyle, cursor: "default" }} onMouseEnter={hover} onMouseLeave={unhover}>{inner}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
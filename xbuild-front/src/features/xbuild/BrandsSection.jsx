export default function BrandsSection({ info = {} }) {
  const brands = (info.brands && info.brands.length > 0) ? info.brands : null;
  if (!brands) return null;
  const items = [...brands, ...brands];

  return (
    <div style={{ padding: "48px 0", background: "#fff", borderTop: "1px solid #f0f0f0", overflow: "hidden" }}>
      <div style={{ display: "flex", animation: "marquee 25s linear infinite", width: "max-content", alignItems: "center" }}>
        {items.map((brand, i) => {
          const name = typeof brand === "string" ? brand : brand.name;
          const logo = typeof brand === "string" ? null : brand.logo;
          const link = typeof brand === "string" ? null : brand.link;
          const inner = (
            <>
              {logo && <img src={logo} alt={name} style={{ height: 56, maxWidth: 130, objectFit: "contain", filter: "grayscale(100%) opacity(0.5)", transition: "filter 0.3s" }} />}
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, color: "#bbb", fontSize: 15, letterSpacing: 1, whiteSpace: "nowrap", transition: "color 0.2s" }}>{name}</span>
            </>
          );
          const commonStyle = { padding: "0 40px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0, textDecoration: "none" };
          const hover = e => { const img = e.currentTarget.querySelector("img"); const span = e.currentTarget.querySelector("span"); if (img) img.style.filter = "grayscale(0%) opacity(1)"; if (span) span.style.color = "var(--color-primary, #0A1684)"; };
          const unhover = e => { const img = e.currentTarget.querySelector("img"); const span = e.currentTarget.querySelector("span"); if (img) img.style.filter = "grayscale(100%) opacity(0.5)"; if (span) span.style.color = "#bbb"; };
          return link
            ? <a key={i} href={link} target="_blank" rel="noreferrer" style={{ ...commonStyle, cursor: "pointer" }} onMouseEnter={hover} onMouseLeave={unhover}>{inner}</a>
            : <div key={i} style={{ ...commonStyle, cursor: "default" }} onMouseEnter={hover} onMouseLeave={unhover}>{inner}</div>;
        })}
      </div>
    </div>
  );
}
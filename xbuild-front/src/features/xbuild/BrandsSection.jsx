export default function BrandsSection({ info = {} }) {
  const brands = (info.brands && info.brands.length > 0)
    ? info.brands
    : null; // don't show fallback — wait for real data

  if (!brands) return null;

  const items = [...brands, ...brands];

  return (
    <div style={{ padding: "48px 0", background: "#fff", borderTop: "1px solid #f0f0f0", overflow: "hidden" }}>
      <div style={{ display: "flex", animation: "marquee 25s linear infinite", width: "max-content", alignItems: "center" }}>
        {items.map((brand, i) => {
          const name = typeof brand === "string" ? brand : brand.name;
          const logo = typeof brand === "string" ? null : brand.logo;
          return (
            <div key={i}
              style={{ padding: "0 40px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.querySelector(".brand-name") && (e.currentTarget.querySelector(".brand-name").style.color = "var(--color-primary, #0A1684)"); }}
              onMouseLeave={e => { e.currentTarget.querySelector(".brand-name") && (e.currentTarget.querySelector(".brand-name").style.color = "#bbb"); }}
            >
              {logo
                ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={logo} alt={name} style={{ height: 56, maxWidth: 130, objectFit: "contain", filter: "grayscale(100%) opacity(0.5)", transition: "filter 0.3s" }}
                      onMouseEnter={e => e.currentTarget.style.filter = "grayscale(0%) opacity(1)"}
                      onMouseLeave={e => e.currentTarget.style.filter = "grayscale(100%) opacity(0.5)"}
                    />
                    <span className="brand-name" style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, color: "#bbb", fontSize: 15, letterSpacing: 1, whiteSpace: "nowrap", transition: "color 0.2s" }}>{name}</span>
                  </div>
                )
                : <span className="brand-name" style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, color: "#bbb", fontSize: 16, letterSpacing: 1, whiteSpace: "nowrap", transition: "color 0.2s" }}>{name}</span>
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}
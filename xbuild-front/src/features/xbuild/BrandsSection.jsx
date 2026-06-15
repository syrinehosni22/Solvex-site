import { useTranslation } from "react-i18next";

export default function BrandsSection() {
  const { t } = useTranslation();
  const brands = t("brands", { returnObjects: true });
  return (
    <div style={{ padding: "48px 0", background: "#fff", borderTop: "1px solid #f0f0f0", overflow: "hidden" }}>
      <div style={{ display: "flex", animation: "marquee 20s linear infinite", width: "max-content" }}>
        {[...brands, ...brands].map((brand, i) => (
          <div key={i} style={{ padding: "0 48px", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, color: "#ccc", fontSize: 16, letterSpacing: 1, whiteSpace: "nowrap", cursor: "pointer" }}
            onMouseEnter={e => e.target.style.color = "var(--color-primary, #0A1684)"} onMouseLeave={e => e.target.style.color = "#ccc"}
          >{brand}</div>
        ))}
      </div>
    </div>
  );
}

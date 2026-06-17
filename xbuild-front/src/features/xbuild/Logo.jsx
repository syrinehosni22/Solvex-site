/**
 * Logo component — affiche l'image logo si configurée,
 * sinon le texte stylisé du nom de l'entreprise.
 * Props:
 *   info       — objet info (companyName, logoImage)
 *   dark       — fond sombre (texte blanc) ou fond clair
 *   size       — "sm" | "md" | "lg"
 *   onClick    — callback optionnel
 */
export default function Logo({ info = {}, dark = true, size = "md", onClick, style = {} }) {
  const sizes = {
    sm: { img: 38,  font: 20 },
    md: { img: 64,  font: 28 },   // was 52/26 — bumped up
    lg: { img: 88,  font: 38 },   // was 72/36 — bumped up
  };
  const { img: imgH, font: fontSize } = sizes[size] || sizes.md;
  const color = dark ? "#fff" : "var(--color-dark, #121315)";

  if (info.loaded === false) {
    return (
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: info.logoImage ? imgH * 3.2 : fontSize * 4.2,
          height: imgH,
          ...style,
        }}
      />
    );
  }

  if (info.logoImage) {
    return (
      <div
        onClick={onClick}
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: dark ? "#fff" : "transparent",
          borderRadius: dark ? 8 : 0,
          padding: dark ? "8px 16px" : 0,
          boxShadow: dark ? "0 2px 10px rgba(0,0,0,0.08)" : "none",
          cursor: onClick ? "pointer" : "default",
          ...style,
        }}
      >
        <img
          src={info.logoImage}
          alt={info.companyName || "Logo"}
          style={{ height: imgH, width: "auto", maxWidth: imgH * 6, objectFit: "contain", display: "block" }}
        />
      </div>
    );
  }

  const companyName = info.companyName;

  return (
    <span
      onClick={onClick}
      style={{ fontSize, fontWeight: 900, color, fontFamily: "'DM Sans',sans-serif", letterSpacing: -1, cursor: onClick ? "pointer" : "default", ...style }}
    >
      {companyName.replace(/build/i, "")}
      <span style={{ color: "var(--color-primary)" }}>{companyName.match(/build/i)?.[0] || "BUILD"}</span>
    </span>
  );
}
/**
 * Logo component — affiche l'image logo si configurée,
 * sinon le texte stylisé XBUILD.
 * Props:
 *   info       — objet info (companyName, logoImage)
 *   dark       — fond sombre (texte blanc) ou fond clair
 *   size       — "sm" | "md" | "lg"
 *   onClick    — callback optionnel
 */
export default function Logo({ info = {}, dark = true, size = "md", onClick, style = {} }) {
  const sizes = { sm: { img: 32, font: 20 }, md: { img: 44, font: 26 }, lg: { img: 60, font: 36 } };
  const { img: imgH, font: fontSize } = sizes[size] || sizes.md;
  const color = dark ? "#fff" : "var(--color-dark, #121315)";

  if (info.logoImage) {
    return (
      <div
        onClick={onClick}
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: "#fff", borderRadius: 8,
          padding: "6px 10px",
          cursor: onClick ? "pointer" : "default",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          ...style,
        }}
      >
        <img
          src={info.logoImage}
          alt={info.companyName || "Logo"}
          style={{ height: imgH, width: "auto", objectFit: "contain", display: "block" }}
        />
      </div>
    );
  }

  return (
    <span
      onClick={onClick}
      style={{ fontSize, fontWeight: 900, color, fontFamily: "'DM Sans',sans-serif", letterSpacing: -1, cursor: onClick ? "pointer" : "default", ...style }}
    >
      {(info.companyName || "XBuild").replace(/build/i, "")}<span style={{ color: "var(--color-primary, #0A1684)" }}>{(info.companyName || "XBuild").match(/build/i)?.[0] || "BUILD"}</span>
    </span>
  );
}
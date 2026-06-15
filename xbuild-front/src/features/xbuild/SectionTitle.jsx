export default function SectionTitle({ tag, title, center = false, dark = false }) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: 48 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16, color: "var(--color-primary, #0A1684)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>
        <span style={{ width: 24, height: 2, background: "var(--color-primary, #0A1684)", display: "inline-block" }} />{tag}<span style={{ width: 24, height: 2, background: "var(--color-primary, #0A1684)", display: "inline-block" }} />
      </div>
      <h2 style={{ fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 900, color: dark ? "#fff" : "var(--color-dark, #121315)", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.15, maxWidth: 640, margin: center ? "0 auto" : 0 }}>{title}</h2>
    </div>
  );
}

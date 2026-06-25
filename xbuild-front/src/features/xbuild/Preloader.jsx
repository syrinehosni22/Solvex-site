import { useTranslation } from "react-i18next";

export default function Preloader({ done, info = {} }) {
  const { t } = useTranslation();
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "var(--color-dark, #121315)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", transition: "opacity 0.6s, visibility 0.6s", opacity: done ? 0 : 1, visibility: done ? "hidden" : "visible" }}>
      <div style={{ width: 60, height: 4, background: "#333", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", background: "var(--color-primary, #0A1684)", animation: "loader 1.5s ease-in-out infinite" }} />
      </div>
      <p style={{ color: "#666", marginTop: 12, fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>{t("loading")}</p>
    </div>
  );
}
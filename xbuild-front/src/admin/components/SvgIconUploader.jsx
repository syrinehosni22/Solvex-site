import { useRef, useState } from "react";
import { getToken } from "../../lib/api";

export function SvgIconUploader({ value, onChange, size = 48 }) {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [tab, setTab] = useState(isImageUrl(value) ? "file" : "emoji");

  function isImageUrl(v) {
    if (!v) return false;
    return v.startsWith("/uploads/") || v.startsWith("http");
  }

  const handleFile = async (file) => {
    if (!file) return;
    const allowed = ["image/svg+xml", "image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      setErr("Format non supporté. Utilisez SVG, PNG, JPG ou WEBP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) { setErr("Fichier trop lourd (max 2 Mo)"); return; }
    setUploading(true); setErr("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload échoué");
      onChange(data.url);
      setTab("file");
    } catch (e) {
      setErr(e.message);
    } finally {
      setUploading(false);
    }
  };

  const isUrl = isImageUrl(value);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 6 }}>
        {[{ id: "file", label: "🖼️ Fichier SVG / PNG" }, { id: "emoji", label: "😀 Emoji" }].map(t => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} style={{
            padding: "5px 14px", borderRadius: 7, fontSize: 12, cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif", fontWeight: 700, border: "1px solid",
            borderColor: tab === t.id ? "var(--color-primary, #0A1684)" : "rgba(255,255,255,0.10)",
            background:  tab === t.id ? "rgba(10,22,132,0.15)" : "rgba(255,255,255,0.04)",
            color:       tab === t.id ? "var(--color-primary, #0A1684)" : "#888",
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "file" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            onClick={() => { setErr(""); inputRef.current?.click(); }}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px", borderRadius: 10, cursor: uploading ? "wait" : "pointer",
              border: "2px dashed rgba(245,91,31,0.35)", background: "rgba(245,91,31,0.05)", transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(245,91,31,0.10)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(245,91,31,0.05)"}
          >
            <div style={{
              width: size, height: size, borderRadius: 8, flexShrink: 0,
              background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
            }}>
              {isUrl
                ? <img src={value} alt="" style={{ width: "80%", height: "80%", objectFit: "contain" }} />
                : <span style={{ fontSize: 28, opacity: 0.3 }}>🖼️</span>
              }
            </div>
            <div>
              <div style={{ color: "#ccc", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13 }}>
                {uploading ? "⏳ Upload en cours…" : (isUrl ? "Cliquer pour changer" : "Cliquer pour uploader")}
              </div>
              <div style={{ color: "#555", fontFamily: "'DM Sans',sans-serif", fontSize: 11, marginTop: 2 }}>
                SVG, PNG, JPG, WEBP — max 2 Mo
              </div>
            </div>
          </div>

          <input
            ref={inputRef} type="file"
            accept="image/svg+xml,image/png,image/jpeg,image/webp,.svg,.png,.jpg,.jpeg,.webp"
            style={{ display: "none" }}
            onChange={e => handleFile(e.target.files?.[0])}
          />

          {isUrl && (
            <button type="button" onClick={() => onChange("")} style={{
              alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 7, fontSize: 12, cursor: "pointer",
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
              color: "#f87171", fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
            }}>✕ Supprimer l'icône</button>
          )}

          {err && (
            <div style={{ fontSize: 12, color: "#f87171", fontFamily: "'DM Sans',sans-serif", padding: "6px 10px", borderRadius: 6, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              ⚠️ {err}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <input
            type="text" value={isUrl ? "" : (value || "")} onChange={e => onChange(e.target.value)}
            placeholder="🏗️"
            style={{ padding: "9px 12px", borderRadius: 8, fontSize: 22, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(0,0,0,0.28)", color: "#fff", fontFamily: "sans-serif", outline: "none", width: 90 }}
          />
          {isUrl && <p style={{ fontSize: 12, color: "#f5a623", fontFamily: "'DM Sans',sans-serif", margin: 0 }}>⚠️ Un fichier est actif. Saisir un emoji le remplacera.</p>}
          <p style={{ fontSize: 11, color: "#555", fontFamily: "'DM Sans',sans-serif", margin: 0 }}>Copiez-collez directement un emoji (ex : 🏗️ 🔧 ⚙️)</p>
        </div>
      )}
    </div>
  );
}

export function IconDisplay({ icon, size = 28, style = {} }) {
  const isUrl = icon && (icon.startsWith("/uploads/") || icon.startsWith("http"));
  if (isUrl) {
    return <img src={icon} alt="" style={{ width: size, height: size, objectFit: "contain", flexShrink: 0, display: "block", ...style }} />;
  }
  return <span style={{ fontSize: size * 0.85, lineHeight: 1, flexShrink: 0, ...style }}>{icon || "⚙️"}</span>;
}
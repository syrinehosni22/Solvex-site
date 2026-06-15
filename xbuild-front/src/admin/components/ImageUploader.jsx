import { useRef, useState } from "react";
import { getToken } from "../../lib/api";

/**
 * ImageUploader — upload vers /api/upload + fallback URL manuelle
 * Props:
 *   value      — URL actuelle de l'image
 *   onChange   — callback(newUrl)
 *   label      — texte du bouton (défaut: "Choisir une image")
 *   hint       — texte d'aide sous le bouton
 *   preview    — "cover" | "contain" | "avatar" (défaut: "cover")
 *   height     — hauteur de la preview (défaut: 140)
 */
export function ImageUploader({ value, onChange, label = "Choisir une image", hint = "", preview = "cover", height = 140 }) {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [urlInput, setUrlInput] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErr("Fichier trop lourd (max 5 Mo)"); return; }
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
      setUrlInput("");
    } catch (e) {
      setErr(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) { onChange(urlInput.trim()); setUrlInput(""); }
  };

  const isAvatar = preview === "avatar";

  return (
    <div>
      {hint && <p style={{ color:"#555", fontFamily:"'DM Sans',sans-serif", fontSize:12, margin:"0 0 10px", lineHeight:1.5 }}>{hint}</p>}

      {/* Buttons */}
      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
        <button
          type="button"
          onClick={() => { setErr(""); inputRef.current?.click(); }}
          disabled={uploading}
          style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"9px 16px", borderRadius:8, background:"rgba(245,91,31,0.15)", border:"1px solid rgba(245,91,31,0.3)", color:"var(--color-primary, #0A1684)", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13, cursor: uploading ? "wait" : "pointer", transition:"all 0.15s" }}
        >
          <span>{uploading ? "⏳" : "📷"}</span>
          {uploading ? "Upload en cours…" : (value ? "Changer" : label)}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => { onChange(""); setErr(""); }}
            style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"9px 12px", borderRadius:8, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}
          >
            ✕ Supprimer
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        style={{ display:"none" }}
        onChange={e => handleFile(e.target.files?.[0])}
      />

      {err && (
        <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8, padding:"8px 12px", borderRadius:8, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171", fontSize:12, fontFamily:"'DM Sans',sans-serif" }}>
          ⚠️ {err}
        </div>
      )}

      {/* URL input fallback */}
      <div style={{ display:"flex", gap:8, marginTop:10 }}>
        <input
          type="url"
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleUrlSubmit()}
          placeholder="Ou collez une URL d'image…"
          style={{ flex:1, padding:"9px 12px", borderRadius:8, border:"1px solid rgba(255,255,255,0.10)", background:"rgba(0,0,0,0.28)", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none" }}
        />
        {urlInput && (
          <button type="button" onClick={handleUrlSubmit}
            style={{ padding:"9px 14px", borderRadius:8, background:"rgba(245,91,31,0.15)", border:"1px solid rgba(245,91,31,0.3)", color:"var(--color-primary, #0A1684)", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>
            OK
          </button>
        )}
      </div>

      {/* Preview */}
      {value && (
        <div style={{ marginTop:12 }}>
          {isAvatar ? (
            <img src={value} alt="" style={{ width:72, height:72, borderRadius:"50%", objectFit:"cover", border:"2px solid rgba(245,91,31,0.4)", display:"block" }} />
          ) : (
            <div style={{ borderRadius:10, overflow:"hidden", border:"1px solid rgba(255,255,255,0.1)", height, background:"#111" }}>
              <img src={value} alt="" style={{ width:"100%", height:"100%", objectFit: preview === "contain" ? "contain" : "cover", display:"block" }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

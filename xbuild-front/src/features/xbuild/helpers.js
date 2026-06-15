

// Retourne le champ localisé d'un objet API : doc.title_fr / doc.title_en → fallback doc.title
export function loc(doc, field, lang) {
  return doc[`${field}_${lang}`] || doc[field] || "";
}

// "#0A1684" -> "10, 22, 132"
export function hexToRgb(hex) {
  const clean = String(hex || "").replace("#", "").trim();
  const m = clean.match(/.{1,2}/g);
  if (!clean || !m || m.length < 3) return "10, 22, 132";
  return m.slice(0, 3).map(h => parseInt(h, 16) || 0).join(", ");
}

export function darkenHex(hex, amount = 0.12) {
  const clean = String(hex || "").replace("#", "").trim();
  const m = clean.match(/.{1,2}/g);
  if (!clean || !m || m.length < 3) return hex;
  const [r, g, b] = m.slice(0, 3).map(h => parseInt(h, 16) || 0);
  const dim = v => Math.max(0, Math.min(255, Math.round(v * (1 - amount))));
  return "#" + [dim(r), dim(g), dim(b)].map(v => v.toString(16).padStart(2, "0")).join("");
}
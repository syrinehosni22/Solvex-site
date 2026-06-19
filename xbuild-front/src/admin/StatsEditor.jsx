import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { Alert, Button, Card, Field, Input, PageHeader, SectionHeading, Spinner, Textarea } from "./components/UI";
import { ImageUploader } from "./components/ImageUploader";
import { SvgIconUploader, IconDisplay } from "./components/SvgIconUploader";

const LANG_TABS = [{ code: "fr", label: "🇫🇷 Français" }, { code: "en", label: "🇬🇧 English" }];

const DEFAULT = {
  statsTitle_fr: "Nos Services Répondent aux Plus Hautes Normes.",
  statsTitle_en: "Our Services Meet the Highest Standards.",
  statsTag_fr:   "Statut de l'Entreprise",
  statsTag_en:   "Company Status",
  statsDesc_fr:  "Avec plus de 25 ans d'expérience, nous continuons de fixer la référence en qualité et innovation dans la construction industrielle.",
  statsDesc_en:  "With over 25 years of experience, we continue to set the benchmark in quality and innovation in industrial construction.",
  statsItems: [
    { value: "45", suffix: "k+", label_fr: "Projets Réalisés",  label_en: "Projects Completed" },
    { value: "25", suffix: "k+", label_fr: "Clients Actifs",    label_en: "Active Clients" },
    { value: "2.4", suffix: "k+", label_fr: "Prix Remportés",   label_en: "Awards Won" },
  ],
  statsBadges: [
    { icon: "🏅", label_fr: "Certifié ISO",     label_en: "ISO Certified" },
    { icon: "🕐", label_fr: "Support 24/7",    label_en: "24/7 Support" },
    { icon: "👷", label_fr: "Équipe d'Experts", label_en: "Expert Team" },
    { icon: "🛡️", label_fr: "Sûr & Sécurisé",  label_en: "Safe & Secure" },
  ],
  statsImage: "",
};

export default function StatsEditor() {
  const [form, setForm] = useState(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [lang, setLang] = useState("fr");

  useEffect(() => {
    apiFetch("/api/info")
      .then(d => setForm(f => ({
        ...f,
        statsTitle_fr: d.statsTitle_fr || f.statsTitle_fr,
        statsTitle_en: d.statsTitle_en || f.statsTitle_en,
        statsTag_fr:   d.statsTag_fr   || f.statsTag_fr,
        statsTag_en:   d.statsTag_en   || f.statsTag_en,
        statsDesc_fr:  d.statsDesc_fr  || f.statsDesc_fr,
        statsDesc_en:  d.statsDesc_en  || f.statsDesc_en,
        statsItems:    d.statsItems    || f.statsItems,
        statsBadges:   d.statsBadges   || f.statsBadges,
        statsImage:    d.statsImage    || "",
      })))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const patch = (key, value) => { setForm(f => ({ ...f, [key]: value })); setDirty(true); setSuccess(false); };
  const patchItem  = (i, key, value) => { setForm(f => { const items = [...f.statsItems];  items[i]  = { ...items[i],  [key]: value }; return { ...f, statsItems:  items };  }); setDirty(true); setSuccess(false); };
  const patchBadge = (i, key, value) => { setForm(f => { const badges = [...f.statsBadges]; badges[i] = { ...badges[i], [key]: value }; return { ...f, statsBadges: badges }; }); setDirty(true); setSuccess(false); };
  const addItem    = () => patch("statsItems",  [...form.statsItems,  { value: "0", suffix: "+", label_fr: "Nouveau", label_en: "New" }]);
  const removeItem = i  => patch("statsItems",  form.statsItems.filter((_, idx) => idx !== i));
  const addBadge   = () => patch("statsBadges", [...form.statsBadges, { icon: "✓", label_fr: "Nouveau badge", label_en: "New badge" }]);
  const removeBadge = i => patch("statsBadges", form.statsBadges.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true); setError(""); setSuccess(false);
    try {
      await apiFetch("/api/info", { method: "PUT", auth: true, body: JSON.stringify(form) });
      setSuccess(true); setDirty(false);
      setTimeout(() => setSuccess(false), 4000);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 64 }}><Spinner size={36} /></div>;

  return (
    <div>
      <PageHeader icon="📊" title="Statut de l'Entreprise" subtitle="Chiffres clés, badges de certification, titre et image de la section"
        actions={<Button variant="primary" onClick={save} disabled={saving || !dirty}>{saving ? <><Spinner size={14} /> Sauvegarde…</> : "💾 Sauvegarder"}</Button>}
      />
      {error   && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">Section mise à jour avec succès !</Alert>}

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {LANG_TABS.map(tab => (
          <button key={tab.code} onClick={() => setLang(tab.code)} style={{
            padding: "7px 16px", borderRadius: 8, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer", border: "1px solid",
            borderColor: lang === tab.code ? "var(--color-primary, #0A1684)" : "rgba(255,255,255,0.12)",
            background:  lang === tab.code ? "rgba(245,91,31,0.15)" : "rgba(255,255,255,0.04)",
            color:       lang === tab.code ? "var(--color-primary, #0A1684)" : "#aaa",
          }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card>
          <SectionHeading title="✏️ Textes de la section" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label={`Tag — ${lang === "fr" ? "Français" : "English"}`}>
              <Input value={form[`statsTag_${lang}`] || ""} onChange={e => patch(`statsTag_${lang}`, e.target.value)} placeholder={lang === "fr" ? "Statut de l'Entreprise" : "Company Status"} />
            </Field>
          </div>
          <Field label={`Titre — ${lang === "fr" ? "Français" : "English"}`}>
            <Input value={form[`statsTitle_${lang}`] || ""} onChange={e => patch(`statsTitle_${lang}`, e.target.value)} />
          </Field>
          <Field label={`Description — ${lang === "fr" ? "Français" : "English"}`}>
            <Textarea value={form[`statsDesc_${lang}`] || ""} onChange={e => patch(`statsDesc_${lang}`, e.target.value)} rows={3} />
          </Field>
        </Card>

        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <SectionHeading title="🔢 Chiffres clés" subtitle="Compteurs animés affichés sous le titre" />
            <Button variant="outline" onClick={addItem}>+ Ajouter</Button>
          </div>
          <div style={{ display: "flex", gap: 32, padding: "16px 20px", borderRadius: 12, background: "var(--color-dark, #121315)", marginBottom: 20, flexWrap: "wrap" }}>
            {form.statsItems.map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: "var(--color-primary, #0A1684)", fontFamily: "'DM Sans',sans-serif", lineHeight: 1 }}>{s.value}{s.suffix}</div>
                <div style={{ color: "#aaa", fontFamily: "'DM Sans',sans-serif", fontSize: 13, marginTop: 4 }}>{s[`label_${lang}`]}</div>
              </div>
            ))}
          </div>
          {form.statsItems.map((item, i) => (
            <div key={i} style={{ marginBottom: 14, padding: "16px", borderRadius: 12, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ color: "var(--color-primary, #0A1684)", fontWeight: 800, fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>Compteur {i + 1} — <span style={{ color: "#fff" }}>{item.value}{item.suffix}</span></span>
                {form.statsItems.length > 1 && <button onClick={() => removeItem(i)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: 700 }}>✕ Supprimer</button>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 2fr", gap: 10, alignItems: "end" }}>
                <Field label="Valeur"><Input value={item.value || ""} onChange={e => patchItem(i, "value", e.target.value)} placeholder="45" /></Field>
                <Field label="Suffixe"><Input value={item.suffix || ""} onChange={e => patchItem(i, "suffix", e.target.value)} placeholder="k+" /></Field>
                <div />
                <Field label={`Label — ${lang === "fr" ? "Français" : "English"}`}>
                  <Input value={item[`label_${lang}`] || ""} onChange={e => patchItem(i, `label_${lang}`, e.target.value)} placeholder={lang === "fr" ? "Projets Réalisés" : "Projects Completed"} />
                </Field>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <SectionHeading title="🏅 Badges de certification" subtitle="Affichés dans la zone droite quand il n'y a pas d'image" />
            <Button variant="outline" onClick={addBadge}>+ Ajouter</Button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 20 }}>
            {form.statsBadges.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: "rgba(245,91,31,0.08)", border: "1px solid rgba(245,91,31,0.15)" }}>
                <IconDisplay icon={b.icon} size={20} />
                <span style={{ color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600 }}>{b[`label_${lang}`]}</span>
              </div>
            ))}
          </div>
          {form.statsBadges.map((badge, i) => (
            <div key={i} style={{ marginBottom: 14, padding: "16px", borderRadius: 12, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ color: "var(--color-primary, #0A1684)", fontWeight: 800, fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>Badge {i + 1}</span>
                <button onClick={() => removeBadge(i)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: 700 }}>✕ Supprimer</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <Field label="Label FR"><Input value={badge.label_fr || ""} onChange={e => patchBadge(i, "label_fr", e.target.value)} placeholder="Certifié ISO" /></Field>
                <Field label="Label EN"><Input value={badge.label_en || ""} onChange={e => patchBadge(i, "label_en", e.target.value)} placeholder="ISO Certified" /></Field>
              </div>
              <Field label="Icône" hint="SVG, PNG ou emoji">
                <SvgIconUploader value={badge.icon || ""} onChange={v => patchBadge(i, "icon", v)} size={44} />
              </Field>
            </div>
          ))}
        </Card>

        <Card>
          <SectionHeading title="📸 Image de la section" subtitle="Si une image est définie, elle remplace les badges dans la colonne droite" />
          <ImageUploader value={form.statsImage || ""} onChange={v => patch("statsImage", v)} hint="Recommandé : 800×600px. Si vide, les badges de certification s'affichent." height={200} />
        </Card>
      </div>

      {dirty && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200, background: "#0a0c0f", border: "1px solid rgba(245,91,31,0.3)", borderRadius: 14, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
          <span style={{ color: "var(--color-primary, #0A1684)", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>⚠️ Non sauvegardé</span>
          <Button variant="primary" onClick={save} disabled={saving}>{saving ? <><Spinner size={14} /> …</> : "💾 Sauvegarder"}</Button>
        </div>
      )}
    </div>
  );
}
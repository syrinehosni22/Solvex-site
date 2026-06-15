import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { Alert, Button, Card, Field, Input, PageHeader, SectionHeading, Spinner, Textarea } from "./components/UI";
import { INFO_DEFAULT } from "../features/xbuild/apiHooks";
import { ImageUploader } from "./components/ImageUploader";

const LANG_TABS = [{ code:"fr", label:"🇫🇷 Français" }, { code:"en", label:"🇬🇧 English" }];
const ICON_SUGGESTIONS = ["🏅","⚡","🏆","📋","🎯","🛡️","🔧","⭐","🚀","✅","👷","🏗️"];

export default function AboutEditor() {
  const [form,    setForm]    = useState(INFO_DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [dirty,   setDirty]   = useState(false);
  const [lang,    setLang]    = useState("fr");

  useEffect(() => {
    apiFetch("/api/info")
      .then(d => setForm(f => ({
        ...f, ...d,
        aboutHighlights: (d.aboutHighlights && d.aboutHighlights.length > 0) ? d.aboutHighlights : f.aboutHighlights,
        whyItems:        (d.whyItems && d.whyItems.length > 0)               ? d.whyItems        : f.whyItems,
      })))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const patch = (key, value) => { setForm(f => ({ ...f, [key]: value })); setDirty(true); setSuccess(false); };

  const patchHighlight = (i, key, value) => {
    setForm(f => {
      const items = [...f.aboutHighlights];
      items[i] = { ...items[i], [key]: value };
      return { ...f, aboutHighlights: items };
    });
    setDirty(true); setSuccess(false);
  };
  const addHighlight = () => patch("aboutHighlights", [...form.aboutHighlights, { icon:"⭐", title_fr:"Nouveau point fort", title_en:"New highlight", subtitle_fr:"", subtitle_en:"" }]);
  const removeHighlight = (i) => patch("aboutHighlights", form.aboutHighlights.filter((_, idx) => idx !== i));

  const patchWhyItem = (i, key, value) => {
    setForm(f => {
      const items = [...f.whyItems];
      items[i] = { ...items[i], [key]: value };
      return { ...f, whyItems: items };
    });
    setDirty(true); setSuccess(false);
  };
  const addWhyItem = () => patch("whyItems", [...form.whyItems, { icon:"⭐", title_fr:"Nouvel atout", title_en:"New strength", desc_fr:"", desc_en:"" }]);
  const removeWhyItem = (i) => patch("whyItems", form.whyItems.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true); setError(""); setSuccess(false);
    try {
      await apiFetch("/api/info", { method:"PUT", auth:true, body: JSON.stringify(form) });
      setSuccess(true); setDirty(false);
      setTimeout(() => setSuccess(false), 4000);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ display:"flex", justifyContent:"center", padding:64 }}><Spinner size={36} /></div>;

  return (
    <div>
      <PageHeader icon="📖" title="À Propos & Pourquoi Nous Choisir"
        subtitle="Contenu des sections « Qui sommes-nous » et « Pourquoi nous choisir » de la page d'accueil"
        actions={
          <Button variant="primary" onClick={save} disabled={saving || !dirty}>
            {saving ? <><Spinner size={14}/> Sauvegarde…</> : "💾 Sauvegarder"}
          </Button>
        }
      />
      {error   && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">Modifications enregistrées avec succès !</Alert>}

      {/* Lang tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {LANG_TABS.map(tab => (
          <button key={tab.code} onClick={() => setLang(tab.code)} style={{
            padding:"7px 16px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12,
            cursor:"pointer", border:"1px solid",
            borderColor: lang===tab.code ? "var(--color-primary, #0A1684)" : "rgba(255,255,255,0.12)",
            background:  lang===tab.code ? "rgba(245,91,31,0.15)" : "rgba(255,255,255,0.04)",
            color:       lang===tab.code ? "var(--color-primary, #0A1684)" : "#aaa",
          }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

        {/* ───────────────── QUI SOMMES-NOUS ───────────────── */}
        <Card>
          <SectionHeading title="🙋 Qui sommes-nous — Section « À Propos »" subtitle="Texte d'introduction, points forts et badges affichés sur la page d'accueil" />

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <Field label={`Tag — ${lang==="fr"?"Français":"English"}`}>
              <Input value={form[`aboutTag_${lang}`]||""} onChange={e => patch(`aboutTag_${lang}`, e.target.value)} placeholder={lang==="fr"?"À Propos de Notre Entreprise":"About Our Company"} />
            </Field>
            <Field label={`Titre — ${lang==="fr"?"Français":"English"}`}>
              <Input value={form[`aboutTitle_${lang}`]||""} onChange={e => patch(`aboutTitle_${lang}`, e.target.value)} placeholder={lang==="fr"?"Nous Offrons la Qualité…":"We Offer Quality…"} />
            </Field>
          </div>
          <Field label={`Description — ${lang==="fr"?"Français":"English"}`}>
            <Textarea value={form[`about_${lang}`]||""} onChange={e => patch(`about_${lang}`, e.target.value)} rows={4} placeholder={lang==="fr"?"Décrivez votre entreprise…":"Describe your company…"} />
          </Field>
          <Field label="📸 Photo section À Propos">
            <ImageUploader value={form.aboutImage||""} onChange={v => patch("aboutImage", v)} label="About" hint="Photo affichée à droite dans la section À Propos. Recommandé : 800×900px." />
          </Field>
        </Card>

        {/* ── Points forts (highlights) ── */}
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <SectionHeading title="✨ Points forts" subtitle="Les 2 mises en avant à côté du texte « À propos » (icône + titre + sous-titre)" />
            <Button variant="outline" onClick={addHighlight}>+ Ajouter</Button>
          </div>

          {/* Preview */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:20 }}>
            {form.aboutHighlights.map((h, i) => (
              <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"10px 14px", borderRadius:8, background:"rgba(245,91,31,0.08)", border:"1px solid rgba(245,91,31,0.15)" }}>
                <span style={{ fontSize:22 }}>{h.icon}</span>
                <div>
                  <div style={{ color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:800 }}>{h[`title_${lang}`]}</div>
                  <div style={{ color:"#aaa", fontFamily:"'DM Sans',sans-serif", fontSize:12 }}>{h[`subtitle_${lang}`]}</div>
                </div>
              </div>
            ))}
          </div>

          {form.aboutHighlights.map((h, i) => (
            <div key={i} style={{ marginBottom:14, padding:"16px", borderRadius:12, background:"rgba(0,0,0,0.2)", border:"1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <span style={{ color:"var(--color-primary, #0A1684)", fontWeight:800, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Point fort {i+1}</span>
                {form.aboutHighlights.length > 1 && (
                  <button onClick={() => removeHighlight(i)} style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171", padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif", fontWeight:700 }}>
                    ✕ Supprimer
                  </button>
                )}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"100px 1fr 1fr", gap:10 }}>
                <Field label="Icône">
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    <Input value={h.icon||""} onChange={e => patchHighlight(i, "icon", e.target.value)} placeholder="🏅" />
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                      {ICON_SUGGESTIONS.slice(0,6).map(ic => (
                        <button key={ic} onClick={() => patchHighlight(i, "icon", ic)} style={{ width:26, height:26, borderRadius:6, fontSize:14, border: h.icon===ic?"2px solid var(--color-primary, #0A1684)":"1px solid rgba(255,255,255,0.10)", background: h.icon===ic?"rgba(245,91,31,0.15)":"rgba(255,255,255,0.04)", cursor:"pointer" }}>{ic}</button>
                      ))}
                    </div>
                  </div>
                </Field>
                <Field label={`Titre — ${lang==="fr"?"FR":"EN"}`}>
                  <Input value={h[`title_${lang}`]||""} onChange={e => patchHighlight(i, `title_${lang}`, e.target.value)} placeholder={lang==="fr"?"Haute Qualité":"High Quality"} />
                </Field>
                <Field label={`Sous-titre — ${lang==="fr"?"FR":"EN"}`}>
                  <Input value={h[`subtitle_${lang}`]||""} onChange={e => patchHighlight(i, `subtitle_${lang}`, e.target.value)} placeholder={lang==="fr"?"Services Fiables":"Reliable Services"} />
                </Field>
              </div>
            </div>
          ))}
        </Card>

        {/* ── Badge "primé" + bannière consultation ── */}
        <Card>
          <SectionHeading title="🏆 Badge « Primé » & bannière consultation" subtitle="Affichés sur/sous l'image de la section À Propos" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <Field label={`Titre du badge — ${lang==="fr"?"FR":"EN"}`}>
              <Input value={form[`awardTitle_${lang}`]||""} onChange={e => patch(`awardTitle_${lang}`, e.target.value)} placeholder={lang==="fr"?"Primé":"Award Winning"} />
            </Field>
            <Field label={`Sous-titre du badge — ${lang==="fr"?"FR":"EN"}`}>
              <Input value={form[`awardSub_${lang}`]||""} onChange={e => patch(`awardSub_${lang}`, e.target.value)} placeholder={lang==="fr"?"Meilleur Constructeur Industriel":"Best Industrial Builder"} />
            </Field>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:10 }}>
            <Field label={`Texte bannière — ${lang==="fr"?"FR":"EN"}`}>
              <Input value={form[`consultTitle_${lang}`]||""} onChange={e => patch(`consultTitle_${lang}`, e.target.value)} placeholder={lang==="fr"?"Planifiez votre consultation gratuite…":"Plan your free consultation…"} />
            </Field>
            <Field label={`Bouton — ${lang==="fr"?"FR":"EN"}`}>
              <Input value={form[`consultCta_${lang}`]||""} onChange={e => patch(`consultCta_${lang}`, e.target.value)} placeholder={lang==="fr"?"Contactez-nous":"Contact Us"} />
            </Field>
          </div>
        </Card>

        {/* ───────────────── POURQUOI NOUS CHOISIR ───────────────── */}
        <Card>
          <SectionHeading title="🎯 Pourquoi nous choisir — Textes" subtitle="Section affichée juste après « À propos »" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <Field label={`Tag — ${lang==="fr"?"Français":"English"}`}>
              <Input value={form[`whyTag_${lang}`]||""} onChange={e => patch(`whyTag_${lang}`, e.target.value)} placeholder={lang==="fr"?"Pourquoi Nous Choisir":"Why Choose Us"} />
            </Field>
            <Field label={`Titre — ${lang==="fr"?"Français":"English"}`}>
              <Input value={form[`whyTitle_${lang}`]||""} onChange={e => patch(`whyTitle_${lang}`, e.target.value)} placeholder={lang==="fr"?"Pourquoi Nous Choisir ?":"Why Choose Us?"} />
            </Field>
          </div>
          <Field label={`Description — ${lang==="fr"?"Français":"English"}`}>
            <Textarea value={form[`whyDesc_${lang}`]||""} onChange={e => patch(`whyDesc_${lang}`, e.target.value)} rows={4} placeholder={lang==="fr"?"Décrivez pourquoi vous choisir…":"Describe why choose you…"} />
          </Field>
          <Field label="📸 Visuel de la section">
            <ImageUploader value={form.whyImage||""} onChange={v => patch("whyImage", v)} label="WhyChooseUs" hint="Recommandé : 800×600px. Si vide, un motif décoratif s'affiche." height={200} />
          </Field>
        </Card>

        {/* ── Points forts "Pourquoi nous choisir" ── */}
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <SectionHeading title="✅ Atouts « Pourquoi nous choisir »" subtitle="Les 3 cartes (icône + titre + description) à droite du visuel" />
            <Button variant="outline" onClick={addWhyItem}>+ Ajouter</Button>
          </div>

          {/* Preview */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
            {form.whyItems.map((it, i) => (
              <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"10px 14px", borderRadius:8, background:"rgba(245,91,31,0.08)", border:"1px solid rgba(245,91,31,0.15)" }}>
                <span style={{ fontSize:22 }}>{it.icon}</span>
                <div>
                  <div style={{ color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:800 }}>{it[`title_${lang}`]}</div>
                  <div style={{ color:"#aaa", fontFamily:"'DM Sans',sans-serif", fontSize:12 }}>{(it[`desc_${lang}`]||"").slice(0,90)}{(it[`desc_${lang}`]||"").length>90?"…":""}</div>
                </div>
              </div>
            ))}
          </div>

          {form.whyItems.map((item, i) => (
            <div key={i} style={{ marginBottom:14, padding:"16px", borderRadius:12, background:"rgba(0,0,0,0.2)", border:"1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <span style={{ color:"var(--color-primary, #0A1684)", fontWeight:800, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Atout {i+1}</span>
                {form.whyItems.length > 1 && (
                  <button onClick={() => removeWhyItem(i)} style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171", padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif", fontWeight:700 }}>
                    ✕ Supprimer
                  </button>
                )}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"100px 1fr", gap:10, marginBottom:10 }}>
                <Field label="Icône">
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    <Input value={item.icon||""} onChange={e => patchWhyItem(i, "icon", e.target.value)} placeholder="🏆" />
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                      {ICON_SUGGESTIONS.map(ic => (
                        <button key={ic} onClick={() => patchWhyItem(i, "icon", ic)} style={{ width:26, height:26, borderRadius:6, fontSize:14, border: item.icon===ic?"2px solid var(--color-primary, #0A1684)":"1px solid rgba(255,255,255,0.10)", background: item.icon===ic?"rgba(245,91,31,0.15)":"rgba(255,255,255,0.04)", cursor:"pointer" }}>{ic}</button>
                      ))}
                    </div>
                  </div>
                </Field>
                <Field label={`Titre — ${lang==="fr"?"FR":"EN"}`}>
                  <Input value={item[`title_${lang}`]||""} onChange={e => patchWhyItem(i, `title_${lang}`, e.target.value)} placeholder={lang==="fr"?"Expertise Reconnue":"Proven Expertise"} />
                </Field>
              </div>
              <Field label={`Description — ${lang==="fr"?"FR":"EN"}`}>
                <Textarea value={item[`desc_${lang}`]||""} onChange={e => patchWhyItem(i, `desc_${lang}`, e.target.value)} rows={2} placeholder={lang==="fr"?"Décrivez cet atout…":"Describe this strength…"} />
              </Field>
            </div>
          ))}
        </Card>

      </div>

      {/* Floating save */}
      {dirty && (
        <div style={{ position:"fixed", bottom:24, right:24, zIndex:200, background:"#0a0c0f", border:"1px solid rgba(245,91,31,0.3)", borderRadius:14, padding:"14px 20px", display:"flex", alignItems:"center", gap:14, boxShadow:"0 8px 32px rgba(0,0,0,0.5)" }}>
          <span style={{ color:"var(--color-primary, #0A1684)", fontSize:13, fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>⚠️ Non sauvegardé</span>
          <Button variant="primary" onClick={save} disabled={saving}>
            {saving ? <><Spinner size={14}/> …</> : "💾 Sauvegarder"}
          </Button>
        </div>
      )}
    </div>
  );
}